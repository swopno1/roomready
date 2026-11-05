# Yard #6 Submission Package — RoomReady

**Deadline: Fri Nov 6, 18:00 UTC. Budget: video (~1h with retakes) + writeup paste + screenshot + submit click.**

## 1. Writeup (paste-ready for the Yard page)

**RoomReady — offline housekeeping for resorts that works with zero internet.**

Resort staff in places like Cox's Bazar work where the wifi doesn't reach.
RoomReady is a housekeeping PWA — 21 rooms, turnover checklists, maintenance
tickets, a readiness dashboard — that does its whole job in airplane mode.
No account, no backend, no `fetch()` at all: a cache-first service worker
holds the app shell, and every room, checklist tick, and ticket lives
on-device. The header badge flips to "Offline — still working" the moment
the network drops, and the Offline-proof tab shows the live network state,
service-worker state, and storage size.

**How to test it:** serve the folder (`python3 -m http.server`), open once,
turn on airplane mode, reload — rooms load, checklists tick, tickets save.
DevTools → Network shows zero remote requests.

Vanilla HTML/CSS/JS, ~600 lines, zero dependencies. Open source (MIT).

## 2. Video script (target ~2:10, hard cap 3:00)

Format: phone screen recording, portrait 1080×1920, 30fps. The status-bar
airplane icon must be visible for the entire offline portion. Prep: install
the PWA to the home screen while online (10s, can be off-camera), open once
so the service worker caches, then start recording.

| Time | Visual | Voiceover (founder, natural pace) |
|---|---|---|
| 0:00–0:12 HOOK | Close-up: finger toggles **airplane mode ON** in quick settings; status-bar plane icon visible. | "No wifi. No data. This resort still runs housekeeping." |
| 0:12–0:25 INTRO | Open RoomReady from home screen. Hold on dashboard: stats + "Offline — still working" badge. | "RoomReady — offline housekeeping. Twenty-one rooms, checklists, tickets. Zero internet." |
| 0:25–1:05 FEATURE 1 | Rooms tab → search "Bamboo" → open a Dirty room → tick 3 checklist items → **Start cleaning** → pill flips to Cleaning. | "A dirty room. Tick the turnover checklist — eight steps. Start cleaning. All saved on the device." |
| 1:05–1:35 FEATURE 2 | Tickets tab → add ticket "AC not cooling", Urgent → open count badge increments → Mark done. | "Found a fault mid-turnover? Ticket it, prioritise it, resolve it. Still offline." |
| 1:35–2:00 WOW | Offline-proof tab: network state, "Active — app cached", storage size. **Reload the page while offline** — everything persists. | "The proof tab: offline, cached, two kilobytes of rooms and tickets on-device. Reload with no signal — nothing is lost." |
| 2:00–2:10 CLOSE | Dashboard wide shot, badge visible. | "RoomReady. The offline companion a resort PMS deserves. Repo linked below." |

Production notes:

- Recording: phone's built-in screen recorder (mic ON) or OBS + phone mirror.
- Audio: quiet room, founder voiceover; optional quiet music bed at ~15% under voice (YouTube Audio Library). No dead air — cut pauses.
- Zoom moments: the airplane toggle (0:00), the status-pill flip (1:00), the reload-persists moment (1:50).
- Forbidden on film: real credentials, real guest data (seed is fictional first names only — verified), any browser tab with personal info.
- Upload to YouTube as Unlisted, test the embed, then submit.

## 3. Screenshot spec (founder captures — 2 min)

- **Primary:** phone portrait screenshot of the **Rooms board** with the
  status bar showing the **airplane icon** and the in-app
  "Offline — still working" badge visible. 1080×1920 PNG.
- **Backup:** the Offline-proof tab showing "Active — app cached" + storage
  size, same airplane-visible status bar.
- No personal info in frame (notification shade clear).

## 4. Submit checklist (founder)

- [ ] (Recommended, 2 min) Enable GitHub Pages on `main` (repo Settings →
  Pages → Deploy from branch) so voters get a one-click demo link.
- [ ] Upload video to YouTube (Unlisted), verify it plays.
- [ ] Screenshot captured per §3.
- [ ] Submit on the Yard page: repo + video + §1 writeup + screenshot —
  before Fri Nov 6, 18:00 UTC.
- [ ] After lock: open every other build, rank top 3 with a one-liner on
  #1 (required to win).

## 5. Pre-flight verification (done 5 Nov 2026)

- Zero remote references across all PWA files (`grep` clean).
- `manifest.json` valid: name, start_url, standalone, theme color, both
  icons present; every `sw.js` precache entry resolves on disk.
- Secret scan clean; seed data fictional (first names only, no PII).
- Live localhost serve-test blocked by sandbox (bind denied) — the
  founder's device/browser run is the real serve test; statics are
  standard and low-risk.
