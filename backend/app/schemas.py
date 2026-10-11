from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: Optional[str] = None
    created_at: datetime


class JournalCreate(BaseModel):
    text: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    trigger: Optional[str] = None


class JournalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    mood: Optional[str] = None
    trigger: Optional[str] = None
    created_at: datetime


class PulseCreate(BaseModel):
    emotion: str
    intensity: int
    energy: Optional[int] = 0
    loneliness: Optional[int] = 0
    overthinking: Optional[int] = 0
    contact_urge: Optional[int] = 0
    trigger: Optional[str] = None
    text: Optional[str] = None
    secondary: Optional[List[str]] = None


class PulseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    emotion: str
    intensity: int
    energy: Optional[int] = 0
    loneliness: Optional[int] = 0
    overthinking: Optional[int] = 0
    contact_urge: Optional[int] = 0
    trigger: Optional[str] = None
    text: Optional[str] = None
    created_at: datetime


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "Routine"
    progress: Optional[int] = 0
    target_duration: Optional[str] = None
    due_date: Optional[datetime] = None
    streak: Optional[int] = 0
    # Also support frontend camelCase aliases if sent
    nextAction: Optional[str] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    progress: Optional[int] = None
    target_duration: Optional[str] = None
    due_date: Optional[datetime] = None
    streak: Optional[int] = None
    completed: Optional[bool] = None
    completed_at: Optional[datetime] = None
    nextAction: Optional[str] = None


class GoalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = "Routine"
    progress: int = 0
    target_duration: Optional[str] = None
    due_date: Optional[datetime] = None
    streak: int = 0
    completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime

