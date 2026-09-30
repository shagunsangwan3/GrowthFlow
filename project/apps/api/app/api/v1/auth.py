from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import UserRegistrationRequest
from app.services.auth_service import AuthService
from app.schemas.auth import (
    UserRegistrationRequest,
    UserLoginRequest,
)

from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

@router.post("/register")
async def register_user(
    request: UserRegistrationRequest,
    db: Session = Depends(get_db),
):
    try:
        auth_service = AuthService(db)

        user = auth_service.register_user(request)

        return {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/login")
async def login_user(
    request: UserLoginRequest,
    db: Session = Depends(get_db),
):
    try:
        auth_service = AuthService(db)

        user, access_token = auth_service.login_user(request)

        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )

@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }