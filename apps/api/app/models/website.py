from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

class Website(Base):
    __tablename__ = "websites"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    url: Mapped[str] = mapped_column(String(2048), nullable=False)

    domain: Mapped[str] = mapped_column(String(255), nullable=False)

    audit_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="NOT_STARTED",
    )

    tracking_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="NOT_INSTALLED",
    )

    created_at: Mapped[str] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="websites",
    )