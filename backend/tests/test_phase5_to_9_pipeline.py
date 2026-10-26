"""
End-to-End Pipeline Tests for Phases 5 through 9:
1. Phase 5: Verified Reference Dataset queries & metadata filtering.
2. Phase 6 & 7: AI Image Processing, Feature Extraction, Cosine Similarity, and Severity Classification.
3. Phase 8: Loss & Compensation Recommendation (explainable policy rules, deterministic calculations).
4. Phase 9: Admin Dashboard, Role Enforcement, Human Verification Decisions & Audit Trail.
"""
import io
import json
import os
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.property import Property
from app.models.claim import Claim, ClaimImage
from app.models.reference import ReferenceImage
from app.models.decision import ClaimDecision
from app.services.auth import create_access_token
from pwdlib import PasswordHash

pwd_hasher = PasswordHash.recommended()
client = TestClient(app)


def make_test_img(color=(120, 150, 80), size=(256, 256)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.getvalue()


@pytest.fixture(scope="module")
def pipeline_fixture():
    db = SessionLocal()

    # Admin User
    admin = db.query(User).filter(User.email == "test_officer@disasteraid.gov").first()
    if not admin:
        admin = User(
            name="Test Review Officer",
            email="test_officer@disasteraid.gov",
            phone="044-22223333",
            password_hash=pwd_hasher.hash("OfficerSecret2026!"),
            role="admin",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # Applicant User
    applicant = db.query(User).filter(User.email == "pipeline_applicant@example.com").first()
    if not applicant:
        applicant = User(
            name="Pipeline Applicant",
            email="pipeline_applicant@example.com",
            phone="9876543219",
            password_hash=pwd_hasher.hash("ApplicantPass2026!"),
            role="applicant",
        )
        db.add(applicant)
        db.commit()
        db.refresh(applicant)

    # Register Property for Applicant with real image
    os.makedirs("uploads/properties", exist_ok=True)
    baseline_filename = f"uploads/properties/prop_pipeline_baseline_{applicant.id}.jpg"
    with open(baseline_filename, "wb") as f:
        f.write(make_test_img(color=(90, 160, 70)))

    prop = db.query(Property).filter(Property.user_id == applicant.id).first()
    if not prop:
        prop = Property(
            user_id=applicant.id,
            property_type="Residential",
            ownership="Owned",
            property_name="Cauvery River House",
            address="77 Delta Basin",
            city_village="Kumbakonam",
            district="Thanjavur",
            state="Tamil Nadu",
            pin_code="612001",
            property_value=3500000.0,
            pre_disaster_image=baseline_filename,
        )
        db.add(prop)
        db.commit()
        db.refresh(prop)

    # Create Claim with 2 damaged images
    os.makedirs(f"uploads/claims/pipeline_{applicant.id}", exist_ok=True)
    dmg_file1 = f"uploads/claims/pipeline_{applicant.id}/damaged_view1.jpg"
    dmg_file2 = f"uploads/claims/pipeline_{applicant.id}/damaged_view2.jpg"
    with open(dmg_file1, "wb") as f:
        f.write(make_test_img(color=(160, 70, 70)))  # High color change indicates damage
    with open(dmg_file2, "wb") as f:
        f.write(make_test_img(color=(180, 50, 50)))

    claim = db.query(Claim).filter(Claim.user_id == applicant.id).first()
    if not claim:
        claim = Claim(
            user_id=applicant.id,
            property_id=prop.id,
            disaster_type="Flood",
            disaster_date="2026-10-18",
            damage_description="Ground floor inundated with 5 feet flood waters, foundation cracked.",
            status="submitted",
        )
        db.add(claim)
        db.flush()

        img1 = ClaimImage(claim_id=claim.id, image_path=dmg_file1, file_size=len(make_test_img()), image_width=256, image_height=256)
        img2 = ClaimImage(claim_id=claim.id, image_path=dmg_file2, file_size=len(make_test_img()), image_width=256, image_height=256)
        db.add(img1)
        db.add(img2)
        db.commit()
        db.refresh(claim)

    admin_token = create_access_token(user_id=admin.id, role=admin.role)
    applicant_token = create_access_token(user_id=applicant.id, role=applicant.role)

    result = {
        "admin": {"id": admin.id, "token": admin_token},
        "applicant": {"id": applicant.id, "token": applicant_token},
        "claim_id": claim.id,
        "prop_id": prop.id,
    }
    db.close()
    return result


def test_phase5_reference_dataset_filtering(pipeline_fixture):
    token = pipeline_fixture["applicant"]["token"]

    # 1. Fetch reference locations
    loc_res = client.get("/references/locations", headers={"Authorization": f"Bearer {token}"})
    assert loc_res.status_code == 200
    locations = loc_res.json()["locations"]
    assert len(locations) > 0

    # 2. Filter reference images by disaster_type=Flood
    flood_res = client.get("/references/?disaster_type=Flood", headers={"Authorization": f"Bearer {token}"})
    assert flood_res.status_code == 200
    flood_images = flood_res.json()["references"]
    assert len(flood_images) > 0
    for img in flood_images:
        assert img["verification_status"] == "verified"
        assert "Flood" in img["disaster_type"]


def test_phase6_7_8_ai_assessment_and_compensation(pipeline_fixture):
    token = pipeline_fixture["applicant"]["token"]
    claim_id = pipeline_fixture["claim_id"]

    # Run AI assessment on the claim
    run_res = client.post(f"/assessments/run/{claim_id}", headers={"Authorization": f"Bearer {token}"})
    assert run_res.status_code == 200, run_res.text
    res_data = run_res.json()

    assert "assessment" in res_data
    assessment = res_data["assessment"]
    assert assessment["model_name"] == "BDANet-DualBranch-Vision"
    assert assessment["severity_category"] in ["no_damage", "minor_damage", "major_damage", "destroyed"]
    assert assessment["confidence_score"] > 0.0
    assert assessment["damage_score"] >= 0.0
    assert "limitations_notes" in assessment
    assert "supporting_references" in assessment

    # Phase 8: Verify Compensation Recommendation
    assert "recommendation" in res_data
    recommendation = res_data["recommendation"]
    assert recommendation["policy_name"] == "National Disaster Relief & Property Assistance Policy"
    assert recommendation["estimated_loss"] >= 0.0
    assert recommendation["recommended_compensation"] >= 0.0
    assert recommendation["is_provisional"] is True

    # Breakdown verification
    breakdown = recommendation["breakdown"]
    assert "declared_property_value" in breakdown
    assert "loss_rationale" in breakdown
    assert "deductible_amount" in breakdown
    assert "officer_review_notice" in breakdown


def test_phase9_admin_role_enforcement(pipeline_fixture):
    applicant_token = pipeline_fixture["applicant"]["token"]
    admin_token = pipeline_fixture["admin"]["token"]
    claim_id = pipeline_fixture["claim_id"]

    # Applicant attempting to access admin claims endpoint must receive 403 Forbidden
    forbidden_res = client.get("/admin/claims", headers={"Authorization": f"Bearer {applicant_token}"})
    assert forbidden_res.status_code == 403

    # Admin accessing admin claims endpoint succeeds
    admin_res = client.get("/admin/claims", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_res.status_code == 200
    claims = admin_res.json()["claims"]
    assert len(claims) > 0

    # Admin gets full decision-support bundle for the claim
    detail_res = client.get(f"/admin/claims/{claim_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert detail_res.status_code == 200
    detail = detail_res.json()["claim"]
    assert detail["assessment"] is not None
    assert detail["recommendation"] is not None


def test_phase9_admin_human_decision_audit(pipeline_fixture):
    admin_token = pipeline_fixture["admin"]["token"]
    claim_id = pipeline_fixture["claim_id"]

    # Admin makes official review decision
    decision_payload = {
        "decision": "approved",
        "decision_reason": "Photographic damage evidence matches reported flood surge; structural repair recommended as per Policy 2026.1.",
        "approved_amount": 750000.0,
    }

    dec_res = client.post(
        f"/admin/claims/{claim_id}/decision",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=decision_payload,
    )
    assert dec_res.status_code == 200, dec_res.text
    dec_data = dec_res.json()
    assert dec_data["new_status"] == "approved"
    assert dec_data["decision"]["decision"] == "approved"

    # Confirm audit trail in database
    db = SessionLocal()
    audit_rows = db.query(ClaimDecision).filter(ClaimDecision.claim_id == claim_id).all()
    assert len(audit_rows) > 0
    latest_audit = audit_rows[-1]
    assert latest_audit.decision == "approved"
    assert latest_audit.approved_amount == 750000.0
    assert latest_audit.reviewer_id == pipeline_fixture["admin"]["id"]
    db.close()


def test_identical_images_zero_damage():
    """
    Verify optimal AI accuracy:
    Comparing identical or near-identical photos (e.g. same room without damage)
    must strictly produce 0.0% damage and 'no_damage' severity.
    """
    from PIL import Image
    from app.services.ai_service import perform_change_detection

    # Create a synthetic photo
    img_a = Image.new("RGB", (256, 256), color=(100, 150, 200))
    # 1. Byte-for-byte identical
    dmg_score_exact, conf_exact, meta_exact = perform_change_detection(img_a, img_a)
    assert dmg_score_exact == 0.0
    assert conf_exact >= 0.95

    # 2. Camera-noise simulated identical (slight sensor noise < 4 intensity)
    import numpy as np
    arr = np.asarray(img_a, dtype=np.int16)
    noise = np.random.randint(-3, 3, size=arr.shape)
    noisy_arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    img_noisy = Image.fromarray(noisy_arr)

    dmg_score_noisy, conf_noisy, meta_noisy = perform_change_detection(img_a, img_noisy)
    assert dmg_score_noisy == 0.0
    assert conf_noisy >= 0.95
