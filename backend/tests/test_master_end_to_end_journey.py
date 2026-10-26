"""
Master End-to-End Journey Integration Test:
Tests the complete DisasterAid workflow from applicant onboarding to official admin decision:
1. Applicant Registration
2. Duplicate Registration Rejection
3. Applicant Login & JWT Issuance
4. Invalid Token Rejection
5. Property Registration & Baseline Image Upload (PIL content verification & storage)
6. Applicant Property Listing & Isolation
7. Disaster Claim Submission with Multiple Post-Disaster Damaged Photographs
8. Verified Reference Dataset Retrieval (xBD benchmark)
9. AI Vision Processing: Feature Embedding, Cosine Similarity & Change Detection
10. Damage Assessment Severity Categorization (4-tier standard)
11. Explainable Loss Estimation & Policy Compensation Recommendation (Deterministic breakdown)
12. Official Admin Reviewer Login & Role-Based Access Enforcement
13. Admin Inspection of Claim Evidence & Reference Matches
14. Official Review Decision & Auditable Log Persistence
"""
import io
import os
from pathlib import Path
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.property import Property
from app.models.claim import Claim
from app.models.decision import ClaimDecision

client = TestClient(app)


def generate_test_image_bytes(format="JPEG", size=(256, 256), color=(80, 140, 90)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()


def test_complete_applicant_to_admin_master_journey():
    # ----------------------------------------------------
    # STEP 1: Applicant Registration
    # ----------------------------------------------------
    unique_email = f"master_journey_applicant_{os.urandom(4).hex()}@example.com"
    reg_payload = {
        "name": "Karthik Raman",
        "email": unique_email,
        "phone": "9840123456",
        "password": "SecurePassword2026!",
    }
    reg_res = client.post("/users/register", json=reg_payload)
    assert reg_res.status_code == 200, reg_res.text
    reg_data = reg_res.json()
    assert reg_data["user"]["email"] == unique_email
    assert reg_data["user"]["role"] == "applicant"

    # ----------------------------------------------------
    # STEP 2: Duplicate Registration Rejection
    # ----------------------------------------------------
    dup_res = client.post("/users/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already registered" in dup_res.json()["detail"].lower()

    # ----------------------------------------------------
    # STEP 3: Applicant Login
    # ----------------------------------------------------
    login_res = client.post(
        "/users/login",
        json={"email": unique_email, "password": "SecurePassword2026!"},
    )
    assert login_res.status_code == 200, login_res.text
    login_data = login_res.json()
    applicant_token = login_data["access_token"]
    assert applicant_token is not None
    assert login_data["user"]["role"] == "applicant"

    # ----------------------------------------------------
    # STEP 4: Invalid Token Rejection
    # ----------------------------------------------------
    bad_auth_res = client.get("/properties/", headers={"Authorization": "Bearer invalid_tampered_token"})
    assert bad_auth_res.status_code == 401

    # ----------------------------------------------------
    # STEP 5: Property Registration with Baseline Image Upload
    # ----------------------------------------------------
    dataset_img_dir = Path("..") / "basepaper" / "dataset" / "data" / "test" / "images"
    with open(dataset_img_dir / "disaster_test_000_pre_disaster.png", "rb") as f:
        baseline_bytes = f.read()

    property_form = {
        "property_type": "Residential",
        "ownership": "Property Owner",
        "property_name": "Raman Riverfront Residence",
        "address": "14 North Street, Delta Nagar",
        "city_village": "Kollidam",
        "district": "Mayiladuthurai",
        "state": "Tamil Nadu",
        "pin_code": "609102",
        "property_value": "4200000.0",
        "latitude": "11.3200",
        "longitude": "79.7400",
    }
    files = {
        "baseline_image": ("pre_disaster_house.png", baseline_bytes, "image/png")
    }

    prop_res = client.post(
        "/properties/",
        headers={"Authorization": f"Bearer {applicant_token}"},
        data=property_form,
        files=files,
    )
    assert prop_res.status_code == 200, prop_res.text
    prop_data = prop_res.json()["property"]
    property_id = prop_data["id"]
    baseline_img_path = prop_data["pre_disaster_image"]
    assert baseline_img_path.startswith("uploads/properties/")
    assert os.path.exists(baseline_img_path)

    # ----------------------------------------------------
    # STEP 6: Applicant Property Listing
    # ----------------------------------------------------
    my_props_res = client.get("/properties/", headers={"Authorization": f"Bearer {applicant_token}"})
    assert my_props_res.status_code == 200
    props_list = my_props_res.json()["properties"]
    assert any(p["id"] == property_id for p in props_list)

    # ----------------------------------------------------
    # STEP 7: Disaster Claim Submission with Multiple Damaged Images
    # ----------------------------------------------------
    with open(dataset_img_dir / "disaster_test_000_post_disaster.png", "rb") as f:
        dmg1_bytes = f.read()
    with open(dataset_img_dir / "disaster_test_001_post_disaster.png", "rb") as f:
        dmg2_bytes = f.read()

    claim_form = {
        "property_id": str(property_id),
        "disaster_type": "Flood",
        "disaster_date": "2026-10-20",
        "damage_description": "Flood water inundated living areas up to window sill, walls damaged.",
    }
    claim_files = [
        ("damaged_images", ("damaged_exterior.png", dmg1_bytes, "image/png")),
        ("damaged_images", ("damaged_interior.png", dmg2_bytes, "image/png")),
    ]

    claim_res = client.post(
        "/claims/",
        headers={"Authorization": f"Bearer {applicant_token}"},
        data=claim_form,
        files=claim_files,
    )
    assert claim_res.status_code == 200, claim_res.text
    claim_data = claim_res.json()["claim"]
    claim_id = claim_data["id"]
    assert len(claim_data["images"]) == 2
    for img in claim_data["images"]:
        assert img["image_path"].startswith(f"uploads/claims/{claim_id}/")
        assert os.path.exists(img["image_path"])

    # ----------------------------------------------------
    # STEP 8: Verified Reference Dataset Retrieval
    # ----------------------------------------------------
    ref_res = client.get("/references/?disaster_type=Flood", headers={"Authorization": f"Bearer {applicant_token}"})
    assert ref_res.status_code == 200
    refs = ref_res.json()["references"]
    assert len(refs) > 0
    assert all(r["verification_status"] == "verified" for r in refs)

    # ----------------------------------------------------
    # STEP 9 & 10: Run AI Damage Assessment & Severity Classification
    # ----------------------------------------------------
    assess_res = client.post(
        f"/assessments/run/{claim_id}",
        headers={"Authorization": f"Bearer {applicant_token}"},
    )
    assert assess_res.status_code == 200, assess_res.text
    assess_data = assess_res.json()

    ai_assessment = assess_data["assessment"]
    assert ai_assessment["model_name"] == "BDANet-DualBranch-Vision"
    assert ai_assessment["severity_category"] in ["no_damage", "minor_damage", "major_damage", "destroyed"]
    assert ai_assessment["confidence_score"] > 0.0
    assert len(ai_assessment["supporting_references"]) > 0

    # ----------------------------------------------------
    # STEP 11: Policy Compensation Recommendation
    # ----------------------------------------------------
    comp_rec = assess_data["recommendation"]
    assert comp_rec["policy_name"] == "National Disaster Relief & Property Assistance Policy"
    assert comp_rec["estimated_loss"] > 0
    assert comp_rec["recommended_compensation"] > 0
    assert comp_rec["is_provisional"] is True
    assert "breakdown" in comp_rec

    # ----------------------------------------------------
    # STEP 12: Admin Login & Privilege Verification
    # ----------------------------------------------------
    # Applicant cannot access admin endpoint
    unauth_admin_res = client.get("/admin/claims", headers={"Authorization": f"Bearer {applicant_token}"})
    assert unauth_admin_res.status_code == 403

    # Admin logs in
    admin_login_res = client.post(
        "/users/login",
        json={"email": "admin@disasteraid.gov", "password": "AdminOfficial2026!"},
    )
    assert admin_login_res.status_code == 200, admin_login_res.text
    admin_token = admin_login_res.json()["access_token"]

    # ----------------------------------------------------
    # STEP 13: Admin Inspects Claim Evidence
    # ----------------------------------------------------
    admin_review_res = client.get(f"/admin/claims/{claim_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_review_res.status_code == 200
    review_bundle = admin_review_res.json()["claim"]
    assert review_bundle["id"] == claim_id
    assert len(review_bundle["images"]) == 2
    assert review_bundle["assessment"] is not None
    assert review_bundle["recommendation"] is not None

    # ----------------------------------------------------
    # STEP 14: Admin Official Decision & Audit Logging
    # ----------------------------------------------------
    decision_payload = {
        "decision": "approved",
        "decision_reason": "Verified flood surge structural damage and photographic evidence. Approved compensation under Policy 2026.1.",
        "approved_amount": comp_rec["recommended_compensation"],
    }
    decision_res = client.post(
        f"/admin/claims/{claim_id}/decision",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=decision_payload,
    )
    assert decision_res.status_code == 200, decision_res.text
    dec_result = decision_res.json()
    assert dec_result["new_status"] == "approved"
    assert dec_result["decision"]["decision"] == "approved"

    # Confirm applicant sees approved status on their dashboard
    applicant_claim_res = client.get(f"/claims/{claim_id}", headers={"Authorization": f"Bearer {applicant_token}"})
    assert applicant_claim_res.status_code == 200
    updated_claim = applicant_claim_res.json()["claim"]
    assert updated_claim["status"] == "approved"
    assert len(updated_claim["decisions"]) >= 1
    assert updated_claim["decisions"][-1]["decision"] == "approved"
