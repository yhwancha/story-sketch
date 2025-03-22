from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models import story as story_model
from app.schemas import story as story_schema

router = APIRouter()

@router.post("/", response_model=story_schema.Story)
def create_story(story: story_schema.StoryCreate, db: Session = Depends(get_db)):
    db_story = story_model.Story(
        title=story.title,
        input_type=story.input_type,
        output_type=story.output_type,
        content=story.content
    )
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.get("/", response_model=List[story_schema.Story])
def read_stories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stories = db.query(story_model.Story).offset(skip).limit(limit).all()
    return stories

@router.get("/{story_id}", response_model=story_schema.Story)
def read_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(story_model.Story).filter(story_model.Story.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.put("/{story_id}", response_model=story_schema.Story)
def update_story(story_id: int, story: story_schema.StoryCreate, db: Session = Depends(get_db)):
    db_story = db.query(story_model.Story).filter(story_model.Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    for var, value in vars(story).items():
        setattr(db_story, var, value)
    
    db.commit()
    db.refresh(db_story)
    return db_story

@router.delete("/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(story_model.Story).filter(story_model.Story.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(story)
    db.commit()
    return {"message": "Story deleted successfully"} 