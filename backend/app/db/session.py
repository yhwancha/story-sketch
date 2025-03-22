from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# SQLite 데이터베이스 URL에 대해서만 check_same_thread=False를 설정
connect_args = {"check_same_thread": False} if settings.SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 