import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "TripSage AI API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Security & Auth
    SECRET_KEY: str = "tripsage-insecure-secret-key-change-in-production-123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/tripsagedb"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/tripsagedb"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI & Tools
    OPENAI_API_KEY: str = ""
    TAVILY_API_KEY: str = ""
    MOCK_AI: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()
