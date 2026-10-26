from datetime import date

from pydantic import BaseModel, Field


class ClaimCreate(BaseModel):

    property_id: int

    disaster_type: str = Field(min_length=2, max_length=50)

    disaster_date: date

    damage_description: str | None = None
