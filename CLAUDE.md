# CLAUDE.md — Rock&Roll UpsideDown
## Session Context File — Read This First, Every Time

---

## WHO YOU ARE WORKING WITH

**Wolf Schram** — Co-founder, Co-owner (50/50 with Dave)
- German-born, bilingual (German/English), based in Santa Clarita / LA
- 25+ years broadcast engineering + global concert touring (U2, Rolling Stones, McCartney, Beyoncé)
- Former VP Engineering at Diversified — led ~250 engineers globally (departed Jan 2026)
- ADHD + dyslexia — not a limitation, it's how he's built. Accommodate it.
- Communicates via voice-to-text. Auto-correct all errors silently. Never flag them.
- Inputs are non-linear brain dumps. Extract the real question. Answer that.

**Dave** — Co-founder, Co-owner (50/50)
- Based in Cincinnati, OH
- Strong developer — owns backend/infrastructure
- GitHub account: [ADD DAVE'S GITHUB USERNAME WHEN KNOWN]

---

## COMMUNICATION RULES — NON-NEGOTIABLE

- **Short. Scannable. Bullets. Bold key terms.**
- No walls of text. No preamble. No corporate language.
- Lead with the answer, then explain if needed.
- If Wolf sends a voice-to-text brain dump: parse it, find the real ask, answer that.
- If something is ambiguous in a build context: **ask before building**.
- Wolf approves all final decisions. You research, draft, build. He decides.

---

## PROJECT IDENTITY

**Name:** Rock&Roll UpsideDown (RRUD)
**Mission:** Redesign how the live music industry creates, archives, licenses, and distributes concert content.
**Co-owners:** Wolf Schram + Dave — 50/50 on all IP, code, ideas, revenue.
**Co-ownership agreement:** Signed digitally in the portal. Stored in `LEGAL_AGREEMENT.md`. Both parties required.

---

## WHERE EVERYTHING LIVES

```
Local machine (Wolf's M3 Max MacBook Pro):
/Users/wolfgangschram/Documents/ACTIVE/Rock&Roll/
  CLAUDE.md               ← this file
  ARCHITECTURE.md         ← full system spec — read before building anything
  rrud-portal.html        ← working portal prototype (login + architecture viz)

GitHub (source of truth for all code):
github.com/{owner}/rock-and-roll-upside-down

Other active projects Wolf runs (DO NOT TOUCH unless in those sessions):
/Users/wolfgangschram/Documents/ACTIVE/archive-35/     ← live photography business
/Users/wolfgangschram/Documents/ACTIVE/job-pipeline/   ← job search automation
/Users/wolfgangschram/Documents/ACTIVE/lighthaus/      ← AI second brain app
/Users/wolfgangschram/Documents/ACTIVE/ATHOS/          ← leadership consulting site
```

**Rock&Roll project files stay inside `/ACTIVE/Rock&Roll/`. No exceptions.**

---

## REPO STRUCTURE — MEMORIZE THIS

```
rock-and-roll-upside-down/     ← mono-repo (Turborepo + pnpm workspaces)
├── apps/
│   ├── portal/                ← Auth portal (Phase 1 — build first)
│   ├── platform-web/          ← Main platform
│   ├── architecture-viz/      ← Interactive mind map site
│   ├── ingest-service/        ← Live show edge ingest
│   ├── metadata-engine/       ← AI content detection (Python)
│   ├── licensing-service/     ← Rights management
│   ├── streaming-service/     ← HLS/DASH delivery
│   └── ecommerce-service/     ← Fan store
├── packages/
│   ├── shared-types/          ← TypeScript types — build first
│   ├── shared-auth/           ← JWT, session utilities
│   ├── shared-db/             ← Prisma client + migrations
│   ├── shared-storage/        ← S3/GCS abstraction
│   └── shared-events/         ← BullMQ event bus types
├── infra/
│   ├── terraform/             ← Cloud infra (platform-agnostic for now)
│   └── docker/                ← Base images + service dockerfiles
├── docs/
│   ├── ARCHITECTURE.md        ← Full spec (read this)
│   ├── CO_OWNERSHIP.md        ← Legal agreement
│   └── API_SPEC.md            ← OpenAPI specs
├── sandbox-wolf/              ← Wolf's sandbox — no CI, no rules
├── sandbox-dave/              ← Dave's sandbox — no CI, no rules
├── CLAUDE.md                  ← this file
└── LEGAL_AGREEMENT.md         ← Co-ownership agreement (both signed)
```

---

## BRANCH MODEL

| Branch | Purpose | Rules |
|---|---|---|
| `main` | Production | Protected. Both owners must approve PR. |
| `staging` | Pre-prod | Auto-deploys to staging env. |
| `develop` | Integration | All features merge here first. |
| `feature/wolf-*` | Wolf's features | PR to develop. |
| `feature/dave-*` | Dave's features | PR to develop. |
| `sandbox/wolf` | Wolf's playground | Zero CI. Zero enforcement. Zero approval. |
| `sandbox/dave` | Dave's playground | Zero CI. Zero enforcement. Zero approval. |
| `hotfix/*` | Emergency fix | Merge to main + develop simultaneously. |

**Sandbox rule:** Wolf and Dave each have a sandbox that cannot break main. Full visibility to each other — no hidden areas. Merge to develop when ready. That merge = jointly owned under agreement.

---

## BUILD ORDER — FOLLOW THIS EXACTLY

### Phase 1 — Foundation (START HERE)
1. Scaffold mono-repo: `pnpm create turbo`
2. `packages/shared-types` — TypeScript types for entire platform
3. `packages/shared-auth` — JWT utilities, session helpers
4. `packages/shared-db` — Prisma client + schema + migrations
5. `apps/portal` — Auth portal (first login, GitHub OAuth, co-owner signing)

### Phase 2 — Core Platform
6. `packages/shared-storage` — S3/GCS abstraction layer
7. `packages/shared-events` — BullMQ event bus
8. `apps/platform-web` — Band accounts, tours, shows
9. `infra/terraform/core` — VPC, DNS, SSL baseline

### Phase 3 — Live Production
10. `apps/ingest-service` — Edge ingest, camera control (SMPTE 2110, NDI, VISCA)
11. `apps/metadata-engine` — AI tagging pipeline (Python/FastAPI)
12. `infra/terraform/edge` — Edge node definitions

### Phase 4 — Distribution
13. `apps/licensing-service` — Rights + access control
14. `apps/streaming-service` — HLS/DASH delivery, DSP pipeline
15. `apps/ecommerce-service` — Fan store

### Phase 5 — Visualization
16. `apps/architecture-viz` — Interactive mind map site (the platform Wolf + Dave use to work)

**Do not skip phases. Do not jump ahead. Build dependencies in order.**

---

## PORT MAP — RRUD SERVICES

| Service | Port | Notes |
|---|---|---|
| portal (dev) | 3100 | Do NOT use 3000 — that's job-pipeline |
| platform-web (dev) | 3101 | |
| architecture-viz (dev) | 3102 | |
| ingest-service (dev) | 4000 | |
| metadata-engine (Python) | 8050 | Do NOT use 8035 — that's archive-35 |
| licensing-service (dev) | 4001 | |
| streaming-service (dev) | 4002 | |
| ecommerce-service (dev) | 4003 | |
| PostgreSQL | 5432 | standard |
| Redis | 6379 | standard |
| Meilisearch | 7700 | standard |
| Qdrant | 6333 | standard |

**Ports 3000, 8035, 8036 are owned by other Wolf projects. Never use them here.**

---

## TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Mono-repo | Turborepo + pnpm workspaces |
| Frontend | Next.js 14 (App Router) |
| API | tRPC + Fastify (service-dependent) |
| Auth | NextAuth.js v5 + GitHub OAuth |
| Database | PostgreSQL 15 via Prisma |
| Cache/Queue | Redis (Upstash or self-hosted) + BullMQ |
| Storage | AWS S3 (abstracted — platform-agnostic) |
| Search | Meilisearch |
| Vector DB | Qdrant |
| Analytics DB | ClickHouse |
| ML/AI | Python 3.11, FastAPI, PyTorch, Whisper, YOLOv8 |
| Media | FFmpeg (static build), AJA/BMD capture drivers |
| Email | Resend |
| Payments | Stripe + Stripe Connect |
| Streaming | Mux or self-hosted HLS/DASH |
| Infra | Terraform (cloud-agnostic — AWS/GCP/Azure TBD) |
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose (dev), ECS/GKE (prod) |

---

## KEY DEPENDENCIES TO KNOW

Full dependency lists (10–12 per module) are in `ARCHITECTURE.md`.

Quick reference — the ones that matter most:

- `next-auth@5` — auth core
- `@octokit/oauth-app` — GitHub identity linking
- `prisma` — database ORM
- `bullmq` — async job queue
- `casl` — role-based permissions per band account
- `@aws-sdk/lib-storage` — multipart S3 upload (used in ingest)
- `fluent-ffmpeg` — ProRes encoding at edge
- `openai-whisper` — speech-to-text for content tagging
- `ultralytics` (YOLOv8) — object detection
- `qdrant-client` — vector search
- `stripe` + `stripe connect` — payments + revenue split
- `svix` — reliable webhooks to partner systems
- `jose` — JWT (RS256) across all services
- `zod` — validation on every API route

---

## BROADCAST / PRODUCTION SPECS

This platform handles professional broadcast production. Specs matter.

- **Camera protocols:** SMPTE ST 2110-20/30/40, NDI 5, SDI via AJA Kona / Blackmagic DeckLink
- **Archive format:** ProRes 422 HQ, 4K (3840×2160), up to 29.97fps
- **Camera scale:** 20+ simultaneous camera streams per show
- **Sync:** PTP IEEE 1588 (sub-microsecond across all nodes)
- **Camera control:** VISCA-over-IP (PTZ), Sony RCPU (RCP), vendor APIs (Sony/Panasonic/Canon)
- **Upload:** Parallel cloud sync DURING recording — not after. Local NVMe ring buffer as fallback.
- **Latency target:** Content available in cloud within minutes of show end.
- **Edge node minimum spec:** 128GB RAM, NVMe RAID, 10GbE NIC, Docker runtime

---

## CO-OWNERSHIP — HARD RULES

- All IP created in this repo = 50/50 Wolf + Dave. No exceptions.
- `main` branch requires BOTH owners to approve any PR.
- Major decisions (architecture changes, external partnerships, fundraising) = both owners must agree.
- Sandbox merges to develop = content becomes jointly owned automatically.
- Legal agreement is in `LEGAL_AGREEMENT.md`. Do not modify it without both owners.
- Dave's GitHub must be added to CODEOWNERS before any protected branch is created.

---

## WOLF'S OTHER ACTIVE PROJECTS — STAY AWAY UNLESS ASKED

| Project | Location | Status | Note |
|---|---|---|---|
| Archive-35 | `/ACTIVE/archive-35/` | LIVE BUSINESS | Real customers. Real money. |
| ATHOS | `/ACTIVE/ATHOS/` | Active | Leadership consulting site |
| Job Pipeline | `/ACTIVE/job-pipeline/` | Active daily | Job search automation |
| Lighthaus | `/ACTIVE/lighthaus/` | Paused | AI second brain app |

**Never touch these directories during a Rock&Roll session unless Wolf explicitly asks.**

---

## LESSONS LEARNED — READ THESE

These come from months of working with Wolf across multiple projects.

**1. Ask before building.**
Wolf's pattern on dev/build work: clarifying questions first, then execute. If you're about to write code and haven't confirmed the brief — stop and ask.

**2. Voice-to-text is the input method.**
Correct errors silently. "get up" = GitHub. Trailing sentences are probes, not confusion. Respond to what's useful.

**3. Port conflicts are real.**
Wolf runs multiple active servers simultaneously. Always check the port map before starting a service. 3000 and 8035 are taken.

**4. Shared files = test everything.**
If a change touches a shared package (`shared-types`, `shared-auth`, `shared-db`), test all downstream services. One change can silently break three things.

**5. Never auto-deploy anything.**
Wolf controls deploys. Build, test, confirm — then Wolf says go.

**6. Architecture.md is the contract.**
Don't improvise architecture. Everything is specified. If something isn't covered, ask Wolf before inventing it.

**7. The sandboxes are sacred.**
Sandbox branches are no-judgment zones. Don't enforce CI there. Don't comment on what's in them. They exist so both owners can experiment without consequences.

**8. Dave is a full equal.**
Not a contractor. Not a junior. Co-owner. When in doubt about something that affects the main branch, surface it for both owners.

**9. Platform-agnostic until decided.**
Cloud provider is TBD. Write Terraform modules that abstract AWS/GCP/Azure. Don't hardcode providers. Don't assume S3 = forever.

**10. This is a pitch as much as a product.**
Everything built here may be shown to Live Nation, AEG, major labels, or investors. Code quality and architecture clarity matter for the pitch, not just the build.

---

## FIRST COMMAND WHEN STARTING A NEW SESSION

```bash
cd /Users/wolfgangschram/Documents/ACTIVE/Rock&Roll
cat ARCHITECTURE.md
# Then proceed with current phase
```

---

## OPEN ITEMS (as of March 2026)

- [ ] Dave's GitHub username — needed before CODEOWNERS + repo setup
- [ ] Cloud provider decision — AWS / GCP / Azure
- [ ] Legal entity formation — LLC or partnership, US + international
- [ ] Rights management partner — Frame.io / Mediasilo / custom
- [ ] Licensing model — per-event / subscription / revenue share
- [ ] First door: Live Nation, AEG, or other?

---

*CLAUDE.md version: 1.0*
*Project: Rock&Roll UpsideDown*
*Authors: Wolf Schram + Dave*
*Created: 2026-03-16*
*Next review: when Phase 1 complete*
