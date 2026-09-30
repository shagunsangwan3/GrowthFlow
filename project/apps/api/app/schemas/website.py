from datetime import datetime 

from pydantic import BaseModel, ConfigDict, HttpUrl


class WebsiteCreate(BaseModel):
    name: str
    url: HttpUrl

class WebsiteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    organization_id: int
    name: str
    url: str
    domain: str
    audit_status: str
    tracking_status: str
    created_at: datetime
    updated_at: datetime