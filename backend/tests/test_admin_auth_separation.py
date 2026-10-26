import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_admin_login_success():
    """Verify that seeded admin can successfully authenticate via dedicated /users/admin/login."""
    response = client.post(
        "/users/admin/login",
        json={
            "email": "admin@disasteraid.gov",
            "password": "AdminOfficial2026!",
        },
    )
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == "admin@disasteraid.gov"


def test_jaswanth_officer_login_success():
    """Verify that Jaswanth officer credentials authenticate successfully."""
    response = client.post(
        "/users/admin/login",
        json={
            "email": "jaswanth@gmail.com",
            "password": "JaswanthOfficer2026!",
        },
    )
    assert response.status_code == 200, f"Jaswanth login failed: {response.text}"
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == "jaswanth@gmail.com"


def test_citizen_cannot_login_to_admin_portal():
    """
    Verify strict role enforcement:
    A registered citizen / applicant trying to login through /users/admin/login
    is immediately blocked with 403 Forbidden.
    """
    # 1. Register a fresh citizen
    citizen_email = "citizen_sec_test@example.com"
    client.post(
        "/users/register",
        json={
            "name": "Jane Citizen",
            "email": citizen_email,
            "phone": "9876543299",
            "password": "CitizenSecret123!",
        },
    )

    # 2. Attempt to authenticate as admin
    response = client.post(
        "/users/admin/login",
        json={
            "email": citizen_email,
            "password": "CitizenSecret123!",
        },
    )
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"]


def test_admin_login_invalid_credentials():
    """Verify that invalid password returns 401 Unauthorized."""
    response = client.post(
        "/users/admin/login",
        json={
            "email": "admin@disasteraid.gov",
            "password": "WrongPassword999!",
        },
    )
    assert response.status_code == 401
    assert "Invalid officer credentials" in response.json()["detail"]
