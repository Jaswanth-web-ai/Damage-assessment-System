from pydantic import BaseModel, Field


class UserRegister(BaseModel):

    name: str = Field(min_length=2, max_length=100)

    email: str = Field(min_length=5, max_length=150)

    phone: str | None = Field(default=None, max_length=20)

    password: str = Field(min_length=8, max_length=100)


class UserLogin(BaseModel):

    email: str = Field(min_length=5, max_length=150)

    password: str = Field(min_length=1, max_length=100)
