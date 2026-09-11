from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    name: Optional[str] = None


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    home_airport: Optional[str] = None
    preferred_currency: str = "USD"
    preferred_travel_style: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
