<p align="center">
  <img src="icons/logo.svg" width="120" alt="RoomReady logo">
</p>

<h1 align="center">RoomReady</h1>

<p align="center">
  <strong>Every room ready.</strong><br>
  Offline-first housekeeping for resorts — rooms, turnover checklists, and
  maintenance tickets that work with zero internet.<br>
  A ViveReply Suite product.
</p>

<p align="center">
  <a href="https://hackyard.tech/yards/yard-6"><img src="https://img.shields.io/badge/Hackyard-Yard_%236_Offline-black" alt="Yard #6"></a>
  <img src="https://img.shields.io/badge/network-zero_requests-brightgreen" alt="zero network requests">
  <img src="https://img.shields.io/badge/PWA-installable-blue" alt="installable PWA">
  <img src="https://img.shields.io/badge/stack-vanilla_HTML_CSS_JS-yellow" alt="vanilla stack">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="MIT license"></a>
</p>

<p align="center">
  <strong><a href="https://swopno1.github.io/roomready/">Try the live demo</a></strong> · <strong><a href="https://youtube.com/shorts/ziCT43-OXW4">Watch the demo video</a></strong>
</p>

![Housekeeping staff checking rooms offline](feature-checklist.jpg)

## What it does

- **21 rooms, 5 room types** with live status (Ready / Dirty / Cleaning /
  Inspected / Out of order), search, and status filter.
- **Turnover checklists** — 8 steps per room, tap to tick, progress bars,
  room notes. Status advances Dirty → Cleaning → Inspected → Ready.
- **Maintenance tickets** — create, prioritise (Low → Urgent), resolve.
- **Dashboard** — what's ready, what's dirty, what needs attention now.
- **Offline-proof page** — live network state, service-worker state, and
  on-device storage size. The receipts for every claim on this page.

## Proof: filmed in airplane mode

| Dirty room, no signal | Checklist ticked offline | Ticket filed offline |
|---|---|---|
| <img src="images/screen-room-dirty.jpeg" width="260" alt="Dirty room with empty checklist, offline badge visible"> | <img src="images/screen-checklist-done.jpeg" width="260" alt="Checklist 2 of 8 ticked, progress bar, offline badge visible"> | <img src="images/screen-tickets.jpeg" width="260" alt="New maintenance ticket form, offline badge visible"> |

[![Watch the offline clip](feature-board.jpg)](images/demo-clip.mp4)

*▶ Watch the clip: the full turnover flow with the network off.*

## The airplane-mode test (60 seconds)

1. Open the demo and load once.
2. Turn on airplane mode. The badge flips to *Offline — still working*.
3. Reload. Rooms load, checklists tick, tickets save.
4. DevTools → Network: **zero remote requests**. Everything is local.

## How the offline works

- **Zero dependencies.** No CDN, no fonts, no analytics, no `fetch()` at all.
  ~650 lines of vanilla HTML/CSS/JS, no framework, no build step.
- **Service worker.** Cache-first: the whole app cached on first load, served
  from cache on every later load — online or off.
- **On-device storage.** Rooms, checklists, and tickets live in
  `localStorage`. Nothing leaves the device, ever.
- **Installable.** Valid manifest, maskable + Apple icons, add-to-homescreen
  ready. Any static host works (`python3 -m http.server 8000`).

## Where this goes

RoomReady is day one of a bigger plan:

- **Native Android app** — the same offline engine as a Play Store app with
  push notifications for urgent tickets and assignments.
- **ViveReply Suite integration** — rooms, bookings, and staff flow in from
  [app.vivereply.com](https://app.vivereply.com); turnover status and tickets
  sync back when the device is online. Check-in stays blocked until the room
  is Ready.
- **Part of the ViveReply family** — alongside [vivereply.com](https://vivereply.com)
  and [ViveReply Concierge](https://github.com/swopno1/vivereply-concierge),
  one connected platform for resorts that works with or without a signal.

## License

MIT — see [LICENSE](LICENSE).
