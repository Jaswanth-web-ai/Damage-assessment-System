from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ReferenceLocation(Base):
    __tablename__ = "reference_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default="India", nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    images = relationship("ReferenceImage", back_populates="location")


class ReferenceImage(Base):
    __tablename__ = "reference_images"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("reference_locations.id"), nullable=True)
    dataset_source = Column(String(100), default="xBD-benchmark", nullable=False)
    image_path = Column(String(500), nullable=False)
    paired_pre_image_path = Column(String(500), nullable=True)
    loc_target_path = Column(String(500), nullable=True)
    dmg_target_path = Column(String(500), nullable=True)
    disaster_type = Column(String(50), nullable=False)  # e.g. "Flood", "Cyclone", "Earthquake"
    property_type = Column(String(50), default="Residential", nullable=False)
    verification_status = Column(String(30), default="verified", nullable=False)
    ground_truth_label = Column(String(50), nullable=True)  # "no_damage", "minor_damage", "major_damage", "destroyed"
    building_count = Column(Integer, default=0)
    embedding_vector = Column(Text, nullable=True)  # JSON-serialized embedding
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    location = relationship("ReferenceLocation", back_populates="images")
