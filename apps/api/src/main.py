from fastapi import FastAPI

from src.config import Settings
from src.health.router import router as health_router


def create_app() -> FastAPI:
    settings = Settings()
    application = FastAPI(title=settings.app_name)
    application.include_router(health_router, prefix="/api")
    return application


app = create_app()
