import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


# --------------------------------------------------
# VALIDATE JWT CONFIGURATION
# --------------------------------------------------

if not JWT_SECRET_KEY:

    raise ValueError("JWT_SECRET_KEY is not set in the .env file")


# --------------------------------------------------
# OAUTH2 CONFIGURATION
# --------------------------------------------------

# FastAPI uses this to extract:
#
# Authorization: Bearer <JWT>
#
# Swagger will use:
# POST /users/token
#
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


# --------------------------------------------------
# CREATE JWT ACCESS TOKEN
# --------------------------------------------------


def create_access_token(user_id: int, role: str):

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {"sub": str(user_id), "role": role, "exp": expire}

    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    return token


# --------------------------------------------------
# GET CURRENT USER
# --------------------------------------------------


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # --------------------------------------------------
    # DECODE AND VERIFY JWT
    # --------------------------------------------------

    try:

        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])

        # Get user ID from JWT "sub"
        user_id = payload.get("sub")

        if user_id is None:

            raise credentials_exception

        # Convert user ID from string to integer
        user_id = int(user_id)

    except (JWTError, ValueError, TypeError):

        raise credentials_exception

    # --------------------------------------------------
    # FIND USER IN DATABASE
    # --------------------------------------------------

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:

        raise credentials_exception

    # Return logged-in user
    return user
