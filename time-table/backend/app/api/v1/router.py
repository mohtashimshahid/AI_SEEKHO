from fastapi import APIRouter
from app.api.v1 import auth, catalog, ingestion, generator, schedules

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(catalog.router)
api_router.include_router(ingestion.router)
api_router.include_router(generator.router)
api_router.include_router(schedules.router)
