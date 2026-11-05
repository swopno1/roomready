# RoomReady — Offline Housekeeping for Resorts

**Hackyard Yard #6 · theme: Offline.** A housekeeping PWA for resorts that does its
whole job with zero internet. Turn on airplane mode and it still works.

## What it does

- **Rooms** — 21 rooms across 5 room types (Terracotta Villa, Bamboo Cottage,
  Clay House Suite, Palm Loft, Earth Lodge) with live status: Ready / Dirty /
  Cleaning / Inspected / Out of order.
- **Turnover checklists** — 8-step checklist per room, tap to tick off. Status
  advances Dirty → Cleaning → Inspected → Ready.
- **Maintenance tickets** — create, prioritise (Low → Urgent), resolve. Open
  tickets count on the tab.
- **Dashboard** — rooms ready, rooms dirty, rooms cleaning, open tickets, and
  what needs attention right now.
- **Offline proof page** — live network state, service-worker state, on-device
  storage size, and a demo-data reset.

## The airplane-mode test

1. Serve the folder (`python3 -m http.server` in this directory) and open it once.
2. Turn on airplane mode (wifi + data off).
3. Reload. The app opens, rooms load, checklists tick, tickets save.
4. Open DevTools → Network: **zero remote requests**. Everything is local.

## How the offline works

- **Zero dependencies.** No CDN, no fonts, no analytics, no `fetch()` at all.
  Every asset is a local file.
- **Service worker (`sw.js`).** Cache-first: on first load it caches the whole
  app, then serves from cache on every later load — online or off.
- **On-device storage.** Rooms, checklists and tickets live in `localStorage`
  under `roomready.v1`. Nothing leaves the device, ever.
- **Live indicator.** The header badge follows `navigator.onLine` and flips to
  *Offline — still working* the moment the network drops.

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step, no install, no backend. Any static host works — or open
`index.html` directly for the app shell (service worker needs http/https).

## Stack

Vanilla HTML / CSS / JS. `localStorage` for data, Cache API for the app shell,
Web App Manifest for installability. ~600 lines total, no framework.

## Why this

Resort staff in places like Cox's Bazar work where the wifi doesn't reach.
Housekeeping shouldn't stop when the network does — and a front desk that can
prove a room is ready, with receipts, beats a radio call every time. RoomReady
is the offline companion a Resort PMS deserves.
