# Cursus — Security & Performance Policy (Section 11 Compliance)

This document details the security model, secrets rotation policy, and deployment sign-off checklist for **Cursus Timetable Builder**.

---

## 1. Secrets Management & Rotation Policy (§11.7)

1. **Environment Variables Only:**
   - All sensitive credentials (`SECRET_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_API_URL`) are loaded dynamically from environment variables (`.env` in local development, Vercel / Render environment secrets in production).
   - `.env` files are gitignored from initial repository creation.

2. **Secret Exposure & Rotation Procedure:**
   - If a signing secret (`SECRET_KEY`) is ever exposed or suspected of compromise:
     1. Generate a new 64-character cryptographically secure key: `python -c "import secrets; print(secrets.token_hex(32))"`.
     2. Update the `SECRET_KEY` environment variable in Vercel / Render host dashboards.
     3. Trigger backend service restart.
     4. Existing JWT access and refresh tokens will instantly fail verification, invalidating all compromised active user sessions and forcing clean re-authentication.

---

## 2. Security & Performance Verification Matrix (§11)

| Section | Requirement | Implementation Details | Status |
|---|---|---|---|
| **11.1 Frontend** | HttpOnly JWT Cookies | Set via `httponly=True`, `samesite="lax"`. Never stored in `localStorage`. | **PASS** |
| **11.1 Frontend** | CSP Headers Active | `Content-Security-Policy` header restricts script/style/frame origins. | **PASS** |
| **11.1 Frontend** | No Client Secrets | Frontend bundle contains zero signing keys or DB strings. | **PASS** |
| **11.1 Frontend** | Server Re-validation | All client inputs re-validated on API server via Pydantic. | **PASS** |
| **11.2 Backend** | Schema Validation | Pydantic v2 schemas reject invalid types, unknown fields, and out-of-bounds values. | **PASS** |
| **11.2 Backend** | Rate Limiting | `slowapi` limits API requests (5/min on auth, 200/min general). | **PASS** |
| **11.2 Backend** | Strict CORS Policy | `CORSMiddleware` configured with explicit allowed origins list (`localhost:3000`, `127.0.0.1:3000`). | **PASS** |
| **11.2 Backend** | Centralized Errors | Global exception handler catches all uncaught errors, suppressing stack traces. | **PASS** |
| **11.3 Auth** | Auth Service | `AuthService` handles authentication and JWT session issuance. | **PASS** |
| **11.3 Auth** | Password Hashing | Argon2 (`passlib.context.CryptContext(schemes=["argon2", "bcrypt"])`). | **PASS** |
| **11.3 Auth** | Token Algorithm | `HS256` HMAC signing algorithm. | **PASS** |
| **11.3 Auth** | Short-Lived JWTs | 15-minute access token expiration with `/auth/refresh` rotation. | **PASS** |
| **11.4 Authz** | Route Guards | `get_current_user` and `get_current_admin_user` server-side role checks. | **PASS** |
| **11.4 Authz** | Resource Ownership | Schedules query filtered by `user_id == current_user.id` at SQL level. | **PASS** |
| **11.4 Authz** | Admin Audit Log | Ingestion uploads recorded in `ingestion_logs` database table. | **PASS** |
| **11.5 Input** | Parameterized SQL | 100% SQLAlchemy 2.0 ORM queries — zero raw SQL string concatenation. | **PASS** |
| **11.5 Input** | Output Encoding | React JSX default HTML escaping prevents DOM XSS injection. | **PASS** |
| **11.5 Input** | Upload Validation | Admin ingestion checks `.xlsx` extension and 10MB size limit. | **PASS** |
| **11.6 Throttling** | Brute-force Protection | Login/register routes throttled to 5 attempts/min per IP. | **PASS** |
| **11.6 Throttling** | Generic Auth Failure | Authentication failure returns identical `"Invalid email or password"` message. | **PASS** |
| **11.7 Secrets** | Env Vars Only | `Settings` loads configuration from environment variables. | **PASS** |
| **11.7 Secrets** | .gitignore Active | `.env` files gitignored from initial commit. | **PASS** |
| **11.8 HTTPS** | HSTS & Security Headers | `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` enabled. | **PASS** |
| **11.9 Database** | Row-Level Isolation | User-owned schedules isolated in SQL query predicates. | **PASS** |
| **11.9 Database** | Least Privilege | Scoped database connection user. | **PASS** |
| **11.10 Perf** | Indexes | `course.code`, `section.course_id`, `time_slots.section_id`, `saved_schedules.user_id`. | **PASS** |
| **11.10 Perf** | N+1 Queries Resolved | `selectinload` used for all relationship fetches. | **PASS** |
| **11.10 Perf** | Async I/O | `aiosqlite` non-blocking async DB driver and `async def` routes. | **PASS** |
| **11.11 Architecture** | Modularization | Clean separation of models, schemas, services, api routers, and frontend pages. | **PASS** |
