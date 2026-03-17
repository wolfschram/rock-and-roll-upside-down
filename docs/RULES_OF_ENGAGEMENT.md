# RULES_OF_ENGAGEMENT.md — Rock&Roll UpsideDown
## How Wolf and Dave Work Together

---

## The Foundation

This is a 50/50 partnership. Every line of code, every concept, every architectural decision created inside this project is jointly owned. That does not change based on who had the idea or who wrote it.

What makes this work is not legal paperwork. It is how we operate day to day. These rules exist so we never have to have an awkward conversation about ownership, credit, or direction. The rules replace that conversation before it needs to happen.

---

## Ownership

**Everything in the repo = jointly owned. No exceptions.**

- An idea Wolf has in his sandbox → still 50/50 once it merges to develop
- Code Dave writes over a weekend → still 50/50 once it merges
- A concept that one person originated → 50/50 the moment it becomes part of the platform
- External work (freelancers, contractors) brought in → must be agreed by both, work-for-hire contracts required

The only exception: work that stays in your sandbox forever and never merges. That stays yours. The moment it touches develop — it is ours.

---

## Decision Making

Not every decision needs two people. Here is the framework:

### Green — No approval needed
- Work within your own sandbox branch
- Bug fixes on your own feature branches
- Documentation updates
- Anything that does not affect shared packages or main

### Yellow — Proceed, but notify the other owner
- New feature branches
- Adding new dependencies to a single service
- Changing dev environment config
- Architectural experiments in a sandbox

### Red — Both owners must agree
- Merging anything to `main`
- Changes to shared packages (shared-types, shared-auth, shared-db, etc.)
- Adding or removing platform services
- Any database schema change on staging or production
- External partnerships, integrations, or contracts
- Spending money (any amount)
- Significant changes to ARCHITECTURE.md
- Bringing in a third co-owner or investor

### Hard Stop — Neither owner can proceed alone
- Modifying LEGAL_AGREEMENT.md
- Changing IP ownership structure
- Making commitments to investors or promoters

---

## Architecture Changes

ARCHITECTURE.md is the contract. It is not sacred — it can change. But changes need a process.

**How to propose a change:**
1. Write it up. A paragraph is enough. What changes, why, what it affects.
2. Open a GitHub issue tagged `architecture-proposal`.
3. Both owners review. Async is fine.
4. Both owners comment approval or concerns.
5. If agreed: update ARCHITECTURE.md + CLAUDE.md, merge to main.
6. If disagreed: discussion continues until resolved. No change gets forced through.

**The current architecture is a starting point — not a cage.**

Wolf designed it. Dave may look at it and have better ideas. That is the point. If Dave reads ARCHITECTURE.md and thinks a module should be built differently — open an issue, make the case, decide together.

---

## Branch Rules

| Branch | Who can push | Approval needed |
|---|---|---|
| `main` | Either, via PR | Both owners |
| `staging` | Either, via PR | One owner |
| `develop` | Either, via PR | One owner |
| `feature/wolf-*` | Wolf | No |
| `feature/dave-*` | Dave | No |
| `sandbox/wolf` | Wolf only | None — zero rules |
| `sandbox/dave` | Dave only | None — zero rules |

**The sandbox is sacred space.** Break things. Experiment. Build half an idea. No judgment. No CI. No one comments on what is in your sandbox unless you ask.

Merging sandbox to develop is a deliberate act — it means "I think this is ready to become ours." Review it the same as any feature PR.

---

## Communication

We are in different cities. Async is the default.

- **GitHub issues** — primary channel for all technical decisions
- **No hidden work** — both owners have full read access to every branch at all times
- **Disagreements** — resolved in GitHub issues, not side channels. Keeps a record.
- **No gatekeeping** — if one owner is blocked waiting on the other, that gets flagged immediately

---

## Velocity vs. Quality

**Early stages:** move fast. Get things working. The portal, the architecture viz, the core band account system — these need to exist and look credible before we pitch.

**Before any external demo:** quality standards apply. No broken flows on main. No placeholder content that is not clearly marked.

**The rule:** what is on `main` is what we would show Live Nation tomorrow if they called.

---

## New Ideas

They will come. Often. This is how both of us are wired.

**The process:** new idea goes into `BACKLOG.md` with a one-line description. We do not derail the current phase. We capture it and come back. The phases in CLAUDE.md exist for a reason — dependencies are real, and skipping them creates problems during demos.

---

## Revenue and Costs

Revenue splits 50/50 after agreed operating costs.

**No approval needed:**
- Cloud infrastructure for dev/staging (reasonable)
- Domain names
- Required API keys for development

**Both owners must agree:**
- Anything over $500
- Any recurring SaaS subscription
- Any contractor or freelancer
- Legal or accounting fees

---

## If We Disagree

**Technical:** write up the competing approaches in a GitHub issue. Most disagreements resolve when both sides are written down clearly.

**Business:** same. Issue. Written arguments. Agree on the merits.

**Still stuck:** park it for a week. Most disagreements look different after a week.

**Unresolvable:** California arbitration per the legal agreement. That is the backstop — not the first move.

---

## The Spirit of This

We are two people who both care about building something real. The rules exist to protect that — not to slow it down.

If something is unclear — ask. If something feels wrong — say it. If an idea is better than what is in the architecture doc — make the case.

The goal is a platform that turns the live music industry upside down. Everything else is in service of that.

---

*RULES_OF_ENGAGEMENT.md v1.0 — Rock&Roll UpsideDown — March 2026*
