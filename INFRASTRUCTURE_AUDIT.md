# Kaup Infrastructure Audit & Migration Plan

**Date:** 2026-02-20
**Status:** Planning Phase

---

## Part 1: Current State

### Frontend (Next.js 15.5.3 on Vercel)

| Aspect | Finding |
|---|---|
| **Framework** | Next.js 15.5.3, React 19, Tailwind v4, shadcn/ui |
| **Rendering** | 100% client-side rendered (`"use client"` on every page) — essentially an SPA wrapped in Next.js |
| **SSR/SSG** | None. Zero server components. All data fetched via `useEffect` |
| **API routes** | None. No BFF. All calls go directly from browser to .NET backend |
| **Vercel lock-in** | **Zero.** No `@vercel/analytics`, no Edge Functions, no Vercel KV/Blob/Postgres |
| **Images** | Stored on AWS S3 (`kaup-images` bucket), `next/image` used but with `unoptimized={true}` |
| **Auth** | JWT in localStorage, Google OAuth via `@react-oauth/google` |
| **Env vars** | Only 2: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| **Docker** | Dockerfile already exists (Node 20 Alpine) |

#### Critical Frontend Bugs

- `ImageUpload.tsx`, `MultipleImageUpload.tsx`, `ProfileImageUpload.tsx` have **hardcoded `http://localhost:5075`** — image uploads broken in non-local environments
- `vercel.json` rewrites point to `localhost:5075` — non-functional on Vercel
- `next: { revalidate }` options in `api.ts` do nothing because all fetches are in client components
- No SSR = no SEO. Listing pages are invisible to search engines

### Backend (.NET 8 / ASP.NET Core on Azure)

| Aspect | Finding |
|---|---|
| **Framework** | ASP.NET Core 8 Web API (C#) |
| **Database** | SQLite everywhere (dev AND production!). PostgreSQL provider installed but **not wired up** |
| **ORM** | Entity Framework Core 8, code-first, 13 migrations |
| **Schema** | 10 tables: Users, Listings, Bids, Messages, Reviews, Offers, Notifications, Watchlists, CartItems, Follows |
| **API** | REST, ~50 endpoints across 9 controllers |
| **Auth** | JWT (7-day expiry, HMAC-SHA256) |
| **File storage** | AWS S3 (`kaup-images` bucket) via `AWSSDK.S3` |
| **Image processing** | Server-side with ImageSharp (resize to 1600x1600, auto-thumbnail 200x200) |
| **Caching** | None |
| **Background jobs** | None |
| **Email** | None (TODO comments only) |
| **Payments** | None (roadmap only) |
| **Deployment** | GitHub Actions to Azure App Service (Linux, .NET 8) |
| **Docker** | Multi-stage Dockerfile exists |

#### Critical Backend Issues

- **Production is running SQLite** (`appsettings.Production.json` = `Data Source=kaup.db`) — data loss risk on ephemeral filesystem
- **Password hashing uses plain SHA-256** without salt — industry standard is bcrypt/Argon2
- **Google OAuth has no server-side token verification** — anyone can forge a login
- **JWT issuer/audience validation is disabled** with hardcoded fallback secret
- **CORS locked to `localhost:3000`** — production frontend can't reach the API
- **No authorization on listing mutations** — any logged-in user could delete others' listings

---

## Part 2: Cost Analysis

### Current vs Proposed Monthly Costs

| Component | Current Setup | Cost Now | Hetzner All-in-One | Cost After |
|---|---|---|---|---|
| **Frontend hosting** | Vercel Pro | $20-40/mo (grows to $300-700+ at scale) | Hetzner VPS + Coolify | ~EUR 8-15/mo (fixed) |
| **Backend hosting** | Azure App Service | ~$13-55/mo | Same Hetzner VPS | $0 (shared server) |
| **Database** | SQLite on Azure (!) | $0 (but broken) | PostgreSQL on Hetzner | $0 (shared server) |
| **Image storage** | AWS S3 | ~$5-20/mo + egress | Cloudflare R2 | ~$1-2/mo (**zero egress**) |
| **CDN** | None | $0 | Cloudflare Free | $0 |
| **Backups** | None | $0 | Hetzner Object Storage | ~EUR 5/mo |
| **SSL** | Vercel auto / Azure | included | Let's Encrypt via Coolify | $0 |
| **TOTAL** | | **~$40-120/mo** (grows fast) | | **~EUR 35/mo (~$38) fixed** |

At 100K users, current setup would cost $500-1500+/mo. Hetzner stays at ~EUR 50-80/mo.

---

## Part 3: Recommended Architecture

```
Users (Iceland)
      |
      v
Cloudflare (Free plan: CDN, SSL, DDoS protection)
      |
      |--- Static assets / images ---> Cloudflare R2 (S3-compatible, zero egress)
      |
      v
Hetzner VPS - CAX21 (4 ARM vCPU, 8GB RAM) ~EUR 7.49/mo
+---------------------------------------------+
|  Coolify (self-hosted PaaS)                  |
|  |-- Next.js frontend (Docker)               |
|  |-- .NET 8 backend API (Docker)             |
|  |-- PostgreSQL 17                           |
|  |-- Redis (sessions + caching)              |
|  +-- Traefik (reverse proxy, auto-SSL)       |
+---------------------------------------------+
      |
      v
Hetzner Object Storage (~EUR 5/mo)
+-- Database backups (pgBackRest)
```

### Why This Stack

- **Hetzner Germany/Finland to Iceland latency: ~20-40ms** (excellent)
- **20TB bandwidth included** (same on Vercel would cost $3,000 in overages)
- **Coolify gives Vercel-like DX**: git-push deploys, preview URLs, auto-SSL, one-click database provisioning
- **Cloudflare R2 replaces AWS S3**: S3-compatible API but **zero egress fees**
- **GDPR compliant**: all data in EU data centers
- **No vendor lock-in**: standard Docker containers, portable anywhere

---

## Part 4: Database Decision — Standardize on PostgreSQL

Drop MySQL/SQLite entirely. Use PostgreSQL everywhere.

1. **ORM already has the PostgreSQL provider installed** (`Npgsql.EntityFrameworkCore.PostgreSQL`)
2. **Built-in full-text search** — sufficient for Iceland's market size (~380K people)
3. **JSONB support** — perfect for variable product attributes
4. **PostGIS** — location-based features if needed later
5. **Industry momentum** — PostgreSQL surpassed MySQL in 2025 Stack Overflow survey (45.5% vs 41.1%)
6. **Better complex query performance** for marketplace joins across users, listings, bids, reviews

---

## Part 5: Migration Plan

### Phase 1: Fix Critical Security & Code Issues

1. Replace SHA-256 password hashing with bcrypt (BCrypt.Net-Next)
2. Add server-side Google OAuth token verification
3. Enable JWT issuer/audience validation, remove hardcoded fallback secret
4. Add authorization checks on listing update/delete endpoints
5. Fix hardcoded `localhost:5075` in upload components — use `NEXT_PUBLIC_API_URL`
6. Configure production CORS to allow actual frontend domain via env var

### Phase 2: Database Migration (SQLite to PostgreSQL)

1. Switch `Program.cs` to use Npgsql provider
2. Use PostgreSQL for both development and production (Docker for local dev)
3. Regenerate EF Core migrations for PostgreSQL
4. Migrate existing data from SQLite to PostgreSQL

### Phase 3: Infrastructure Migration

1. Provision Hetzner VPS (CAX21 to start)
2. Install Coolify (`curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`)
3. Deploy PostgreSQL + Redis via Coolify
4. Add `output: "standalone"` to `next.config.js`, install `sharp`
5. Connect GitHub repos to Coolify
6. Configure environment variables in Coolify dashboard
7. Set up Cloudflare (DNS, proxy mode for CDN + DDoS)
8. Migrate images from AWS S3 to Cloudflare R2 (use `rclone`)
9. Set up database backups (pgBackRest to Hetzner Object Storage)
10. Test everything, cut DNS to Hetzner

### Phase 4: Post-Migration Improvements

1. Add SSR to SEO-critical pages (listings, browse, categories)
2. Add Redis caching for hot queries
3. Add PostgreSQL full-text search for products
4. Set up Uptime Kuma for monitoring
5. Consider Meilisearch if FTS isn't enough

---

## Scaling Roadmap

| Stage | Users | Server | Monthly Cost |
|---|---|---|---|
| **Launch** | 0-1K | CAX21 (4 vCPU, 8GB) | ~EUR 15-20 total |
| **Growth** | 1K-10K | CAX31 (8 vCPU, 16GB) | ~EUR 25-35 total |
| **Scale** | 10K-50K | Split: app server + DB server | ~EUR 50-70 total |
| **Large** | 50K+ | Multiple app servers + dedicated DB + LB | ~EUR 100-150 total |
