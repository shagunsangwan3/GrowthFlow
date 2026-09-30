from pydantic import BaseModel, Field 

class ProfileUpdateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True