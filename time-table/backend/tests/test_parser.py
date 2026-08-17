import pytest
import io
import pandas as pd
from app.core.database import AsyncSessionLocal, init_db
from app.services.parser_service import ExcelParserService
from app.services.catalog_service import CatalogService

@pytest.mark.asyncio
async def test_excel_parser_ingestion():
    await init_db()

    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine="openpyxl")

    monday_data = [
        {"Course Code": "TEST101", "Course Title": "Test Science", "Section": "SEC-01", "Instructor": "Dr. Test", "Department": "CS", "Time Slot": "09:00 - 10:15", "Room": "A-1"},
        {"Course Code": "BAD_CODE", "Course Title": "Broken Time", "Section": "SEC-02", "Instructor": "Dr. Fail", "Department": "CS", "Time Slot": "INVALID", "Room": "B-2"}
    ]
    pd.DataFrame(monday_data).to_excel(writer, sheet_name="Monday", index=False)
    writer.close()
    file_bytes = output.getvalue()

    async with AsyncSessionLocal() as db:
        log = await ExcelParserService.parse_and_ingest_excel(
            file_bytes=file_bytes,
            filename="test_file.xlsx",
            db=db
        )

        assert log.filename == "test_file.xlsx"
        assert log.parsed_sections == 1, f"Expected 1 parsed section, got {log.parsed_sections}. Errors: {log.unparsed_errors}"
        assert log.error_count == 1
        assert len(log.unparsed_errors) == 1

        courses, total = await CatalogService.get_courses(db, search="TEST101")
        assert total == 1
        assert courses[0].code == "TEST101"
        assert len(courses[0].sections) == 1
        assert courses[0].sections[0].time_slots[0].start_time == "09:00"
        assert courses[0].sections[0].time_slots[0].end_time == "10:15"
