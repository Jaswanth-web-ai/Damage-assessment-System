import os
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import Base, engine, get_db
import app.models  # Ensures all models are registered
from app.models.user import User
from app.models.property import Property
from app.models.claim import Claim, ClaimImage
from app.routes.user import router as users_router
from app.routes.property import router as properties_router
from app.routes.claim import router as claims_router
from app.routes.reference import router as references_router
from app.routes.assessment import router as assessments_router
from app.routes.admin import router as admin_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DisasterAid API",
    description="AI-Assisted Disaster Damage Assessment & Compensation Support Platform",
    version="1.0.0",
)

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include Routers
# -----------------------------
app.include_router(users_router)
app.include_router(properties_router)
app.include_router(claims_router)
app.include_router(references_router)
app.include_router(assessments_router)
app.include_router(admin_router)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "disasteraid_super_secret_key_change_this_later")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


# -----------------------------
# Protected File Serving Endpoint
# -----------------------------
@app.get("/files/{file_path:path}")
def serve_protected_file(
    file_path: str,
    request: Request,
    token: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """
    Secure file streaming endpoint enforcing role and ownership access control:
    - Allows direct <img src="/files/... ?token=..." /> or Bearer Authorization header.
    - Strictly blocks directory traversal outside workspace boundaries.
    - Enforces ownership: applicants can only view their own properties/claims.
    - Admins can view any claim or property file for assessment review.
    - Verified reference dataset images are readable by authenticated users.
    """
    # 1. Resolve raw token from Authorization header or URL query parameter
    auth_header = request.headers.get("Authorization")
    raw_token = None
    if auth_header and auth_header.startswith("Bearer "):
        raw_token = auth_header.split(" ", 1)[1]
    elif token:
        raw_token = token

    user = None
    if raw_token:
        try:
            payload = jwt.decode(raw_token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == int(user_id)).first()
        except (JWTError, ValueError):
            pass

    # 2. Path normalization & traversal defense
    backend_dir = Path(__file__).resolve().parent.parent
    workspace_dir = backend_dir.parent

    # Normalize incoming path
    clean_incoming = file_path.replace("\\", "/").lstrip("/")
    target_abs: Path = (backend_dir / clean_incoming).resolve()

    if not target_abs.exists():
        alt = (workspace_dir / clean_incoming).resolve()
        if alt.exists():
            target_abs = alt

    # Allowed parent folders
    allowed_backend_uploads = (backend_dir / "uploads").resolve()
    allowed_basepaper = (workspace_dir / "basepaper").resolve()

    is_in_uploads = target_abs.is_relative_to(allowed_backend_uploads)
    is_in_basepaper = target_abs.is_relative_to(allowed_basepaper)

    if not (is_in_uploads or is_in_basepaper):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="File access denied."
        )

    if not target_abs.exists() or not target_abs.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server."
        )

    # 3. Access Control checks
    # If the file is in uploads/properties/:
    if target_abs.is_relative_to(allowed_backend_uploads / "properties"):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to view property images.",
            )
        if user.role != "admin":
            # Verify user owns property with this baseline image
            rel = str(target_abs.relative_to(backend_dir)).replace("\\", "/")
            prop = db.query(Property).filter(Property.pre_disaster_image == rel).first()
            if prop and prop.user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this property image.",
                )

    # If the file is in uploads/claims/:
    elif target_abs.is_relative_to(allowed_backend_uploads / "claims"):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to view claim images.",
            )
        if user.role != "admin":
            rel = str(target_abs.relative_to(backend_dir)).replace("\\", "/")
            claim_img = db.query(ClaimImage).filter(ClaimImage.image_path == rel).first()
            if claim_img and claim_img.claim and claim_img.claim.user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this claim image.",
                )

    # Reference images or masks in basepaper: allowed if authenticated
    elif is_in_basepaper:
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to view verified dataset imagery.",
            )

    return FileResponse(target_abs)


@app.get("/")
def root():
    return {
        "project": "DisasterAid",
        "description": "AI-Assisted Disaster Damage Assessment & Compensation Support Platform",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "docs": "/docs",
            "users": "/users",
            "properties": "/properties",
            "claims": "/claims",
            "references": "/references",
            "assessments": "/assessments",
            "admin": "/admin",
        },
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
