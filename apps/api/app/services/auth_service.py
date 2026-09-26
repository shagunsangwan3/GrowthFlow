from pwdlib import PasswordHash

from app.models.user import User
from app.repositories.user_repository import UserRepository


password_hash = PasswordHash.recommended()

class AuthService:

    def __init__(self, db):
        self.user_repository = UserRepository(db)

    def register_user(self, request):

        # Check if email already exists
        existing_user = self.user_repository.get_user_by_email(
            request.email
        )

        if existing_user:
            raise ValueError("Email already registered")

        # Hash password
        hashed_password = password_hash.hash(request.password)

        # Create user
        user = User(
            name=request.name,
            email=request.email,
            password_hash=hashed_password,
        )

        return self.user_repository.create_user(user)
