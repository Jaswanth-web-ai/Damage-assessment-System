import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reference import ReferenceImage, ReferenceLocation
from app.models.user import User
from app.services.auth import get_current_user
from app.services.reference_importer import import_reference_dataset
from app.services.ai_service import compute_cosine_similarity

router = APIRouter(prefix="/references", tags=["Reference Dataset"])


@router.get("/")
def list_reference_images(
    disaster_type: Optional[str] = Query(None),
    location_id: Optional[int] = Query(None),
    ground_truth_label: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieves independently verified reference images with metadata filtering:
    - disaster_type (Flood, Cyclone, Earthquake, Tsunami)
    - location_id
    - ground_truth_label (no_damage, minor_damage, major_damage, destroyed)
    """
    query = db.query(ReferenceImage).filter(ReferenceImage.verification_status == "verified")

    if disaster_type:
        query = query.filter(ReferenceImage.disaster_type.ilike(f"%{disaster_type.strip()}%"))
    if location_id:
        query = query.filter(ReferenceImage.location_id == location_id)
    if ground_truth_label:
        query = query.filter(ReferenceImage.ground_truth_label == ground_truth_label.strip())

    records = query.limit(limit).all()

    return {
        "count": len(records),
        "references": [
            {
                "id": r.id,
                "dataset_source": r.dataset_source,
                "location_name": r.location.name if r.location else None,
                "district": r.location.district if r.location else None,
                "state": r.location.state if r.location else None,
                "image_path": r.image_path,
                "paired_pre_image_path": r.paired_pre_image_path,
                "loc_target_path": r.loc_target_path,
                "dmg_target_path": r.dmg_target_path,
                "disaster_type": r.disaster_type,
                "property_type": r.property_type,
                "verification_status": r.verification_status,
                "ground_truth_label": r.ground_truth_label,
                "building_count": r.building_count,
            }
            for r in records
        ],
    }


@router.get("/locations")
def list_reference_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lists available reference geographic locations."""
    locations = db.query(ReferenceLocation).all()
    return {
        "locations": [
            {
                "id": loc.id,
                "name": loc.name,
                "district": loc.district,
                "state": loc.state,
                "country": loc.country,
                "latitude": loc.latitude,
                "longitude": loc.longitude,
                "image_count": len(loc.images),
            }
            for loc in locations
        ]
    }


@router.get("/{reference_id}")
def get_reference_detail(
    reference_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieves full metadata and ground truth masks for a single reference pair."""
    ref = db.query(ReferenceImage).filter(ReferenceImage.id == reference_id).first()
    if not ref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Reference image not found."
        )

    parsed_metadata = None
    if ref.metadata_json:
        try:
            parsed_metadata = json.loads(ref.metadata_json)
        except Exception:
            parsed_metadata = ref.metadata_json

    return {
        "reference": {
            "id": ref.id,
            "dataset_source": ref.dataset_source,
            "location": {
                "id": ref.location.id,
                "name": ref.location.name,
                "district": ref.location.district,
                "state": ref.location.state,
            } if ref.location else None,
            "image_path": ref.image_path,
            "paired_pre_image_path": ref.paired_pre_image_path,
            "loc_target_path": ref.loc_target_path,
            "dmg_target_path": ref.dmg_target_path,
            "disaster_type": ref.disaster_type,
            "property_type": ref.property_type,
            "verification_status": ref.verification_status,
            "ground_truth_label": ref.ground_truth_label,
            "building_count": ref.building_count,
            "metadata": parsed_metadata,
        }
    }


@router.post("/import")
def trigger_import(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin-only endpoint to sync / import the reference dataset."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required to sync reference dataset.",
        )

    result = import_reference_dataset()
    return result
