# PRD — Cursus
### A conflict-free timetable builder for university students

**Owner:** [You]
**Status:** Draft v3 — retheme + merged with Security & Performance Checklist
**Last updated:** August 15, 2026

---

## 1. Summary

Every semester, students are handed a single, enormous master timetable — hundreds of course/section/room/instructor rows across every department — and have to manually cross-reference it by hand to build a schedule that doesn't overlap and fits their life. Cursus turns that spreadsheet into a searchable course catalog and generates every valid, non-conflicting timetable that matches a student's course list and preferences, ranked by fit.

## 2. Problem

- The source of truth is a raw Excel export (per-day sheets, inconsistent casing, merged header rows, string-formatted time ranges) — not something a student can query or filter.
- Students currently build schedules by hand in a notebook or a personal spreadsheet, cross-checking every course against every other for time overlaps.
- When a course has 10–15 sections, the number of valid combinations across 5–7 courses is too large to check by hand, so students settle for the first workable option rather than the best one (e.g., latest start time, fewest gaps).
- This repeats every registration cycle, for every student, at every department.

## 3. Goals / Non-goals

**Goals**
- Turn the university's master Excel timetable into a structured, queryable dataset.
- Let a student select the courses they need and get back ranked, conflict-free schedule options.
- Let a student save, compare, and export a chosen schedule.
- Meet a defined security and performance bar before any real student data touches the app (§11).

**Non-goals (v1)**
- Official registration / seat-booking (Cursus is a planning tool, not a registrar system).
- Real-time seat availability.
- Multi-university support (v1 targets one institution's sheet format).

## 4. Target users

| Persona | Need |
|---|---|
| **Incoming/registering student** | Pick courses, see every conflict-free combination, choose the best fit |
| **Student re-planning mid-semester** | Swap a section, instantly see what still fits |
| **Advisor (secondary)** | Sanity-check a student's proposed schedule |

## 5. User stories

1. As a student, I can search for a course by code or title and see every section offered, with instructor, time, and room.
2. As a student, I can add courses to a "my courses" list without picking a specific section yet.
3. As a student, I can set preferences (no classes before a given time, days I want free, minimize gaps) before generating.
4. As a student, I can generate all conflict-free schedules for my course list and see them ranked by how well they match my preferences.
5. As a student, I can preview any generated option as a weekly grid before choosing it.
6. As a student, I can save a chosen schedule and export it (image / PDF / calendar file).
7. As an admin, I can upload a new semester's master Excel file and have it parsed into the catalog without manual re-entry.

## 6. Functional requirements

### 6.1 Ingestion
- Admin uploads the master `.xlsx` (one sheet per day).
- Parser skips metadata rows, reads from the real header row, and normalizes into `course / section / instructor / day / start_time / end_time / room`.
- Parser flags rows it couldn't confidently parse (bad time format, empty course code) for manual review rather than silently dropping them.

### 6.2 Course catalog & search
- Full-text search by course code or title.
- Filter by department, instructor, or day.
- Each course shows all its sections with time/room/instructor.

### 6.3 Schedule generation
- Student builds a course list (course-level, not section-level, unless they want to lock a specific section).
- Engine computes all section combinations with zero time overlap.
- Soft preferences (earliest/latest allowed time, free days, max gap between classes) are used to **rank**, not filter — a student should always be able to see "closest matches" even if nothing fits perfectly.
- Results capped and paginated (e.g., top 20 by score) to stay usable when combinations are large.

### 6.4 Review & save
- Weekly grid view per generated option, with conflicts (if the student overrides a lock) visually flagged.
- Save any number of named schedules per account.
- Export as image, PDF, or `.ics` calendar file.

## 7. Non-functional requirements

- Ingestion of a full semester sheet completes in under a minute.
- Schedule generation returns results in under 2 seconds for a typical 5–7 course search.
- Mobile-responsive — students will use this on their phones during registration windows.
- Re-running ingestion for a new semester must not require code changes, only a new file upload.

## 8. Data model (high level)

```
courses        (id, code, title, department)
sections       (id, course_id, section_label, instructor)
time_slots     (id, section_id, day, start_time, end_time, room)
users          (id, email)
saved_schedules(id, user_id, name, section_ids[], created_at)
```

## 9. Suggested tech stack

- **Frontend:** Next.js + React, Tailwind
- **Backend:** FastAPI (Python) — pairs naturally with the Excel-parsing step (pandas/openpyxl)
- **Database:** PostgreSQL
- **Scheduling engine:** backtracking search in the API layer; pull in OR-Tools only if performance later demands it
- **Auth:** NextAuth or Supabase Auth (see §11.3)
- **Hosting:** Vercel (frontend) + Render/Railway (API + Postgres)

## 10. UI direction

Visual language: **dark academia** — the space theme is dropped in favor of something that reads as study, not sci-fi. Deep forest-green/near-black background (`#0e1712`) with a warm aged-gold accent (`#D4AF37`) standing in for the single "electric" color, and parchment (`#F1E7CE`) for card surfaces and the open-book motif. Display type is `Fraunces` (a serif with real editorial weight — feels like a university crest, not a startup logotype); body/UI text stays in `Inter` for readability, with `JetBrains Mono` reserved for course codes and data.

The hero's signature element is a realistic 3D scene, not a flat illustration: a fanned stack of textbooks (spines labeled with real course titles) sits under a soft lamp-glow, with an open book on top whose right-hand page turns on a slow loop to reveal a glowing grid — the student's timetable literally emerging from the page. This is the one place motion is heavy and deliberate; everything else (sidebar, generated-schedule grid) stays quiet and disciplined so the opening moment lands. The security checklist in §11 is a backend/deployment artifact only — it is not part of the student-facing UI and has no on-screen representation; it's tracked as an engineering sign-off (a doc, a CI gate, or an internal admin view at most), not a page a student ever sees.

## 11. Security & Performance Checklist

Non-negotiable bar the app must clear before any deployment a real student would use. Six audit categories, each with concrete, testable requirements — "secure" isn't a vibe here, it's a checklist someone can verify.

### 11.1 Frontend
| Requirement | Detail |
|---|---|
| HttpOnly JWT cookies | Auth tokens set as `HttpOnly`, `Secure`, `SameSite=Strict` cookies — never `localStorage`, which any injected script can read. |
| CSP headers active | Content-Security-Policy restricts script/style/frame sources to your domain + trusted CDNs — blocks most XSS even if a payload slips into rendered content. |
| Secrets never in client bundle | No API keys, DB URLs, or signing secrets ship to the browser — check for stray `NEXT_PUBLIC_*` misuse. |
| Server re-validates everything | Client-side validation is UX only; every check is re-run server-side regardless of what the UI already enforced. |

### 11.2 Backend
| Requirement | Detail |
|---|---|
| Schema validation | Every request body/query param validated (Pydantic or equivalent) before touching business logic — reject unknown fields, wrong types, out-of-range values. |
| Rate limiting active | Per-IP and per-account limits on all endpoints, tighter on auth endpoints specifically (§11.6). |
| Strict CORS policy | Explicit allowlist of the real frontend domain — never `*` on any route reading cookies or returning user data. |
| Centralized error handling | Stack traces and internal exception messages never reach the client response. |

### 11.3 Authentication
| Requirement | Detail |
|---|---|
| Auth provider | NextAuth or Supabase Auth for session/JWT management rather than hand-rolled auth. |
| Password hashing | bcrypt or Argon2 with a per-password salt — never MD5/SHA1 or reversible encryption. |
| Token algorithm | HS256 (shared secret) for a single-backend setup, or RS256 if a separate service needs to verify tokens without holding the signing secret. |
| Short-lived JWTs + refresh rotation | Access tokens expire quickly (~15 min); rotated refresh tokens issue new access tokens without forcing re-login. |

### 11.4 Authorization / Role-Based Access Control
| Requirement | Detail |
|---|---|
| Route-level guards | Every route touching user/admin data checks the caller's role server-side, not just token validity. |
| Resource ownership checks | A student can only read/edit/delete their own saved schedules — checked on every fetch/update/delete, not just create. |
| Admin actions logged | Ingestion uploads, role changes, and destructive actions write an audit log entry (who, what, when). |

### 11.5 Input Validation & Sanitization
| Requirement | Detail |
|---|---|
| Parameterized queries / ORM only | No string-concatenated SQL anywhere — SQLAlchemy/Prisma or equivalent. |
| Output encoding | User-supplied text (course names, saved-schedule names) rendered through the framework's default escaping — never raw HTML insertion. |
| File upload validation | Excel ingestion checks file type, size, and structure before parsing. |

### 11.6 Rate Limiting / Brute-Force Protection
| Requirement | Detail |
|---|---|
| Login-specific throttling | Tighter limit than the general API on `/login` and `/register` (e.g. 5 attempts/5 min/IP), with backoff or temporary lockout. |
| Generic failure messages | Failed login returns the same message whether the email exists or not. |
| CAPTCHA fallback | Optional for v1 — documented as a fast-follow if automated attempts persist past rate limits. |

### 11.7 Secrets Management
| Requirement | Detail |
|---|---|
| Environment variables only | DB strings, JWT secrets, API keys live in `.env`/host secret manager — never committed. |
| `.gitignore` from commit one | Env files gitignored before the first commit, not after a leak. |
| Rotation plan | Documented step to rotate a secret and invalidate old sessions if one is ever exposed. |

### 11.8 HTTPS Enforcement
| Requirement | Detail |
|---|---|
| Vercel (frontend) | Confirm auto TLS + HTTP→HTTPS redirect hasn't been overridden by custom domain config. |
| Render (backend) | Confirm the API isn't reachable over plain HTTP once a custom domain is attached. |
| HSTS header | `Strict-Transport-Security` set so browsers refuse repeat HTTP attempts. |

### 11.9 Database
| Requirement | Detail |
|---|---|
| Row-level data isolation | Queries for user-owned resources filter by the authenticated user's ID at the query level, not after fetching everything. |
| Least privilege enforced | The app's DB credential has only the permissions it needs — never a superuser role. |

### 11.10 Optimization
| Requirement | Detail |
|---|---|
| Indexes on common columns | `course.code`, `section.course_id`, `time_slots.section_id`, `saved_schedules.user_id`. |
| N+1 queries resolved | Fetching a schedule's full detail uses a join/batched query, not one query per section in a loop. |
| Async I/O utilized | Non-blocking DB driver and async route handlers so one slow request doesn't stall others. |

### 11.11 Modularization
| Requirement | Detail |
|---|---|
| Separated routes & models | Routes, DB models, and business logic in distinct files/folders. |
| Logic abstracted to services | Scheduling algorithm, ingestion parser, and auth logic each behind a service function; routes stay thin. |
| Reusable utils centralized | Shared helpers (time parsing, response formatting, error classes) in one location, not copy-pasted per route. |

### 11.12 Pre-deployment sign-off
- [ ] Frontend: cookies, CSP, no leaked secrets, server-side re-validation
- [ ] Backend: schema validation, rate limits, strict CORS, no leaked stack traces
- [ ] Auth: provider configured, bcrypt/Argon2, correct JWT algorithm, short-lived + refresh tokens
- [ ] Authorization: route guards, ownership checks, admin actions logged
- [ ] Input handling: parameterized queries, output encoding, upload validation
- [ ] Secrets: env vars only, gitignored, rotation plan documented
- [ ] Brute-force protection: login throttling, generic failure messages
- [ ] HTTPS: confirmed on both Vercel and Render, HSTS set
- [ ] Database: least-privilege credential, row-level isolation
- [ ] Optimization: indexes in place, no N+1 patterns, async I/O
- [ ] Modularization: routes/models/services separated, no duplicated utils

## 12. Milestones

| Phase | Scope |
|---|---|
| M1 | Ingestion pipeline + browsable course catalog |
| M2 | Manual schedule builder with conflict flagging |
| M3 | Auto-generation engine + ranked results |
| M4 | Accounts, saved schedules, export |
| M5 | Full security & performance checklist (§11) verified before public deploy |

## 13. Success metrics

- % of target students who generate at least one schedule during a registration window
- Median time from "start" to "saved schedule" (target: under 5 minutes)
- % of generated top-ranked schedules a student actually keeps without manual edits
- 100% of §11 checklist items verified before each production deploy

## 14. Risks

- **Source data quality:** the master sheet has inconsistent formatting (casing, merged cells) — ingestion needs a manual-review step, not silent failure.
- **Combinatorial blow-up:** popular courses with many sections could make full enumeration slow — needs early pruning, not brute-force generate-then-filter.
- **Single-institution format lock-in:** parser is built against one university's layout; expanding to another school means rebuilding ingestion, not just re-pointing a URL.
- **Security debt:** skipping §11 items to hit a deadline is the most likely real-world risk on a student project — treat the checklist as a merge-blocker, not a backlog item.
