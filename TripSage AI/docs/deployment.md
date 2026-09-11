# TripSage AI — Production Deployment Guide

This guide outlines the production deployment workflow for **TripSage AI**, matching **PRD Section 60 (Phase 9: Deployment)**.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│                    Hosted on Vercel                         │
│            https://tripsage.vercel.app                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / SSE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                          │
│               Hosted on Railway / Render                    │
│            https://api.tripsage.railway.app                 │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Managed PostgreSQL      │ │      Managed Redis         │
│   (Railway / Render / Neon)  │ │   (Upstash / Railway)      │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## Phase 1: Database Provisioning (PostgreSQL)

### Option A: Railway PostgreSQL
1. Log in to [Railway](https://railway.app).
2. Click **+ New Project** → **Provision PostgreSQL**.
3. Under **Variables**, copy the `DATABASE_URL` connection string:
   `postgresql://postgres:password@host:port/railway`
4. Convert connection prefix to async dialect: `postgresql+asyncpg://...` (or use standard `DATABASE_URL` which TripSage automatically adapts).

### Option B: Render PostgreSQL
1. Log in to [Render](https://render.com).
2. Click **New +** → **PostgreSQL**.
3. Set Database Name: `tripsage`.
4. Copy the **Internal Database URL** for services in the same region.

---

## Phase 2: Backend Deployment (FastAPI on Railway / Render)

### Option A: Railway (Recommended)
1. In your Railway project, click **+ New** → **GitHub Repo** → select `TripSage AI`.
2. Set **Root Directory**: `apps/api`.
3. Railway automatically detects [`Dockerfile`](file:///d:/Second%20repo/TripSage%20AI/apps/api/Dockerfile) and [`railway.json`](file:///d:/Second%20repo/TripSage%20AI/apps/api/railway.json).
4. Configure Environment Variables:
   - `ENVIRONMENT=production`
   - `DEBUG=false`
   - `DATABASE_URL=postgresql+asyncpg://...`
   - `JWT_SECRET=<generated_secure_secret_key>`
   - `OPENAI_API_KEY=<your_live_openai_api_key>`
   - `CORS_ORIGINS=["https://tripsage.vercel.app","http://localhost:3000"]`
   - `PORT=8000`
5. Click **Deploy**.
6. Verify live health check:
   ```bash
   curl https://<your-railway-app>.up.railway.app/api/v1/health
   # Response: {"status":"healthy","database":"connected"}
   ```

### Option B: Render Blueprint (1-Click)
1. Use the provided [`render.yaml`](file:///d:/Second%20repo/TripSage%20AI/render.yaml) blueprint.
2. In Render, select **New +** → **Blueprint** → connect repository.
3. Fill in your `OPENAI_API_KEY`.
4. Click **Apply Blueprint**.

---

## Phase 3: Frontend Deployment (Next.js on Vercel)

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project** → Import `TripSage AI`.
3. Configure Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/web`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-url>/api/v1`
5. Click **Deploy**.
6. Vercel deploys globally with optimized edge routing per [`vercel.json`](file:///d:/Second%20repo/TripSage%20AI/apps/web/vercel.json).

---

## Phase 4: Production Verification & Smoke Test

1. Open your Vercel deployment URL (`https://tripsage.vercel.app`).
2. Verify the landing page hero and travel marquee animation.
3. Register a new user (`/sign-up`).
4. Plan a new trip (`/app/trips/new`).
5. Trigger multi-agent analysis (`/app/trips/[id]/analysis`) and watch the live SSE stream transition through all 5 specialists:
   - `01 Destination Research`
   - `02 Budget Intelligence`
   - `03 Flight & Stay`
   - `04 Local Experiences`
   - `05 Trip Orchestrator`
6. View the synthesized Final Itinerary.
