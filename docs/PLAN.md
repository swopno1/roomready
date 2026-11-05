# RoomReady — Production Plan

**Version:** 1.3 — draft for founder review (re-validated 5 Nov 2026:
added §14 production wiring & deployment runbook; to-do coverage audit
complete — every plan section maps to work)
**Date:** 5 November 2026
**Status:** Plan only. No app code changes accompany this document.
**Repo:** [swopno1/roomready](https://github.com/swopno1/roomready)
**Related:** [ViveReply Suite](https://www.vivereply.com/suite) (Resort PMS + direct booking),
`client/demo1` (Krishnachura Retreat demo property)

> **How to read this plan.** Sections 1–4 are the product and the wiring.
> Sections 5–6 are what gets built, in what order. Sections 7–9 are the
> obligations (auth, security, legal) that make it production-grade.
> Section 10 is how it ships. Section 13 lists the decisions only the
> founder can make. **Section 14 is the final piece: the production wiring
> map and the deployment runbook** — how the pieces connect when live, and
> the exact sequence that takes the product from staging to a paying
> property. Anything marked **TBD** is a real open question, not a detail
> to invent later.

---

## 1. Product definition

### 1.1 One line

**RoomReady is the offline-first housekeeping companion for resorts running
ViveReply Suite: room turnover, checklists and maintenance tickets that work
with zero internet.**

### 1.2 The problem

Resort staff work where the wifi doesn't reach — hillside villas, basements,
remote properties. Housekeeping runs on radios, paper and memory. When the
network drops, the front desk loses sight of which rooms are actually ready,
and a guest is walked to a dirty room. RoomReady exists so the work never
stops when the network does, and so the Suite always knows the true state of
every room.

### 1.3 Users

| User | What they do in RoomReady |
|---|---|
| Housekeeping staff | Tick turnover checklists, update room status, raise tickets, add room notes |
| Housekeeping supervisor | Assign rooms, inspect and sign off, re-open failed inspections |
| Maintenance staff | Pick up tickets, update progress, mark resolved with photo proof |
| Front desk / manager | Read the readiness board; the Suite blocks check-in until a room is Ready/Inspected (§4.2) |
| Resort owner | Reports: turnover time, rooms per staff per day, ticket SLA, property health |

### 1.4 The offline promise (non-negotiable)

1. The app opens and works with airplane mode on — first load caches
   everything, later loads need no network at all.
2. Every action a staff member takes offline is stored on-device and synced
   when connectivity returns. No work is ever lost to a dead zone.
3. The demo video proves it: the airplane-mode test is the product's core
   claim, and every release must pass it before shipping.

### 1.5 Non-goals

- RoomReady is **not** a booking engine, a PMS, or a guest-facing app. The
  Suite owns reservations, rates, payments and guest data.
- RoomReady stores **no guest personal data** by design (see §8.4). Rooms are
  identified by unit; bookings are referenced by ID only.
- No real-time chat, no guest messaging, no OTA sync. Those belong to the
  Suite roadmap, not this product.

### 1.6 Business opportunity

- **The wedge.** Incumbent housekeeping modules (Cloudbeds, Mews and the
  like) assume connectivity. Bangladeshi resorts — hillside properties,
  patchy wifi, staff on the floor — do not have it. Offline-first is the
  differentiator, and it is demonstrable in 30 seconds: airplane mode on,
  app still works. No competitor demo does that.
- **Where revenue attaches.** RoomReady earns its keep in **Phase 2**,
  not at the Android launch. A working housekeeping module in the Suite
  demo makes Suite deals easier to close, and RoomReady is a future
  add-on revenue line in the same shape as the Chatbot subscription
  (model TBD, §13 — no figures in this plan). The Android app extends
  reach; it does not create the revenue.
- **Platform asset.** The Python Integration Service (§2.2) is the second
  revenue lever: built once for RoomReady, it becomes the shared sync,
  push and jobs backbone for WorkRoster, Estavo and the Chatbot — one
  lightweight service family instead of one integration per product.
  Every product after RoomReady gets cheaper to integrate.
- **Revenue-first sequencing.** Under the founder's revenue-first
  directive, Phase 2 (Suite wiring + pilot at a real property) outranks
  Phase 3 (Android). If time gets short, Android slips; the Suite-wired
  PWA does not.

---

## 2. Platforms

Two clients, one contract. The PWA is the web surface; native Android is
the store surface. Both implement the same API contract and sync protocol
(§3.3), and both are backed by the same Python integration service (§3.1).

### 2.1 PWA (web) — the primary surface, already built (Hackyard MVP)

- Vanilla HTML/CSS/JS, zero dependencies, zero network calls.
- Service worker (cache-first app shell), `localStorage` in the MVP,
  installable via Web App Manifest.
- Runs on any modern browser; installable on Android and desktop from the
  browser. This is the surface staff use on shared tablets and phones.

### 2.2 Android app — native Kotlin + Python FastAPI service (founder preference, 5 Nov 2026)

**Founder preference:** native Android, with Python (or another lightweight
stack) behind it — light, secure, reliable, and able to integrate with the
other ViveScript products. Next.js is fine, but for this purpose the stack
should stay lightweight.

The stack, in two parts:

**Native Android (Kotlin).** Kotlin + Jetpack Compose UI, Room (encrypted
SQLite) for the on-device store, WorkManager for background sync, Retrofit
for the API, CameraX for photo evidence, FCM for push. No WebView: the app
is fully native, which is what makes it fast on the low-end devices staff
actually carry, and gives real offline behaviour (encrypted store, scheduled
sync, camera) that a web wrapper can only approximate.

**Python Integration Service (FastAPI).** A small, single-container Python
service that owns the server side of the product: the sync endpoint (outbox
replay, idempotency, conflict resolution), push delivery, photo uploads and
background jobs. Why Python here:

- **Light:** one container, ~256–512 MB RAM, no heavy runtime. FastAPI is
  async and fast enough for a sync workload without a JVM or Node cluster.
- **Secure:** Pydantic validation on every boundary, fully typed, small
  dependency surface.
- **Reliable:** typed, tested (pytest), boring in the good way — it does a
  few jobs and does them the same way every time.
- **Integratable:** this is the strategic point. The service is built as
  the shared backbone for all ViveScript products — the same sync, push
  and jobs layer can later serve WorkRoster, Estavo and the Chatbot, instead
  of each product growing its own integration. One lightweight service
  family, not one integration per product.

Why not the alternatives:

| Option | Verdict |
|---|---|
| **Native Kotlin + FastAPI (chosen)** | Best offline behaviour, best Play presence, lightest server, shared backbone for other products. More build effort than a wrapper — accepted deliberately. |
| Capacitor / TWA wrapper | Less native work, but a WebView app with wrapper-grade offline behaviour and no shared service layer. Rejected per founder preference for native + Python. |
| React Native / Flutter | Cross-platform, but a second language/runtime to own, and neither is Python. Heavier than the Kotlin + FastAPI combination for this team of one. |

The PWA stays as the web surface — it is already built and working, and
both clients implement the same contract (§4.3).

### 2.3 Platform principles

- **Offline-first on both surfaces.** The Android app must pass the same
  airplane-mode test as the PWA.
- **One API contract, one sync protocol.** The PWA and native Android
  implement the same contract (§4.3) and the same outbox protocol (§3.3).
  The server-side sync logic lives once, in the Python service — not
  duplicated per client.
- **No platform-only features in Phase 2.** Anything built for Android
  (photo evidence, push) must degrade gracefully on the PWA, not fork it.
- **Shared service layer.** The Python Integration Service is built to be
  reused: the same sync, push and jobs backbone can later serve WorkRoster,
  Estavo and the Chatbot — one lightweight service family, not one
  integration per product.
- **Design.** The visual system — brand, logo + icon plan, bottom nav,
  screens, themed colour tokens — lives in `docs/DESIGN.md`. Build work
  follows it; no screen ships off-spec.

---

## 3. Architecture

### 3.1 System diagram (text)

```
Staff device (PWA / native Android)
  ├─ PWA shell (HTML/CSS/JS, cached by service worker)
  │   — or — native UI (Kotlin, Jetpack Compose)
  ├─ Local store (IndexedDB on web — §3.2; Room/SQLite on Android)
  ├─ Sync engine: outbox queue + background sync (§3.3)
  └─ Auth: Suite session / token (§7)
        │  HTTPS, only when online
        ▼
ViveScript Integration Service (Python, FastAPI)
  ├─ Sync endpoint (outbox replay, idempotency, conflicts)
  ├─ Push delivery (FCM), photo uploads, background jobs
  └─ Validates Suite-issued tokens; fronts the Suite API
        │
        ▼
ViveReply Suite API  (Next.js, same deployment — §4.5)
  ├─ Rooms, units, reservations (source of truth)
  ├─ Housekeeping status + log, tickets, checklists
  └─ Staff, roles, audit log
        │
        ▼
Suite DB (Supabase Postgres + Prisma)
```

### 3.2 Local store — migration path

| Stage | Store | Notes |
|---|---|---|
| MVP (now) | `localStorage`, key `roomready.v1` | Simple, reliable, enough for 21 rooms. Single JSON blob. |
| Phase 2 | **IndexedDB** via Dexie (or localForage) | Per-record storage, queries, larger data, proper indexes. Migration: one-time import of the `localStorage` blob on first Phase-2 launch. |
| Android | **Room (SQLite) + SQLCipher**, Kotlin | Same schema as IndexedDB, encrypted at rest (§8.3). |

Schema (core tables, all records carry `property_id`, `updated_at`,
`updated_by`, `deleted_at` for soft delete):

- `rooms` — id, property_id, unit_id (Suite), name, type, status, assignee,
  note
- `checklist_items` — id, room_id, template_item_id, done, done_by, done_at
- `checklist_templates` — id, property_id, room_type, items[]
- `tickets` — id, property_id, room_id, title, priority, status,
  created_by, assigned_to, photo_urls[], resolved_at
- `status_log` — id, room_id, from_status, to_status, by, at, device_id
- `sync_outbox` — id, operation, payload, idempotency_key, attempts, status

### 3.3 Sync engine

- **Outbox pattern.** Every mutation writes locally first, then appends an
  outbox entry. The engine replays the outbox when online, oldest first.
- **Idempotency keys.** Every outbox entry carries a UUID. Replays are safe:
  the server ignores duplicates.
- **Conflict rules (server is the arbiter, but merges where safe):**
  - Checklist items: union merge — a tick on either side wins.
  - Room status: last-write-wins by server timestamp.
  - Tickets: server wins on status transitions; client wins on new tickets.
  - Notes: last-write-wins, with both versions kept in the status log.
- **Background sync.** Web: Background Sync API where available, plus retry
  on app foreground. Android: WorkManager periodic sync + immediate sync on
  connectivity change.
- **Sync health.** The app shows pending-change count; the Suite dashboard
  shows per-device last-sync time and failed-operation alerts.
- **Server side.** The sync endpoint, idempotency ledger and conflict
  resolution run in the Python Integration Service (§3.1), not in the
  Suite app — one implementation serves the PWA, Android, and future
  products.

### 3.4 API style

- REST, JSON, versioned (`/api/v1/...`). Pagination (cursor-based) on all
  list endpoints. Rate limits per property and per device.
- All mutations are authenticated (§7) and validated at the boundary
  (Zod schemas on the Suite/Next.js API, Pydantic models on the FastAPI
  service, Prisma parameterized queries underneath).
- No guest PII crosses this API (see §1.5, §8.4).

---

## 4. Wiring with ViveReply Suite

RoomReady is a Suite module first, a standalone product second. The Suite
is the source of truth; RoomReady is the offline edge that feeds it.

### 4.1 Source of truth

| Data | Owner | RoomReady's role |
|---|---|---|
| Properties, room units, room types | Suite | Read-only import. RoomReady never invents rooms. |
| Reservations, check-in/out | Suite | Drives turnover (§4.2). RoomReady never creates bookings. |
| Staff, roles, assignments | Suite | Read-only import + role mapping (§7.3). |
| Housekeeping status, checklists, tickets | **Shared** | RoomReady writes offline; Suite stores and serves the canonical state. |
| Audit log | Suite | Every status change lands here, with who/when/device. |

### 4.2 The turnover loop (the core integration)

1. Guest checks out (Suite) → Suite creates a turnover job: room →
   `Dirty`, checklist reset, assigned to on-duty housekeeping.
2. Staff open RoomReady (offline, on the floor) → see the room as Dirty →
   tick the checklist → status advances Dirty → Cleaning → Inspected.
3. Supervisor inspects and signs off → status `Ready`.
4. Suite releases the room for the next check-in. **Check-in is blocked
   until the room is Ready or Inspected** — the Suite enforces this, so a
   guest is never walked to a dirty room. **Note:** this guard does not
   exist in the Suite today. It is a Suite-repo change (check-in guard in
   the booking flow, Muse Code / founder-local scope), listed as a
   Phase-2 dependency in `docs/TO-DO.md` — not RoomReady work.
5. If inspection fails → room back to Dirty with a note; the loop repeats.
6. Maintenance issues found mid-turnover become tickets (§5), linked to the
   room and visible to the front desk.

### 4.3 API contract (draft — to freeze in Phase 2)

**Status: none of these endpoints exist in the Suite today.** The contract
below is proposed; all nine endpoints must be built in the Suite repo
(or fronted by the Integration Service) during Phase 2.

Base: `https://<property>.vivereply.com/api/v1` (embedded) or
`https://suite.vivereply.com/api/v1` (standalone). Auth: §7.

| Method & path | Purpose |
|---|---|
| `GET /properties/:id/rooms` | List room units with type, status, assignee |
| `GET /properties/:id/rooms/:unitId` | Room detail + checklist + open tickets |
| `PATCH /properties/:id/rooms/:unitId/status` | Change status (body: `to`, `note?`, `device_id`) |
| `GET /properties/:id/checklist-templates` | Templates per room type |
| `POST /properties/:id/tickets` | Create ticket |
| `PATCH /properties/:id/tickets/:ticketId` | Update ticket (status, assignee, priority) |
| `POST /properties/:id/sync` | Batch replay of the outbox (idempotency keys required) |
| `GET /properties/:id/staff/assignments` | Who is on duty, which rooms are theirs |
| `GET /properties/:id/housekeeping/report?from&to` | Turnover times, rooms/staff/day, ticket SLA |

Events (Suite → RoomReady, via webhook or SSE when online):
`booking.checked_out`, `booking.checked_in`, `room.status_changed`,
`ticket.assigned`.

### 4.4 Data mapping (Suite → RoomReady)

| Suite (client/demo1, verified) | RoomReady |
|---|---|
| Property (Krishnachura Retreat) | `property_id` scope on every record |
| Room unit (e.g. Terracotta Villa 01) | `rooms` row, `unit_id` link |
| Room-unit housekeeping status/log | `rooms.status` + `status_log` |
| Booking states (checked-in / checked-out) | Turnover triggers (§4.2) |
| Staff roles (Owner, Manager, Front Desk, Housekeeping, …) | Role mapping (§7.3) |
| Folio / cash-shift / night-audit | Out of scope — never touched |

> **S1 correction (5 Nov 2026):** the "Staff roles" row above was marked
> verified but is not — actual Suite roles are `MemberRole = OWNER /
> ADMIN / AGENT / VIEWER`. The Suite→RoomReady role mapping is TBD in S2.

### 4.5 Deployment topology (two phases)

- **Phase A — embedded module (first).** RoomReady ships inside the Suite
  deployment as a `/housekeeping` route of the same Next.js app. Same
  origin: no CORS, shared session cookie, shared auth, one deploy. The
  Python Integration Service runs alongside from Phase 2 and owns the sync
  endpoint, push delivery and photo uploads — the Suite app calls it, and
  the Android app talks to it directly. This is the fastest path to a
  pilot property. **Open spike (Phase 0):** the embedding mechanism —
  static PWA files under `public/housekeeping` vs a Next.js route wrapping
  the shell — is undecided and must be picked before Phase 2 build.
- **Phase B — standalone (later).** RoomReady PWA + Android point at the
  Integration Service as their single backend; the service fronts the
  Suite API. Needs CORS allowlist, token auth (Authorization Code + PKCE
  for Android, §7.1), and a public API stability commitment. Only after
  Phase A proves the sync engine in production.

### 4.6 Migration path from the Hackyard MVP

1. Property setup wizard (Suite admin): pick property → import room units
   → import staff → pick checklist templates → assign on-duty staff.
2. MVP `localStorage` seed data is **demo-only** and is wiped on first
   Suite import. No demo data ever ships to a real property.
3. The MVP's offline engine (service worker + outbox) carries over
   unchanged; only the store backend changes (§3.2).

---

## 5. Proposed features (phased)

Priority: **P0** = must have for that phase · **P1** = should have ·
**P2** = nice to have.

### 5.1 Phase 1 — Hackyard MVP (done, 6 Nov 2026)

| Feature | Status |
|---|---|
| Room board (21 rooms, 5 types) with status pills | Done |
| Status flow Dirty → Cleaning → Inspected → Ready (+ Out of order) | Done |
| 8-step turnover checklist per room | Done |
| Maintenance tickets (create, prioritise, resolve) | Done |
| Dashboard (counts, needs-attention, turnover) | Done |
| Offline-proof page (live network state, SW state, storage size) | Done |
| Service worker (cache-first), manifest, installable | Done |
| Search + status filter | Done |

### 5.2 Phase 2 — Suite wiring (pilot-ready)

| Feature | Priority | Notes |
|---|---|---|
| Suite SSO login (shared session when embedded) | P0 | §7 |
| Live rooms imported from Suite (no demo data) | P0 | §4.1 |
| Checkout → turnover job trigger | P0 | §4.2 |
| Check-in blocked until Ready/Inspected | P0 | Enforced by Suite |
| Staff assignment (who cleans which rooms) | P0 | From Suite staff + on-duty roster |
| Supervisor inspection + sign-off (+ re-open) | P0 | With reason + note |
| Photo evidence (before/after) on checklist + tickets | P1 | Stored on Suite, referenced by URL; captured offline, uploaded on sync |
| Room notes with history | P1 | Per-room note log, not just latest |
| Checklist templates per room type (editable by manager) | P1 | Suite admin UI |
| Ticket assignment + status timeline | P1 | |
| Offline queue + sync engine (§3.3) | P0 | The heart of Phase 2 |
| Multi-property switcher (staff working across properties) | P2 | Property-scoped data (§3.2) |
| Bengali + English UI | P1 | Suite is bilingual; RoomReady follows |

### 5.3 Phase 3 — Android + pro features

| Feature | Priority | Notes |
|---|---|---|
| Android app (native Kotlin, Play Store) | P0 | §6 |
| Push notifications (FCM): new assignment, urgent ticket, inspection failed | P0 | Android first; web push later |
| Background sync on Android (WorkManager) | P0 | §3.3 |
| Inventory / consumables tracking (linen, toiletries per room) | P1 | Low-stock alerts to storekeeper |
| Lost & found log (item, room, date, photo, status) | P1 | |
| Reports & analytics (turnover time, rooms/staff/day, ticket SLA, property health) | P1 | Suite dashboard + export |
| Staff shift view (who is on, what is theirs) | P1 | Read-only in RoomReady; managed in Suite |
| Dark mode + large-text mode (outdoor/glare + accessibility) | P1 | WCAG 2.1 AA (§11) |
| Staff messaging (offline-queued, per property) | P2 | Never guest-facing |
| Deep link from Suite (room → RoomReady room view) | P1 | |

### 5.4 Explicitly out of scope (do not build)

Guest-facing features, bookings, payments, rates, OTA sync, guest
messaging, housekeeping payroll, procurement. If a request belongs to the
Suite, it goes on the Suite roadmap, not here.

---

## 6. Android app plan (native Kotlin)

### 6.1 Build (native Kotlin)

- **Stack:** Kotlin, Jetpack Compose (UI), MVVM + Hilt (DI), Retrofit +
  OkHttp (network), Room + SQLCipher (encrypted on-device DB), WorkManager
  (background sync), DataStore (preferences), CameraX (photo evidence),
  FCM (push). No WebView — the app is fully native.
- **Modules:** `app` (UI + navigation), `data` (Room DAOs + Retrofit API),
  `sync` (outbox + WorkManager + conflict handling), `core` (auth, logging).
  The `sync` module implements the same outbox protocol as the PWA (§3.3).
- **Build:** Android Studio + Gradle (Kotlin DSL). `minSdk 26`
  (Android 8), `targetSdk` = latest stable at release.
- **Signing:** Play App Signing, upload key stored in the founder's password
  manager + CI secret. Never in the repo.
- **Versioning:** semver (`1.0.0`) + auto-incrementing `versionCode`.
  versionCode is the source of truth for Play ordering.
- **Python service (companion):** FastAPI + Pydantic + SQLAlchemy,
  packaged as one Docker container (§10.2). It owns the sync endpoint,
  push, photo uploads and background jobs — see §3.1.

### 6.2 Play Store listing

- Title: **RoomReady — Offline Housekeeping**. Short description (80 chars),
  full description, feature graphic + screenshots (including one that shows
  the offline badge / airplane-mode proof).
- **Privacy policy URL (required):** the hosted Privacy Policy (§9) — must
  exist before the first submission.
- Content rating questionnaire (no user-generated public content; staff-only
  tool). Data safety section: what is collected (staff account, room status,
  photos), what is shared (with the resort's own Suite only), encryption in
  transit + at rest.
- Release tracks: Internal → Closed (pilot property staff) → Production.
  Staged rollout (10% → 50% → 100%) with a halt criterion (crash rate,
  sync-failure rate).

### 6.3 Permissions (with Play justifications)

| Permission | Why |
|---|---|
| Camera | Photo evidence for checklists and tickets |
| Notifications (POST_NOTIFICATIONS) | Assignment + urgent-ticket alerts |
| Storage / media | On-device photo + data storage |
| Network state | Offline detection + sync triggers |
| No location, no contacts, no microphone | Not needed; do not request |

### 6.4 Offline on Android

- Same airplane-mode test as the PWA, run on a real device before every
  release. Room (encrypted SQLite) holds the store; WorkManager replays
  the outbox, including on connectivity change and on a periodic schedule.
- Photos captured offline are stored on-device and uploaded on sync with
  retry + resumable upload. A photo that fails to upload stays queued and
  visible as pending — never silently dropped.

### 6.5 Updates

- Store updates via Play (staged rollout) + in-app update API (flexible
  updates; immediate updates only for critical security fixes). Web shell
  updates via service worker (new version prompt, never a forced reload
  mid-shift). Version skew policy: the app must work against the previous
  two API versions.

---

## 7. Authentication & authorization (with ViveReply Suite)

RoomReady does not run its own identity system. The Suite is the identity
provider; RoomReady is a client of it.

> **Verified 5 Nov 2026 (Phase-0 spike S1 — see
> `docs/phase0/spikes/auth.md`).** The Suite runs NextAuth (v4)
> Credentials + JWT strategy (`apps/dashboard/src/lib/auth.ts`):
> email + scrypt password login, JWE-encrypted session cookie holding
> only the user id, 30-day default expiry (no `maxAge` configured),
> per-route enforcement via `withWorkspace`, no 2FA, no server-side
> session list. §7.1/§7.2/§7.4 below are revised to this reality; the
> 15-min/7-day token model originally written here is deferred to
> Phase B OAuth. Do not revert to the unverified design.

### 7.1 Authentication (how staff sign in)

| Surface | Mechanism |
|---|---|
| Embedded module (Phase A) | Shared Suite session cookie (`httpOnly`, `Secure`, `SameSite=Lax`). No separate login. Staff sign in to the Suite once. |
| Standalone PWA (Phase B) | OAuth 2.0 Authorization Code + PKCE against the Suite, tokens in memory + `httpOnly` refresh cookie. No tokens in `localStorage`. |
| Android app (Phase B) | Same OAuth + PKCE flow via Custom Tabs; tokens in EncryptedSharedPreferences / Android Keystore. |

Token policy (verified reality + Phase-2A changes):

- **Suite session (Phase A):** NextAuth session cookie, user id only.
  Scope (workspace/property) and role are resolved server-side per
  request, never carried in the token.
- **Lifetime:** 30 days today (NextAuth default); Phase 2A sets
  `session.maxAge` to **24 hours** (one line, per founder decision) to
  bound the stolen-token window.
- **Second-service validation:** introspection, not local verification.
  The Integration Service POSTs the client's session token to Suite
  `POST /api/v1/auth/introspect` (new Phase-2A endpoint, service key,
  ~60s result cache) and receives
  `{ userId, workspaceId, role, expiresAt }`. `NEXTAUTH_SECRET` is never
  shared out of the Suite. (Direct Python verification was rejected in
  S1: the tokens are JWE-encrypted and carry no scope/role.)
- **Phase B (deferred):** the short-lived access (15 min) + rotating
  refresh (7 day) + 30-day absolute model moves to the standalone
  OAuth + PKCE design. Not built in Phase 2.
- **Offline grace:** a cached session lets the app keep working offline for
  up to 7 days; on reconnect the token is revalidated via introspection
  (silently when still valid). Past 7 days offline, or with an expired or
  revoked token, the app requires re-authentication before syncing (local
  data stays readable, new syncs are blocked until auth succeeds).

### 7.2 Device trust

> None of this exists in the Suite today (S1: JWT strategy, no Session
> model) — all of it is Phase-2A build work, not verification.

- Each device gets a `device_id` on first login (stored server-side per user).
- Owners/managers can list and revoke devices from Suite admin.
- A revoked device stops syncing immediately; its local data is wiped on
  next launch (or next sync attempt, whichever comes first).
- Simple revocation: a `tokenVersion` counter on `User`, checked by the
  introspection endpoint — password change or admin revoke bumps it and
  outstanding tokens fail validation. (No full DB-session migration needed.)
- Lost/stolen device procedure: revoke from Suite admin → tokens dead →
  local data unreadable without the app's encrypted store (§8.3).
  Until 2A ships, the stolen-token window equals token lifetime (30d now,
  24h after the `maxAge` change).

### 7.3 Authorization — role matrix

> **S1 correction (5 Nov 2026):** the Suite's actual roles are
> `MemberRole = OWNER / ADMIN / AGENT / VIEWER`
> (`packages/db/prisma/schema.prisma`) — chat-workspace roles, not the
> hospitality list previously claimed here as "verified". The matrix below
> is the RoomReady-side target; S2 must define the Suite→RoomReady role
> mapping (or new Suite roles) before sign-off. Do not treat this matrix
> as agreed with the Suite until S2 lands.

Roles come from the Suite (mapping TBD in S2). RoomReady
uses the subset below; unlisted roles have **no access** to RoomReady.

| Action | Owner | Manager | Front Desk | Housekeeping | Supervisor* | Maintenance | Auditor |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| View readiness board | ✓ | ✓ | ✓ | own rooms | ✓ | tickets only | ✓ read-only |
| Change room status | ✓ | ✓ | — | own rooms | ✓ | — | — |
| Tick checklists | ✓ | ✓ | — | own rooms | ✓ | — | — |
| Inspect + sign off | ✓ | ✓ | — | — | ✓ | — | — |
| Re-open failed inspection | ✓ | ✓ | — | — | ✓ | — | — |
| Create tickets | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Resolve tickets | ✓ | ✓ | — | — | ✓ | ✓ | — |
| Assign rooms / staff | ✓ | ✓ | — | — | ✓ | — | — |
| Edit checklist templates | ✓ | ✓ | — | — | — | — | — |
| View reports | ✓ | ✓ | ✓ | own stats | ✓ | own stats | ✓ |
| Manage property settings | ✓ | — | — | — | — | — | — |

\* Supervisor is a Housekeeping role with inspection rights (a Suite role
flag, not a separate role). Front Desk is read-only in RoomReady except
ticket creation — check-in blocking (§4.2) is enforced by the Suite, not by
front-desk action in RoomReady.

**Enforcement:** roles are enforced server-side on every API call
(never trust the client). The client hides UI it can't use, but the API is
the real boundary. Every mutation is written to the audit log with
who/when/device/property.

### 7.4 Two-factor authentication

> S1: no 2FA exists in the Suite today (credentials-only login). All of
> this is Phase-2A build work, not verification.

- Owners and Managers: 2FA required (to be built at Suite login in 2A).
- Other roles: 2FA optional, recommended for supervisors.
- 2FA is enforced at Suite login; RoomReady inherits it (no separate 2FA).

---

## 8. Security — standards, measurements, policy

### 8.1 Standards (what we build to)

- **OWASP ASVS Level 2** as the baseline for the API and the app.
  (ASVS L1 for the MVP; L2 before a paying property goes live.)
- **OWASP Top 10 (2021)** — addressed explicitly in code review checklists.
- **TLS 1.2+** (1.3 preferred) everywhere; HSTS (`max-age=31536000`,
  `includeSubDomains`, preload when stable).
- **Content Security Policy:** strict CSP on the PWA shell (no inline
  scripts in the production build; nonces where needed). No `unsafe-inline`,
  no `unsafe-eval`. **Known violation in the MVP:** `index.html` currently
  registers the service worker with an inline `<script>` block. Before
  CSP is enforced (Phase 2), that registration must move into `app.js`
  (or use a nonce) — the plan's CSP and the shipped code disagree today,
  and the code must change to match the plan.
- **Headers:** `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN` (or `frame-ancestors 'self'`),
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (camera/microphone/geolocation off except where the
  app needs them, and only on the app's own origin).
- **CSRF:** `SameSite=Lax` cookies + anti-CSRF tokens on all mutations when
  cookie auth is used. Token auth (Phase B) uses `Authorization: Bearer`
  with no ambient credentials.
- **Input validation:** Zod schemas on every API boundary; Prisma
  parameterized queries underneath (no raw SQL with interpolation).
- **Secrets:** environment variables / Vercel env only. Never in the repo,
  never in the client bundle, never in logs. `.env.example` carries
  placeholders only.
- **Dependencies:** Dependabot on; `npm audit` in CI, failing the build on
  any **critical** finding and on **high** findings older than 14 days.
  Same bar for the Python service (`pip-audit` in CI) and Android (Gradle
  dependency verification + lint).
- **Rate limiting:** login (5 attempts / 15 min / IP + account lockout
  after 10), sync endpoint (per device, burst-tolerant), public routes.
- **Audit logging:** every auth event, role change, status change, ticket
  transition and device revoke — who, when, device, property, IP (hashed
  after 30 days).

### 8.2 Measurements (how we know we're meeting the standard)

| Measurement | Target |
|---|---|
| Security-headers score | A on securityheaders.com before launch |
| `npm audit` critical/high | 0 in CI at release time |
| Secret scanning (GitHub) | On, 0 unresolved alerts |
| Penetration test | One external pen-test before the first paying property; fixes before launch |
| Dependency review cadence | Monthly; critical patches within 48h |
| Incident response drill | Twice a year (tabletop) |
| Uptime (Suite API) | 99.9% monthly; status page for properties |
| Backup restore drill | Quarterly (Suite DB point-in-time recovery) |

**Incident response (summary):** detect (alerting on auth anomalies, sync
failures, error spikes) → contain (revoke tokens, disable device, block IP)
→ notify (affected property within 24h of confirmed breach) → fix → review
(blameless post-mortem, filed in the repo). Full runbook lives in
`docs/security/runbook.md` (to be written in Phase 2).

### 8.3 On-device / offline security

- **Android:** SQLite encrypted with SQLCipher; tokens in
  EncryptedSharedPreferences (Keystore-backed); photos in app-private
  storage (not shared media folders).
- **Web:** data lives in the browser profile (IndexedDB). Accept the
  browser's profile encryption; warn on shared devices (a "shared device"
  mode that wipes local data on logout).
- **No secrets on device:** API keys and service credentials never ship in
  the client. The client holds only the user's own tokens. No API keys or
  service credentials in the Android APK either — nothing hardcoded in
  `BuildConfig`, resources or the manifest.
- **Remote wipe:** revoke device (§7.2) → tokens dead, local store wiped
  on next launch.

### 8.4 Data protection & privacy (by design)

- **Minimisation:** RoomReady stores staff identity (name, role), room
  state, checklists, tickets, photos of rooms. It stores **no guest names,
  no guest contact details, no payment data**. Bookings are referenced by
  ID only; if a UI ever needs a guest name, it fetches it live from the
  Suite and never persists it on-device.
- **Photos.** Room photos can capture guest belongings or faces. Policy:
  staff photograph the room, not people; avoid guest belongings where
  possible; never photograph a guest. Photos are room evidence, kept with
  the ticket/checklist record for 24 months (§8.4), and deleted with it.
  Staff are briefed on this at onboarding; the app shows a one-line
  reminder on the camera screen.
- **Encryption:** in transit (TLS), at rest (Suite DB encryption, Android
  SQLCipher).
- **Retention:** housekeeping logs 12 months, then anonymised (staff IDs
  hashed) and archived; tickets with photos 24 months; audit log 24 months.
  (Founder to confirm — see §13.)
- **Access:** staff see only their own property (§7.3). Cross-property
  access needs an explicit owner grant.
- **Backups:** Suite DB point-in-time recovery; RoomReady has no separate
  backup (its data lives in the Suite DB once synced; unsynced on-device
  data is the device's responsibility until sync).

### 8.5 Compliance notes (not legal advice)

- **GDPR (EU guests/properties):** RoomReady is a processor of staff data
  and room-state data on behalf of the resort (controller). Needs a DPA
  (§9). Guest data is not processed by RoomReady by design.
- **Bangladesh:** no comprehensive data-protection law in force at the
  time of writing; follow GDPR-level practice anyway (it is the stricter
  bar and the one EU-facing properties will ask about).
- **Children's data:** none collected. Staff must be 18+ per the resort's
  employment.
- **Founder to confirm with counsel** before the first paying property.

---

## 9. Legal pages

All four pages live at `/legal/*` (PWA + Suite site) and are linked from
the Play Store listing and from the app's settings screen. They must exist
before the first Play submission and before the first paying property.

| Page | Route | Must cover |
|---|---|---|
| **Terms of Service** | `/legal/terms` | Who the service is for (resorts + their staff); the resort is the customer and is responsible for its staff accounts; acceptable use (no unlawful use, no scraping, no reverse engineering); service availability (best-effort uptime, maintenance windows); data ownership (the resort owns its property data; ViveScript owns the software); liability limits; termination (non-payment, abuse, with data export window); changes to terms (30 days' notice). |
| **Privacy Policy** | `/legal/privacy` | What is collected (staff account data, room state, checklists, tickets, photos, device + sync metadata, support messages); why (operating the service); what is **not** collected (no guest PII by design — §8.4); how long data is kept (§8.4); who data is shared with (the resort itself, hosting/sub-processors listed by name, nobody else); user rights (access, correction, deletion — via the resort admin or privacy@vivereply.com); cookies (§9.1); contact for privacy questions; children's data (none). |
| **Cookie Policy** | `/legal/cookies` | Strictly necessary cookies only (session, CSRF, preferences). No third-party tracking, no advertising cookies, no analytics cookies unless the founder explicitly adds privacy-respecting analytics later — in which case this page is updated first. |
| **Data Processing Addendum (DPA)** | `/legal/dpa` | Standard processor terms for EU properties: processor obligations, sub-processors (hosting, push provider), breach notification (within 72h of awareness), data-subject request handling, audit rights, return/deletion on termination. Based on the standard contractual clauses for transfers outside the EEA. |

### 9.1 Notes

- **B2B reality:** the resort is the customer; its staff are users under
  the resort's authority. Consent for staff data is handled through the
  resort's employment relationship; the Privacy Policy states this plainly.
- **Jurisdiction / governing law:** **TBD — founder + counsel.** ViveScript
  Solutions LLC is a Wyoming company; operations are in Bangladesh. The
  Terms must pick one governing law and stick to it.
- **Language:** English first; Bengali translation for the Privacy Policy
  summary before Bangladeshi pilot properties go live.
- **Review:** all four pages reviewed by counsel before the first paying
  property. This plan is not legal advice.

---

## 10. Production deployment

### 10.1 Environments

| Env | Purpose | Data |
|---|---|---|
| `dev` | Daily development | Seed/demo data only |
| `staging` | Pre-release verification, pilot-property UAT | Anonymised copy of pilot data |
| `prod` | Live properties | Real data, PITR backups on |

No real property data in `dev`. Ever.

### 10.2 Hosting & CI/CD

- **PWA shell:** Vercel (same project as the Suite in Phase A; separate
  project in Phase B). Immutable deploys, instant rollback, preview URL per
  PR.
- **API + DB:** the Suite's existing deployment (Next.js + Supabase
  Postgres + Prisma).
- **Integration Service (Python/FastAPI):** serverless on Modal
  Starter (free tier + founder credits — decided 5 Nov 2026, §13).
  A plain FastAPI app (container build kept for portability); stateless
  except for its small sync ledger (Postgres) and Modal Cron + Postgres
  for background jobs (Redis only if outgrown). Serves on Modal's default
  URL (unbranded accepted); the frontend keeps the custom domain. Health
  endpoint + zero-downtime deploys; logs shipped to the same sink as the
  Suite.
- **Android:** Play Internal track on every tagged release; promotion is
  manual (closed → production).
- **CI (GitHub Actions) on every PR:** web — lint, typecheck, unit tests,
  E2E (Playwright — including an offline-mode run), `npm audit`, secret
  scan; Python — ruff, mypy, pytest; Android — Gradle lint, unit tests.
  `main` deploys to staging automatically; production is a manual approval.
- **Caching rules:** app shell + static assets immutable (`max-age=1y`,
  content-hashed); API responses `no-store`; service-worker updates prompt
  the user (never a forced reload mid-shift).

### 10.3 Monitoring & reliability

- **Errors:** Sentry (client + API), with PII scrubbing on. Alert on error
  spikes and on sync-failure rate > 1%.
- **Uptime:** external check on the PWA shell + API health endpoint;
  status page for properties.
- **Sync observability:** per-property pending-outbox age, failed-operation
  counts, last-sync per device — visible on the Suite dashboard.
- **Logging:** structured logs, no PII, 30-day retention.
- **Backups:** Suite DB point-in-time recovery (tested quarterly, §8.2).
- **Rollback:** Vercel instant rollback for the shell; Play staged-halt
  for Android; API deploys are backwards-compatible for two versions
  (version skew policy, §6.5).

### 10.4 Performance budgets

| Metric | Budget |
|---|---|
| First load (3G) | < 2 s to interactive |
| Offline open (cached) | < 1 s |
| JS bundle (PWA shell) | < 200 KB gzip |
| Sync of 100 queued ops | < 10 s on reconnect |
| Room board render (200 rooms) | < 100 ms interaction |

### 10.5 Release checklist (every production release)

1. Airplane-mode test passed on web + one Android device.
2. E2E suite green, including the offline run.
3. `npm audit`: 0 critical, 0 high older than 14 days.
4. Security headers verified on staging.
5. DB migration tested on a staging copy (backwards-compatible).
6. Rollback plan written in the release notes.
7. Pilot property notified of the change window.

---

## 11. Testing & QA

| Layer | Tool / approach | Notes |
|---|---|---|
| Unit | Vitest | Store, sync engine (conflict rules), status machine |
| Component | Testing Library | Board, checklist, ticket form |
| E2E | Playwright | Full flows + offline simulation (context offline mode) + airplane-mode script on device |
| Device | Physical Android (mid-range, Android 10+) | Real airplane-mode test, camera, push |
| Accessibility | axe + manual keyboard/talkback pass | WCAG 2.1 AA target |
| Security | OWASP ZAP in CI (staging) | + annual pen-test (§8.2) |
| Performance | Lighthouse CI | Budgets in §10.4 |
| UAT | Pilot property: **Krishnachura Retreat** (the demo property) | Real staff, real rooms, one week, feedback log |

---

## 12. Roadmap & milestones

| When | Milestone |
|---|---|
| **6 Nov 2026** | Hackyard Yard #6 ship (PWA MVP + video + writeup) |
| 7–9 Nov 2026 | Hackyard ranking + Champion crowned (9 Nov, 04:00 Dhaka) |
| 10–21 Nov 2026 | Phase 2 design: API contract freeze (§4.3), role matrix sign-off (§7.3), legal pages drafted (§9) |
| Dec 2026 | Phase 2 build: Suite wiring, Python Integration Service, sync engine, IndexedDB migration, pilot setup |
| Jan 2027 | Pilot at Krishnachura Retreat (staff UAT week, PWA) + native Android build |
| Feb 2027 | Android beta (closed track) + production launch (PWA) for Suite properties |
| Mar 2027 | Android production launch (staged rollout) |
| **Before launch** | Production wiring & deployment runbook (§14) written, rehearsed on staging, and signed off |

Dates after November are targets, not commitments — the founder confirms
each gate.

---

## 13. Decisions needed from the founder

- [x] **Android path:** native Kotlin + Python FastAPI — **confirmed by
      founder 5 Nov 2026** (light, secure, reliable, integratable with
      other products).
- [x] **Integration Service hosting:** Modal Starter (free tier) —
      **decided by founder 5 Nov 2026** (backend on default Modal URL,
      frontend on custom domain).
- [ ] **Integration Service repo:** separate repo (recommended — shared
      across products) or inside the Suite repo?
- [ ] **Deployment topology:** embedded Suite module first (recommended,
      §4.5) or standalone from day one?
- [ ] **Business model:** bundled with Suite, or a subscription add-on
      like the Chatbot? (No figures in this plan, per standing policy —
      pricing is negotiated and stays private.)
- [ ] **Pilot property:** Krishnachura Retreat (recommended, §11) or
      another property?
- [ ] **Governing law / jurisdiction** for the Terms (§9.1).
- [ ] **Data retention periods** (§8.4): 12 months logs / 24 months
      tickets — confirm or change.
- [ ] **Play Store account:** use the existing publisher account, or
      create one for ViveScript? (Needs the $25 one-time registration if
      new — founder pays, not Cosmo.)
- [ ] **Concurrent sessions:** cap simultaneous staff sessions per
      account? (Yes/no + number — §8.1 leaves this open.)
- [ ] **Analytics:** none by default (privacy-first). Add
      privacy-respecting analytics later, or keep it at zero?

---

## 14. Production wiring & deployment runbook (the final piece)

This section answers the two questions every other section assumes away:
**what connects to what when live, and in what order do we ship it?**
Nothing here is aspirational — it is the checklist the launch runs on.

### 14.1 Production wiring map

| Component | Lives at | Talks to | Auth | Notes |
|---|---|---|---|---|
| PWA shell | Vercel — same project as the Suite (Phase A); own project (Phase B) | Integration Service + Suite API | Shared session cookie (A) / Bearer token (B) | Immutable deploys, instant rollback |
| Integration Service (Python/FastAPI) | Modal Starter, free tier (D1 decided 5 Nov 2026) | **Suite API only** — never the Suite DB directly | Validates Suite-issued tokens | Own small Postgres (sync ledger) + Modal Cron (Redis only if outgrown) |
| Suite API + DB | Suite deployment (Next.js + Supabase Postgres + Prisma) | — | — | Source of truth; PITR backups on |
| Android app | Play Store | Integration Service (single backend, both phases) | OAuth + PKCE, Keystore tokens | Staged rollout, halt criteria (§6.2) |
| Push (FCM) | Firebase project (§13 spike) | Integration Service → FCM → devices | FCM server key (host secret) | Assignment, urgent ticket, inspection failed |
| Photo storage | Supabase Storage (to confirm, Phase-0 spike) | Suite API / Integration Service | Signed URLs, short-lived | Virus scan before serving (§2B) |
| Domains | `*.vivereply.com` property subdomains; `suite.vivereply.com`; Integration Service on default Modal URL (unbranded accepted per D1 — branded `sync.vivereply.com` needs Modal Team, revisit post-revenue) | — | TLS 1.2+ everywhere, HSTS | DNS cutover is a runbook step (§14.2) |

**Wiring rules (non-negotiable):**

1. **The Integration Service never touches the Suite DB directly.**
   It talks to the Suite through the API only. That keeps the Suite's
   invariants (booking states, role checks, audit log) intact no matter
   what the sync layer does.
2. **No secret is ever in the repo, the client bundle, or the APK.**
   Secrets live in exactly three places: Vercel env (Suite/PWA), the
   host's secret store (Integration Service), and the founder's password
   manager (signing keys, Firebase server key). The env/secret inventory
   is a living document (`docs/security/secrets-inventory.md`, names only,
   never values) — written in Phase 2, audited at every launch gate.
3. **CORS (Phase B only):** exact-origin allowlist — the PWA origin and
   nothing else. No wildcard, no `*`.
4. **Cookies (Phase A):** shared session cookie is `httpOnly`, `Secure`,
   `SameSite=Lax`, scoped to the Suite's domain. The PWA and the Suite
   share the origin, so there is no cross-origin cookie problem to solve.
5. **Version skew:** the API stays backwards-compatible for two versions
   (§6.5). A deploy never breaks a client that shipped last month.

### 14.2 Deployment runbook (ordered — the go-live sequence)

Run top to bottom. Stop at the first failed step; roll back that step
before continuing. Rehearse the whole sequence on staging first (dress
rehearsal, `TO-DO.md` Phase 5B).

| Step | Action | Owner |
|---|---|---|
| 0 | **Freeze.** No merges to `main` in any of the three repos (Suite, Integration Service, RoomReady) until go-live completes or is aborted. Announce the freeze to the pilot property. | Founder |
| 1 | **Suite API deploy.** Deploy the Suite with the §4.3 endpoints + check-in guard. Migrations are backwards-compatible (expand → migrate → contract; never destructive in one step). Verify on staging first. | Muse Code |
| 2 | **Integration Service deploy.** New container image to the host. Health endpoint green, sync endpoint smoke-tested against staging Suite. Previous image kept for instant rollback. | Cosmo |
| 3 | **PWA shell deploy.** Vercel production deploy (Phase A: same project as the Suite; Phase B: own project). Verify headers (CSP, HSTS) + the /docs route. | Cosmo |
| 4 | **Android release.** Promote closed track → production, staged 10%. Watch crash rate + sync-failure rate for 24h before the next step. | Founder |
| 5 | **DNS / cutover.** Point the Integration Service domain + property subdomains at production. Verify TLS on every host. | Founder |
| 6 | **Smoke tests** (all must pass — see §14.3). | Cosmo |
| 7 | **Monitoring window.** 48h of watched operation: Sentry, sync-failure rate, uptime checks, pilot staff on standby. No further deploys in the window except a hotfix. | Cosmo + Founder |
| 8 | **Go-live comms.** Notify the pilot property (change window, what's new, who to call). Update the status page. | Founder |
| 9 | **Retro.** File the launch retro within a week: what broke, what the runbook missed, what changes before the next property. | Cosmo |

**Rollback triggers (any one aborts the launch):** smoke test failure;
sync-failure rate > 1% in the monitoring window; crash rate above the
Play halt criterion; auth errors spiking; any secret or data leak.
Rollback is: Vercel instant rollback (shell) + previous container image
(service) + Play staged halt (Android) + migration contract step (never a
destructive reverse migration).

### 14.3 Smoke tests (run at step 6, and after every production deploy)

1. Staff login (each role) — Owner, Manager, Front Desk, Housekeeping.
2. Room board loads with live Suite rooms (no demo data visible).
3. Status change Dirty → Cleaning syncs to the Suite and appears in the
   audit log.
4. Offline → online replay: make 3 changes in airplane mode, reconnect,
   all 3 land once (idempotency — no duplicates).
5. Check-in blocked on a Dirty room; allowed on a Ready room.
6. Ticket created offline, assigned, resolved with photo.
7. Push notification received on Android for an urgent ticket.
8. Device revoke: revoked device stops syncing, local data wiped on launch.
9. Health endpoints green on all three components; uptime monitor shows
   all green.

### 14.4 Production readiness checklist (the gate — all must pass)

- [ ] Wiring map (§14.1) matches reality — every row verified live.
- [ ] Env/secret inventory written; zero secrets in any repo, bundle or APK.
- [ ] DNS + TLS verified on every production host.
- [ ] CORS tested from the real origins (Phase B).
- [ ] Health endpoints green; uptime monitor + status page live; test
      alert fired and received.
- [ ] Sentry live on all three components with PII scrubbing on.
- [ ] Backup restore drill passed (Suite DB PITR).
- [ ] Runbook rehearsed end-to-end on staging (dress rehearsal).
- [ ] Smoke tests (§14.3) green on production.
- [ ] Pen-test findings fixed + retested (§8.2).
- [ ] Legal pages live + counsel sign-off (§9).
- [ ] Pilot property briefed (staff quick-start guide + photo policy).

---

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| PWA | Progressive Web App — a website that installs like an app and works offline |
| TWA | Trusted Web Activity — a Play Store wrapper that is essentially the PWA |
| Capacitor | A runtime that wraps a web app as a native Android/iOS app with plugin access |
| Outbox | The on-device queue of changes waiting to sync |
| Idempotency key | A UUID per change so a retried sync never applies twice |
| PITR | Point-in-time recovery (database restore to any second) |
| FCM | Firebase Cloud Messaging (push notifications on Android) |
| PKCE | Proof Key for Code Exchange (OAuth security for public clients) |
| SQLCipher | Encrypted SQLite |
| ASVS | OWASP Application Security Verification Standard |
| DPA | Data Processing Addendum |
| SLA | Service-level agreement (here: ticket response/resolution targets) |

## Appendix B — What the MVP already proves

The Hackyard build (this repo, `main`) already demonstrates the hardest
parts of the offline promise: zero external requests, a cache-first service
worker, on-device persistence, and a working room board. Phase 2 is mostly
wiring and scale — the offline engine does not need to be re-proven, only
extended (IndexedDB, outbox, background sync).

---

*Plan prepared 5 November 2026 by Cosmo (Muse) for Md Amir Hossain.
Not legal advice. Pricing intentionally absent — Suite pricing is negotiated
per project and stays private.*
