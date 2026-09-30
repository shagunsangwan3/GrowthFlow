from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    print("AUTH SCHEME:", credentials.scheme)
    print("TOKEN RECEIVED:", credentials.credentials[:30] + "...")

    try:
        payload = decode_access_token(credentials.credentials)
        print("TOKEN PAYLOAD:", payload)

    except ValueError as e:
        print("TOKEN ERROR:", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    print("USER ID:", user_id)

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = UserRepository(db).get_user_by_id(int(user_id))

    if not user:
        print("USER NOT FOUND")
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    print("USER FOUND:", user.email)

    return user