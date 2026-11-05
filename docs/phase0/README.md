# Phase 0 — Validate before building

**Goal (from `TO-DO.md`):** kill the plan's unknowns before any Phase-2 code.
No building on assumptions.

**Exit criteria:** every spike has a written answer (in its file below, or
copied into `PLAN.md`); all founder decisions in `PLAN.md` §13 that gate
Phase 2 are made; the 🔒 security gate passes.

## Tracker

| # | Item | File | Owner | Status |
|---|---|---|---|---|
| S1 | Suite auth spike | `spikes/auth.md` | Muse Code (inspect) + Cosmo (record) | Answered 5 Nov 2026 + repo-identity addendum 5 Nov 2026 |
| S2 | Suite API inventory | `spikes/api-inventory.md` | Muse Code | Answered 5 Nov 2026 |
| S3 | Embedding mechanism spike | `spikes/embedding.md` | Muse Code + Founder | Answered 5 Nov 2026 (MVP standalone; integration-time A needs founder ack) |
| S4 | Photo storage spike | `spikes/photo-storage.md` | Muse Code | Answered 5 Nov 2026 |
| S5 | FCM project spike | `spikes/fcm.md` | Founder | Deferred post-MVP (no hackathon action); founder acts at integration |
| D1–D13 | Decisions + accounts + legal | `decisions.md` | Founder (+ counsel for law) | Steers recorded 5 Nov 2026; verdicts open — needs founder |
| G1 | Auth spike answered in writing | `spikes/auth.md` § Answer | — | Done 5 Nov 2026 |
| G2 | Threat model sketched | `threat-model.md` | Cosmo (draft) + Founder (review) | Review notes recorded 5 Nov 2026; sign-off open |

## How to close an item

1. Do the work described in the item's file (spikes: read-only inspection;
   never modify the Suite repo from Phase-0 work).
2. Write the answer **in the file**, dated, with evidence (file paths,
   not pasted secrets).
3. If the answer changes the plan, update `PLAN.md` and note it here.
4. Tick the box in `TO-DO.md` only when the written answer exists.

## Key facts for this phase

- Suite repo is the sibling **`travel-scaffold`** (`client/demo1`
  branch family). Inspect read-only. (Corrected 5 Nov 2026:
  `../vivereply` is the ChatBot/AI platform, not the Suite — see S1
  addendum. Older references to `../vivereply` as the Suite are stale.)
- Suite auth starting point: `travel-scaffold/src/lib/auth.ts`
  (better-auth) plus `travel-scaffold/prisma/schema.prisma`.
- No secrets in this directory, ever. Record key *holders* and *locations*
  (e.g. "FCM server key in founder's password manager"), never values.
