from pydantic import BaseModel, Field


class PropertyCreate(BaseModel):

    property_type: str = Field(min_length=2, max_length=50)

    ownership: str = Field(min_length=2, max_length=50)

    property_name: str = Field(min_length=2, max_length=150)

    address: str = Field(min_length=5, max_length=300)

    city_village: str = Field(min_length=2, max_length=100)

    district: str = Field(min_length=2, max_length=100)

    state: str = Field(min_length=2, max_length=100)

    pin_code: str = Field(min_length=4, max_length=10)

    property_value: float | None = None

    latitude: float | None = None

    longitude: float | None = None
