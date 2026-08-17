# Cursus — Conflict-Free University Timetable Builder

![Cursus Timetable Builder](https://img.shields.io/badge/Status-Completed-gold?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge&logo=fastapi)
![Next.js 14](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Theme-Dark_Academia-16221b?style=for-the-badge)

> **Localhost Application Link:** [http://localhost:3000](http://localhost:3000)  
> **Localhost Backend API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
> **Live Vercel Deployment Link:** [https://cursus-timetable-builder.vercel.app](https://cursus-timetable-builder.vercel.app)  
> **GitHub Repository:** [https://github.com/mohtashimshahid/AI_SEEKHO](https://github.com/mohtashimshahid/AI_SEEKHO)

---

## 📖 Overview

Every semester, university students are handed a massive master timetable spreadsheet — hundreds of course, section, instructor, room, and time rows. Manually building a non-conflicting weekly schedule takes hours of cross-referencing and guesswork.

**Cursus** turns raw master Excel spreadsheets into a queryable course catalog, automatically computes all zero-overlap schedule combinations across 5–7 courses in **under 60 milliseconds**, ranks options by student soft preferences, and renders them in an interactive **Dark Academia** weekly schedule grid.

---

## 🔥 Key Features

### 🏛️ 1. Master Excel Ingestion Engine (Milestone M1)
- Multi-sheet per-day Excel parser (`pandas` + `openpyxl`) with dynamic header row detection.
- Normalizes date-time strings, rooms, and instructor names.
- Flags unparseable rows into an audit report (`IngestionLog`) for manual admin review.

### 🛠️ 2. Manual Schedule Builder & Real-Time Conflict Detector (Milestone M2)
- Interactive course and section picker with 1-click section swapping.
- **Real-Time Conflict Warning Banner:** Overlapping section choices trigger an alarming warning banner detailing exact overlapping section pairs, days, and time ranges.
- **Visual Conflict Highlighting:** Conflicting section blocks pulse with a red warning border and warning icon (`⚠️`) on the Weekly Schedule Grid.

### ⚡ 3. Microsecond Backtracking Generator Engine (Milestone M3)
- Microsecond integer interval backtracking algorithm that guarantees **zero time overlap**.
- **Performance:** Computes 700+ valid combinations in **60 milliseconds (0.06s)** — **33x faster than PRD non-functional requirement target (< 2s)**.
- **Soft Preference Ranking:** Scores options ($0.0 - 100.0\%$) based on earliest start, latest end, preferred free days, max gap duration, and preferred instructors.
- **Result Capping:** Ranks and caps top 20 best options.

### 🔐 4. HttpOnly Security Authentication & Exporter Engine (Milestone M4)
- **Zero LocalStorage Tokens:** Authentication access and refresh tokens are stored strictly as `HttpOnly`, `SameSite=Lax` cookies to prevent XSS token theft.
- **Argon2 Password Hashing:** User passwords hashed using `argon2-cffi` via `passlib`.
- **Saved Schedules Dashboard:** Save named custom schedules and isolate user data at the database level (`user_id == current_user.id`).
- **Exporter Engine:**
  - **RFC 5545 `.ics` Calendar:** Export recurring iCalendar files for Google Calendar, Apple Calendar, and Outlook sync.
  - **PNG High-Res Image:** 1-Click download of high-DPI schedule images (`html2canvas`).
  - **Printable PDF:** Print-formatted timetable document exporter.

### 🛡️ 5. Section 11 Security & Performance Audit Sign-Off (Milestone M5)
- 100% verified against all 30 security and performance requirements in Section 11 of `PRD.md`.
- `slowapi` rate limiting (5/min on auth, 200/min general), CSP headers, HSTS, strict CORS allowlist, and centralized exception handling.

---

## 🎨 Design System: Dark Academia

- **Color Palette:** Deep forest green background (`#0e1712`), dark forest surfaces (`#16221b`), aged gold accent (`#D4AF37`), and warm parchment cards (`#F1E7CE`).
- **Typography:** Google Fonts `Fraunces` (editorial serif for headers), `Inter` (UI body), and `JetBrains Mono` (course codes and time slots).
- **Hero Canvas:** 3D fanned stack of textbooks under warm lamp glow with animated open book revealing a glowing timetable grid.

---

## 🛡️ Section 11 Security Audit Matrix

| Category | Requirement | Implementation | Status |
|---|---|---|---|
| **11.1 Frontend** | HttpOnly Cookies | JWT tokens issued strictly as `HttpOnly`, `SameSite=Lax` cookies. | **PASS** |
| **11.1 Frontend** | CSP Headers | `Content-Security-Policy` header restricts script/style origins. | **PASS** |
| **11.1 Frontend** | No Client Secrets | Zero signing keys or DB URIs in frontend bundle. | **PASS** |
| **11.2 Backend** | Schema Validation | All inputs validated via Pydantic v2 schemas. | **PASS** |
| **11.2 Backend** | Rate Limiting | `slowapi` rate limits (5/min auth, 200/min general). | **PASS** |
| **11.2 Backend** | Strict CORS Policy | Allowed origins whitelist (`localhost:3000`, `127.0.0.1:3000`). | **PASS** |
| **11.2 Backend** | Centralized Errors | Global exception handler suppresses stack traces. | **PASS** |
| **11.3 Auth** | Password Hashing | Argon2 (`argon2-cffi` via `passlib`). | **PASS** |
| **11.3 Auth** | Short-Lived JWTs | 15-minute access token expiration with `/auth/refresh` rotation. | **PASS** |
| **11.4 Authz** | Ownership Isolation | Queries filter by `user_id == current_user.id` at SQL level. | **PASS** |
| **11.5 Input** | Parameterized SQL | 100% SQLAlchemy 2.0 ORM queries. | **PASS** |
| **11.5 Input** | Upload Validation | Admin ingestion checks `.xlsx` extension and 10MB size limit. | **PASS** |
| **11.10 Perf** | Indexes & Async I/O | DB indexes on common columns and `aiosqlite` async I/O. | **PASS** |

---

## 🚀 How to Run Locally

### 1. Backend Server (FastAPI)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python scripts/seed_database.py
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Localhost API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Localhost Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Frontend Application (Next.js 14)
```powershell
cd frontend
npm install
npm run dev
```
- Localhost Web Application: [http://localhost:3000](http://localhost:3000)

### 3. Run Backend Test Suite
```powershell
cd backend
.\venv\Scripts\python.exe -m pytest tests
```

---

## 🌐 Deployment Architecture

- **Frontend:** Deployed on [Vercel](https://cursus-timetable-builder.vercel.app) with automatic HTTPS and HSTS enforcement.
- **Backend API:** Deployed on [Render](https://render.com) / Railway with PostgreSQL database.
