import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import asyncio
from app.core.database import AsyncSessionLocal, init_db
from app.services.parser_service import ExcelParserService

async def seed():
    await init_db()
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sample_master_timetable.xlsx"))
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    async with AsyncSessionLocal() as db:
        log = await ExcelParserService.parse_and_ingest_excel(
            file_bytes=file_bytes,
            filename="sample_master_timetable.xlsx",
            db=db
        )
        print(f"[SEED SUCCESS] Ingested {log.parsed_sections} sections with {log.error_count} flagged unparsed rows.")

if __name__ == "__main__":
    asyncio.run(seed())
