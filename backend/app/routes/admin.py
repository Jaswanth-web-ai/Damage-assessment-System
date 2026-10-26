import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.claim import Claim
from app.models.decision import ClaimDecision
from app.models.user import User
from app.services.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin & Verification"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency enforcing that the authenticated user possesses the admin/officer role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required. Access denied.",
        )
    return current_user


class DecisionPayload(BaseModel):
    decision: str = Field(description="Decision: approved, rejected, or evidence_requested")
    decision_reason: str = Field(min_length=5, max_length=1000)
    approved_amount: Optional[float] = None


@router.get("/claims")
def admin_list_claims(
    claim_status: Optional[str] = Query(None),
    disaster_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Lists all claims with administrative metadata and filtering options."""
    query = db.query(Claim)
    if claim_status:
        query = query.filter(Claim.status == claim_status.strip().lower())
    if disaster_type:
        query = query.filter(Claim.disaster_type.ilike(f"%{disaster_type.strip()}%"))

    claims = query.order_by(Claim.created_at.desc()).all()

    return {
        "total_claims": len(claims),
        "claims": [
            {
                "id": c.id,
                "applicant": {
                    "id": c.user.id if c.user else None,
                    "name": c.user.name if c.user else "Applicant",
                    "email": c.user.email if c.user else "",
                    "phone": c.user.phone if c.user else "",
                },
                "property": {
                    "id": c.property.id if c.property else None,
                    "property_name": c.property.property_name if c.property else "Unknown",
                    "property_type": c.property.property_type if c.property else "Unknown",
                    "city_village": c.property.city_village if c.property else "",
                    "district": c.property.district if c.property else "",
                    "state": c.property.state if c.property else "",
                    "property_value": c.property.property_value if c.property else None,
                    "pre_disaster_image": c.property.pre_disaster_image if c.property else None,
                },
                "disaster_type": c.disaster_type,
                "disaster_date": str(c.disaster_date),
                "damage_description": c.damage_description,
                "status": c.status,
                "created_at": str(c.created_at),
                "image_count": len(c.images),
                "assessment": {
                    "severity_category": c.assessment.severity_category,
                    "confidence_score": c.assessment.confidence_score,
                    "damage_score": c.assessment.damage_score,
                    "visual_similarity_score": c.assessment.visual_similarity_score,
                    "uncertainty_flag": c.assessment.uncertainty_flag,
                    "uncertainty_reason": c.assessment.uncertainty_reason,
                } if c.assessment else None,
                "recommendation": {
                    "estimated_loss": c.recommendation.estimated_loss,
                    "deductible": c.recommendation.deductible,
                    "recommended_compensation": c.recommendation.recommended_compensation,
                    "is_provisional": c.recommendation.is_provisional,
                } if c.recommendation else None,
            }
            for c in claims
        ],
    }


@router.get("/claims/{claim_id}")
def admin_get_claim_review_detail(
    claim_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """
    Returns full decision-support bundle for officer review:
    - Applicant identity & contact
    - Property details & baseline photograph
    - Post-disaster photographs
    - AI assessment metrics & uncertainty flags
    - Supporting reference evidence
    - Policy compensation calculation breakdown
    - Auditable decision history
    """
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    supporting_refs = []
    if claim.assessment and claim.assessment.supporting_reference_ids:
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
        "claim": {
            "id": claim.id,
            "status": claim.status,
            "disaster_type": claim.disaster_type,
            "disaster_date": str(claim.disaster_date),
            "damage_description": claim.damage_description,
            "created_at": str(claim.created_at),
            "applicant": {
                "id": claim.user.id if claim.user else None,
                "name": claim.user.name if claim.user else "Applicant",
                "email": claim.user.email if claim.user else "",
                "phone": claim.user.phone if claim.user else "",
            },
            "property": {
                "id": claim.property.id if claim.property else None,
                "property_name": claim.property.property_name if claim.property else "",
                "property_type": claim.property.property_type if claim.property else "",
                "ownership": claim.property.ownership if claim.property else "",
                "address": claim.property.address if claim.property else "",
                "city_village": claim.property.city_village if claim.property else "",
                "district": claim.property.district if claim.property else "",
                "state": claim.property.state if claim.property else "",
                "pin_code": claim.property.pin_code if claim.property else "",
                "property_value": claim.property.property_value if claim.property else None,
                "latitude": claim.property.latitude if claim.property else None,
                "longitude": claim.property.longitude if claim.property else None,
                "pre_disaster_image": claim.property.pre_disaster_image if claim.property else None,
            },
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
                "visual_similarity_score": claim.assessment.visual_similarity_score,
                "uncertainty_flag": claim.assessment.uncertainty_flag,
                "uncertainty_reason": claim.assessment.uncertainty_reason,
                "limitations_notes": claim.assessment.limitations_notes,
                "supporting_references": supporting_refs,
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
                "is_provisional": claim.recommendation.is_provisional,
                "breakdown": breakdown,
            } if claim.recommendation else None,
            "decisions_audit_history": [
                {
                    "id": d.id,
                    "reviewer_id": d.reviewer_id,
                    "reviewer_name": d.reviewer.name if d.reviewer else "Officer",
                    "decision": d.decision,
                    "decision_reason": d.decision_reason,
                    "approved_amount": d.approved_amount,
                    "status_before": d.status_before,
                    "status_after": d.status_after,
                    "decided_at": str(d.decided_at),
                }
                for d in claim.decisions
            ],
        }
    }


@router.post("/claims/{claim_id}/decision")
def record_claim_decision(
    claim_id: int,
    payload: DecisionPayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """
    Submits an official verification decision (approve, reject, or request_more_evidence).
    Enforces server-side audit logging: stores reviewer ID, decision, reason, and timestamps.
    """
    normalized_decision = payload.decision.strip().lower()
    valid_decisions = ["approved", "rejected", "evidence_requested"]
    if normalized_decision not in valid_decisions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid decision '{payload.decision}'. Allowed: {', '.join(valid_decisions)}",
        )

    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found."
        )

    status_before = claim.status
    status_after = normalized_decision

    # Update claim status
    claim.status = status_after

    # Create immutable audit record
    decision_record = ClaimDecision(
        claim_id=claim.id,
        reviewer_id=admin_user.id,
        decision=normalized_decision,
        decision_reason=payload.decision_reason.strip(),
        approved_amount=payload.approved_amount if normalized_decision == "approved" else 0.0,
        status_before=status_before,
        status_after=status_after,
    )

    db.add(decision_record)
    db.commit()
    db.refresh(claim)
    db.refresh(decision_record)

    return {
        "message": f"Claim #{claim.id} decision '{normalized_decision}' recorded successfully.",
        "claim_id": claim.id,
        "new_status": claim.status,
        "decision": {
            "id": decision_record.id,
            "reviewer_name": admin_user.name,
            "decision": decision_record.decision,
            "decision_reason": decision_record.decision_reason,
            "approved_amount": decision_record.approved_amount,
            "decided_at": str(decision_record.decided_at),
        },
    }


@router.get("/stats")
def admin_get_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Returns administrative platform KPI statistics."""
    total_claims = db.query(Claim).count()
    submitted_claims = db.query(Claim).filter(Claim.status == "submitted").count()
    under_review_claims = db.query(Claim).filter(Claim.status == "under_review").count()
    approved_claims = db.query(Claim).filter(Claim.status == "approved").count()
    rejected_claims = db.query(Claim).filter(Claim.status == "rejected").count()
    evidence_req_claims = db.query(Claim).filter(Claim.status == "evidence_requested").count()
    total_properties = db.query(Claim).count()
    total_applicants = db.query(User).filter(User.role == "applicant").count()

    return {
        "total_claims": total_claims,
        "submitted": submitted_claims,
        "under_review": under_review_claims,
        "approved": approved_claims,
        "rejected": rejected_claims,
        "evidence_requested": evidence_req_claims,
        "total_properties": total_properties,
        "total_applicants": total_applicants,
    }
