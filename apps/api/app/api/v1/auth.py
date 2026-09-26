from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import UserRegistrationRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

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