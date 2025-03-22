from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VoiceBase(BaseModel):
    filename: str
    duration: float
    transcription: Optional[str] = None

class VoiceCreate(VoiceBase):
    file_path: str

class Voice(VoiceBase):
    id: int
    file_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class VoiceResponse(BaseModel):
    id: int
    filename: str
    duration: float
    transcription: Optional[str] = None
    created_at: datetime 