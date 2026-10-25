from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserRegister(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    age: int

    occupation: str


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class ChangePassword(BaseModel):

    current_password: str

    new_password: str

    confirm_password: str


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    age: int

    occupation: str

    role: str

    class Config:

        from_attributes = True

class Token(BaseModel):

    access_token: str

    refresh_token: str

    token_type: str


class Message(BaseModel):

    message: str


class ChangeRole(BaseModel):

    role: str


class UserDetails(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    age: int

    occupation: str

    role: str

    class Config:

        from_attributes = True

class InviteSubAdmin(BaseModel):

    full_name: str

    email: EmailStr

    organization_id: int


class AcceptInvitation(BaseModel):

    password: str

class RefreshTokenRequest(BaseModel):

    refresh_token: str


# Activity Start Schema
class ActivityStart(BaseModel):

    url: str

    tab_title: str

    application: str


# Activity End Schema
class ActivityEnd(BaseModel):

    pass


# Activity Response Schema
class ActivityResponse(BaseModel):

    id: int

    url: str

    tab_title: str

    application: str

    start_time: datetime

    end_time: datetime | None

    duration: int

    class Config:

        from_attributes = True


class TabSwitch(BaseModel):

    from_website: str = Field(min_length=1, max_length=255)

    to_website: str = Field(min_length=1, max_length=255)

class UserStatusUpdate(BaseModel):

    status: str

# -----------------------------------------------------
# Organization
# -----------------------------------------------------

class OrganizationCreate(BaseModel):

    organization_name: str


class OrganizationResponse(BaseModel):

    id: int

    organization_name: str

    is_active: bool

    class Config:

        from_attributes = True

# -----------------------------------------------------
# Assign Organization
# -----------------------------------------------------

class AssignOrganization(BaseModel):

    user_id: int

    organization_id: int


# -----------------------------------------------------
# Create Organization User
# -----------------------------------------------------

class OrganizationUserCreate(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    age: int

    occupation: str

# -----------------------------------------------------
# Deactivation Request
# -----------------------------------------------------

class DeactivationRequestCreate(BaseModel):

    reason: str


# -----------------------------------------------------
# AI Chat
# -----------------------------------------------------

class ChatRequest(BaseModel):

    message: str


class ChatResponse(BaseModel):

    response: str


# ---------------------------------------
# Notification Schemas
# ---------------------------------------

class NotificationCreate(BaseModel):

    title: str

    message: str

    notification_type: str


class NotificationResponse(BaseModel):

    id: int

    title: str

    message: str

    notification_type: str

    is_read: bool

    created_at: datetime

    class Config:

        from_attributes = True


# =====================================================
# Focus Planner Schemas
# =====================================================

from datetime import datetime, time
from typing import List, Optional


class FocusPlanItemCreate(BaseModel):
    category: str
    planned_minutes: int
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class FocusPlanCreate(BaseModel):
    plan_date: datetime
    total_goal_minutes: int
    plans: List[FocusPlanItemCreate]

class FocusPlanUpdate(BaseModel):
    total_goal_minutes: int
    plans: List[FocusPlanItemCreate]


class FocusPlanItemResponse(BaseModel):
    category: str
    planned_minutes: int
    start_time: Optional[time]
    end_time: Optional[time]

    class Config:
        from_attributes = True


class FocusPlanResponse(BaseModel):
    id: int
    plan_date: datetime
    total_goal_minutes: int
    plans: List[FocusPlanItemResponse]

    class Config:
        from_attributes = True



class TranslationResponse(BaseModel):

    message_key: str

    language: str

    translated_text: str

    class Config:
        from_attributes = True


class OrganizationUserResponse(BaseModel):

    id: int

    full_name: str

    email: str

    age: int | None

    occupation: str | None

    role: str

    is_active: bool

    created_at: datetime

    class Config:
        from_attributes = True


class UpdateLanguageRequest(BaseModel):

    language: str


class DynamicTranslationRequest(BaseModel):

    message: str


class ChatHistoryItem(BaseModel):

    sender: str

    text: str


class ChatRequest(BaseModel):

    message: str

    history: List[ChatHistoryItem] = []


class BatchTranslationItem(BaseModel):

    text: str

    key: Optional[str] = None


class BatchTranslationRequest(BaseModel):

    items: List[BatchTranslationItem]