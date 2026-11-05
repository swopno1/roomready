# S5 — FCM project spike

**Status:** Open — founder action required
**Owner:** Founder
**Gates:** Phase 2B push delivery; `PLAN.md` §14.1 push row.

## Question (from TO-DO.md)

Confirm the Firebase project for push (new vs existing), who holds the
server key, and the sender ID.

## What the founder must provide

1. Firebase project: new `roomready` project (recommended — isolates push
   audiences and quotas from other products) vs existing ViveScript project?
2. Server key holder: founder's password manager (required — never in a repo).
3. Sender ID: record here once the project exists.
4. Confirm the Phase-2/3 use is Android-only (FCM); web push stays deferred.

## MVP scope note (5 Nov 2026, Muse Code)

No founder action needed for the hackathon: the MVP has no push (no
backend, no device tokens). Verified: no Firebase/FCM in the Suite
(`travel-scaffold`), the ChatBot platform (`vivereply`), or Concierge —
so this is genuinely greenfield. At integration time the steer stands:
new `roomready` Firebase project (audience/quota isolation), server key
in the founder's password manager (+ Modal secrets at 2B),
Android-only; web push stays deferred (no web-push infra exists
anywhere today).

## Answer

- Date:
- Project: new / existing (project id):
- Sender ID:
- Server key held by / stored at (location only, never the value):
- Android app id(s) registered:

## Done when

- [ ] Project exists, sender ID recorded, key location recorded (no values)
- [ ] `PLAN.md` §14.1 push row updated from "§13 spike" to decided
