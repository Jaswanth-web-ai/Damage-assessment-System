from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Property(Base):

    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    property_type = Column(String(50), nullable=False)

    ownership = Column(String(50), nullable=False)

    property_name = Column(String(150), nullable=False)

    address = Column(String(300), nullable=False)

    city_village = Column(String(100), nullable=False)

    district = Column(String(100), nullable=False)

    state = Column(String(100), nullable=False)

    pin_code = Column(String(10), nullable=False)

    property_value = Column(Float, nullable=True)

    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    # Pre-disaster reference image
    pre_disaster_image = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="properties")

    claims = relationship("Claim", back_populates="property")
