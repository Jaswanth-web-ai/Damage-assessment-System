from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class CompensationRecommendation(Base):
    __tablename__ = "compensation_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False)
    assessment_id = Column(Integer, ForeignKey("claim_assessments.id", ondelete="CASCADE"), nullable=True)
    policy_name = Column(String(150), default="National Disaster Relief & Property Assistance Policy", nullable=False)
    policy_version = Column(String(50), default="2026.1", nullable=False)
    property_declared_value = Column(Float, nullable=False)
    estimated_loss = Column(Float, nullable=False)
    deductible = Column(Float, nullable=False)
    max_coverage_limit = Column(Float, nullable=False)
    recommended_compensation = Column(Float, nullable=False)
    calculation_breakdown = Column(Text, nullable=False)  # JSON breakdown
    is_provisional = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("Claim", back_populates="recommendation")
