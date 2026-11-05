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

- Date:
- Backend:
- Bucket + rules:
- Upload/read flow:
- Open items (if any):

## Done when

- [ ] All 5 questions answered with evidence paths
- [ ] `PLAN.md` §14.1 photo row updated from "to confirm" to decided
