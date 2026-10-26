from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from app.services.auth import create_access_token

from pwdlib import PasswordHash

router = APIRouter(prefix="/users", tags=["Users"])


password_hash = PasswordHash.recommended()


@router.post("/register")
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):

    # Check whether email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password
    hashed_password = password_hash.hash(user_data.password)

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        role="applicant",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role,
        },
    }


@router.post("/login")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()

    # User not found
    if not user:

        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    password_is_valid = password_hash.verify(user_data.password, user.password_hash)

    # Password incorrect
    if not password_is_valid:

        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate JWT token
    access_token = create_access_token(user_id=user.id, role=user.role)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


@router.post("/admin/login")
def login_admin(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Dedicated authentication endpoint for Disaster Assessment Officers & Administrators.
    Strictly forbids citizen/applicant accounts from accessing official officer tools.
    """
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid officer credentials or unauthorized access."
        )

    password_is_valid = password_hash.verify(user_data.password, user.password_hash)

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid officer credentials or unauthorized access."
        )

    # Server-side security gate: Strictly enforce admin/officer role
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access Denied: This portal is strictly restricted to authorized Disaster Assessment Officers. Citizen accounts must log in via the Citizen Portal at /login."
        )

    access_token = create_access_token(user_id=user.id, role=user.role)

    return {
        "message": "Officer authenticated successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    password_is_valid = password_hash.verify(form_data.password, user.password_hash)

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user_id=user.id, role=user.role)

    return {"access_token": access_token, "token_type": "bearer"}
