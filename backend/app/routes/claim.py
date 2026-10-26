import os
import shutil
from datetime import date, datetime
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.claim import Claim, ClaimImage
from app.models.property import Property
from app.models.user import User
from app.services.auth import get_current_user
from app.services.image_service import (
    validate_image_bytes,
    save_image_bytes,
    delete_file_safely,
)

router = APIRouter(prefix="/claims", tags=["Claims"])

BASE_CLAIMS_UPLOAD_DIR = Path("uploads/claims")
BASE_CLAIMS_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
async def create_claim(
    property_id: int = Form(...),
    disaster_type: str = Form(...),
    disaster_date: str = Form(...),
    damage_description: Optional[str] = Form(None),
    damaged_images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submits a new disaster claim with multiple post-disaster damaged images:
    1. Verifies that the property exists and strictly belongs to current_user.
    2. Validates that at least one damaged image is provided.
    3. Validates each image via PIL (content, dimensions, size, format).
    4. Creates Claim record and creates dedicated directory: uploads/claims/<claim_id>/.
    5. Saves images and records each ClaimImage with path and dimensions.
    6. Atomically commits or rolls back and deletes files on error.
    """
    # 1. Verify property ownership
    property_data = (
        db.query(Property)
        .filter(Property.id == property_id)
        .first()
    )

    if not property_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found."
        )

    if property_data.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to submit a claim for this property."
        )

    # 2. Parse disaster date
    try:
        parsed_date = datetime.strptime(disaster_date.strip(), "%Y-%m-%d").date()
    except ValueError:
        try:
            parsed_date = date.fromisoformat(disaster_date.strip())
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid disaster_date format. Please use YYYY-MM-DD."
            )

    # 3. Validate damaged images
    if not damaged_images or len(damaged_images) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one post-disaster damaged image is required."
        )

    # Read and pre-validate all images before database creation
    validated_files = []
    for idx, upload_file in enumerate(damaged_images):
        try:
            file_bytes = await upload_file.read()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read image #{idx+1}: {str(exc)}"
            )

        ext, width, height = validate_image_bytes(
            file_bytes, declared_content_type=upload_file.content_type
        )
        validated_files.append((file_bytes, ext, width, height, upload_file.filename))

    # 4. Create Claim in database
    new_claim = Claim(
        user_id=current_user.id,
        property_id=property_id,
        disaster_type=disaster_type.strip(),
        disaster_date=parsed_date,
        damage_description=damage_description.strip() if damage_description else None,
        status="submitted",
    )

    saved_claim_dir: Optional[Path] = None
    saved_file_paths: List[Path] = []

    try:
        db.add(new_claim)
        db.flush()  # Allocate new_claim.id

        claim_dir = BASE_CLAIMS_UPLOAD_DIR / str(new_claim.id)
        claim_dir.mkdir(parents=True, exist_ok=True)
        saved_claim_dir = claim_dir

        for idx, (img_bytes, ext, w, h, original_name) in enumerate(validated_files):
            prefix = f"claim_{new_claim.id}_damaged_{idx+1}"
            file_path, rel_path = save_image_bytes(
                image_bytes=img_bytes,
                target_dir=claim_dir,
                filename_prefix=prefix,
                extension=ext,
            )
            saved_file_paths.append(file_path)

            claim_img = ClaimImage(
                claim_id=new_claim.id,
                image_path=rel_path,
                file_size=len(img_bytes),
                image_width=w,
                image_height=h,
            )
            db.add(claim_img)

        db.commit()
        db.refresh(new_claim)

    except Exception as exc:
        db.rollback()
        # Clean up files on error
        for p in saved_file_paths:
            delete_file_safely(p)
        if saved_claim_dir and saved_claim_dir.exists():
            try:
                shutil.rmtree(saved_claim_dir)
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create disaster claim: {str(exc)}"
        )

    return {
        "message": "Disaster claim submitted successfully",
        "claim": {
            "id": new_claim.id,
            "user_id": new_claim.user_id,
            "property_id": new_claim.property_id,
            "property_name": property_data.property_name,
            "disaster_type": new_claim.disaster_type,
            "disaster_date": str(new_claim.disaster_date),
            "damage_description": new_claim.damage_description,
            "status": new_claim.status,
            "created_at": str(new_claim.created_at),
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "dimensions": f"{img.image_width}x{img.image_height}",
                    "file_size": img.file_size,
                }
                for img in new_claim.images
            ],
        },
    }


@router.get("/")
def list_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns claims accessible to the user:
    - Applicants view only their own claims.
    - Admins view all claims across the platform.
    """
    if current_user.role == "admin":
        claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    else:
        claims = (
            db.query(Claim)
            .filter(Claim.user_id == current_user.id)
            .order_by(Claim.created_at.desc())
            .all()
        )

    return {
        "claims": [
            {
                "id": c.id,
                "user_id": c.user_id,
                "property_id": c.property_id,
                "property_name": c.property.property_name if c.property else "Unknown",
                "disaster_type": c.disaster_type,
                "disaster_date": str(c.disaster_date),
                "damage_description": c.damage_description,
                "status": c.status,
                "created_at": str(c.created_at),
                "baseline_image": c.property.pre_disaster_image if c.property else None,
                "image_count": len(c.images),
                "images": [
                    {
                        "id": img.id,
                        "image_path": img.image_path,
                        "file_size": img.file_size,
                    }
                    for img in c.images
                ],
                "assessment": {
                    "severity_category": c.assessment.severity_category,
                    "confidence_score": c.assessment.confidence_score,
                    "damage_score": c.assessment.damage_score,
                    "uncertainty_flag": c.assessment.uncertainty_flag,
                } if c.assessment else None,
                "recommendation": {
                    "estimated_loss": c.recommendation.estimated_loss,
                    "recommended_compensation": c.recommendation.recommended_compensation,
                    "is_provisional": c.recommendation.is_provisional,
                } if c.recommendation else None,
            }
            for c in claims
        ]
    }


@router.get("/{claim_id}")
def get_claim_detail(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns complete details of a specific claim.
    Enforces authorization: owner or admin only.
    """
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    if claim.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this claim."
        )

    return {
        "claim": {
            "id": claim.id,
            "user_id": claim.user_id,
            "applicant_name": claim.user.name if claim.user else "Applicant",
            "applicant_email": claim.user.email if claim.user else "",
            "property_id": claim.property_id,
            "property": {
                "id": claim.property.id,
                "property_name": claim.property.property_name,
                "property_type": claim.property.property_type,
                "ownership": claim.property.ownership,
                "address": claim.property.address,
                "city_village": claim.property.city_village,
                "district": claim.property.district,
                "state": claim.property.state,
                "pin_code": claim.property.pin_code,
                "property_value": claim.property.property_value,
                "latitude": claim.property.latitude,
                "longitude": claim.property.longitude,
                "pre_disaster_image": claim.property.pre_disaster_image,
            } if claim.property else None,
            "disaster_type": claim.disaster_type,
            "disaster_date": str(claim.disaster_date),
            "damage_description": claim.damage_description,
            "status": claim.status,
            "created_at": str(claim.created_at),
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "dimensions": f"{img.image_width}x{img.image_height}",
                    "file_size": img.file_size,
                    "created_at": str(img.created_at),
                }
                for img in claim.images
            ],
            "assessment": {
                "id": claim.assessment.id,
                "model_name": claim.assessment.model_name,
                "model_version": claim.assessment.model_version,
                "severity_category": claim.assessment.severity_category,
                "confidence_score": claim.assessment.confidence_score,
                "damage_score": claim.assessment.damage_score,
                "detected_buildings": claim.assessment.detected_buildings,
                "damaged_buildings": claim.assessment.damaged_buildings,
                "change_ratio": claim.assessment.change_ratio,
                "visual_similarity_score": claim.assessment.visual_similarity_score,
                "localization_mask_path": claim.assessment.localization_mask_path,
                "damage_mask_path": claim.assessment.damage_mask_path,
                "supporting_reference_ids": claim.assessment.supporting_reference_ids,
                "uncertainty_flag": claim.assessment.uncertainty_flag,
                "uncertainty_reason": claim.assessment.uncertainty_reason,
                "limitations_notes": claim.assessment.limitations_notes,
            } if claim.assessment else None,
            "recommendation": {
                "id": claim.recommendation.id,
                "policy_name": claim.recommendation.policy_name,
                "policy_version": claim.recommendation.policy_version,
                "property_declared_value": claim.recommendation.property_declared_value,
                "estimated_loss": claim.recommendation.estimated_loss,
                "deductible": claim.recommendation.deductible,
                "max_coverage_limit": claim.recommendation.max_coverage_limit,
                "recommended_compensation": claim.recommendation.recommended_compensation,
                "calculation_breakdown": claim.recommendation.calculation_breakdown,
                "is_provisional": claim.recommendation.is_provisional,
            } if claim.recommendation else None,
            "decisions": [
                {
                    "id": d.id,
                    "reviewer_name": d.reviewer.name if d.reviewer else "Officer",
                    "decision": d.decision,
                    "decision_reason": d.decision_reason,
                    "approved_amount": d.approved_amount,
                    "decided_at": str(d.decided_at),
                }
                for d in claim.decisions
            ],
        }
    }
