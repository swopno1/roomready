# RoomReady — To-Do

**Actionable roadmap, Phase 0 → launch.** Companion to
[`PLAN.md`](PLAN.md) (the why and the design) — this file is the work list.
Work it top to bottom: a phase is done only when its **exit criteria** and
its **🔒 security gate** all pass.

**Legend:** `- [ ]` open · `- [x]` done · **Owner:** who does it —
Founder, Cosmo, Muse Code (Suite repo), or TBD (founder assigns).
🔒 marks a security checkpoint: the phase cannot close with it open.
No pricing figures anywhere in this file (Suite pricing is negotiated and
stays private).

---

## Phase 0 — Validate before building

**Goal:** kill the plan's unknowns before any Phase-2 code. No building on
assumptions.
**Exit:** every spike has a written answer in `PLAN.md` or here; all
founder decisions in §13 that gate Phase 2 are made.

- [x] **Spike: Suite auth — verify, don't assume.** → Answered 5 Nov 2026:
  NextAuth Credentials + JWT (user id only, 30d default); validation via new
  Suite `POST /api/v1/auth/introspect` (service key, ~60s cache); `maxAge` →
  24h + `tokenVersion` revoke in Phase 2A; no 2FA / no sessions today (both
  become 2A build work). Full answer in `docs/phase0/spikes/auth.md`; §7
  revised. **Owner:** Muse Code (read-only inspection) + Cosmo (record)
- [ ] **Spike: Suite API inventory.** List what the Suite already exposes
  for rooms, units, staff, roles, booking states. Map each §4.3 endpoint to
  "exists / extend / build new". **Owner:** Muse Code
- [ ] **Spike: embedding mechanism.** Pick Phase-A embedding: static PWA
  files under `public/housekeeping` vs a Next.js route wrapping the shell.
  Record the choice + why. **Owner:** Muse Code + Founder
- [ ] **Spike: photo storage.** Pick the backend for photo evidence
  (Supabase Storage presumed — confirm bucket, access rules, URL signing).
  **Owner:** Muse Code
- [ ] **Spike: FCM project.** Confirm the Firebase project for push
  (new vs existing), who holds the server key, and the sender ID.
  **Owner:** Founder
- [x] **Decision: Integration Service hosting.** → Modal Starter
  (free tier), backend on default Modal URL, frontend on custom domain
  (decided 5 Nov 2026 — see `docs/phase0/decisions.md` D1). **Owner:** Founder
- [ ] **Decision: Integration Service repo.** Separate repo (recommended —
  shared across products) or inside the Suite repo. **Owner:** Founder
- [ ] **Decision: deployment topology.** Embedded Suite module first
  (recommended) or standalone from day one. **Owner:** Founder
- [ ] **Decision: business model.** Bundled with Suite, or subscription
  add-on like the Chatbot? (No figures.) **Owner:** Founder
- [ ] **Decision: concurrent sessions.** Cap simultaneous staff sessions
  per account? Yes/no + number. **Owner:** Founder
- [ ] **Decision: data retention.** Confirm 12-month logs / 24-month
  tickets + photos (§8.4) or change. **Owner:** Founder
- [ ] **Decision: governing law / jurisdiction** for the Terms (§9).
  **Owner:** Founder + counsel
- [ ] **Account: Play Store publisher.** Use the existing account or create
  one for ViveScript ($25 one-time, founder pays). **Owner:** Founder
- [ ] **Account: Apple?** Out of scope — iOS is not in this roadmap.
  Record the decision so it isn't re-litigated. **Owner:** Founder
- [ ] **Legal: counsel engaged** for the four legal pages (§9) before any
  paying property. **Owner:** Founder

### 🔒 Security gate — Phase 0
- [x] Auth spike answered in writing (no build starts on an assumed token model)
- [ ] Threat model sketched: assets (staff creds, room state, photos),
  attackers (stolen device, malicious staff, network attacker), top 5 risks
  with mitigations mapped to §8

---

## Phase 1 — Hackyard ship (Yard #6, Offline)

**Goal:** ship the MVP + demo video before Sat 7 Nov 2026, 00:00 Dhaka.
**Exit:** submitted on the Yard page (repo + video + writeup + screenshot).

- [x] PWA built: rooms, statuses, checklists, tickets, dashboard, offline-proof page
- [x] Verified: zero external requests, service worker caches, renders from seed data
- [x] Repo created: `swopno1/roomready` (public, `main`)
- [x] Code pushed (commit `5fa1250`) + PWA icons (commit `8c47082`)
- [x] Production plan v1.0–v1.1 written (`docs/PLAN.md` + `/docs` route)
- [ ] **Demo video:** record with the internet OFF on camera (airplane mode
  visible → app still works: tick a checklist, add a ticket). ≤ 3 min.
  **Owner:** Cosmo (rig) + Founder (voiceover if needed)
- [ ] **Writeup + screenshot** for the Yard page (short: what it is, why
  offline, how the test works). **Owner:** Cosmo
- [ ] **Submit on the Yard page** (repo + video + writeup + screenshot)
  before Sat 7 Nov, 00:00 Dhaka. **Owner:** Founder (submit click)
- [ ] **Rank after lock:** rank a top 3 + one line on #1 (required to be
  eligible to win). **Owner:** Founder

### 🔒 Security gate — Phase 1
- [x] No secrets in the repo (`.env.example` placeholders only — verified)
- [x] No guest PII in seed/demo data (fictional staff names only)
- [ ] Video shows no real credentials, no real guest data

---

## Phase 2 — Suite wiring (pilot-ready PWA + Integration Service)

**Goal:** a real property's live rooms in RoomReady, with checkout driving
turnover and check-in blocked until Ready. Pilot-ready.
**Exit:** pilot property (Krishnachura Retreat, §13) runs a full turnover
week on the PWA with zero demo data.

### 2A. Suite side (Suite repo — Muse Code)

- [ ] **Design window (10–21 Nov): API contract freeze.** §4.3 endpoints
  frozen — method, path, body, error codes. Any change after freeze needs
  a version bump.
- [ ] **Design window (10–21 Nov): role matrix sign-off.** §7.3 reviewed
  with the founder; every cell confirmed.
- [ ] Build the §4.3 API endpoints (rooms, status, templates, tickets,
  sync, assignments, report). All nine, versioned `/api/v1`.
- [ ] Auth introspection endpoint `POST /api/v1/auth/introspect` for the
  Integration Service (from S1: validates session token, returns
  user/workspace/role/expiry; service key; `tokenVersion` check) +
  `session.maxAge` → 24h + `tokenVersion` on `User`.
- [ ] **Check-in guard:** block check-in until room is Ready/Inspected
  (§4.2 step 4). Suite-repo change — RoomReady cannot do this alone.
- [ ] Checkout → turnover job trigger (room → Dirty, checklist reset,
  assign on-duty staff).
- [ ] Event delivery (webhook or SSE) for `booking.checked_out`,
  `booking.checked_in`, `room.status_changed`, `ticket.assigned` (§4.3).
- [ ] Role flag: Supervisor (Housekeeping + inspection rights) (§7.3).
- [ ] Audit log writes for every status change (who/when/device/property).
- [ ] Sync-health dashboard widget: per-device last-sync, pending-outbox
  age, failed-operation counts (§3.3, §10.3).
- [ ] Device list + revoke UI in Suite admin; lost/stolen device procedure
  doc (§7.2).
- [ ] Build 2FA enforcement for Owner/Manager at Suite login — S1 found
  no 2FA exists today (credentials-only), so this is build work, not
  verification (§7.4).
- [ ] Property setup wizard: import units → import staff → pick templates
  → assign on-duty staff (§4.6).
- [ ] Photo storage backend (from Phase-0 spike) wired to ticket/checklist
  photo fields.
- [ ] Rate limiting on sync + login endpoints (§8.1).
- [ ] IP hashing after 30 days in the audit log (§8.1).

### 2B. Integration Service (Python/FastAPI — new repo)

- [ ] Scaffold: FastAPI + Pydantic + SQLAlchemy, Docker, health endpoint,
  structured logging (no PII).
- [ ] Uptime monitor + status page hooks (the health endpoint is consumed
  by the external monitor, §10.3).
- [ ] Sync endpoint: outbox replay with idempotency ledger + conflict
  rules (§3.3). Unit tests for every conflict rule.
- [ ] Token validation against Suite via the introspection endpoint
  (from S1: POST session token, service key, ~60s cache; no shared
  `NEXTAUTH_SECRET`).
- [ ] Push delivery (FCM): assignment, urgent ticket, inspection failed.
- [ ] Photo upload endpoint (resumable, virus-scan hook — ClamAV or
  provider scan before serving).
- [ ] Background jobs: ticket SLA watcher, stale-outbox alerts.
- [ ] Deploy to the Phase-0 host (staging first), CI: ruff, mypy, pytest.

### 2C. PWA (this repo — Cosmo)

- [ ] **Move SW registration out of inline `<script>` into `app.js`**
  (the plan's CSP forbids inline scripts — the MVP violates it today).
- [ ] IndexedDB store via Dexie (replaces `localStorage`); one-time
  migration of the MVP blob on first launch.
- [ ] Outbox queue + sync engine (§3.3) with pending-count UI.
- [ ] Suite SSO login (shared session when embedded; §7.1).
- [ ] Live rooms from Suite (import; demo seed wiped on first import).
- [ ] Supervisor inspection + sign-off (+ re-open with reason).
- [ ] Room notes with history (not just latest).
- [ ] Checklist templates per room type (Suite admin UI).
- [ ] Ticket assignment + status timeline.
- [ ] Photo evidence (capture offline → upload on sync → pending state).
- [ ] Bengali + English UI.
- [ ] Shared-device mode (wipe local data on logout) (§8.3).
- [ ] Service-worker update prompt (new version available, never a forced
  reload mid-shift) (§10.2).
- [ ] Install prompt + install guidance for staff devices (§2.1).
- [ ] Strict CSP headers + security headers on staging (target: A).

### 2D. Pilot

- [ ] Staging deploy + pilot data (anonymised) loaded.
- [ ] Pilot week at Krishnachura Retreat: real staff, real rooms,
  feedback log. **Owner:** Founder (staff) + Cosmo (fixes)
- [ ] Pilot retro: what broke offline, what confused staff, what to fix
  before launch.
- [ ] Staff quick-start guide (EN + BN, one page) + onboarding briefing,
  including the photo policy (§8.4). **Owner:** Cosmo (draft) + Founder (staff)
- [ ] Support channel for pilot staff (email/WhatsApp) + FAQ.
  **Owner:** Founder

### 2E. Environments (§10.1)

- [ ] Create `dev`, `staging`, `prod` (Vercel projects + env vars per env).
- [ ] Seed/demo data policy enforced: no real property data in `dev`, ever;
  staging uses an anonymised copy of pilot data only.
- [ ] Env/secret inventory started (`docs/security/secrets-inventory.md`,
  names only, never values) — §14.1 rule 2.

### 2F. Testing (§11)

- [ ] Vitest unit tests: store, sync engine (every conflict rule), status machine.
- [ ] Testing Library component tests: board, checklist, ticket form.
- [ ] Playwright E2E: full flows + offline run (context offline mode) +
  airplane-mode script.
- [ ] Device test plan: mid-range Android 10+, real airplane-mode test,
  camera, push.
- [ ] Accessibility pass (axe + manual keyboard/TalkBack) — WCAG 2.1 AA target.
- [ ] OWASP ZAP in CI against staging.
- [ ] Lighthouse CI with the §10.4 performance budgets enforced
  (first load < 2 s on 3G, offline open < 1 s, JS < 200 KB gzip).

### 2G. Legal pages — draft (§9, design window 10–21 Nov)

- [ ] Draft the four pages: Terms, Privacy Policy, Cookie Policy, DPA.
- [ ] Bengali summary of the Privacy Policy (before Bangladeshi pilot).
- [ ] Pages linked from the app settings screen + Play listing.
  (Counsel review stays in Phase 5 — draft now, sign off later.)

### 2H. Design system (docs/DESIGN.md)

- [ ] **Founder picks:** tagline (§1.3) + logo mark direction (§1.4).
- [ ] Designer delivers the mark + icon set (§1.5); Cosmo replaces the
  placeholder brand mark + PWA icons in place (same filenames, §2.2)
  and adds the maskable 512 icon + Apple touch icon + favicon set.
- [ ] `design-tokens.json` created (one source of truth, §5.1); PWA
  consumes it as CSS custom properties (light / dark / high-contrast).
- [ ] Top tabs replaced by the five-item bottom nav (§3): Home | Rooms |
  Tickets | Activity | Profile — routes, badges, desktop left rail.
- [ ] Screens rebuilt to §4: Home, Rooms, Room detail, Tickets, Ticket
  detail, Activity (incl. the offline-proof block), Profile.
- [ ] Status pills, checklist rows, cards, bottom sheets, toasts, offline
  banner built to §6 (44 px targets, no colour-only status).
- [ ] In-app icon set drawn (§7): 24 px stroke set, inline SVG.
- [ ] Theme switcher in Profile (auto / light / dark / high-contrast)
  + large-text toggle; contrast pairs verified ≥ 4.5:1 (§5.6).
- [ ] Bengali UI strings in place (Phase 2 language work, §9).

### 🔒 Security gate — Phase 2
- [ ] Auth spike answer implemented (no assumed token model in prod code)
- [ ] Role enforcement tested server-side (each role × each action, §7.3)
- [ ] CSP live on staging with zero inline scripts; headers score A
- [ ] `npm audit` 0 critical/high; `pip-audit` 0 critical/high
- [ ] Secret scan 0 alerts; no keys in client bundle or APK
- [ ] Audit log verified end-to-end (status change → Suite log row)
- [ ] Device revoke tested (revoke → sync stops → local wipe on launch)
- [ ] No demo/seed data reachable in staging or prod
- [ ] Photo PII policy (§8.4) briefed to pilot staff

---

## Phase 3 — Native Android

**Goal:** the same product as a real native app on the Play Store.
**Exit:** closed-track beta with pilot staff passing the airplane-mode test
on a real device.

- [ ] Scaffold: Kotlin, Jetpack Compose, MVVM + Hilt, Gradle (Kotlin DSL).
  Modules: `app`, `data`, `sync`, `core` (§6.1). **Owner:** TBD (founder assigns)
- [ ] Room (encrypted SQLite + SQLCipher) with the §3.2 schema.
- [ ] Outbox + WorkManager sync (same protocol as the PWA, §3.3).
- [ ] Auth: OAuth + PKCE via Custom Tabs; tokens in Keystore-backed
  secure storage (§7.1).
- [ ] Screens mirror the PWA: board, room detail + checklist, tickets,
  dashboard, offline-proof.
- [ ] CameraX photo evidence (with the §8.4 photo reminder on-screen).
- [ ] FCM push (assignment, urgent ticket, inspection failed).
- [ ] Play listing: title, descriptions, screenshots (incl. offline proof),
  privacy policy URL (§9), data safety section. **Owner:** Founder + Cosmo
- [ ] Play content rating questionnaire completed (staff-only tool, no
  public user content).
- [ ] API backwards-compat discipline: expand → migrate → contract; the app
  works against the previous two API versions (§6.5, §14.1 rule 5).
- [ ] Internal track → closed track (pilot staff). Staged rollout plan.
- [ ] Device test: mid-range Android 10+, airplane-mode test, camera, push.

### 🔒 Security gate — Phase 3
- [ ] APK contains no hardcoded keys/secrets (automated check in CI)
- [ ] SQLCipher verified (DB file unreadable without the key)
- [ ] Tokens in Keystore-backed storage (not plain SharedPreferences)
- [ ] Play data safety section matches actual collection (no over-claims)
- [ ] Airplane-mode test passed on a real device (recorded)

---

## Phase 4 — Pro features & hardening

**Goal:** the product a multi-property operator would pay for.
**Exit:** all P0/P1 Phase-3 features (§5.3) live behind the pilot's feedback.

- [ ] Inventory / consumables tracking (linen, toiletries) + low-stock
  alerts to storekeeper.
- [ ] Lost & found log (item, room, date, photo, status).
- [ ] Reports & analytics (turnover time, rooms/staff/day, ticket SLA,
  property health) + export.
- [ ] Staff shift view (read-only; managed in Suite).
- [ ] Multi-property switcher (property-scoped data throughout).
- [ ] Dark mode + large-text mode (WCAG 2.1 AA).
- [ ] Staff messaging (offline-queued, per property, never guest-facing).
- [ ] Deep link from Suite (room → RoomReady room view).
- [ ] Data export / offboarding: a churning property exports its
  housekeeping data (ties to TOS export window, §9).
- [ ] Retention jobs: anonymise housekeeping logs after 12 months, delete
  tickets + photos after 24 months (§8.4).
- [ ] Cross-property isolation tests: staff of property A cannot read
  property B's data (rooms, tickets, reports).
- [ ] Accessibility audit (axe + TalkBack pass) → fix list closed.

### 🔒 Security gate — Phase 4
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Reports show only the viewer's property + role (§7.3)
- [ ] Export produces only the requesting property's data (no cross-property leak)
- [ ] Dependency review (monthly cadence running, §8.2)

---

## Phase 5 — Production launch & growth

**Goal:** live for paying Suite properties, with the launch discipline to
stay live.
**Exit:** production launch complete, first property live, launch retro filed.

- [ ] **Pen-test:** one external penetration test; all findings fixed
  before launch (§8.2).
- [ ] **Legal sign-off:** four legal pages reviewed by counsel (§9);
  Bengali Privacy summary published.
- [ ] **Release checklist (§10.5)** run green on staging.
- [ ] Production launch (PWA) for Suite properties; Android staged rollout
  10% → 50% → 100% with halt criteria.
- [ ] Status page live; on-call rotation agreed (solo founder = founder
  + Cosmo alerting).
- [ ] Launch retro + first-month metrics (sync health, turnover times,
  ticket SLA, crash rate).
- [ ] **Integration Service reuse, first candidate:** pick the next product
  (WorkRoster / Estavo / Chatbot) to adopt the shared sync/push backbone
  (§2.2) — one design note, not a build commitment.

### Phase 5B — Production wiring & deployment (PLAN.md §14 — the final piece)

**Goal:** the wiring map is real, the runbook is rehearsed, and the launch
is a sequence, not a hope.
**Exit:** §14.4 readiness checklist all green + dress rehearsal passed.

- [ ] Wiring map (§14.1) written and verified live — every row checked
  against production (hosts, domains, auth, TLS).
- [ ] Env/secret inventory completed and audited; zero secrets in any repo,
  client bundle or APK (§14.1 rule 2).
- [ ] DNS + TLS verified on every production host (PWA, Integration
  Service, property subdomains).
- [ ] CORS tested from the real origins (Phase B — exact allowlist, no wildcard).
- [ ] Health endpoints green on all three components; uptime monitor +
  status page live; test alert fired and received.
- [ ] Sentry live on all three components (PWA, Integration Service,
  Android) with PII scrubbing on; alert on error spikes + sync-failure
  rate > 1% (§10.3).
- [ ] Sync observability live on the Suite dashboard (per-property
  pending-outbox age, failed ops, last-sync per device).
- [ ] Verify PITR enabled on the Suite DB (point-in-time recovery on).
- [ ] Dress rehearsal: run the full §14.2 runbook end-to-end on staging,
  including a simulated failure + rollback.
- [ ] Smoke test suite (§14.3) run on production — all nine checks green.
- [ ] Rollback rehearsed: Vercel instant rollback + previous container
  image + Play staged halt.
- [ ] Go-live comms sent (pilot property: change window, what's new, who
  to call); status page updated.
- [ ] 48-hour monitoring window staffed; no deploys except hotfixes.
- [ ] Launch retro filed within a week of go-live.
- [ ] Standing item: `PLAN.md` + this to-do updated at every phase close
  (docs stay true to the build).

### 🔒 Security gate — Phase 5 (launch gate — all must pass)
- [ ] Pen-test complete, findings fixed + retested
- [ ] Legal pages live + counsel sign-off
- [ ] Headers score A on production
- [ ] Backup restore drill passed (quarterly cadence starts)
- [ ] Incident response runbook (`docs/security/runbook.md`) written +
  tabletop drill done
- [ ] Rollback tested (Vercel rollback + Play staged halt)
- [ ] **§14.4 production readiness checklist all green** (wiring verified,
  secrets audited, smoke tests green, dress rehearsal passed)

---

## Decisions (from PLAN.md §13 — tracked here so they close)

- [x] Android path: native Kotlin + Python FastAPI (confirmed 5 Nov 2026)
- [x] Integration Service hosting → Modal Starter (Phase 0)
- [ ] Integration Service repo: separate vs Suite repo (Phase 0)
- [ ] Deployment topology: embedded first vs standalone (Phase 0)
- [ ] Business model: bundled vs add-on subscription (Phase 0)
- [ ] Pilot property: Krishnachura Retreat vs another (Phase 0)
- [ ] Governing law / jurisdiction (Phase 0)
- [ ] Data retention periods (Phase 0)
- [ ] Concurrent sessions cap (Phase 0)
- [ ] Play Store account: existing vs new (Phase 0)
- [ ] Analytics: none vs privacy-respecting later (Phase 0)

---

## Coverage — every PLAN.md section maps to work here

This table is the 100% check. If a plan section has no row, the to-do is
incomplete.

| PLAN.md section | Covered in |
|---|---|
| §1 Product definition | Phase 1 (MVP), Phase 2 (pilot) |
| §1.6 Business opportunity | Phase 0 (model decision), Phase 5 (reuse candidate) |
| §2.1 PWA | Phase 1 (built), Phase 2C (install prompt, SW update prompt) |
| §2.2 Android + Python service | Phase 3 (Android), Phase 2B (Integration Service) |
| §2.3 Platform principles | Phase 0 (spikes), Phase 2 (one contract, one protocol) |
| §3.1 System diagram | Phase 5B (wiring map §14.1 verified live) |
| §3.2 Local store migration | Phase 2C (IndexedDB + migration) |
| §3.3 Sync engine | Phase 2B (endpoint + conflict tests), Phase 2C (outbox) |
| §3.4 API style | Phase 2A (versioned API), Phase 2B (Pydantic), Phase 3 (compat) |
| §4.1 Source of truth | Phase 2A (endpoints), Phase 2C (live import) |
| §4.2 Turnover loop | Phase 2A (trigger + check-in guard) |
| §4.3 API contract | Phase 0 (inventory spike), Phase 2A (freeze + build), Phase 2A (events) |
| §4.4 Data mapping | Phase 2A (wizard import) |
| §4.5 Deployment topology | Phase 0 (topology decision + embedding spike), Phase 5B |
| §4.6 Migration from MVP | Phase 2A (wizard), Phase 2C (demo wipe) |
| §5.1 Phase 1 MVP | Phase 1 (all items) |
| §5.2 Phase 2 features | Phase 2A–2G |
| §5.3 Phase 3 features | Phase 3 + Phase 4 |
| §5.4 Out of scope | Enforced — no items; anything here goes to the Suite roadmap |
| §6.1 Android build | Phase 3 |
| §6.2 Play listing | Phase 3 (listing, content rating, staged rollout) |
| §6.3 Permissions | Phase 3 (permission justifications in listing) |
| §6.4 Offline on Android | Phase 3 (airplane-mode gate) |
| §6.5 Updates / version skew | Phase 3 (compat discipline), Phase 5B (rollback) |
| §7.1 Authentication | Phase 0 (auth spike), Phase 2B (token validation), Phase 2C (SSO), Phase 3 (PKCE) |
| §7.2 Device trust | Phase 2A (list/revoke UI + procedure), Phase 2 gate (revoke test) |
| §7.3 Role matrix | Phase 2A (sign-off + flag), Phase 2 gate (server-side tests) |
| §7.4 2FA | Phase 2A (verify enforcement) |
| §8.1 Standards | Phase 2 gates (CSP, headers, audit, rate limits), Phase 3 gate (APK) |
| §8.2 Measurements | Phase 4 gate (dep review), Phase 5 + 5B (pen-test, drills, uptime) |
| §8.3 On-device security | Phase 2C (shared-device mode), Phase 3 gate (SQLCipher, Keystore) |
| §8.4 Data protection | Phase 2D (photo policy briefing), Phase 4 (retention jobs), Phase 2A (IP hashing) |
| §8.5 Compliance | Phase 2G (DPA draft), Phase 5 (counsel sign-off) |
| §9 Legal pages | Phase 2G (draft), Phase 5 (sign-off + live) |
| §10.1 Environments | Phase 2E |
| §10.2 Hosting & CI/CD | Phase 2B (deploy + CI), Phase 3 (Play tracks) |
| §10.3 Monitoring | Phase 2B (uptime hooks), Phase 5B (Sentry, status page, alerts) |
| §10.4 Performance budgets | Phase 2F (Lighthouse CI) |
| §10.5 Release checklist | Phase 5 (run green) + Phase 5B (runbook) |
| §11 Testing & QA | Phase 2F (full suite), Phase 3 (device), Phase 4 (a11y audit) |
| §12 Roadmap | Phases 0–5B in order; §14 rehearsed before launch |
| §13 Decisions | Decisions section above (all tracked) |
| §14 Production wiring & deployment | **Phase 5B** (wiring, runbook, dress rehearsal, smoke tests) |
| DESIGN.md (branding & design plan) | Phase 2H (tokens, bottom nav, screens, icons) + Phase 3 (Android applies the same tokens + adaptive icon) |

---

*To-do prepared 5 November 2026 by Cosmo for Md Amir Hossain.
Companion to `PLAN.md` v1.3. Nothing here is a commitment to a date —
phases close on their exit criteria and security gates, not on the calendar.*
