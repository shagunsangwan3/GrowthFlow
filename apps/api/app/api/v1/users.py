from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1",
    tags=["Users"]
)

@router.get("/users")
async def get_users():
    return {
        "users": [
            {
                "id": 1,
                "name": "John Doe"
            }
        ]
    }