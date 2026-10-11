from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import create_access_token, verify_password
from ..crud import get_db


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


# =========================
# REGISTER
# =========================
@router.post(
    "/register",
    response_model=schemas.UserOut
)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing = crud.get_user_by_email(db, user.email)

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = crud.create_user(db, user)

    return new_user


# =========================
# FRONTEND LOGIN
# =========================
# Keeps the existing JSON login used by the React frontend.
@router.post(
    "/login",
    response_model=schemas.Token
)
def login(
    form_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(
        db,
        form_data.email
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
# SWAGGER / OAUTH2 LOGIN
# =========================
# Swagger sends username + password as form data.
@router.post(
    "/token",
    response_model=schemas.Token
)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Swagger sends the user's email
    # inside the "username" field.
    user = crud.get_user_by_email(
        db,
        form_data.username
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }