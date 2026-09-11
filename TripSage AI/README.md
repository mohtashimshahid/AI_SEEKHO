# 🧭 TripSage AI — Multi-Agent Travel Intelligence Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/AI%20Orchestration-LangGraph-blue?style=flat-square)](https://www.langchain.com/langgraph)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.13-blue?style=flat-square&logo=python)](https://python.org)
[![Playwright](https://img.shields.io/badge/E2E%20Tests-Playwright-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

> **"Turn a travel idea into a trip you can actually take."**  
> TripSage AI replaces chaotic 40-tab browser research with an autonomous, five-agent collaborative travel agency powered by LangGraph, deterministic financial math, and real-time Server-Sent Events (SSE).

---

## 🌐 Live Deployment & Links

| Service | Environment | URL / Endpoint | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://tripsage.vercel.app](http://localhost:3000) *(Local: `http://localhost:3000`)* | 🟢 Active |
| **FastAPI Backend REST API** | Railway / Render | [https://api.tripsage.railway.app](http://127.0.0.1:8000) *(Local: `http://127.0.0.1:8000`)* | 🟢 Active |
| **Interactive OpenAPI Docs** | Swagger UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | 🟢 Active |
| **GitHub Repository** | GitHub | [https://github.com/mohtashimshahid/AI_SEEKHO](https://github.com/mohtashimshahid/AI_SEEKHO) | 🟢 Up-to-Date |

---

## 🏗 System Architecture & 5-Agent Pipeline

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER TRAVEL REQUEST                                │
│   (Origin, Destination, Dates, Travelers, Budget, Travel Style, Interests)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     LANGGRAPH 5-AGENT STATE MACHINE                         │
│                                                                             │
│  [01 Destination Research] ── Handoff #1 ──► [02 Budget Intelligence]       │
│  (Attractions, Climate & Safety)             (Deterministic Python Math)     │
│                                                          │                  │
│                                                     Handoff #2              │
│                                                          ▼                  │
│  [04 Local Experiences]    ◄── Handoff #3 ── [03 Flight & Stay]             │
│  (Culinary & Hidden Gems)                    (Corridors & Accommodations)   │
│            │                                                                │
│        Handoff #4                                                           │
│            ▼                                                                │
│  [05 Trip Orchestrator] ────────────────────► FINAL EVIDENCE-BACKED         │
│  (Synthesis & Verification)                   ITINERARY WITH SOURCES        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Real-Time SSE Stream
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION                                │
│           (Live Agent Terminal • Interactive Timeline • Budget Chart)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The Five Specialist Agents

1. **Agent 1: Destination Research Agent (`DestinationResearch`)**
   - **Role**: Discovers seasonal climate profiles, cultural norms, safety guidelines, and iconic landmarks.
   - **Tools**: `search_web` (with prompt-injection sanitization), `get_destination_data` (deterministic fact lookup).
2. **Agent 2: Budget Intelligence Agent (`BudgetAnalysis`)**
   - **Role**: Itemizes flight, lodging, dining, transit, activity, and contingency costs.
   - **Invariant**: **Zero LLM math**. Authorized arithmetic executed via Python `Decimal` deterministic calculator (`calculate_trip_budget`).
3. **Agent 3: Flight & Stay Agent (`FlightAndStayOptions`)**
   - **Role**: Evaluates airport corridors and selects neighborhood boutique accommodations matching traveler group size and budget caps.
4. **Agent 4: Local Experiences Agent (`LocalExperiences`)**
   - **Role**: Curates authentic gastronomy, neighborhood walks, and secret local spots matched to traveler interests.
5. **Agent 5: Trip Orchestrator (`FinalItinerary`)**
   - **Role**: Final synthesis node aggregating findings from Agents 1–4 into a day-by-day itinerary with packing lists, assumptions, and source citations.

---

## ⚡ Key Technical Features

- **No Fake Progress Bars (PRD Section 28 & 39)**: Real agent state transitions streamed via Server-Sent Events (`GET /api/v1/workflows/{run_id}/events`).
- **Deterministic Python Math (PRD Section 22)**: Complete immunity to floating-point imprecision and LLM arithmetic hallucinations.
- **Design Bomb-Inspired Motion Language (PRD Section 31–36)**: Kinetic typography, infinite destination marquee, and smooth Framer Motion card interactions.
- **Multi-Tenant Data Isolation**: Native bcrypt password hashing and JWT token authentication.

---

## 🧪 Comprehensive Verification Suite

- **Section 57 Playwright E2E**: `1 passed (5.0s)` — validates full user lifecycle (signup → trip creation → 5 agents → handoffs → view itinerary).
- **Backend Pytest Suite**: **`44/44 passed (100%)`** across contract tests, calculator tests, LangGraph state machine tests, and SSE streaming.
- **Next.js Production Bundle**: `✓ Compiled successfully (8/8 routes)`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Backend Setup
```bash
cd "TripSage AI/apps/api"
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd "TripSage AI/apps/web"
npm install
npm run dev
```

### 3. Run Automated Tests
```bash
# Backend Pytest Suite
cd "TripSage AI/apps/api"
pytest -v

# Frontend Playwright E2E Suite
cd "TripSage AI/apps/web"
npx playwright test
```
