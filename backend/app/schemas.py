from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str]


class UserRead(BaseModel):
    id: int
    email: EmailStr
    display_name: Optional[str]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
