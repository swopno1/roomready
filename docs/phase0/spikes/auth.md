# S1 — Suite auth spike (verify, don't assume)

**Status:** Answered 5 Nov 2026 (founder input + code verification)
**Owner:** Muse Code (read-only inspection) + Cosmo (record)
**Gates:** 🔒 security gate G1; `PLAN.md` §7; all of Phase 2B/2C auth work.

## Question (from TO-DO.md)

Read the Suite's actual auth implementation (session mechanism, token
format, how a second service validates a Suite-issued token). Answer: can
the Python service validate Suite tokens (JWKS / shared secret /
introspection)? If not, revise §7 before Phase 2.

## Where to look (read-only)

1. `../vivereply/docs/13-AUTH-SECURITY-MULTITENANCY.md` — documented auth design.
2. Auth code under `../vivereply/apps/` (`dashboard`, `web`, `widget`) and
   `../vivereply/packages/` (`lib`, `db`) — find the session creation,
   cookie/token issuance, and any middleware that validates requests.
3. Look specifically for: JWT issuer + signing keys, JWKS endpoint, session
   store (DB table? cookie?), OAuth provider setup, 2FA enforcement point
   (needed for `TO-DO.md` Phase 2A "verify 2FA enforcement").

Useful starting commands (from `../vivereply`, no writes):

```bash
ls apps/dashboard/src 2>/dev/null || find apps -maxdepth 3 -name '*auth*' -o -maxdepth 3 -name '*session*'
grep -ril 'jwks\|jsonwebtoken\|next-auth\|lucia\|better-auth\|supabase.*auth' apps packages --include='*.ts' | head -20
```

## Questions to answer

1. Session mechanism: cookie session, JWT, or both? Cookie name/flags?
2. Token format: issuer, claims (user id, property scope, role?), expiry.
3. Can a second service (Python/FastAPI) validate a Suite-issued token?
   By which mechanism: JWKS URL / shared secret / introspection endpoint / none?
4. Is there a per-user device/session list with revoke? (Needed for §7.2.)
5. Is Owner/Manager 2FA enforced today, and where? (Needed for §7.4.)

## Answer

**Date:** 5 Nov 2026. **Founder input + code verification (Muse Code,
read-only). All paths below are in the sibling Suite repo `../vivereply`.**

Founder-provided answers (received 5 Nov 2026):

1. Session mechanism: both
2. Token format: user id, property scope, role, expiry 24h
3. Second-service validation: need a simple solution for now
4. Mechanism: prefer simple solution
5. Per-user device/session list with revoke: No
6. Owner/Manager 2FA enforced: No

Verified against Suite code — agreements and discrepancies:

1. **Session mechanism: NextAuth (v4) Credentials + JWT strategy — broadly
   "both".** Cookie transport (`next-auth.session-token`, JWE-encrypted)
   carrying a JWT payload. No DB session rows. Evidence:
   `apps/dashboard/src/lib/auth.ts` (entire file: CredentialsProvider,
   scrypt password check, `session.strategy: 'jwt'`,
   `secret: process.env.NEXTAUTH_SECRET`). Enforcement is per-route via
   `withWorkspace` in `apps/dashboard/src/lib/api-utils.ts` (no edge
   middleware). Auth exists only in `apps/dashboard`; `apps/web` is the
   marketing site, `widget` uses `vr_live_*` API keys.
2. **Token contents: user id ONLY — property scope and role are NOT in the
   token.** The `jwt` callback (`auth.ts:71-77`) copies just `user.id`.
   Workspace ("property") scope is resolved per-request from the DB
   (`apps/dashboard/src/lib/workspace-resolver.ts` via `WorkspaceMember`
   membership); role lives in the DB as `MemberRole`. **Expiry is 30 days
   (NextAuth default), NOT 24h** — no `maxAge` is configured anywhere
   (verified by grep). Founder's "24h" is the desired state, not the code.
3. **Second-service validation: YES, via a small introspection endpoint
   (recommended simple solution, see below).** Direct Python verification
   is NOT simple: NextAuth JWT-strategy tokens are JWE (encrypted, not
   signed), so the service would need `NEXTAUTH_SECRET` shared into Modal
   plus JWE-decrypt code — and would still only learn the user id (no
   scope/role). Rejected.
4. **Device/session list with revoke: confirmed NO.** JWT strategy means no
   server-side sessions; schema has `User` + `WorkspaceMember` only, no
   `Session`/`Account` models (`packages/db/prisma/schema.prisma`).
   Consequence: a password change does NOT invalidate outstanding tokens
   today — exposure window equals token lifetime (30d now, 24h after the
   recommended `maxAge` change).
5. **2FA enforced: confirmed NO.** No totp/mfa/2fa code anywhere in
   `apps/` or `packages/`; login is email + scrypt password only.

**Recommended simple validation (no crypto in Python, no secret sharing):**

- Suite adds `POST /api/v1/auth/introspect` (Phase 2A work, ~30 lines):
  accepts the client's session-token, validates with NextAuth's `getToken()`,
  returns `{ userId, workspaceId, role, expiresAt }`. Called over HTTPS with
  a service key held in Modal secrets + Vercel env.
- Modal service validates every sync/photo/push call through it, caching
  results ~60s. Client sends its existing session cookie value; no new
  login flow in Phase A.
- Suite also sets `session.maxAge` to 24h (one line, matches founder's
  stated expectation) and adds a `tokenVersion` counter on `User`,
  checked by introspect — password change / admin revoke bumps the version,
  giving simple revocation without full DB sessions.

**Handoffs to S2 (found, not solved here):** Suite roles are
`MemberRole = OWNER / ADMIN / AGENT / VIEWER` (`schema.prisma:35-40`) —
chat-workspace roles, NOT the "Owner, Manager, Front Desk, Housekeeping,
…" list `PLAN.md` §4.4/§7.3 claims as verified. S2 must define the
Suite-`MemberRole` → RoomReady-role mapping (or new Suite roles), and the
workspace → property mapping, before the §7.3 matrix can be signed off.

- §7 impact: **revision applied** — see `PLAN.md` §7 (verified 5 Nov 2026).

## Done when

- [x] All 5 questions answered above with evidence paths
- [x] `PLAN.md` §7 updated (revised to verified reality — see §7.1/§7.2/§7.4)
- [x] G1 (auth spike in writing) ticked in `TO-DO.md`
