# RoomReady — Offline Housekeeping for Resorts

[![Yard #6](https://img.shields.io/badge/Hackyard-Yard_%236_Offline-black)](https://hackyard.tech/yards/yard-6)
[![Offline](https://img.shields.io/badge/network-zero_requests-brightgreen)](https://github.com/swopno1/roomready)
[![PWA](https://img.shields.io/badge/PWA-installable-blue)](https://github.com/swopno1/roomready)
[![Vanilla JS](https://img.shields.io/badge/stack-vanilla_HTML_CSS_JS-yellow)](https://github.com/swopno1/roomready)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Hackyard Yard #6 · theme: Offline.** A housekeeping PWA for resorts that does its
whole job with zero internet. Turn on airplane mode and it still works.

**Live demo:** https://swopno1.github.io/roomready/ · **Video:** (link lands here before the deadline)

<!-- Founder: save the Yard screenshot as screenshot.png next to this file, then uncomment:
![RoomReady rooms board, offline](screenshot.png)
-->

## What it does

- **Rooms** — 21 rooms across 5 room types (Terracotta Villa, Bamboo Cottage,
  Clay House Suite, Palm Loft, Earth Lodge) with live status: Ready / Dirty /
  Cleaning / Inspected / Out of order. Search + status filter included.
- **Turnover checklists** — 8-step checklist per room, tap to tick off. Status
  advances Dirty → Cleaning → Inspected → Ready, with progress bars everywhere.
- **Maintenance tickets** — create, prioritise (Low → Urgent), resolve. Open
  tickets count on the tab.
- **Dashboard** — rooms ready, rooms dirty, rooms cleaning, open tickets, and
  what needs attention right now.
- **Offline proof page** — live network state, service-worker state, on-device
  storage size, and a demo-data reset. The receipts for every claim below.

## The airplane-mode test (60 seconds)

1. Open the demo (or serve the folder: `python3 -m http.server`) and load once.
2. Turn on airplane mode (wifi + data off). Watch the header badge flip to
   *Offline — still working*.
3. Reload. The app opens, rooms load, checklists tick, tickets save.
4. Open DevTools → Network: **zero remote requests**. Everything is local.

## Install it

It's a real PWA: valid manifest, 192 + 512 icons, cache-first service worker.
Add to home screen from the demo URL, then kill the network — it launches and
runs fully offline.

## How the offline works

- **Zero dependencies.** No CDN, no fonts, no analytics, no `fetch()` at all.
  Every asset is a local file (~650 lines total, no framework, no build step).
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

## Why this

Resort staff in places like Cox's Bazar work where the wifi doesn't reach.
Housekeeping shouldn't stop when the network does — and a front desk that can
prove a room is ready, with receipts, beats a radio call every time.

## Vision

RoomReady is built to become the offline edge of a modern resort PMS: a
standalone add-on that runs the floor with no signal and syncs with property
systems when back online — the same way our [ViveReply Concierge](https://github.com/swopno1/vivereply-concierge)
serves guests around the clock. Offline-first today, connected tomorrow,
native Android on the roadmap.

## License

MIT — see [LICENSE](LICENSE).
