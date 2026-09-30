from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.profile import ProfileUpdateRequest, ProfileResponse


router = APIRouter(
    prefix="/api/v1/profile",
    tags=["Profile"],
)


@router.get("/", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.put("/", response_model=ProfileResponse)
def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)

    updated_user = repository.update_user(
        current_user.id,
        {
            "name": request.name,
        },
    )

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return updated_user