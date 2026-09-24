from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.website_repository import WebsiteRepository
from app.schemas.website import WebsiteCreate, WebsiteResponse

router  = APIRouter(prefix="/websites", tags=["Websites"])

@router.post("/", response_model=WebsiteResponse)
def create_website(
    data: WebsiteCreate,
    db: Session = Depends(get_db),
):
    parsed_url = urlparse(str(data.url))
    domain = parsed_url.netloc

    if not domain:
        raise HTTPException(
            status_code=400,
            detail="Invalid website URL",
        )

    organization_id = 1

    return WebsiteRepository.create(
        db=db,
        organization_id=organization_id,
        name=data.name,
        url=str(data.url),
        domain=domain
    )

@router.get("/", response_model=list[WebsiteResponse])
def get_websites(
    db: Session = Depends(get_db),
):
    organization_id = 1

    return WebsiteRepository.get_all(
        db=db,
        organization_id=organization_id,
    )