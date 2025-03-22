from sqlalchemy import Column, Integer, String, Float, DateTime, LargeBinary
from sqlalchemy.sql import func
from app.db.base_class import Base

class Voice(Base):
    __tablename__ = "voices"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    duration = Column(Float)
    transcription = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 