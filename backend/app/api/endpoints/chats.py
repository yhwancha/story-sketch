from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.core.gemini import ChatManager

router = APIRouter()
chat_manager = ChatManager()

@router.post("", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    try:
        # 메시지 전송
        response = chat_manager.send_message(request.message)
        
        # 채팅 히스토리 가져오기
        history = chat_manager.get_history()
        
        # 응답 형식으로 변환
        chat_messages = [ChatMessage(**msg) for msg in history]
        
        return ChatResponse(
            response=response,
            history=chat_messages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 