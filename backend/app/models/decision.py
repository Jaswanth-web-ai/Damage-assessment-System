from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ClaimDecision(Base):
    __tablename__ = "claim_decisions"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False)  # "approved", "rejected", "evidence_requested"
    decision_reason = Column(Text, nullable=False)
    approved_amount = Column(Float, nullable=True)
    status_before = Column(String(50), nullable=True)
    status_after = Column(String(50), nullable=False)
    decided_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("Claim", back_populates="decisions")
    reviewer = relationship("User", backref="reviewed_claims")
