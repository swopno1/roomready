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

*(Fill in: route → what it does today → RoomReady relevance.)*

| Area | Exists today (path) | Verdict |
|---|---|---|
| Rooms / units | | |
| Housekeeping status / log | | |
| Staff / roles | | |
| Booking states (in/out) | | |
| Webhook / SSE events | | |

## §4.3 endpoint mapping

| Method & path | Exists / Extend / Build new | Notes |
|---|---|---|
| `GET /properties/:id/rooms` | | |
| `GET /properties/:id/rooms/:unitId` | | |
| `PATCH /properties/:id/rooms/:unitId/status` | | |
| `GET /properties/:id/checklist-templates` | | |
| `POST /properties/:id/tickets` | | |
| `PATCH /properties/:id/tickets/:ticketId` | | |
| `POST /properties/:id/sync` | | Likely Integration Service, not Suite |
| `GET /properties/:id/staff/assignments` | | |
| `GET /properties/:id/housekeeping/report` | | |

Events (`booking.checked_out`, `booking.checked_in`,
`room.status_changed`, `ticket.assigned`): current mechanism / missing.

## Done when

- [ ] Every §4.3 row has a verdict with an evidence path (or "not found")
- [ ] §4.3 "none exist" claim in `PLAN.md` corrected if anything exists
- [ ] Result feeds the 10–21 Nov contract freeze
