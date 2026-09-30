from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    Text,
    Boolean,
    ForeignKey,
)
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    # Primary Information
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=True)

    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    password_changed_at = Column(DateTime(timezone=True), nullable=True)
    token_version = Column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
    )

    # Contact Information
    mobile_number = Column(String(20), nullable=True)
    alt_mobile_number = Column(String(20), nullable=True)
    country_code = Column(String(10), nullable=True)

    # Personal Information
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)

    # Professional Information
    company = Column(String(150), nullable=True)
    designation = Column(String(150), nullable=True)
    department = Column(String(150), nullable=True)

    # Social Links
    website = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    twitter = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)

    # Profile
    bio = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    # Location
    timezone = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    zip_code = Column(String(20), nullable=True)

    # Media
    profile_picture_url = Column(String(255), nullable=True)
    cover_picture_url = Column(String(255), nullable=True)

    # Organization
    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=True,
    )

    role = Column(
        String(50),
        nullable=False,
        default="owner",
        server_default="owner",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    is_verified = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    has_completed_onboarding = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    # Audit Fields
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )