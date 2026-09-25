from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegistrationRequest
from app.security.password import hash_password

class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        request: UserRegistrationRequest,
        organization_id: int,
    ) -> User:

        existing_user = UserRepository.get_user_by_email(
            db,
            request.email,
        )

        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            name=request.name,
            email=request.email,
            password_hash=hash_password(request.password),
            organization_id=organization_id,
        )

        return UserRepository.create_user(db, user)
