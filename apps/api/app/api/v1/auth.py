from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import UserRegistrationRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

auth_service = AuthService()


@router.post("/register")
async def register_user(
    request: UserRegistrationRequest,
    db: Session = Depends(get_db),
):
    try:
        user = auth_service.register_user(
            db=db,
            request=request,
            organization_id=1,
        )

        return {
            "message": "User registered successfully",
            "user_id": user.id,
            "email": user.email,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )