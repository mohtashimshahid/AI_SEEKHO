from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.trips import router as trips_router
from app.api.v1.workflows import router as workflows_router
from app.api.v1.itineraries import router as itineraries_router
from app.api.v1.research import router as research_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    yield
    # Shutdown tasks


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="TripSage AI Multi-Agent Travel Intelligence Platform API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(trips_router, prefix=settings.API_V1_PREFIX)
app.include_router(workflows_router, prefix=settings.API_V1_PREFIX)
app.include_router(itineraries_router, prefix=settings.API_V1_PREFIX)
app.include_router(research_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "mock_ai": settings.MOCK_AI,
    }
