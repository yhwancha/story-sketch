from google import genai
import os
import logging
from typing import List

# API 키 검증
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logging.warning("GEMINI_API_KEY is not set. Please set the environment variable.")
    raise ValueError("GEMINI_API_KEY environment variable is required")

# Gemini 클라이언트 설정
client = genai.Client(api_key=GEMINI_API_KEY)

class ChatManager:
    def __init__(self):
        self.chat = client.chats.create(model="gemini-2.0-flash")
    
    def send_message(self, content: str) -> str:
        try:
            print('content received', content)
            response = self.chat.send_message(content)
            print('response', response.text)
            return response.text
        except Exception as e:
            logging.error(f"Error in send_message: {str(e)}")
            raise

    def get_history(self) -> List[dict]:
        try:
            history = []
            for message in self.chat.get_history():
                history.append({
                    "role": message.role,
                    "content": message.parts[0].text
                })
            return history
        except Exception as e:
            logging.error(f"Error in get_history: {str(e)}")
            raise 