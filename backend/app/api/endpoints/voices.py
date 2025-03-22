from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import whisper
import tempfile
import os
from mutagen.mp3 import MP3

from app.db.session import get_db
from app.models import voice as voice_model
from app.schemas import voice as voice_schema

router = APIRouter()
model = whisper.load_model("base")

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename.endswith('.mp3'):
        raise HTTPException(status_code=400, detail="Only MP3 files are allowed")
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(await file.read())
        audio_path = tmp.name

    result = model.transcribe(audio_path)
    os.remove(audio_path)

    print(result["text"] + '1')

    return {"text": result["text"]}

@router.post("/upload/", response_model=voice_schema.Voice)
async def upload_voice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.mp3'):
        raise HTTPException(status_code=400, detail="Only MP3 files are allowed")
    
    # 파일을 임시로 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp.flush()
        
        # MP3 파일의 길이 확인
        audio = MP3(tmp.name)
        duration = audio.info.length
        
        # Whisper를 사용한 음성 인식
        result = model.transcribe(tmp.name)
        
        # 파일을 영구 저장소로 이동
        save_path = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(content)
        
    # 데이터베이스에 저장
    db_voice = voice_model.Voice(
        filename=file.filename,
        file_path=save_path,
        duration=duration,
        transcription=result["text"]
    )
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    
    # 임시 파일 삭제
    os.unlink(tmp.name)
    
    return db_voice

@router.get("/", response_model=List[voice_schema.VoiceResponse])
def read_voices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    voices = db.query(voice_model.Voice).offset(skip).limit(limit).all()
    return voices

@router.get("/{voice_id}", response_model=voice_schema.Voice)
def read_voice(voice_id: int, db: Session = Depends(get_db)):
    voice = db.query(voice_model.Voice).filter(voice_model.Voice.id == voice_id).first()
    if voice is None:
        raise HTTPException(status_code=404, detail="Voice not found")
    return voice

@router.delete("/{voice_id}")
def delete_voice(voice_id: int, db: Session = Depends(get_db)):
    voice = db.query(voice_model.Voice).filter(voice_model.Voice.id == voice_id).first()
    if voice is None:
        raise HTTPException(status_code=404, detail="Voice not found")
    
    # 파일 시스템에서 음성 파일 삭제
    try:
        os.remove(voice.file_path)
    except OSError:
        pass  # 파일이 이미 삭제되었거나 없는 경우 무시
    
    db.delete(voice)
    db.commit()
    return {"message": "Voice deleted successfully"} 