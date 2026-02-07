import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GlacierWatch API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "glacierwatch")
    SQLALCHEMY_DATABASE_URI: str | None = "sqlite:///./glacierwatch.db"

    # Celery
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "memory://")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "db+sqlite:///./celery_results.sqlite")
    CELERY_TASK_ALWAYS_EAGER: bool = True

    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: int | None = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = "GlacierWatch"

    # Admin
    ADMIN_EMAIL: str = "admin@glacierwatch.com"
    ADMIN_PASSWORD: str = "admin@123"

    def __init__(self, **values):
        super().__init__(**values)
        # if not self.SQLALCHEMY_DATABASE_URI:
        #     self.SQLALCHEMY_DATABASE_URI = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
