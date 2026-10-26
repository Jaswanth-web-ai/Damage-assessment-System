from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    disaster_type = Column(String(50), nullable=False)
    disaster_date = Column(Date, nullable=False)
    damage_description = Column(Text, nullable=True)
    status = Column(String(50), default="submitted", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    property = relationship("Property", back_populates="claims")
    user = relationship("User", backref="claims")
    images = relationship("ClaimImage", back_populates="claim", cascade="all, delete-orphan")
    assessment = relationship("ClaimAssessment", back_populates="claim", uselist=False, cascade="all, delete-orphan")
    recommendation = relationship("CompensationRecommendation", back_populates="claim", uselist=False, cascade="all, delete-orphan")
    decisions = relationship("ClaimDecision", back_populates="claim", cascade="all, delete-orphan")


class ClaimImage(Base):
    __tablename__ = "claim_images"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    image_width = Column(Integer, nullable=True)
    image_height = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("Claim", back_populates="images")
