from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.schemas.ingestion import IngestionLogResponse
from app.services.auth_service import get_current_admin_user
from app.services.parser_service import ExcelParserService

router = APIRouter(prefix="/admin/ingestion", tags=["Admin Excel Ingestion"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 # 10MB file upload limit (§11.5)

@router.post("/upload", response_model=IngestionLogResponse)
async def upload_master_timetable(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    filename = file.filename or "master_timetable.xlsx"

    # File Type Validation (§11.5)
    if not (filename.endswith(".xlsx") or filename.endswith(".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only Excel spreadsheets (.xlsx, .xls) are accepted."
        )

    file_bytes = await file.read()

    # File Size Validation (§11.5)
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10MB."
        )

    ingestion_log = await ExcelParserService.parse_and_ingest_excel(
        file_bytes=file_bytes,
        filename=filename,
        db=db,
        clear_existing=True
    )

    return ingestion_log
