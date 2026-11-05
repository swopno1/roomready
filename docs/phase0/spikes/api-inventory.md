# S2 — Suite API inventory spike

**Status:** Open
**Owner:** Muse Code
**Gates:** `PLAN.md` §4.3 contract freeze (Phase 2A design window 10–21 Nov).

## Question (from TO-DO.md)

List what the Suite already exposes for rooms, units, staff, roles,
booking states. Map each §4.3 endpoint to "exists / extend / build new".

## Where to look (read-only)

1. Suite API routes under `../vivereply/apps/*/src/app/api` (or `pages/api`) —
   list every route touching rooms, units, staff, roles, bookings.
2. DB schema in `../vivereply/packages/db` (Prisma schema) — tables for
   properties, room units, housekeeping status/log, bookings, staff, roles.
3. `client/demo1` data references (§4.4 claims Owner/Manager/Front Desk/
   Housekeeping roles verified) — confirm role enum in code.
4. Events: any existing webhook/SSE/outbox mechanism for booking or room
   changes.

## Inventory

**Date:** 5 Nov 2026. **Muse Code, read-only. All paths in
`travel-scaffold`** — the Suite is the `client/demo1` branch family, NOT
`../vivereply` (the ChatBot platform; see S1 addendum). Key files
verified present on `client/demo1` via `git show`.

| Area | Exists today (path) | Verdict |
|---|---|---|
| Rooms / units | `Room` + `RoomUnit` models (`prisma/schema.prisma`); list/detail reads via admin pages + server queries (`src/app/admin/rooms/`); REST: only `GET /api/rooms/[roomId]/availability` + `POST /api/bookings` (+ `lookup`, `send-details`) | Reads exist server-side; unit-list REST is new |
| Housekeeping status / log | `HousekeepingStatus` DIRTY/CLEAN/INSPECTED + `HousekeepingEvent` log + transition machine (`MARK_CLEAN`/`INSPECT_PASS`/`INSPECT_FAIL`, edit/approve-gated, `src/lib/housekeeping/status.ts`); auto-DIRTY on checkout; `setHousekeepingAction` with optimistic `expected` state (`src/app/actions/housekeeping-actions.ts:40`); notes actions adjacent | Logic exists; REST wrap is new. Check-in guard is warn-only (`status.ts:5-7`) — the §4.2 block is a confirmed Suite change |
| Staff / roles | `UserRole` = OWNER/MANAGER/STAFF/FRONT_DESK/HOUSEKEEPING/KITCHEN/STOREKEEPER/ACCOUNTANT/HR/AUDITOR (`prisma/schema.prisma`); enforcement matrix `can(role, module, action)` (`src/lib/permissions.ts:229`); `Employee` model + HR pages; no staff REST, no assignment concept | Roles 1:1 (no mapping for the core four); assignments are new |
| Booking states (in/out) | `BookingStatus` PENDING→CONFIRMED→CHECKED_IN→COMPLETED (`prisma/schema.prisma`); CHECKED_IN = stayover trigger, COMPLETED = post-checkout trigger (no separate CHECKED_OUT state) | Both turnover triggers derivable; event delivery is new |
| Webhook / SSE events | None outbound (no SSE/outbox in Suite src). Inbound payment webhooks + `ProcessedWebhook` idempotency ledger exist — reuse the pattern for the sync ledger, not the table | Build new |

## §4.3 endpoint mapping

| Method & path | Exists / Extend / Build new | Notes |
|---|---|---|
| `GET /properties/:id/rooms` | Extend | Wrap existing unit-list queries as REST |
| `GET /properties/:id/rooms/:unitId` | Extend | Board/detail queries exist (`loadHousekeepingBoard`, `src/lib/housekeeping/board.ts:64`); shape as REST |
| `PATCH /properties/:id/rooms/:unitId/status` | Extend | REST-wrap `setHousekeepingAction`; reuse its `expected`-state optimistic check for sync conflicts |
| `GET /properties/:id/checklist-templates` | Build new | No template model; nothing adjacent |
| `POST /properties/:id/tickets` | Build new | Housekeeping notes actions are adjacent precedent, not tickets |
| `PATCH /properties/:id/tickets/:ticketId` | Build new | Same as above |
| `POST /properties/:id/sync` | Build new | Integration Service, not Suite (unchanged) |
| `GET /properties/:id/staff/assignments` | Build new | Model + endpoint both new; `Employee` is the staff roster to assign from |
| `GET /properties/:id/housekeeping/report` | Extend | `loadHousekeepingBoard` is the query; REST shape is new |

Events (`booking.checked_out`, `booking.checked_in`,
`room.status_changed`, `ticket.assigned`): **missing** — no outbound
mechanism; build new in Phase 2A (webhook or SSE TBD at contract freeze).

## Suite→RoomReady role mapping (S1 handoff, closed here)

Owner→OWNER, Manager→MANAGER, Front Desk→FRONT_DESK,
Housekeeping→HOUSEKEEPING, Auditor→AUDITOR (read-only) — all 1:1, no Suite
change. Supervisor = Suite role flag on HOUSEKEEPING (TBD in 2A, per
TO-DO 2A). **MAINTENANCE gap — decided 5 Nov 2026:** no new role;
maintenance tickets are scoped to MANAGER-delegated HOUSEKEEPING (no
schema change).

## Migration seam (post-MVP integration shape)

RoomReady stays standalone for the MVP and integrates Concierge-style:
a `SuiteAdapter` interface (`listRooms/getRoom/setStatus/…`) whose MVP
implementation is the local seed (fixture, like Concierge's
`FixtureSuiteAdapter`) and whose later HTTP implementation calls the §4.3
endpoints above with a per-property binding + shared-secret Bearer
(Concierge precedent: `vivereply-concierge/lib/suite.ts`). Seam is
documented here; code lands in the first post-MVP slice, not the
hackathon build.

## Done when

- [x] Every §4.3 row has a verdict with an evidence path (or "not found")
- [x] §4.3 "none exist" claim in `PLAN.md` corrected if anything exists
- [x] Result feeds the 10–21 Nov contract freeze
