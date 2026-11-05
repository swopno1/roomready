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

## Decision

*(Founder picks; Muse Code supplies the verification above.)*

- Choice: A / B
- Why:
- Date:

## Done when

- [ ] Suite verification points 1–3 answered with evidence paths
- [ ] Choice + why recorded above and reflected in `PLAN.md` §4.5
