# Rock&Roll UpsideDown — Full System Architecture
## Version 1.0 — Handover Document for Claude Code

---

## PROJECT IDENTITY

- **Project Name:** Rock&Roll UpsideDown (RRUD)
- **Repository:** `rock-and-roll-upside-down` (GitHub)
- **Co-Owners:** Wolf Schram (LA) + Dave [Cincinnati]
- **Entity:** To be formed — 50/50 co-ownership, international operations
- **Cloud:** Platform-agnostic (AWS/GCP/Azure — abstracted via Terraform/Pulumi)
- **Runtime Target:** Node.js (primary), Python (ML/metadata services)

---

## REPO STRUCTURE

```
rock-and-roll-upside-down/
├── .github/
│   ├── workflows/
│   │   ├── ci-main.yml
│   │   ├── ci-wolf-dev.yml
│   │   └── ci-dave-dev.yml
│   └── CODEOWNERS
├── apps/
│   ├── portal/              # Login + auth portal (this document, Session 1)
│   ├── platform-web/        # Main platform web app
│   ├── architecture-viz/    # Interactive mind map site
│   ├── ingest-service/      # Live show ingest + edge sync
│   ├── metadata-engine/     # AI content detection + tagging
│   ├── licensing-service/   # Rights + licensing management
│   ├── streaming-service/   # Music/video streaming distribution
│   └── ecommerce-service/   # Fan-facing store
├── packages/
│   ├── shared-types/        # TypeScript types across all services
│   ├── shared-auth/         # Auth utilities (JWT, session, GitHub OAuth)
│   ├── shared-db/           # Database client wrappers
│   ├── shared-storage/      # S3/GCS/R2 abstraction layer
│   └── shared-events/       # Event bus types + publishers
├── infra/
│   ├── terraform/
│   │   ├── core/            # VPC, DNS, SSL, CDN
│   │   ├── compute/         # ECS/GKE cluster definitions
│   │   ├── storage/         # S3/GCS buckets, RDS, Redis
│   │   └── edge/            # Edge compute nodes (fly packs)
│   └── docker/
│       ├── base images
│       └── service dockerfiles
├── docs/
│   ├── ARCHITECTURE.md      # This file
│   ├── CO_OWNERSHIP.md      # Legal agreement
│   ├── API_SPEC.md          # OpenAPI specs
│   ├── BROADCAST_SPEC.md    # SMPTE 2110 / NDI / SDI specs
│   └── RUNBOOKS/
├── scripts/
│   ├── setup-dev.sh
│   ├── seed-db.sh
│   └── deploy.sh
├── sandbox-wolf/            # Wolf's personal sandbox (no CI enforcement)
├── sandbox-dave/            # Dave's personal sandbox (no CI enforcement)
├── LEGAL_AGREEMENT.md
└── README.md
```

---

## BRANCH MODEL

```
main                    → Production. Protected. Requires PR + both owners approve.
staging                 → Pre-production. Auto-deploys to staging environment.
develop                 → Integration branch. Feature PRs merge here first.
feature/wolf-*          → Wolf feature branches (from develop)
feature/dave-*          → Dave feature branches (from develop)
sandbox/wolf            → Wolf's personal playground. Never merges to develop without intent.
sandbox/dave            → Dave's personal playground. Never merges to develop without intent.
hotfix/*                → Emergency fixes. Merge to main + develop simultaneously.
```

**Rules:**
- `main` + `staging` = protected, no direct push
- `sandbox/*` = zero enforcement, zero CI gates, personal space
- All features: PR to `develop`, then `develop` → `staging` → `main`
- Co-ownership agreement stored in `main` as `LEGAL_AGREEMENT.md` — signed via portal click

---

## MODULE 1: AUTH PORTAL
### `apps/portal/`

**Purpose:** Single entry point for all platform users. GitHub-linked identity. First-login password change enforcement. Co-ownership signing surface.

### Stack
- **Frontend:** Next.js 14 (App Router)
- **Backend:** Next.js API Routes + tRPC
- **Auth:** NextAuth.js v5
- **Database:** PostgreSQL (via Prisma ORM)
- **Cache/Session:** Redis (Upstash or self-hosted)
- **Email:** Resend (transactional email)
- **GitHub OAuth:** GitHub Apps API

### Dependencies — Portal (12 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | Auth Core | `next-auth@5` | Session management, OAuth providers |
| 2 | GitHub OAuth | `@octokit/oauth-app` | Link GitHub identity, repo access scoping |
| 3 | Database ORM | `prisma` + `@prisma/client` | User schema, sessions, tokens |
| 4 | Database | PostgreSQL 15 | Persistent user store |
| 5 | Session Cache | `ioredis` | Fast session reads, token blacklist |
| 6 | Password Hash | `bcryptjs` | Secure password storage |
| 7 | Token Management | `jose` | JWT signing/verification (RS256) |
| 8 | Email Service | `resend` | First-login emails, invite flows |
| 9 | Input Validation | `zod` | Schema validation all API routes |
| 10 | Rate Limiting | `@upstash/ratelimit` | Brute force protection on login |
| 11 | Audit Log | `pino` | All auth events logged, immutable |
| 12 | Co-owner Signing | Custom + `date-fns` | Timestamped click-to-sign, both parties required |

### Auth Flow — First Login

```
1. User receives invite email (Resend)
2. Clicks one-time token link (expires 24h, Redis TTL)
3. Forced: set new username + password
4. Forced: connect GitHub account (OAuth flow)
5. If Wolf OR Dave: presented with CO_OWNERSHIP agreement
6. Click "I agree as co-owner" → timestamped, IP-logged, stored in DB
7. Both must sign before either gets full platform access
8. Session created: JWT (15min) + Refresh token (30 days, Redis)
9. GitHub repo access provisioned via GitHub Apps API
```

### Portal Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'co_owner' | 'band_admin' | 'band_member' | 'promoter' | 'label' | 'fan'
  github_id VARCHAR(100),
  github_username VARCHAR(100),
  github_access_token TEXT, -- encrypted
  first_login_complete BOOLEAN DEFAULT FALSE,
  co_owner_signed_at TIMESTAMP,
  co_owner_signed_ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- One-time tokens
CREATE TABLE one_time_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- 'first_login' | 'password_reset' | 'invite'
  used_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  refresh_token_hash VARCHAR(255) NOT NULL,
  device_info JSONB,
  ip_address VARCHAR(50),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Co-ownership signatures
CREATE TABLE co_owner_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agreement_version VARCHAR(20) NOT NULL,
  signed_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(50) NOT NULL,
  user_agent TEXT,
  agreement_hash VARCHAR(255) NOT NULL -- SHA256 of agreement text at time of signing
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  metadata JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## MODULE 2: BAND ACCOUNT SYSTEM
### `apps/platform-web/modules/bands/`

**Purpose:** Full account infrastructure for music artists. Content ownership, member management, tour management, access control.

### Dependencies (10 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | File Upload | `@aws-sdk/client-s3` + `@uppy/core` | Direct-to-S3 multipart upload |
| 2 | Media Processing | `ffmpeg` (binary) + `fluent-ffmpeg` | Transcode, thumbnail, proxy gen |
| 3 | Search | `meilisearch` | Fast band/content discovery |
| 4 | Queue | `bullmq` + Redis | Async jobs: transcode, sync, notify |
| 5 | Permissions | `casl` | Role-based access per band account |
| 6 | Image Processing | `sharp` | Artwork, thumbnails, profile images |
| 7 | Notifications | `socket.io` | Real-time upload progress, approvals |
| 8 | Webhooks | Custom + `zod` | Promoter/label integrations notify |
| 9 | Content Versioning | `@aws-sdk/client-s3` versioning | Immutable content history |
| 10 | Invite System | `nanoid` + Resend | Band member invites, access grants |

### Band Account Schema (key tables)

```sql
CREATE TABLE bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tier VARCHAR(50) NOT NULL, -- 'emerging' | 'touring' | 'arena' | 'stadium'
  storage_quota_gb INTEGER DEFAULT 500,
  storage_used_gb DECIMAL DEFAULT 0,
  metadata JSONB, -- genre, bio, social links, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE band_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES bands(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) NOT NULL, -- 'owner' | 'manager' | 'artist' | 'crew' | 'viewer'
  permissions JSONB, -- granular per-band permissions
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES bands(id),
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'planning', -- 'planning' | 'active' | 'complete' | 'archived'
  production_config JSONB, -- fly pack config, camera list, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES tours(id),
  band_id UUID REFERENCES bands(id),
  venue_name VARCHAR(255),
  venue_city VARCHAR(100),
  venue_country VARCHAR(100),
  show_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  ingest_node_id VARCHAR(100), -- edge node assigned
  camera_count INTEGER DEFAULT 0,
  total_content_gb DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## MODULE 3: LIVE INGEST + FLY PACK SYSTEM
### `apps/ingest-service/`

**Purpose:** Edge hardware abstraction layer. COTS servers at venue. Cloud-sync orchestration. Camera control. Real-time ingest at 4K ProRes 422 scale.

### Stack
- **Edge Runtime:** Node.js on Linux (Ubuntu Server, bare metal COTS)
- **Protocol Support:** SMPTE ST 2110, NDI 5, SDI via capture cards
- **Capture Cards:** AJA Kona, Blackmagic Design DeckLink (driver abstraction layer)
- **Camera Control:** VISCA over IP, RCP protocol, Sony/Panasonic/Canon vendor APIs
- **Cloud Sync:** AWS S3 Transfer Acceleration OR GCS parallel composite upload
- **Orchestration:** Docker on edge nodes, managed from cloud control plane

### Dependencies (12 defined)

| # | Dependency | Package/System | Purpose |
|---|---|---|---|
| 1 | SMPTE 2110 | `node-srt` + custom C++ addon | ST 2110-20/30/40 receive |
| 2 | NDI SDK | NDI SDK (NewTek) Node bindings | NDI source discovery + receive |
| 3 | FFmpeg | `fluent-ffmpeg` + static build | ProRes 422 encoding, mux, segment |
| 4 | Camera Control | Custom VISCA-over-IP lib | PTZ: pan/tilt/zoom/focus/iris |
| 5 | RCP Control | Sony RCPU API + custom adapter | Full remote control panel emulation |
| 6 | Cloud Upload | `@aws-sdk/lib-storage` multipart | Parallel 4K chunk upload to S3 |
| 7 | Edge Orchestration | Docker Engine API + `dockerode` | Remote container management per node |
| 8 | Sync State | Redis Streams | Real-time ingest status, camera health |
| 9 | Clock Sync | PTP (IEEE 1588) via `ptpd` | Sub-microsecond sync across cameras |
| 10 | Asset Manifest | Custom JSON schema | Per-show clip manifest, timecode index |
| 11 | Health Monitor | `prom-client` → Prometheus | Edge node vitals: CPU, temp, disk, net |
| 12 | Fallback Buffer | Local NVMe ring buffer | If cloud link drops — local holds, resumes |

### Ingest Flow Per Show

```
PRE-SHOW:
1. Cloud control plane provisions ingest node (Docker pull)
2. Camera list registered: IP, protocol, slot assignment
3. PTP sync verified across all nodes
4. Storage bucket created: s3://rrud-shows/{show_id}/
5. Local NVMe buffer initialized (ring, configurable TTL)

DURING SHOW:
6. All camera feeds ingested simultaneously
7. Each camera → FFmpeg → ProRes 422 HQ segments (configurable: 1min, 5min, 10min)
8. Segments uploaded to S3 in parallel AS THEY ARE WRITTEN (parallel, not sequential)
9. Manifest updated in Redis on each segment complete
10. Proxy (H.264 1080p) generated in parallel for fast preview
11. Camera health monitored — alert if feed drops > 3 seconds
12. Cloud control plane receives live status dashboard

POST-SHOW:
13. Final segments flushed
14. Manifest finalized → written to S3 + PostgreSQL
15. AI metadata engine job queued (BullMQ)
16. Band account notified: content available
17. Edge node cleanup + shutdown sequence
```

### Camera Control API

```
GET  /cameras                    → List all registered cameras + status
POST /cameras/{id}/move          → PTZ command {pan, tilt, zoom, speed}
POST /cameras/{id}/focus         → Focus {mode: auto|manual, position: 0-100}
POST /cameras/{id}/iris          → Iris {mode: auto|manual, value: 0-100}
POST /cameras/{id}/white-balance → WB {mode: auto|manual, temp: 2700-10000}
GET  /cameras/{id}/preview       → Live JPEG thumbnail stream
POST /cameras/{id}/preset/save   → Save position preset
POST /cameras/{id}/preset/recall → Recall position preset
GET  /ingest/status              → All cameras: recording, health, upload progress
POST /ingest/start               → Begin recording all cameras
POST /ingest/stop                → End recording, begin finalization
```

---

## MODULE 4: METADATA ENGINE
### `apps/metadata-engine/`

**Purpose:** AI-powered content detection, tagging, and indexing. Runs post-ingest. Generates searchable, licensable metadata for every asset.

### Stack
- **Runtime:** Python 3.11 (FastAPI)
- **ML Framework:** PyTorch + HuggingFace Transformers
- **Face Detection:** AWS Rekognition OR self-hosted DeepFace
- **Speech-to-Text:** OpenAI Whisper (self-hosted large-v3)
- **Scene Detection:** PySceneDetect
- **Object Detection:** YOLOv8
- **Vector Store:** Qdrant (semantic search)
- **Job Queue:** BullMQ (Node) → Redis → Python worker via REST

### Dependencies (10 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | Scene Detection | `scenedetect` | Cut detection, scene boundaries |
| 2 | Face Recognition | `deepface` or AWS Rekognition | Artist/performer ID |
| 3 | Speech-to-Text | `openai-whisper` | Lyrics, MC announcements, setlist |
| 4 | Object Detection | `ultralytics` (YOLOv8) | Instruments, logos, stage elements |
| 5 | Audio Analysis | `librosa` | BPM, key, energy, song boundaries |
| 6 | Embedding Model | `sentence-transformers` | Semantic content search vectors |
| 7 | Vector DB | `qdrant-client` | Store + query content embeddings |
| 8 | OCR | `pytesseract` + `easyocr` | Screen text, setlists, signage |
| 9 | Brand Detection | Custom CLIP fine-tune | Sponsor logos, band merch IDs |
| 10 | Export | `pydantic` + JSON Schema | Structured metadata output per asset |

### Metadata Output Schema (per asset)

```json
{
  "asset_id": "uuid",
  "show_id": "uuid",
  "band_id": "uuid",
  "camera_slot": 4,
  "timecode_start": "01:23:45:12",
  "timecode_end": "01:24:10:00",
  "duration_seconds": 24.88,
  "technical": {
    "codec": "prores_422",
    "resolution": "3840x2160",
    "frame_rate": "29.97",
    "audio_channels": 8,
    "file_size_gb": 2.4
  },
  "content": {
    "scene_type": "performance",
    "performers_detected": ["artist_id_1"],
    "instruments_detected": ["guitar", "drums"],
    "lyrics_transcript": "...",
    "song_title_detected": "Stairway to Heaven",
    "energy_level": 0.87,
    "crowd_reaction": 0.92
  },
  "rights": {
    "license_status": "band_owned",
    "clearance_required": ["sync_license"],
    "do_not_distribute": false
  },
  "brands_detected": ["brand_id_1"],
  "tags": ["chorus", "guitar_solo", "crowd_shot", "pyro"],
  "quality_score": 0.91,
  "processed_at": "2025-03-15T22:31:00Z"
}
```

---

## MODULE 5: CONTENT LICENSING SYSTEM
### `apps/licensing-service/`

**Purpose:** Foundation layer for third-party rights management integration. Manages access grants, content availability windows, and usage tracking. Designed for external rights platforms to plug into.

### Dependencies (10 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | API Gateway | `fastify` + `@fastify/swagger` | RESTful + OpenAPI spec |
| 2 | Rights Schema | Custom + `zod` | Flexible license type definitions |
| 3 | Access Tokens | `jose` (JWT) | Time-scoped, purpose-scoped access |
| 4 | Webhook Engine | `svix` | Reliable outbound webhooks to partners |
| 5 | Usage Tracking | `clickhouse` | High-volume access event logging |
| 6 | CDN Signing | `@aws-sdk/cloudfront-signer` | Signed URLs for protected content |
| 7 | Audit Trail | `pino` + S3 log archive | Immutable rights usage log |
| 8 | Notification | `bullmq` | Async approval workflows |
| 9 | Integration API | OpenAPI 3.1 spec | Interface for Frame.io, Mediasilo, etc. |
| 10 | Rate Limiting | `@upstash/ratelimit` | API partner abuse prevention |

---

## MODULE 6: STREAMING + DISTRIBUTION
### `apps/streaming-service/`

**Purpose:** Music and video streaming, live stream distribution, fan-facing playback, and potential label/DSP distribution pipeline.

### Dependencies (10 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | HLS Packaging | `ffmpeg` + `hls.js` | Adaptive bitrate streaming |
| 2 | DASH Packaging | `dash.js` | MPEG-DASH for premium clients |
| 3 | CDN | CloudFront / Cloudflare | Global edge delivery |
| 4 | DRM | Widevine + FairPlay (via Mux) | Content protection |
| 5 | Live Stream | `node-media-server` or Mux Live | RTMP ingest → HLS output |
| 6 | Video Player | `video.js` + custom skin | Web player, embeddable |
| 7 | Audio Player | `howler.js` | Music streaming player |
| 8 | Analytics | `mux-data` or custom | Playback QoE metrics |
| 9 | DSP Integration | Custom adapters | Spotify/Apple Music delivery pipeline |
| 10 | Offline Sync | Service Worker + IndexedDB | Progressive web app offline support |

---

## MODULE 7: E-COMMERCE
### `apps/ecommerce-service/`

**Purpose:** Fan-facing store. Merch, downloads, live recordings, prints, NFT-adjacent digital ownership. Integrated with band accounts and content library.

### Dependencies (10 defined)

| # | Dependency | Package | Purpose |
|---|---|---|---|
| 1 | Payments | `stripe` | Cards, subscriptions, payouts |
| 2 | Storefront | Next.js Commerce or custom | Product pages, cart, checkout |
| 3 | Inventory | Custom + PostgreSQL | Digital + physical inventory |
| 4 | Digital Delivery | Signed S3 URLs + email | Download delivery post-purchase |
| 5 | Print Fulfillment | Printful API or custom | Physical merch drop-ship |
| 6 | Tax | `taxjar` or `stripe-tax` | International tax compliance |
| 7 | Subscription | Stripe Billing | Fan club / content access tiers |
| 8 | Promoter Revenue Share | Custom + Stripe Connect | Split payments to band + promoter |
| 9 | Analytics | `posthog` | Conversion, funnel, revenue |
| 10 | Notifications | Resend + SMS (Twilio) | Order confirm, shipping, drops |

---

## MODULE 8: ARCHITECTURE VIZ SITE
### `apps/architecture-viz/`

**Purpose:** Working platform for Wolf + Dave. Interactive mind map of the full system. Drill-down from concept to dependency to code. Linked to GitHub. External pitch surface.

### Stack
- **Framework:** Next.js 14
- **Mind Map:** `reactflow` (node-based diagram engine)
- **Data:** Static JSON (architecture config), GitHub API for live status
- **Auth:** Shared auth package (co-owner login only for edit mode)
- **Deploy:** Vercel or Cloudflare Pages

### Features
- Public read: full architecture visible, drill into any module
- Co-owner edit mode: add nodes, annotate, link to GitHub issues
- GitHub integration: each node can link to a file, PR, or issue
- Live status: CI/CD badge per module, last deploy timestamp
- Sandbox indicators: Wolf and Dave sandbox nodes clearly marked

---

## INFRASTRUCTURE OVERVIEW

### Cloud Resources (Terraform managed)

```
Core Infrastructure:
├── VPC (multi-AZ)
├── DNS (Route53 or Cloudflare)
├── SSL (ACM or Let's Encrypt)
├── CDN (CloudFront or Cloudflare)
└── Load Balancer (ALB)

Compute:
├── ECS Fargate (portal, platform-web, licensing, ecommerce)
├── ECS + GPU instances (metadata-engine ML workers)
├── EC2 bare metal option (ingest-service edge nodes)
└── Lambda (lightweight webhooks, signed URL generators)

Storage:
├── S3 (raw ProRes archives, proxies, processed assets)
│   ├── rrud-raw-ingest/          # Raw ProRes from shows
│   ├── rrud-proxies/             # H.264 proxy files
│   ├── rrud-processed/           # Post-metadata assets
│   ├── rrud-distribution/        # CDN-fronted delivery
│   └── rrud-audit-logs/          # Immutable audit archive
├── RDS PostgreSQL (primary database cluster)
├── ElastiCache Redis (sessions, queues, pub/sub)
├── Qdrant Cloud (vector embeddings)
└── ClickHouse Cloud (usage analytics)

Edge (Per Show/Venue):
├── COTS server (min spec: 128GB RAM, NVMe RAID, 10GbE)
├── Docker runtime
├── Local Redis instance
└── VPN tunnel to cloud control plane
```

---

## SECURITY ARCHITECTURE

- **All secrets:** AWS Secrets Manager or HashiCorp Vault
- **All GitHub tokens:** Encrypted at rest (AES-256), decrypted per-request
- **All content URLs:** Signed (CloudFront signed URLs, 1h expiry default)
- **All API routes:** JWT-authenticated, role-checked via CASL
- **All uploads:** Virus scanned (ClamAV or AWS GuardDuty)
- **All logs:** Immutable, shipped to S3 within 60 seconds
- **PII:** Encrypted columns in PostgreSQL (pgcrypto)
- **Rate limiting:** All public endpoints via Upstash
- **DDoS:** CloudFront + WAF rules

---

## CO-OWNERSHIP LEGAL AGREEMENT
### `LEGAL_AGREEMENT.md` (stored in repo, signed in portal)

Key terms to be drafted by legal counsel, framework:
1. 50/50 ownership of all IP created within this repository
2. Both parties required to approve major architectural decisions
3. Revenue split: 50/50 after agreed operating costs
4. Dissolution clause: requires mutual agreement or arbitration
5. Contributions tracked via git history as evidence of authorship
6. Third-party integrations require both signatures
7. Signing method: click-to-sign in portal, timestamped, IP-logged, SHA256 hash of agreement version stored

---

## ENVIRONMENT SETUP — CLAUDE CODE HANDOVER

### Prerequisites

```bash
# Required on dev machine
node >= 20.0.0
pnpm >= 8.0.0
docker >= 24.0.0
docker-compose >= 2.0.0
python >= 3.11 (for metadata-engine)
ffmpeg >= 6.0 (static build recommended)
terraform >= 1.6.0
git >= 2.40.0
```

### First Run

```bash
git clone https://github.com/{owner}/rock-and-roll-upside-down.git
cd rock-and-roll-upside-down
pnpm install
cp .env.example .env.local
docker-compose up -d  # starts: postgres, redis, meilisearch, qdrant
pnpm db:migrate
pnpm db:seed
pnpm dev  # starts all apps in parallel via turborepo
```

### Turborepo Pipeline

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "outputs": ["coverage/**"] },
    "db:migrate": { "cache": false }
  }
}
```

---

## BUILD ORDER FOR CLAUDE CODE

**Phase 1 — Foundation (do this first)**
1. Repo init: `pnpm create turbo` mono-repo scaffold
2. `packages/shared-types` — TypeScript types for entire platform
3. `packages/shared-auth` — JWT utilities, session helpers
4. `packages/shared-db` — Prisma client + migrations
5. `apps/portal` — Auth portal (first login, GitHub link, co-owner signing)

**Phase 2 — Core Platform**
6. `packages/shared-storage` — S3/GCS abstraction
7. `packages/shared-events` — BullMQ event bus
8. `apps/platform-web` — Band accounts, tours, shows
9. `infra/terraform/core` — VPC, DNS, SSL baseline

**Phase 3 — Production**
10. `apps/ingest-service` — Edge ingest, camera control
11. `apps/metadata-engine` — AI tagging pipeline
12. `infra/terraform/edge` — Edge node definitions

**Phase 4 — Distribution**
13. `apps/licensing-service` — Rights + access control
14. `apps/streaming-service` — HLS/DASH delivery
15. `apps/ecommerce-service` — Fan store

**Phase 5 — Visualization**
16. `apps/architecture-viz` — Mind map site for Wolf + Dave

---

## OPEN QUESTIONS (to resolve in Phase 1)

- [ ] Dave's GitHub username → needed for CODEOWNERS + repo access
- [ ] Preferred cloud provider → AWS / GCP / Azure (affects Terraform modules)
- [ ] Legal entity formation → needed before external contracts
- [ ] Rights management partner → Frame.io / Mediasilo / custom
- [ ] Licensing model → per-event / subscription / revenue share

---

*Architecture Version: 1.0*
*Authors: Wolf Schram + Dave [Cincinnati]*
*Generated: 2026-03-16*
*Status: Handover Ready — Claude Code Phase 1*
