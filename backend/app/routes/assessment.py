import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.claim import Claim
from app.models.property import Property
from app.models.reference import ReferenceImage
from app.models.assessment import ClaimAssessment
from app.models.compensation import CompensationRecommendation
from app.models.user import User
from app.services.auth import get_current_user
from app.services.ai_service import run_full_claim_assessment
from app.services.compensation_service import calculate_compensation_breakdown

router = APIRouter(prefix="/assessments", tags=["Damage Assessment & AI"])


@router.post("/run/{claim_id}")
def run_claim_assessment_endpoint(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Executes AI damage assessment and compensation recommendation for a claim:
    1. Loads applicant's baseline property photo and post-disaster claim images.
    2. Retrieves candidate verified reference pairs for similarity matching.
    3. Runs change-detection, structural alteration analysis, and damage severity classification.
    4. Computes deterministic policy loss and provisional compensation.
    5. Saves records in claim_assessments and compensation_recommendations.
    6. Updates claim status to 'under_review'.
    """
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    if claim.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to run assessment on this claim."
        )

    # Verify baseline image exists
    property_obj = claim.property
    if not property_obj or not property_obj.pre_disaster_image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property does not have a registered baseline image for comparison."
        )

    # Base directory for resolving relative paths
    backend_dir = Path(__file__).resolve().parent.parent.parent
    workspace_dir = backend_dir.parent

    # Baseline path
    baseline_path = backend_dir / property_obj.pre_disaster_image
    if not baseline_path.exists():
        # Check workspace root
        alt_path = workspace_dir / property_obj.pre_disaster_image
        if alt_path.exists():
            baseline_path = alt_path
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Baseline image file not found on disk: {property_obj.pre_disaster_image}"
            )

    # Damaged images
    if not claim.images or len(claim.images) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Claim has no damaged photographs uploaded."
        )

    damaged_paths = []
    for c_img in claim.images:
        dp = backend_dir / c_img.image_path
        if not dp.exists():
            dp_alt = workspace_dir / c_img.image_path
            if dp_alt.exists():
                dp = dp_alt
        if dp.exists():
            damaged_paths.append(dp)

    if not damaged_paths:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="None of the uploaded damaged images could be located on disk."
        )

    # Fetch candidate reference images with embeddings
    ref_query = (
        db.query(ReferenceImage)
        .filter(ReferenceImage.verification_status == "verified")
    )
    if claim.disaster_type:
        ref_query = ref_query.filter(ReferenceImage.disaster_type.ilike(f"%{claim.disaster_type}%"))
    reference_records = ref_query.limit(20).all()

    reference_candidates = []
    for r in reference_records:
        if r.embedding_vector:
            try:
                emb = json.loads(r.embedding_vector)
                reference_candidates.append({
                    "id": r.id,
                    "image_path": r.image_path,
                    "disaster_type": r.disaster_type,
                    "ground_truth_label": r.ground_truth_label,
                    "embedding": emb,
                })
            except Exception:
                pass

    # Execute AI Assessment
    try:
        assessment_result = run_full_claim_assessment(
            baseline_path=baseline_path,
            damaged_paths=damaged_paths,
            disaster_type=claim.disaster_type,
            reference_candidates=reference_candidates,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI model inference failed: {str(exc)}"
        )

    # Persist or update ClaimAssessment
    assessment_record = (
        db.query(ClaimAssessment)
        .filter(ClaimAssessment.claim_id == claim.id)
        .first()
    )

    supporting_refs_json = json.dumps(assessment_result["supporting_references"])

    if not assessment_record:
        assessment_record = ClaimAssessment(
            claim_id=claim.id,
            model_name=assessment_result["model_name"],
            model_version=assessment_result["model_version"],
            severity_category=assessment_result["severity_category"],
            confidence_score=assessment_result["confidence_score"],
            damage_score=assessment_result["damage_score"],
            detected_buildings=assessment_result["detected_buildings"],
            damaged_buildings=assessment_result["damaged_buildings"],
            change_ratio=assessment_result["change_ratio"],
            visual_similarity_score=assessment_result["visual_similarity_score"],
            supporting_reference_ids=supporting_refs_json,
            uncertainty_flag=assessment_result["uncertainty_flag"],
            uncertainty_reason=assessment_result["uncertainty_reason"],
            limitations_notes=assessment_result["limitations_notes"],
        )
        db.add(assessment_record)
    else:
        assessment_record.model_name = assessment_result["model_name"]
        assessment_record.model_version = assessment_result["model_version"]
        assessment_record.severity_category = assessment_result["severity_category"]
        assessment_record.confidence_score = assessment_result["confidence_score"]
        assessment_record.damage_score = assessment_result["damage_score"]
        assessment_record.visual_similarity_score = assessment_result["visual_similarity_score"]
        assessment_record.supporting_reference_ids = supporting_refs_json
        assessment_record.uncertainty_flag = assessment_result["uncertainty_flag"]
        assessment_record.uncertainty_reason = assessment_result["uncertainty_reason"]
        assessment_record.limitations_notes = assessment_result["limitations_notes"]

    db.flush()

    # Calculate Phase 8 Compensation Recommendation
    comp_data = calculate_compensation_breakdown(
        declared_value=property_obj.property_value,
        damage_score=assessment_result["damage_score"],
        severity_category=assessment_result["severity_category"],
        property_type=property_obj.property_type,
        disaster_type=claim.disaster_type,
    )

    comp_record = (
        db.query(CompensationRecommendation)
        .filter(CompensationRecommendation.claim_id == claim.id)
        .first()
    )

    breakdown_json = json.dumps(comp_data["breakdown"])

    if not comp_record:
        comp_record = CompensationRecommendation(
            claim_id=claim.id,
            assessment_id=assessment_record.id,
            policy_name=comp_data["policy_name"],
            policy_version=comp_data["policy_version"],
            property_declared_value=comp_data["breakdown"]["declared_property_value"],
            estimated_loss=comp_data["estimated_loss"],
            deductible=comp_data["deductible"],
            max_coverage_limit=comp_data["max_coverage_limit"],
            recommended_compensation=comp_data["recommended_compensation"],
            calculation_breakdown=breakdown_json,
            is_provisional=True,
        )
        db.add(comp_record)
    else:
        comp_record.assessment_id = assessment_record.id
        comp_record.property_declared_value = comp_data["breakdown"]["declared_property_value"]
        comp_record.estimated_loss = comp_data["estimated_loss"]
        comp_record.deductible = comp_data["deductible"]
        comp_record.max_coverage_limit = comp_data["max_coverage_limit"]
        comp_record.recommended_compensation = comp_data["recommended_compensation"]
        comp_record.calculation_breakdown = breakdown_json
        comp_record.is_provisional = True

    # Update claim status
    if claim.status == "submitted":
        claim.status = "under_review"

    db.commit()
    db.refresh(claim)

    return {
        "message": "AI damage assessment and provisional compensation recommendation completed successfully",
        "claim_id": claim.id,
        "status": claim.status,
        "assessment": {
            "id": assessment_record.id,
            "model_name": assessment_record.model_name,
            "model_version": assessment_record.model_version,
            "severity_category": assessment_record.severity_category,
            "severity_display": assessment_result["severity_display"],
            "confidence_score": assessment_record.confidence_score,
            "damage_score": assessment_record.damage_score,
            "visual_similarity_score": assessment_record.visual_similarity_score,
            "uncertainty_flag": assessment_record.uncertainty_flag,
            "uncertainty_reason": assessment_record.uncertainty_reason,
            "limitations_notes": assessment_record.limitations_notes,
            "supporting_references": assessment_result["supporting_references"],
            "image_evaluations": assessment_result["image_evaluations"],
        },
        "recommendation": {
            "id": comp_record.id,
            "policy_name": comp_record.policy_name,
            "policy_version": comp_record.policy_version,
            "property_declared_value": comp_record.property_declared_value,
            "estimated_loss": comp_record.estimated_loss,
            "deductible": comp_record.deductible,
            "max_coverage_limit": comp_record.max_coverage_limit,
            "recommended_compensation": comp_record.recommended_compensation,
            "is_provisional": comp_record.is_provisional,
            "breakdown": comp_data["breakdown"],
        },
    }


@router.get("/{claim_id}")
def get_claim_assessment(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves existing AI assessment and compensation recommendation for a claim."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    if claim.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this claim's assessment."
        )

    if not claim.assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment has not yet been run for this claim."
        )

    supporting_refs = []
    if claim.assessment.supporting_reference_ids:
        try:
            supporting_refs = json.loads(claim.assessment.supporting_reference_ids)
        except Exception:
            pass

    breakdown = {}
    if claim.recommendation and claim.recommendation.calculation_breakdown:
        try:
            breakdown = json.loads(claim.recommendation.calculation_breakdown)
        except Exception:
            pass

    return {
        "claim_id": claim.id,
        "assessment": {
            "id": claim.assessment.id,
            "model_name": claim.assessment.model_name,
            "model_version": claim.assessment.model_version,
            "severity_category": claim.assessment.severity_category,
            "confidence_score": claim.assessment.confidence_score,
            "damage_score": claim.assessment.damage_score,
            "visual_similarity_score": claim.assessment.visual_similarity_score,
            "uncertainty_flag": claim.assessment.uncertainty_flag,
            "uncertainty_reason": claim.assessment.uncertainty_reason,
            "limitations_notes": claim.assessment.limitations_notes,
            "supporting_references": supporting_refs,
        },
        "recommendation": {
            "id": claim.recommendation.id,
            "policy_name": claim.recommendation.policy_name,
            "policy_version": claim.recommendation.policy_version,
            "property_declared_value": claim.recommendation.property_declared_value,
            "estimated_loss": claim.recommendation.estimated_loss,
            "deductible": claim.recommendation.deductible,
            "max_coverage_limit": claim.recommendation.max_coverage_limit,
            "recommended_compensation": claim.recommendation.recommended_compensation,
            "is_provisional": claim.recommendation.is_provisional,
            "breakdown": breakdown,
        } if claim.recommendation else None,
    }
