from fastapi import FastAPI, UploadFile, File
import uvicorn
import whisper
import tempfile
import os

app = FastAPI()
model = whisper.load_model("turbo")

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}

@app.post("/audio/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # 파일을 임시로 저장
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(await file.read())
        audio_path = tmp.name

    result = model.transcribe(audio_path)

    # 임시 파일 제거
    os.remove(audio_path)

    # 결과 텍스트만 반환
    return {"text": result["text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)