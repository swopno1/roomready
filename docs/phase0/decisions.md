# Phase 0 — Decision log

Every §13 decision in one place: options, the plan's recommendation, what
Phase-2 work it gates, and the verdict. Founder fills in **Verdict + date**;
nothing here takes effect until then.

**Checklist-health note (5 Nov 2026):** `TO-DO.md` Phase 0 body lists 7
decisions, but `PLAN.md` §13 has 10. **Pilot property** and **Analytics**
are in §13 and gate Phase 2 (2D pilot, 2G cookie policy) yet have no Phase 0
checkbox — they are tracked here as D8/D9 regardless. Conversely D5
(business model) and D10 (Play Store account) don't strictly gate Phase-2
*build* work; keeping them in Phase 0 is still recommended so Phase 3 and
pricing conversations aren't blocked later.

## D1 — Integration Service hosting

- Options: Render / Fly.io / small VPS.
- Plan's steer: any lightweight host; ~256–512 MB RAM + Postgres + Redis.
- Gates: Phase 2B deploy + staging.
- Verdict: **Modal Starter (free tier)** + founder's Modal credits for usage.
  Backend serves on the default `modal.run` URL (unbranded accepted — custom
  domains need the paid Team plan); frontend keeps the custom domain.
  App stays a plain FastAPI service (container build kept for portability),
  queue via Modal Cron + Postgres ledger initially (Redis only if outgrown).
- Date: 5 Nov 2026

## D2 — Integration Service repo

- Options: separate repo (recommended — shared across products) vs inside
  the Suite repo.
- Gates: Phase 2B scaffold; CI setup; freeze scope (§14.2 step 0).
- Steer (5 Nov 2026): separate — strengthened. The Suite lives on 13
  per-tenant `client/*` branches; shared-service code inside a
  tenant-branched repo is a branching nightmare. MVP needs no decision
  (`swopno1/roomready` already standalone); the service repo is
  post-MVP. Verdict: — Date: —

## D3 — Deployment topology

- Options: embedded Suite module first (recommended, §4.5 Phase A) vs
  standalone from day one.
- Gates: Phase 2A/2C auth + hosting shape; S3 embedding spike.
- Steer (5 Nov 2026): **standalone for the MVP, embed optional at
  integration** (Concierge-shaped add-on; S3 answer). MVP ships with
  zero Suite dependency; Option A embed lands only when Suite wiring
  does. Verdict: — Date: —

## D4 — Concurrent sessions cap

- Options: no cap vs cap of N simultaneous staff sessions per account.
- Gates: auth/token design (Phase 2B token validation, 2C SSO).
- Steer (5 Nov 2026): moot for MVP (no sessions). At integration,
  Suite DB sessions make caps enforceable (count/revoke oldest) —
  suggest 3 devices/user, oldest-revoked, Phase B. Verdict: — Date: —

## D5 — Business model

- Options: bundled with Suite vs subscription add-on (Chatbot-shaped).
- No figures anywhere (standing policy — pricing negotiated, private).
- Gates: nothing in Phase-2 build; gates Phase 5 launch + Suite sales story.
- Steer (5 Nov 2026): subscription add-on like Concierge (matches the
  standalone + shared-Integration-Service shape). Verdict: — Date: —

## D6 — Data retention

- Options: confirm 12-month logs / 24-month tickets + photos (§8.4), or change.
- Gates: Phase 2G legal drafts (Privacy Policy "how long"), Phase 4 jobs.
- Steer (5 Nov 2026): confirm 12/24. Note: the Suite audit log is
  append-only — 12-month log deletion needs a purge job (Phase 4).
  Verdict: — Date: —

## D7 — Governing law / jurisdiction

- Options: founder + counsel pick one (Wyoming LLC vs Bangladesh ops).
- Gates: Phase 2G Terms draft (§9.1).
- Steer (5 Nov 2026): counsel decides; no repo evidence either way.
  Verdict: — Date: —

## D8 — Pilot property (§13, missing from Phase-0 body — tracked here)

- Options: Krishnachura Retreat (recommended, §11) vs another property.
- Gates: Phase 2D staging data + pilot week + staff briefing.
- Steer (5 Nov 2026): Krishnachura — matches the `krishnachura-retreat`
  demo property + `client/demo1` tenant. Open: which `client/*` branch
  pilots (13 exist; drift unmeasured). Verdict: — Date: —

## D9 — Analytics (§13, missing from Phase-0 body — tracked here)

- Options: none by default (privacy-first, recommended) vs
  privacy-respecting analytics later.
- Gates: Phase 2G Cookie Policy draft ("no analytics cookies unless…").
- Steer (5 Nov 2026): none by default (MVP is already zero-network —
  nothing to switch off). Verdict: — Date: —

## D10 — Play Store publisher account

- Options: existing publisher account vs new ViveScript account
  ($25 one-time, founder pays).
- Gates: nothing in Phase 2; gates Phase 3 listing work.
- Steer (5 Nov 2026): existing account if held (faster), else new
  ViveScript. Verdict: — Date: —

## D11 — Apple / iOS scope

- Standing position: out of scope — iOS is not in this roadmap.
- Record the confirmation so it isn't re-litigated.
- Steer (5 Nov 2026): confirm out. Verdict: — Date: —

## D12 — Legal counsel engaged

- Requirement: counsel engaged for the four legal pages (§9) before any
  paying property; drafts happen in Phase 2G regardless.
- Gates: Phase 5 legal sign-off (engagement itself should land in Phase 0
  so 2G drafting has a reviewer lined up).
- Counsel: — Engaged date: —
