from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/tableorder"
    database_url_sync: str = "postgresql+psycopg2://postgres:postgres@db:5432/tableorder"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 16
    cors_origins: list[str] = ["http://localhost:3000"]
    login_max_attempts: int = 5
    login_lockout_minutes: int = 15


settings = Settings()
