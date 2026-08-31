from fastapi import APIRouter

from app.schemas.auth import UserRegistrationRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

auth_service = AuthService()

@router.post("/register")
async def register_user():
    return {
        "message": "User registered successfully"
    }

