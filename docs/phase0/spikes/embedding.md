# S3 — Embedding mechanism spike

**Status:** Open
**Owner:** Muse Code + Founder
**Gates:** `PLAN.md` §4.5 Phase A; Phase 2A/2C topology work.

## Question (from TO-DO.md)

Pick Phase-A embedding: static PWA files under `public/housekeeping`
vs a Next.js route wrapping the shell. Record the choice + why.

## Context (already known, no inspection needed)

- The PWA is fully static: `index.html`, `app.js`, `styles.css`, `sw.js`,
  `manifest.json`, `icons/` — zero build step, zero dependencies.
- Service-worker scope matters: a SW served from `/housekeeping/sw.js`
  can only control `/housekeeping/*`, which is exactly what Phase A wants.
- `manifest.json` start URL and icon paths must survive the sub-path move.

## Option A — static files under `public/housekeeping`

- How: copy the PWA files into the Suite app's `public/housekeeping/`;
  served as static assets, same origin, shared session cookie.
- Pros: zero Next.js code; PWA stays build-free; instant rollback with the
  Suite deploy.
- Cons: two copies of the files (drift risk — needs a sync step or
  submodule); no server-side header control per file beyond Next.js config;
  CSP headers must be set in the Suite's Next.js config.

## Option B — Next.js route wrapping the shell

- How: a `/housekeeping` route in the Suite app that serves/embeds the PWA
  shell (rewrite, middleware, or component wrapper).
- Pros: single integration point; headers/CSP/auth checks in one place;
  can inject property context server-side.
- Cons: more Suite-repo code to own; SW scope + routing interactions to
  verify; PWA deploys ride the Suite release train.

## What to verify in the Suite repo (read-only)

1. Which app hosts the property-facing UI (`apps/dashboard`?) and its
   Next.js version + `next.config` header support.
2. Whether `public/` static serving + custom headers for a sub-path is
   already used anywhere (precedent).
3. How auth middleware is applied to routes (matters for Option B).

## Suite verification (5 Nov 2026, Muse Code, read-only, `travel-scaffold`)

1. **Host app:** the Suite Next.js 16.4.1 app itself (`package.json`).
   No separate property-facing app — one deployment (VPS + Docker in
   production, Vercel demo-only per `docs/DEPLOYMENT.md`).
2. **Header support + precedent:** `next.config.ts:58-59` implements
   `headers()` returning the global `securityHeaders()` on `/(.*)` —
   global-only, no per-path precedent. Current headers
   (`src/lib/security/headers.ts`): HSTS, `X-Frame-Options: DENY`, CSP
   = `frame-ancestors 'none'` only (no script restrictions — the MVP's
   inline SW registration is unaffected today), `nosniff`,
   strict `Referrer-Policy`, and **`Permissions-Policy: camera=()` —
   camera is disabled globally, which blocks ticket photo capture on
   any embedded origin until carved out.**
3. **Auth middleware:** `src/middleware.ts` validates the better-auth
   session server-side, but `matcher` covers ONLY `/admin/*` and
   `/api/admin/*` (`runtime: "nodejs"`). A `/housekeeping` route and any
   `/api/v1/*` endpoints get NO outer auth layer — each must enforce
   auth itself (Phase-2A gotcha for either option).

## Decision

- Choice: **neither for the MVP — standalone as-is; Option A at
  integration time** (Muse Code recommendation; founder confirms the
  integration-time half).
- Why: the hackathon MVP ships as the current static PWA (own repo,
  zero Suite dependency) — embedding solves nothing on film and risks
  the build. At integration, Option A wins: zero Suite code, natural
  SW scope (`/housekeeping/sw.js` → `/housekeeping/*`), same-origin
  session cookie, rollback with the Suite deploy — PROVIDED Phase 2A
  (a) scopes a camera allowlist to `/housekeeping/*` (else photo
  evidence breaks — see verification 2) and (b) adds drift control
  (CI check or versioned copy step from this repo into
  `public/housekeeping`).
- Date: 5 Nov 2026 — **acked by founder alongside D3** (standalone
  MVP, Option A at integration).

## Done when

- [x] Suite verification points 1–3 answered with evidence paths
- [x] Choice + why recorded above and reflected in `PLAN.md` §4.5
