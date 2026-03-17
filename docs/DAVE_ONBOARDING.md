# DAVE_ONBOARDING.md — Welcome to Rock&Roll UpsideDown
## Everything you need. Start here.

---

## Hey Dave.

Before you read the architecture document and think Wolf has lost his mind — read VISION.md first.

It explains what this actually is, why the timing is right, and why the two of us are the right people to build it. The architecture will make more sense after that.

This document is your setup guide. By the end of it you will have a working dev environment, access to the repo, your sandbox set up, and a clear picture of where to start.

---

## What You Are Walking Into

Rock&Roll UpsideDown is a content infrastructure platform for the live music industry.

Wolf designed it from 25 years of being inside touring productions — knowing exactly where the content goes wrong, where the money leaks, and what the promoters actually need. You are bringing the engineering depth to build it.

This is a 50/50 partnership. All IP is jointly owned from the moment it hits the develop branch. The legal agreement lives in the repo and you will sign it when you log into the portal for the first time.

**Read these in order:**
1. `VISION.md` — the what and the why
2. `RULES_OF_ENGAGEMENT.md` — how we work together
3. `ARCHITECTURE.md` — the full system design
4. Come back here for setup

---

## Prerequisites

```bash
node --version          # needs >= 20.0.0
pnpm --version          # needs >= 8.0.0
docker --version        # needs >= 24.0.0
docker compose version  # needs >= 2.0.0
python3 --version       # needs >= 3.11
git --version           # needs >= 2.40.0

# Install pnpm if needed
npm install -g pnpm

# Install Node 20 via nvm if needed
nvm install 20 && nvm use 20
```

---

## GitHub Setup

**1. Accept the repo invite**
Wolf will send you a collaborator invite to `github.com/{owner}/rock-and-roll-upside-down`. Accept it.

**2. Set up SSH (recommended)**
```bash
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

**3. Clone**
```bash
git clone git@github.com:{owner}/rock-and-roll-upside-down.git
cd rock-and-roll-upside-down
```

---

## Dev Environment

```bash
# Install all dependencies
pnpm install

# Copy env file — Wolf will send you the initial secrets
cp .env.example .env.local

# Start local services via Docker
docker compose up -d
# Starts: PostgreSQL (5432), Redis (6379), Meilisearch (7700), Qdrant (6333)

# Run migrations
pnpm db:migrate

# Start everything
pnpm dev
# Portal: http://localhost:3100
# Platform: http://localhost:3101
# Architecture viz: http://localhost:3102
```

---

## Your Sandbox

Your personal sandbox is branch `sandbox/dave`.

Zero CI. Zero enforcement. Zero judgment. Break things. Experiment. Nothing in your sandbox can break main.

```bash
git checkout sandbox/dave
git push origin sandbox/dave    # push freely, no approval needed
```

When ready to share or merge:
- Open a PR from `sandbox/dave` → `develop`
- Wolf reviews (optional)
- Once it hits develop → jointly owned under the agreement

---

## Port Map

| Service | Port | Note |
|---|---|---|
| portal | 3100 | |
| platform-web | 3101 | |
| architecture-viz | 3102 | |
| ingest-service | 4000 | |
| metadata-engine (Python) | 8050 | |
| licensing-service | 4001 | |
| streaming-service | 4002 | |
| ecommerce-service | 4003 | |
| PostgreSQL | 5432 | |
| Redis | 6379 | |
| Meilisearch | 7700 | |
| Qdrant | 6333 | |

**Never use 3000, 8035, or 8036** — those are Wolf's other projects on the same machine.

---

## Build Phases — We Go In Order

| Phase | What | Status |
|---|---|---|
| 1 | Shared packages + auth portal | **Start here** |
| 2 | Band accounts + core platform | After Phase 1 |
| 3 | Live ingest + fly pack system | After Phase 2 |
| 4 | Licensing + streaming + e-commerce | After Phase 3 |
| 5 | Architecture viz site | Last |

**Phase 1 first tasks:**
1. Turborepo scaffold
2. `packages/shared-types` — TypeScript types for entire platform
3. `packages/shared-auth` — JWT utilities
4. `packages/shared-db` — Prisma schema + migrations
5. `apps/portal` — real auth portal (NextAuth.js v5, GitHub OAuth, co-owner signing)

---

## What Is Already Built

- `ARCHITECTURE.md` — full system spec, 8 modules, all dependencies
- `CLAUDE.md` — AI session context (Claude reads this automatically)
- `rrud-portal.html` — visual prototype of the portal (HTML only, no backend yet)
- `VISION.md` — the concept document
- `RULES_OF_ENGAGEMENT.md` — how we work together

The HTML prototype is a visual reference. Phase 1 builds the real version.

---

## How We Use AI

Both of us use Claude for development. The repo has `CLAUDE.md` — Claude reads it at the start of every session in this directory. No re-briefing needed.

Claude plans and drafts. We review and decide. Claude Code (terminal agent) executes. You control your instance, Wolf controls his.

---

## Questions + Communication

- **GitHub issues** — primary channel for all technical decisions
- **Async is the default** — different cities, different schedules
- Both owners have full read access to every branch at all times — no hidden areas

If something in the architecture seems wrong — open an issue tagged `architecture-proposal` and make the case. That input is exactly what this is designed for.

---

## One Last Thing

You are not being handed a complete vision and told to execute it. You are a co-founder.

If you look at ARCHITECTURE.md and think "this module should work differently" — say it.
If you look at VISION.md and think "you are missing a market" — say it.

That is why this is 50/50 and not a freelance gig.

Welcome to Rock&Roll UpsideDown.

---

*DAVE_ONBOARDING.md v1.0 — Rock&Roll UpsideDown — March 2026*
