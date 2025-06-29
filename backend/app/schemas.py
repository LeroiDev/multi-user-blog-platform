from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr

class PostCreate(BaseModel):
    title: str
    content: str

class PostRead(BaseModel):
    # Pydantic V2: replace `orm_mode = True`
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str
    publication_date: datetime
    author_email: EmailStr
    owner_id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
