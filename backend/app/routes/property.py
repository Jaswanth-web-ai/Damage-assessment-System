import os
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.property import Property
from app.models.user import User
from app.services.auth import get_current_user
from app.services.image_service import (
    validate_image_bytes,
    save_image_bytes,
    delete_file_safely,
)

router = APIRouter(prefix="/properties", tags=["Properties"])

# Directory where baseline property images are stored
UPLOAD_DIR = Path("uploads/properties")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
async def create_property(
    property_type: str = Form(...),
    ownership: str = Form(...),
    property_name: str = Form(...),
    address: str = Form(...),
    city_village: str = Form(...),
    district: str = Form(...),
    state: str = Form(...),
    pin_code: str = Form(...),
    property_value: float | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    baseline_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Registers a new property with baseline image:
    1. Reads and validates the uploaded image content, format, dimensions and size via PIL.
    2. Enforces authentication (linked strictly to current_user.id).
    3. Persists property in PostgreSQL.
    4. Generates unique server-side filename and saves image to backend/uploads/properties/.
    5. Updates properties.pre_disaster_image with relative path.
    6. Ensures safe rollback and file cleanup on database or disk failure.
    """
    # 1. Read and validate uploaded image file content
    try:
        image_data = await baseline_image.read()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded image: {str(exc)}",
        )

    # Validates non-empty, file size, actual PIL format, and dimensions
    ext, img_width, img_height = validate_image_bytes(
        image_data, declared_content_type=baseline_image.content_type
    )

    # 2. Create property record in database
    new_property = Property(
        user_id=current_user.id,
        property_type=property_type.strip(),
        ownership=ownership.strip(),
        property_name=property_name.strip(),
        address=address.strip(),
        city_village=city_village.strip(),
        district=district.strip(),
        state=state.strip(),
        pin_code=pin_code.strip(),
        property_value=property_value,
        latitude=latitude,
        longitude=longitude,
        pre_disaster_image=None,
    )

    saved_file_path: Path | None = None
    try:
        db.add(new_property)
        db.flush()  # Allocates ID without final commit

        # 3. Save baseline image with unique server-generated filename
        filename_prefix = f"property_{new_property.id}_baseline"
        saved_file_path, relative_image_path = save_image_bytes(
            image_bytes=image_data,
            target_dir=UPLOAD_DIR,
            filename_prefix=filename_prefix,
            extension=ext,
        )

        # 4. Save relative image path in properties.pre_disaster_image
        new_property.pre_disaster_image = relative_image_path
        db.commit()
        db.refresh(new_property)

    except Exception as exc:
        db.rollback()
        if saved_file_path:
            delete_file_safely(saved_file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register property: {str(exc)}",
        )

    return {
        "message": "Property registered successfully",
        "property": {
            "id": new_property.id,
            "user_id": new_property.user_id,
            "property_type": new_property.property_type,
            "ownership": new_property.ownership,
            "property_name": new_property.property_name,
            "address": new_property.address,
            "city_village": new_property.city_village,
            "district": new_property.district,
            "state": new_property.state,
            "pin_code": new_property.pin_code,
            "property_value": new_property.property_value,
            "latitude": new_property.latitude,
            "longitude": new_property.longitude,
            "pre_disaster_image": new_property.pre_disaster_image,
            "image_dimensions": f"{img_width}x{img_height}",
        },
    }


@router.get("/")
def list_properties(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns properties registered by the authenticated user.
    Admins can view all properties.
    """
    if current_user.role == "admin":
        properties = db.query(Property).order_by(Property.created_at.desc()).all()
    else:
        properties = (
            db.query(Property)
            .filter(Property.user_id == current_user.id)
            .order_by(Property.created_at.desc())
            .all()
        )

    return {
        "properties": [
            {
                "id": p.id,
                "user_id": p.user_id,
                "property_type": p.property_type,
                "ownership": p.ownership,
                "property_name": p.property_name,
                "address": p.address,
                "city_village": p.city_village,
                "district": p.district,
                "state": p.state,
                "pin_code": p.pin_code,
                "property_value": p.property_value,
                "latitude": p.latitude,
                "longitude": p.longitude,
                "pre_disaster_image": p.pre_disaster_image,
                "created_at": str(p.created_at) if p.created_at else None,
            }
            for p in properties
        ]
    }


@router.get("/{property_id}")
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieves details for a specific property.
    Enforces authorization: only owner or admin can view.
    """
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Property not found."
        )

    if prop.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this property.",
        )

    return {
        "property": {
            "id": prop.id,
            "user_id": prop.user_id,
            "property_type": prop.property_type,
            "ownership": prop.ownership,
            "property_name": prop.property_name,
            "address": prop.address,
            "city_village": prop.city_village,
            "district": prop.district,
            "state": prop.state,
            "pin_code": prop.pin_code,
            "property_value": prop.property_value,
            "latitude": prop.latitude,
            "longitude": prop.longitude,
            "pre_disaster_image": prop.pre_disaster_image,
            "created_at": str(prop.created_at) if prop.created_at else None,
        }
    }
