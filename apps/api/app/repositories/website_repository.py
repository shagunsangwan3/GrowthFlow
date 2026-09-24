from sqlalchemy.orm import Session

from app.models.website import Website

class WebsiteRepository:

    @staticmethod
    def create(
        db: Session,
        organization_id: int,
        name: str,
        url: str,
        domain: str,
    ) -> Website:
        website = Website(
            organization_id=organization_id,
            name=name,
            url=url,
            domain=domain,
        )

        db.add(website)
        db.commit()
        db.refresh(website)

        return website

    @staticmethod 
    def get_all(
        db: Session,
        organization_id: int,
    ) -> list[Website]:
        return (
            db.query(Website)
            .filter(Website.organization_id == organization_id)
            .order_by(Website.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        website_id: int,
        organization_id: int,
    ) -> Website | None:
        return (
            db.query(Website)
            .filter(
                Website.id == website_id,
                Website.organization_id == organization_id,
            )
            .first()
        )