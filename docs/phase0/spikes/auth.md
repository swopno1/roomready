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

## Addendum — repo-identity correction (5 Nov 2026, Muse Code, read-only)

**The 5 Nov "Answer" above investigated the wrong repo.** `../vivereply`
(turborepo: `apps/dashboard|web|widget`; models `Workspace`,
`Conversation`, `AiAgent`, `Knowledge*`, `Store`, `Cart`) is the
**ChatBot/AI platform** — it has no rooms, bookings, or housekeeping. The
**Suite is `travel-scaffold`** (`client/demo1` branch family). All five
answers above describe ChatBot-dashboard auth and must NOT gate Suite
integration work. They are preserved for history; the corrected Suite
answers follow. Verified on both `client/demo1` and `client/demo11`
(`git show client/demo1:<path>`).

**Suite auth reality (all paths in `travel-scaffold`):**

1. **Session mechanism: better-auth 1.7.14, DB-backed opaque sessions**
   (`src/lib/auth.ts`). Email + password, invitation-only
   (`disableSignUp: true`). Cookie `better-auth.session_token` (prefix +
   name confirmed in installed package source
   `node_modules/.pnpm/better-auth@1.7.14_*/better-auth/dist/cookies/index.mjs:49,266`),
   HMAC-signed with `BETTER_AUTH_SECRET`, value = the `Session.token` DB
   lookup. Outer layer: `src/middleware.ts` validates the session
   server-side for `/admin/*` + `/api/admin/*` only
   (`matcher`, `runtime: "nodejs"`).
2. **Token contents: opaque random token — user id, role, scope all live
   in the DB** (`Session` → `User`, `User.role: UserRole`,
   `prisma/schema.prisma`). **Expiry is 7 days** (better-auth default
   `sec("7d")`, same package source; no `expiresIn` override in
   `src/lib/auth.ts`). Roles are the hospitality list
   (`OWNER, MANAGER, STAFF, FRONT_DESK, HOUSEKEEPING, KITCHEN,
   STOREKEEPER, ACCOUNTANT, HR, AUDITOR`) — so §4.4's original claim
   that this spike "corrected" was right all along; the `MemberRole`
   correction was wrong-repo data.
3. **Second-service validation: YES, via introspection (recommendation
   survives, reason changes).** A Python service cannot verify opaque DB
   tokens offline, and no secret must be shared either. Suite adds
   `POST /api/v1/auth/introspect` (Phase 2A): service key in, session
   token in, `{ userId, role, expiresAt }` out via
   `auth.api.getSession()`. Precedent for the service-key leg already
   ships: Concierge→Suite shared-secret Bearer
   (`travel-scaffold/src/lib/concierge-auth.ts`,
   `vivereply-concierge/lib/suite.ts:39-57`).
4. **Session list with revoke: YES — S1's "no" is reversed.** `Session`
   rows carry `token, expiresAt, ipAddress, userAgent, userId`; revoke
   = delete rows (per-device via `userAgent`, per-user via `userId`).
   Consequence: the proposed `tokenVersion` counter is unnecessary —
   drop it. Open for 2A: confirm password-reset session-revocation
   behavior (not verified here).
5. **2FA: EXISTS — S1's "no" is reversed.** TOTP plugin
   (`twoFactor({ issuer: "ResortAdmin" })`, `auth.ts:117-120`); OWNERs
   are always required (`requireMfa`, `src/lib/auth-helpers.ts`),
   per-user forcing by OWNER (`twoFactorRequired`, `UsersPanel.tsx`);
   enrol UI at `src/app/admin/setup-2fa/`; sign-in + TOTP rate-limited
   and audited (`auth.ts:70-116`).

**MVP scope note:** none of the above gates the hackathon MVP, which has
no auth at all (no PII, no backend — correct). This addendum gates Suite
integration (post-MVP) only.
