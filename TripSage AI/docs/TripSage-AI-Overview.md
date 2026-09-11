# TripSage AI — Comprehensive Project Report & Platform Overview

**Author / Maintainer:** Mohtashim Shahid  
**Repository:** [https://github.com/mohtashimshahid/AI_SEEKHO](https://github.com/mohtashimshahid/AI_SEEKHO)  
**Live Application URL:** [http://localhost:3000](http://localhost:3000) *(Production: `https://tripsage.vercel.app`)*  
**Backend API & Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) *(Production: `https://api.tripsage.railway.app`)*  
**Version:** V1.0  

---

## 1. Executive Summary & Vision

Traditional travel planning is notoriously inefficient: travelers juggle dozens of browser tabs across flights, hotels, blogs, maps, weather charts, and spreadsheets.

**TripSage AI** introduces an autonomous **Multi-Agent Travel Intelligence Platform** where a single travel request is handled by a team of **five specialized AI agents** operating in a sequential **LangGraph State Machine**:

```text
Travel Request ──► Agent 1 ──► Agent 2 ──► Agent 3 ──► Agent 4 ──► Agent 5 ──► Itinerary
                  (Research)   (Budget)     (Stay)      (Local)    (Orchestrator)
```

---

## 2. Platform Architecture & Technology Stack

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 14, TypeScript, Tailwind CSS | High-contrast luxury editorial aesthetic, kinetic motion, trip planner form, live terminal. |
| **Animation System** | Framer Motion, CSS Keyframes | Kinetic typography, infinite horizontal marquee, staggered card reveals, pulse indicators. |
| **Backend REST API** | Python, FastAPI, Pydantic V2 | Multi-tenant auth, trips CRUD, workflow runners, structured OpenAI Gateway. |
| **AI Orchestration** | LangGraph, LangChain Core | State machine execution, conditional routing, failure retries, 4 sequential handoffs. |
| **Streaming** | Server-Sent Events (SSE) | Real-time agent state broadcasting without fake progress percentages. |
| **Database & ORM** | SQLAlchemy 2.0 (Async), SQLite / PostgreSQL | Relational persistence of trips, preferences, agent runs, specialist models, itineraries. |
| **Testing** | Playwright, Pytest, Pytest-Asyncio | 100% automated test coverage across unit, contract, state machine, and E2E browser flows. |

---

## 3. The 5 Specialized Agents & 4 Sequential Handoffs

### 1. Destination Research Agent (Agent 1)
- **Input**: `TripRequest` (origin, destination, dates, style, interests).
- **Core Function**: Fact lookup & search provider tool calls.
- **Output**: `DestinationResearch` (attractions, climate profile, cultural customs, seasonal notes).
- **Handoff #1**: Passes verified destination profile to Budget Intelligence Agent.

### 2. Budget Intelligence Agent (Agent 2)
- **Input**: `TripRequest` + `DestinationResearch`.
- **Core Function**: Authorized arithmetic via deterministic Python calculator (`calculate_trip_budget`).
- **Mathematical Invariant**: Sum of flights, stay, dining, transport, activities, and buffer strictly equals total budget.
- **Output**: `BudgetAnalysis`.
- **Handoff #2**: Passes itemized budget ceilings to Flight & Stay Agent.

### 3. Flight & Stay Agent (Agent 3)
- **Input**: `TripRequest` + `DestinationResearch` + `BudgetAnalysis`.
- **Core Function**: Transit corridor analysis & walkable boutique stay curation.
- **Output**: `FlightAndStayOptions` (flight corridors, lodging recommendations, amenities).
- **Handoff #3**: Passes selected stay location & logistics to Local Experience Agent.

### 4. Local Experience Agent (Agent 4)
- **Input**: `TripRequest` + `DestinationResearch` + `BudgetAnalysis` + `FlightAndStayOptions`.
- **Core Function**: Personalized culinary experiences, cultural rituals, and hidden gems.
- **Output**: `LocalExperiences` (food spots, activities, secret spots, evening options).
- **Handoff #4**: Passes all specialist intelligence to Trip Orchestrator.

### 5. Trip Orchestrator (Agent 5 - Final Node)
- **Input**: Synthesis of all 4 prior specialist outputs.
- **Core Function**: Cohesive day-by-day scheduling, packing checklists, assumption audits, and evidence citation aggregation.
- **Output**: `FinalItinerary`.

---

## 4. Key Pages & User Journeys

1. **Kinetic Landing Page (`/`)**:
   - Oversized headline: **`PLAN LESS. TRAVEL MORE.`**
   - Infinite animated travel marquee (`PARIS → TOKYO → ISTANBUL → ...`).
   - Problem breakdown contrasting manual friction against multi-agent automation.
   - Interactive 5-agent showcase and LangGraph workflow simulation.

2. **Authentication (`/sign-up` & `/sign-in`)**:
   - Native bcrypt password hashing and JWT token authentication with protected routes.

3. **Trip Planning Form (`/app/trips/new`)**:
   - Intuitive form capturing destination, origin, dates, travelers, target budget, currency, travel style, and interest tags.

4. **Trip Workspace (`/app/trips/[tripId]`)**:
   - Overview of trip details and instant activation of the 5-agent pipeline.

5. **Real-Time Analysis Screen (`/app/trips/[tripId]/analysis`)**:
   - Headline: **`YOUR TRIP IS BEING BUILT.`**
   - Real-time agent state indicators (`WAITING`, `RUNNING`, `COMPLETED`, `FAILED`).
   - Live SSE event terminal streaming chronological handoffs.
   - Interactive specialist inspector showing raw validated JSON artifacts.

---

## 5. Automated Verification & Quality Assurance

```text
============================= TEST RESULTS =============================
Backend Pytest Suite:        44 Passed (100%) in 4.72s
Section 57 Playwright E2E:    1 Passed (100%) in 5.0s
Next.js Production Build:     8/8 Static & Dynamic Routes (0 Errors)
Git Remote Synchronization:   Pushed to GitHub main
========================================================================
```

---

## 6. Deployment & Production Setup

- **Frontend**: Configured for Vercel via [`apps/web/vercel.json`](file:///d:/Second%20repo/TripSage%20AI/apps/web/vercel.json).
- **Backend**: Containerized via [`apps/api/Dockerfile`](file:///d:/Second%20repo/TripSage%20AI/apps/api/Dockerfile) and configured for Railway ([`apps/api/railway.json`](file:///d:/Second%20repo/TripSage%20AI/apps/api/railway.json)) and Render ([`render.yaml`](file:///d:/Second%20repo/TripSage%20AI/render.yaml)).
- **Deployment Manual**: Detailed in [`docs/deployment.md`](file:///d:/Second%20repo/TripSage%20AI/docs/deployment.md).
