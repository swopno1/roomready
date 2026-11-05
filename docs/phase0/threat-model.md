# Phase 0 — Threat model (draft for review)

**Status:** Draft skeleton — pre-filled from `PLAN.md` §7/§8 for founder
review. Closing 🔒 security gate G2 requires explicit review sign-off.
**Owner:** Cosmo (draft) + Founder (review)

## Assets (what we protect)

1. Staff credentials + sessions (Suite login, tokens, 2FA).
2. Room state + turnover integrity (a wrong "Ready" walks a guest to a
   dirty room — the core trust asset).
3. Ticket/checklist photos (may show guest belongings/faces — §8.4).
4. Audit log (who/when/device/property — tamper-evident record).
5. Sync ledger + idempotency keys (replay/duplication integrity).

## Attackers (who we defend against)

1. **Stolen/lost device** — an authenticated device in the wrong hands.
2. **Malicious or curious staff** — insider poking outside their role or
   property (e.g. reading another property's data).
3. **Network attacker** — open wifi at a resort; intercepts or replays traffic.
4. Out of scope for this sketch: nation-state, Suite-DB compromise (Suite's
   own threat model owns that layer).

## Top 5 risks + mitigations (mapped to PLAN.md §8)

| # | Risk | Mitigation | Plan ref |
|---|---|---|---|
| 1 | Stolen unlocked device exposes rooms/tickets/photos and keeps syncing | Device list + remote revoke → sync stops, local data wiped on launch; 24h session lifetime + `tokenVersion` revoke (S1); shared-device wipe-on-logout | §7.2, §8.3 |
| 2 | Privilege abuse: staff calls APIs outside their role (e.g. Front Desk signs off inspections) | Server-side role enforcement on every call (§7.3 matrix) + audit log on every mutation; client hiding is not the boundary | §7.3, §8.1 |
| 3 | Network sniffing/replay on resort wifi (credential or sync capture) | TLS 1.2+ everywhere + HSTS; `httpOnly`/`Secure`/`SameSite=Lax` cookies; Bearer tokens never in URLs; idempotency keys make replayed syncs harmless duplicates | §8.1, §3.3 |
| 4 | Photo PII leak (guest faces/belongings stored or over-shared) | Private bucket + short-lived signed URLs; photo-the-room-not-people policy briefed at onboarding + on-screen reminder; 24-month deletion with the ticket | §8.4 |
| 5 | Sync/outbox tampering or duplication (double-apply, forged device_id) | Authenticated sync endpoint; per-op idempotency keys with server ledger; conflict rules with server as arbiter; sync-health alerts on anomalies | §3.3, §10.3 |

## Review sign-off

- [ ] Founder reviewed assets + attackers (complete for Phase 0?)
- [ ] Founder reviewed top-5 risks (right five? ordering right?)
- [ ] Any risk needing a `PLAN.md` §8 change is filed
- Reviewer: — Date: —
