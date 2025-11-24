from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False)
    hashed_password: str
    display_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Dataset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    uploader_id: Optional[int] = None
    rows: int = 0
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    original_name: Optional[str] = None
