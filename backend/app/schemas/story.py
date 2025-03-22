from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class StoryBase(BaseModel):
    title: str
    input_type: str
    output_type: str
    content: List[dict[str, Any]]

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 