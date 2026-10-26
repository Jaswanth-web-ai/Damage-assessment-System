"""
Controlled Admin Account Provisioning Script
Creates or updates the primary system administrator / claims verification officer.
Does not expose public endpoints for privilege escalation.
"""
import os
import sys
from pwdlib import PasswordHash
from app.database import SessionLocal
from app.models.user import User

pwd_hasher = PasswordHash.recommended()

DEFAULT_ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@disasteraid.gov")
DEFAULT_ADMIN_PASS = os.getenv("ADMIN_PASSWORD", "AdminOfficial2026!")
DEFAULT_ADMIN_NAME = os.getenv("ADMIN_NAME", "Disaster Assessment Officer")


def seed_admin_user(email: str = DEFAULT_ADMIN_EMAIL, password: str = DEFAULT_ADMIN_PASS, name: str = DEFAULT_ADMIN_NAME) -> User:
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == email).first()
        if not admin_user:
            admin_user = User(
                name=name,
                email=email,
                phone="044-28591000",
                password_hash=pwd_hasher.hash(password),
                role="admin",
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Created Admin account: {email} (role: {admin_user.role})")
        else:
            # Ensure role is admin
            if admin_user.role != "admin":
                admin_user.role = "admin"
                db.commit()
                print(f"Upgraded user {email} to admin role.")
            else:
                print(f"Admin account already exists: {email}")
        return admin_user
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_user()
    seed_admin_user(email="jaswanth@gmail.com", password="JaswanthOfficer2026!", name="Officer Jaswanth")
