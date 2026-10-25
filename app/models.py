from sqlalchemy import JSON, Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean
from sqlalchemy import Time
from sqlalchemy import Text, UniqueConstraint

from datetime import datetime

from app.database import Base
from pgvector.sqlalchemy import Vector


class Organization(Base):

    __tablename__ = "organizations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    organization_name = Column(
        String,
        unique=True,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )


class DeactivationRequest(Base):

    __tablename__ = "deactivation_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=False
    )

    requested_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    reason = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="PENDING",
        nullable=False
    )

    requested_at = Column(
        DateTime,
        default=datetime.now
    )

    reviewed_at = Column(
        DateTime,
        nullable=True
    )

    reviewed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    age = Column(
        Integer
    )

    occupation = Column(
        String
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=True
    )

    role = Column(
        String,
        default="USER",
        nullable=False
    )

    # -----------------------------------------
    # USER LANGUAGE PREFERENCE
    # -----------------------------------------

    preferred_language = Column(
        String(10),
        default="en",
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    organization = relationship(
        "Organization"
    )


class ActivityLog(Base):

    __tablename__ = "activity_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    url = Column(
        String,
        nullable=False
    )

    tab_title = Column(
        String,
        nullable=False
    )

    application = Column(
        String,
        nullable=False
    )

    website_name = Column(
        String,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    productivity = Column(
        String,
        nullable=True
    )

    start_time = Column(
        DateTime,
        nullable=False
    )

    end_time = Column(
        DateTime,
        nullable=True
    )

    duration = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    user = relationship(
        "User"
    )


class WebsiteCategory(Base):

    __tablename__ = "website_categories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    domain = Column(
        String,
        unique=True,
        nullable=False
    )

    website_name = Column(
        String,
        nullable=False
    )

    category = Column(
        String,
        nullable=False
    )

    productivity = Column(
        String,
        nullable=False
    )


class TabSwitchLog(Base):

    __tablename__ = "tab_switch_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    from_website = Column(
        String,
        nullable=False
    )

    to_website = Column(
        String,
        nullable=False
    )

    switch_time = Column(
        DateTime,
        default=datetime.now
    )

    user = relationship(
        "User"
    )


class UserStatus(Base):

    __tablename__ = "user_status"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="ACTIVE"
    )

    updated_at = Column(
        DateTime,
        default=datetime.now,
        onupdate=datetime.now
    )

    user = relationship(
        "User"
    )


class UserStatusLog(Base):

    __tablename__ = "user_status_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )

    start_time = Column(
        DateTime,
        nullable=False,
        default=datetime.now
    )

    end_time = Column(
        DateTime,
        nullable=True
    )

    duration = Column(
        Integer,
        default=0
    )

    user = relationship(
        "User"
    )


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    notification_type = Column(
        String,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    user = relationship(
        "User"
    )


# -----------------------------------------------------
# Focus Planner
# -----------------------------------------------------

class FocusPlan(Base):

    __tablename__ = "focus_plans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    plan_date = Column(
        DateTime,
        nullable=False
    )

    total_goal_minutes = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    user = relationship(
        "User"
    )

    plan_items = relationship(
        "FocusPlanItem",
        back_populates="plan",
        cascade="all, delete-orphan"
    )


class FocusPlanItem(Base):

    __tablename__ = "focus_plan_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    plan_id = Column(
        Integer,
        ForeignKey(
            "focus_plans.id",
            ondelete="CASCADE"
        )
    )

    category = Column(
        String,
        nullable=False
    )

    planned_minutes = Column(
        Integer,
        nullable=False
    )

    start_time = Column(
        Time,
        nullable=True
    )

    end_time = Column(
        Time,
        nullable=True
    )

    plan = relationship(
        "FocusPlan",
        back_populates="plan_items"
    )


# -----------------------------------------------------
# STATIC TRANSLATIONS
# -----------------------------------------------------

class Translation(Base):

    __tablename__ = "translations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    message_key = Column(
        String(100),
        nullable=False
    )

    language = Column(
        String(10),
        nullable=False
    )

    translated_text = Column(
        Text,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "message_key",
            "language",
            name="uq_translation_message_language",
        ),
    )


# -----------------------------------------------------
# DYNAMIC TRANSLATION CACHE
# -----------------------------------------------------

class DynamicTranslation(Base):

    __tablename__ = "dynamic_translations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    original_text = Column(
        Text,
        nullable=False
    )

    language = Column(
        String(10),
        nullable=False
    )

    translated_text = Column(
        Text,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "original_text",
            "language",
            name="uq_dynamic_translation",
        ),
    )


class RAGDocument(Base):
    __tablename__ = "rag_documents"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True, index=True)
    organization_id = Column(Integer, nullable=True, index=True)

    document_type = Column(String(100), nullable=False, index=True)

    content = Column(Text, nullable=False)

    embedding = Column(Vector(384), nullable=False)

    document_metadata = Column("metadata", JSON, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )