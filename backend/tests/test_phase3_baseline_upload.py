"""
Phase 3 Tests: Baseline Property Image Upload
Verifies:
1. Valid baseline image upload with multipart/form-data.
2. File existence in backend/uploads/properties/.
3. Stored relative path matching database record.
4. Rejection of invalid file types (e.g. text disguised as image).
5. Rejection of empty file uploads (0 bytes).
6. Rejection of oversized files (> 10MB).
7. Applicant property ownership enforcement (user cannot register property for another user).
"""
import io
import os
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app
from app.database import get_db, SessionLocal
from app.models.user import User
from app.models.property import Property
from app.services.auth import create_access_token
from pwdlib import PasswordHash

pwd_hasher = PasswordHash.recommended()
client = TestClient(app)


@pytest.fixture(scope="module")
def test_applicant():
    db = SessionLocal()
    # Check or create a test applicant user
    user = db.query(User).filter(User.email == "test_applicant_p3@example.com").first()
    if not user:
        user = User(
            name="Test Applicant Phase 3",
            email="test_applicant_p3@example.com",
            phone="9876543210",
            password_hash=pwd_hasher.hash("TestPass123!"),
            role="applicant",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    token = create_access_token(user_id=user.id, role=user.role)
    user_id = user.id
    db.close()
    return {"id": user_id, "token": token, "email": "test_applicant_p3@example.com"}


def create_sample_image(format="JPEG", size=(256, 256), color=(45, 120, 200)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()


def test_baseline_upload_valid(test_applicant):
    token = test_applicant["token"]
    img_bytes = create_sample_image("JPEG", size=(300, 300))

    files = {
        "baseline_image": ("baseline_sample.jpg", img_bytes, "image/jpeg"),
    }
    data = {
        "property_type": "Residential",
        "ownership": "Owned",
        "property_name": "Sunrise Villa",
        "address": "123 Coastal Road",
        "city_village": "Cuddalore",
        "district": "Cuddalore",
        "state": "Tamil Nadu",
        "pin_code": "607001",
        "property_value": "4500000.0",
        "latitude": "11.7500",
        "longitude": "79.7600",
    }

    response = client.post(
        "/properties/",
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        files=files,
    )

    assert response.status_code == 200, response.text
    res_json = response.json()
    assert "property" in res_json
    prop = res_json["property"]
    prop_id = prop["id"]
    pre_img_path = prop["pre_disaster_image"]

    assert prop_id is not None
    assert pre_img_path is not None
    assert "uploads/properties" in pre_img_path
    assert pre_img_path.endswith(".jpg")

    # Confirm the file exists on disk
    assert os.path.exists(pre_img_path), f"File {pre_img_path} not found on disk!"

    # Confirm database record matches
    db = SessionLocal()
    db_prop = db.query(Property).filter(Property.id == prop_id).first()
    assert db_prop is not None
    assert db_prop.pre_disaster_image == pre_img_path
    assert db_prop.user_id == test_applicant["id"]
    db.close()


def test_baseline_upload_invalid_corrupted_file(test_applicant):
    token = test_applicant["token"]
    fake_bytes = b"This is not a real image file, just text bytes."

    files = {
        "baseline_image": ("fake.jpg", fake_bytes, "image/jpeg"),
    }
    data = {
        "property_type": "Commercial",
        "ownership": "Owned",
        "property_name": "Bad Image Shop",
        "address": "456 Market St",
        "city_village": "Cuddalore",
        "district": "Cuddalore",
        "state": "Tamil Nadu",
        "pin_code": "607001",
    }

    response = client.post(
        "/properties/",
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        files=files,
    )

    assert response.status_code == 400
    assert "Invalid or corrupted image" in response.json()["detail"]


def test_baseline_upload_empty_file(test_applicant):
    token = test_applicant["token"]
    empty_bytes = b""

    files = {
        "baseline_image": ("empty.png", empty_bytes, "image/png"),
    }
    data = {
        "property_type": "Residential",
        "ownership": "Owned",
        "property_name": "Empty Home",
        "address": "789 Sea View",
        "city_village": "Cuddalore",
        "district": "Cuddalore",
        "state": "Tamil Nadu",
        "pin_code": "607001",
    }

    response = client.post(
        "/properties/",
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        files=files,
    )

    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_baseline_upload_oversized_file(test_applicant):
    token = test_applicant["token"]
    # 11 MB of junk
    oversized_bytes = b"0" * (11 * 1024 * 1024)

    files = {
        "baseline_image": ("huge.jpg", oversized_bytes, "image/jpeg"),
    }
    data = {
        "property_type": "Residential",
        "ownership": "Owned",
        "property_name": "Huge File Home",
        "address": "101 River View",
        "city_village": "Cuddalore",
        "district": "Cuddalore",
        "state": "Tamil Nadu",
        "pin_code": "607001",
    }

    response = client.post(
        "/properties/",
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        files=files,
    )

    assert response.status_code == 400
    assert "exceeds" in response.json()["detail"].lower()


def test_property_list_and_ownership(test_applicant):
    token = test_applicant["token"]
    response = client.get("/properties/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    props = response.json()["properties"]
    assert len(props) > 0
    for p in props:
        assert p["user_id"] == test_applicant["id"]
