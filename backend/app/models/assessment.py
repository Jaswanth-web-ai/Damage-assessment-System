from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ClaimAssessment(Base):
    __tablename__ = "claim_assessments"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False)
    model_name = Column(String(100), default="BDANet-DualBranch", nullable=False)
    model_version = Column(String(50), default="1.0.0", nullable=False)
    severity_category = Column(String(50), nullable=False)  # "no_damage", "minor_damage", "major_damage", "destroyed"
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    damage_score = Column(Float, nullable=False)  # Quantitative damage ratio 0.0 to 1.0
    detected_buildings = Column(Integer, default=1)
    damaged_buildings = Column(Integer, default=0)
    change_ratio = Column(Float, default=0.0)
    visual_similarity_score = Column(Float, nullable=True)  # Cosine similarity to top reference
    localization_mask_path = Column(String(500), nullable=True)
    damage_mask_path = Column(String(500), nullable=True)
    supporting_reference_ids = Column(Text, nullable=True)  # JSON list of reference image IDs and similarity scores
    uncertainty_flag = Column(Boolean, default=False)
    uncertainty_reason = Column(Text, nullable=True)
    limitations_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("Claim", back_populates="assessment")
