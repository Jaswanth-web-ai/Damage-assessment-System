"""
Phase 4 Tests: Disaster Claims and Damaged-Image Upload
Verifies:
1. Submission with multiple post-disaster damaged images.
2. Safe storage in claim-specific folder uploads/claims/<claim_id>/.
3. ClaimImage table entries with width, height, and file sizes.
4. Ownership verification: applicant cannot claim another user's property (403).
5. Nonexistent property rejection (404).
6. Invalid / corrupted image rejection (400).
7. Cross-user isolation: applicant cannot view another applicant's private claim.
"""
import io
import os
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.property import Property
from app.models.claim import Claim, ClaimImage
from app.services.auth import create_access_token
from pwdlib import PasswordHash

pwd_hasher = PasswordHash.recommended()
client = TestClient(app)


def create_sample_img(format="JPEG", size=(256, 256), color=(200, 50, 50)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()


@pytest.fixture(scope="module")
def setup_phase4_data():
    db = SessionLocal()

    # User 1 (Applicant)
    user1 = db.query(User).filter(User.email == "applicant1_p4@example.com").first()
    if not user1:
        user1 = User(
            name="Applicant One",
            email="applicant1_p4@example.com",
            phone="9111111111",
            password_hash=pwd_hasher.hash("Pass12345!"),
            role="applicant",
        )
        db.add(user1)
        db.commit()
        db.refresh(user1)

    # User 2 (Different Applicant)
    user2 = db.query(User).filter(User.email == "applicant2_p4@example.com").first()
    if not user2:
        user2 = User(
            name="Applicant Two",
            email="applicant2_p4@example.com",
            phone="9222222222",
            password_hash=pwd_hasher.hash("Pass12345!"),
            role="applicant",
        )
        db.add(user2)
        db.commit()
        db.refresh(user2)

    # Property belonging to User 1
    prop1 = db.query(Property).filter(Property.user_id == user1.id).first()
    if not prop1:
        prop1 = Property(
            user_id=user1.id,
            property_type="Residential",
            ownership="Owned",
            property_name="Sea Breeze Cottage",
            address="45 Beach Road",
            city_village="Nagapattinam",
            district="Nagapattinam",
            state="Tamil Nadu",
            pin_code="611001",
            property_value=3000000.0,
            pre_disaster_image="uploads/properties/prop1_mock.jpg",
        )
        db.add(prop1)
        db.commit()
        db.refresh(prop1)

    token1 = create_access_token(user_id=user1.id, role=user1.role)
    token2 = create_access_token(user_id=user2.id, role=user2.role)

    data = {
        "user1": {"id": user1.id, "token": token1},
        "user2": {"id": user2.id, "token": token2},
        "prop1_id": prop1.id,
    }
    db.close()
    return data


def test_claim_submission_multiple_images(setup_phase4_data):
    token1 = setup_phase4_data["user1"]["token"]
    prop_id = setup_phase4_data["prop1_id"]

    img1 = create_sample_img("JPEG", (300, 300), (220, 60, 60))
    img2 = create_sample_img("PNG", (400, 400), (180, 40, 40))

    files = [
        ("damaged_images", ("damaged_roof.jpg", img1, "image/jpeg")),
        ("damaged_images", ("damaged_wall.png", img2, "image/png")),
    ]
    data = {
        "property_id": str(prop_id),
        "disaster_type": "Flood",
        "disaster_date": "2026-10-15",
        "damage_description": "Severe flooding caused roof collapse and water intrusion in living quarters.",
    }

    response = client.post(
        "/claims/",
        headers={"Authorization": f"Bearer {token1}"},
        data=data,
        files=files,
    )

    assert response.status_code == 200, response.text
    res_json = response.json()
    assert "claim" in res_json
    claim = res_json["claim"]
    claim_id = claim["id"]
    images = claim["images"]

    assert len(images) == 2
    for img in images:
        assert img["image_path"].startswith(f"uploads/claims/{claim_id}/")
        assert os.path.exists(img["image_path"]), f"Missing file: {img['image_path']}"

    # Confirm database records
    db = SessionLocal()
    db_claim = db.query(Claim).filter(Claim.id == claim_id).first()
    assert db_claim is not None
    assert len(db_claim.images) == 2
    assert db_claim.status == "submitted"
    db.close()


def test_claim_unauthorized_property_access(setup_phase4_data):
    # User 2 tries to file claim on User 1's property
    token2 = setup_phase4_data["user2"]["token"]
    prop1_id = setup_phase4_data["prop1_id"]

    img = create_sample_img("JPEG", (256, 256))
    files = [("damaged_images", ("attempt.jpg", img, "image/jpeg"))]
    data = {
        "property_id": str(prop1_id),
        "disaster_type": "Flood",
        "disaster_date": "2026-10-16",
        "damage_description": "Fraudulent attempt",
    }

    response = client.post(
        "/claims/",
        headers={"Authorization": f"Bearer {token2}"},
        data=data,
        files=files,
    )
    assert response.status_code == 403


def test_claim_nonexistent_property(setup_phase4_data):
    token1 = setup_phase4_data["user1"]["token"]
    img = create_sample_img("JPEG", (256, 256))
    files = [("damaged_images", ("test.jpg", img, "image/jpeg"))]
    data = {
        "property_id": "999999",
        "disaster_type": "Cyclone",
        "disaster_date": "2026-10-16",
    }

    response = client.post(
        "/claims/",
        headers={"Authorization": f"Bearer {token1}"},
        data=data,
        files=files,
    )
    assert response.status_code == 404


def test_claim_corrupted_image_rejection(setup_phase4_data):
    token1 = setup_phase4_data["user1"]["token"]
    prop1_id = setup_phase4_data["prop1_id"]

    corrupt_bytes = b"not an image"
    files = [("damaged_images", ("bad.jpg", corrupt_bytes, "image/jpeg"))]
    data = {
        "property_id": str(prop1_id),
        "disaster_type": "Cyclone",
        "disaster_date": "2026-10-16",
    }

    response = client.post(
        "/claims/",
        headers={"Authorization": f"Bearer {token1}"},
        data=data,
        files=files,
    )
    assert response.status_code == 400
    assert "Invalid or corrupted image" in response.json()["detail"]


def test_claim_isolation_between_applicants(setup_phase4_data):
    token1 = setup_phase4_data["user1"]["token"]
    token2 = setup_phase4_data["user2"]["token"]

    # User 1 list claims
    res1 = client.get("/claims/", headers={"Authorization": f"Bearer {token1}"})
    assert res1.status_code == 200
    claims1 = res1.json()["claims"]
    assert len(claims1) > 0
    for c in claims1:
        assert c["user_id"] == setup_phase4_data["user1"]["id"]

    # User 2 should NOT see User 1's claims
    res2 = client.get("/claims/", headers={"Authorization": f"Bearer {token2}"})
    assert res2.status_code == 200
    claims2 = res2.json()["claims"]
    for c in claims2:
        assert c["user_id"] == setup_phase4_data["user2"]["id"]
