# Phase 0 — Validate before building

**Goal (from `TO-DO.md`):** kill the plan's unknowns before any Phase-2 code.
No building on assumptions.

**Exit criteria:** every spike has a written answer (in its file below, or
copied into `PLAN.md`); all founder decisions in `PLAN.md` §13 that gate
Phase 2 are made; the 🔒 security gate passes.

## Tracker

| # | Item | File | Owner | Status |
|---|---|---|---|---|
| S1 | Suite auth spike | `spikes/auth.md` | Muse Code (inspect) + Cosmo (record) | Answered 5 Nov 2026 |
| S2 | Suite API inventory | `spikes/api-inventory.md` | Muse Code | Open — ready, Suite repo available |
| S3 | Embedding mechanism spike | `spikes/embedding.md` | Muse Code + Founder | Open — ready |
| S4 | Photo storage spike | `spikes/photo-storage.md` | Muse Code | Open — ready |
| S5 | FCM project spike | `spikes/fcm.md` | Founder | Open — needs founder |
| D1–D13 | Decisions + accounts + legal | `decisions.md` | Founder (+ counsel for law) | Open — needs founder |
| G1 | Auth spike answered in writing | `spikes/auth.md` § Answer | — | Done 5 Nov 2026 |
| G2 | Threat model sketched | `threat-model.md` | Cosmo (draft) + Founder (review) | Draft skeleton ready for review |

## How to close an item

1. Do the work described in the item's file (spikes: read-only inspection;
   never modify the Suite repo from Phase-0 work).
2. Write the answer **in the file**, dated, with evidence (file paths,
   not pasted secrets).
3. If the answer changes the plan, update `PLAN.md` and note it here.
4. Tick the box in `TO-DO.md` only when the written answer exists.

## Key facts for this phase

- Suite repo is the sibling monorepo `../vivereply` (turborepo: `apps/`,
  `packages/`, `docs/`). Inspect read-only.
- Suite auth starting point: `../vivereply/docs/13-AUTH-SECURITY-MULTITENANCY.md`
  plus the actual auth code under `../vivereply/apps/` and
  `../vivereply/packages/`.
- No secrets in this directory, ever. Record key *holders* and *locations*
  (e.g. "FCM server key in founder's password manager"), never values.
