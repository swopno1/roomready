# S4 — Photo storage spike

**Status:** Open
**Owner:** Muse Code
**Gates:** Phase 2A "photo storage backend wired"; Phase 2B photo upload
endpoint; `PLAN.md` §14.1 photo row.

## Question (from TO-DO.md)

Pick the backend for photo evidence (Supabase Storage presumed — confirm
bucket, access rules, URL signing).

## Where to look (read-only)

1. `../vivereply/packages/db` — Supabase client setup, existing buckets.
2. `../vivereply/infra` and `../vivereply/docker-compose*.yml` — storage
   config, local vs hosted Supabase.
3. `../vivereply/docs/12-DATABASE-PLAN.md` — documented storage plan.
4. Any existing file-upload endpoint in the Suite (precedent for signed
   URLs, size limits, scan hooks).

## Questions to answer

1. Backend: Supabase Storage (hosted/self-hosted?) or something else?
2. Bucket name for housekeeping photos (new or existing)?
3. Access rules: private bucket + short-lived signed URLs (recommended)?
   Who can mint read URLs — Suite API, Integration Service, or both?
4. Upload path: client → Integration Service → bucket, or client → Suite
   API → bucket? (Must match the virus-scan hook placement, Phase 2B.)
5. Size/retention implications: photos deleted with tickets after 24 months
   (§8.4) — lifecycle rule or application delete?

## Answer

- Date: 5 Nov 2026 (Muse Code, read-only, `travel-scaffold`)
- Backend: **R2 (S3-compatible) — NOT Supabase Storage.** Zero Supabase
  imports in Suite src; Supabase is hosted Postgres only. Precedent:
  private receipts bucket + keys-only in DB + 5-min presigned URLs +
  per-view audit + `.data/` dev fallback
  (`src/lib/payments/banglaqr/receipt-storage.ts`,
  `src/lib/storage/r2.ts:43-81` — `uploadToR2`,
  `getPresignedR2Url` default 300s, `deleteFromR2`).
- Bucket + rules: new **private** bucket mirroring the `R2_RECEIPTS_*`
  env pattern (account id + key-scoped credentials + bucket name); no
  public domain (R2 public access is bucket-wide); read via
  short-lived presigned URLs minted by the Suite API (integration
  time; Integration Service fronts in Phase B).
- Upload/read flow: **MVP: local-only** (the ticket form has no photo
  input today; add a local blob at most if the demo story demands it
  — default no). Integration: client → Suite API → bucket (keeps auth
  + the virus-scan hook in one Phase-2B place).
- Open items (if any): virus-scan provider choice (ClamAV vs provider
  scan — 2B); 24-month deletion = application delete (exact keys
  known) with a lifecycle rule as backstop (confirm at contract freeze).

## Done when

- [x] All 5 questions answered with evidence paths
- [x] `PLAN.md` §14.1 photo row updated from "to confirm" to decided
