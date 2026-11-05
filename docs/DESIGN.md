# RoomReady — Branding & Design Plan

**Version:** 1.0 — plan for founder review (5 November 2026)
**Status:** Plan and principles only. **No design assets are made here** —
no logo files, no icon files, no mockups. The founder manages the actual
design separately; this document is the brief the designer works from, and
the spec the developers build from.
**Related:** [`PLAN.md`](PLAN.md) (product plan) ·
[`TO-DO.md`](TO-DO.md) (build checklist)

> **Design truth the whole document rests on:** RoomReady is a staff tool
> used on the floor, often one-handed, often offline, often in glare.
> Every decision below is judged by that: big touch targets, status that
> reads without colour, nothing that needs the network to render.

---

## 1. Brand

### 1.1 Name

**RoomReady** — one word, two capitals (`RoomReady`). Never `Room Ready`,
never `roomready` in display text (the repo name `roomready` and the
domain-style handle are the only lowercase uses).

### 1.2 Wordmark

- The wordmark is the name set in the display serif (Georgia on web,
  the serif the Suite uses) with normal letter-spacing. No custom
  lettering is required — the **mark** (below) carries the identity, the
  wordmark stays plain so it survives anywhere.
- Lockup with the parent brand: **"RoomReady — a ViveReply Suite
  product"** (small text under the wordmark, or "by ViveReply" in the
  footer / Play listing). RoomReady never presents itself as a standalone
  company; it is a Suite product.

### 1.3 Tagline (pick one — founder decision)

| # | Tagline | Why |
|---|---|---|
| 1 | **Every room ready.** | The product promise in three words. Recommended. |
| 2 | Housekeeping, offline. | Says the wedge out loud. |
| 3 | Ready when the guest is. | Hospitality framing; warmer, less literal. |

Use the chosen tagline in the Play listing short description and the
PWA install prompt — nowhere else. The app itself has no tagline on
screen (staff don't need marketing while they work).

### 1.4 The logo mark — three directions for the designer

The mark must read at **16 px** (favicon) and at **512 px** (Play
listing), in colour and in one colour, on light and dark. It is a
**staff tool mark**, not a hotel logo: simple, geometric, no gradients,
no drop shadows, no stock clip-art (no beds, no bells, no maids).

| Direction | Concept | Notes |
|---|---|---|
| **A — The Ready Check (recommended)** | A rounded square (the room) with a check mark whose long arm extends past the square's edge — the room is *done*. | Simplest, most legible at small sizes. The check is the whole story. |
| **B — The Door** | A door outline (frame + ajar panel) with a check in the opening. | More literal, more ownable. Harder at 16 px — the door must stay bold. |
| **C — The R Monogram** | A capital R whose leg is a check mark. | Elegant, but risks reading as just a letter. Only if A and B feel generic. |

**Construction rules (all directions):**
- Built on a 24×24 grid, 2 px stroke, rounded joins. The mark must
  survive being drawn as a single-colour silhouette.
- Clear space: one check-height on all sides. Minimum size: 16 px
  digital, 8 mm print.
- Colour versions: full colour (teal mark, terracotta check — §5),
  mono ink, mono reversed (cream on teal-dark). No other colourways.
- The current app uses a placeholder brand mark (a terracotta square
  with an "R"). It is **not** the logo — it is replaced when the real
  mark lands, and nothing else in the app changes with it.

### 1.5 What the designer delivers (handoff list)

- [ ] Logo mark: SVG (master) + PNG at 512, 192, 96, 48, 32, 16.
- [ ] Wordmark lockup: horizontal + stacked, SVG + PNG, colour + mono +
      reversed.
- [ ] App icon set: §2 (adaptive foreground/background, maskable, Apple
      touch, favicon).
- [ ] One-page brand sheet: the mark, clear space, minimum size, the
      three colour versions, and the don'ts (§1.6).
- [ ] Source files (SVG/AI/Figma) handed over — the founder owns them.

### 1.6 Don'ts

- No gradients, shadows, or 3-D effects in the mark.
- No photographs inside the mark; no hotel imagery (palm trees, beaches,
  sunsets) — this is the housekeeping tool, not the resort.
- No recolouring the mark to match a property's branding. Properties get
  their own name in text; the mark stays RoomReady.
- No text inside the mark (the wordmark is separate).

---

## 2. App icon plan

The icon is the mark (§1.4) fitted to each platform's rules. The designer
draws **one** foreground; the build derives the rest.

### 2.1 Android — adaptive icon (primary)

| Layer | Content | Spec |
|---|---|---|
| Foreground | The mark, centred | 108×108 dp canvas; the mark inside the **72 dp safe zone** (nothing important outside it — launchers crop to circles, squircles, teardrops) |
| Background | Flat theme colour | `--color-primary` (teal `#226355`) on light; teal-dark on dark |
| Monochrome | Single-colour version of the mark | Required for Android 13+ themed icons: the mark drawn in one colour, no background detail |

- No text in the icon. No badge baked in (badges are runtime, §3.3).
- Adaptive icon XML + PNG fallbacks generated from the same foreground.

### 2.2 PWA / web

| Asset | Size | Notes |
|---|---|---|
| `icon-192.png` | 192×192 | Manifest `any` purpose. **Exists today (placeholder)** — replaced by the real mark, same filename/path. |
| `icon-512.png` | 512×512 | Manifest `any` purpose. Same — replace in place. |
| `icon-maskable-512.png` | 512×512 | Manifest `maskable` purpose; mark inside the 80% safe zone (maskable crops ~20%). **New** — the current set has no maskable icon. |
| `apple-touch-icon.png` | 180×180 | iOS home-screen icon; solid background (no transparency). |
| `favicon.svg` + `favicon-32.png` / `favicon-16.png` | — | The mark at 16 px must still read (direction A survives this best). |
| Shortcut icons | 96×96 | One per PWA shortcut (e.g. "My rooms") if shortcuts ship. |

- The manifest (`manifest.json`) lists the icons by purpose; filenames
  and paths stay stable so the manifest does not change when the mark lands.
- Splash/background colour: `--color-surface` (cream on light, dark
  surface on dark) — never a photo.

### 2.3 Icon states

- **Offline:** the launcher/PWA icon never changes for offline (no
  badge, no grey-out) — offline is shown *inside* the app (§4.6), not on
  the icon.
- **Notification:** FCM notifications use the monochrome mark (§2.1).

---

## 3. Navigation — five-item bottom nav

The current MVP uses top tabs (Dashboard / Rooms / Tickets / Offline).
**That is replaced** by a standard five-item bottom navigation, as the
founder specified: **Home on the left, Profile on the right, three items
in the middle.**

### 3.1 The five items

| # | Tab | Icon | What it shows |
|---|---|---|---|
| 1 | **Home** | home | Dashboard: today's turnover, needs attention, my progress, sync card |
| 2 | **Rooms** | door / bed | Room board: search + filter, room cards, tap → room detail |
| 3 | **Tickets** | wrench | Maintenance tickets: filter by status/priority, tap → ticket detail |
| 4 | **Activity** | clock / list | My day: assigned-room progress, status log, sync + offline state |
| 5 | **Profile** | person | Me, my property, theme, accessibility, legal, device, logout |

**Why Activity is #4 (not Reports):** the MVP's Offline-proof page has
no natural home in a five-tab layout — Activity gives it one, and
Activity is what staff actually check during a shift (what did I do,
did it sync?). Reports (Phase 4) live under Profile → Reports for
managers/owners, not as a tab — most staff never open reports, and a
tab they never use is a wasted thumb.

### 3.2 Behaviour

- **Fixed bottom bar**, 64 dp tall + safe-area inset. Icon (24 px) above
  a 12 px label. Active tab: filled icon + `--color-primary` label;
  inactive: outlined icon + muted label.
- **Badges:** Rooms shows the dirty-room count; Tickets shows the urgent
  count. Badges are a number in a terracotta dot (max "9+"). No badge
  ever appears on Home, Activity or Profile.
- **Same five tabs for every role.** Content adapts (Front Desk sees the
  board read-only; Auditor sees read-only everything), but the tabs never
  disappear — staff learn one layout and keep it when their role changes.
- **Routes:** each tab is a route (`#/home`, `#/rooms`, `#/tickets`,
  `#/activity`, `#/profile`) so the Suite can deep-link to a tab, and the
  back button works.
- **No FAB.** A floating action button would collide with the bottom nav.
  Primary actions live inside their screen (e.g. the big "Advance status"
  button at the bottom of Room detail, above the nav).
- **Desktop / tablet (PWA, ≥ 1024 px):** the bottom nav becomes a **left
  rail** — same five items, vertical, icon + label, 72 px wide. Same
  order, same badges, same routes.
- **One-handed use:** the bar sits in the thumb zone; the most-used tab
  (Rooms) is second from the left, reachable by either thumb.

### 3.3 What the current top tabs become

| Current top tab | Becomes |
|---|---|
| Dashboard | Home |
| Rooms | Rooms |
| Tickets | Tickets |
| Offline (proof page) | Activity → sync card (same content: net badge, SW state, storage size) |

---

## 4. Screens

Every screen lists its purpose, its key elements, and its states.
**States are part of the design:** loading, empty, error, and offline
are specified for every screen — a screen without an empty state is
unfinished.

### 4.1 Home (dashboard)

- **Purpose:** "What needs me right now?"
- **Elements:** greeting (first name + property), today strip (check-outs
  due / rooms dirty / inspections pending), needs-attention list (top 3,
  tap → room), my progress (rooms done today), sync card (pending count,
  last sync, tap → Activity).
- **Empty:** "All rooms ready — nothing needs you." (not a blank page).
- **Offline:** full content from the local store; sync card shows
  "Offline — N changes will sync".

### 4.2 Rooms (board)

- **Purpose:** the floor, at a glance.
- **Elements:** search field, status filter chips (All / Dirty / Cleaning /
  Inspected / Ready / Out of order), room cards: name + type, status pill
  (§6.1), assignee, checklist progress bar, note indicator.
- **Empty:** "No rooms match this filter." + clear-filter action.
- **Offline:** identical — the board is local data; a small offline
  banner notes sync is paused.

### 4.3 Room detail

- **Purpose:** do the turnover.
- **Elements:** header (name, type, status pill, assignee), checklist
  (8 steps, tick rows §6.2), big bottom button "Advance status"
  (Dirty → Cleaning → Inspected), note field, this room's open tickets,
  photo evidence (before/after), status history.
- **Supervisor variant:** an "Inspect + sign off" section (pass / fail +
  note) replaces the advance button.
- **Offline:** everything works; the advance button queues the change
  and says so ("Saved — will sync").

### 4.4 Tickets (list) + 4.5 Ticket detail

- **List:** filter chips (Open / In progress / Done + priority), ticket
  cards (title, room, priority pill, status, age).
- **Detail:** title, room, description, photo(s), timeline (created →
  assigned → resolved, who/when), actions: assign, start, resolve with
  photo proof.
- **New ticket:** a bottom sheet (§6.4) from Rooms or Room detail — title,
  room (prefilled), priority, photo optional.

### 4.6 Activity

- **Purpose:** "What did I do, and did it sync?"
- **Elements:** today timeline (my status changes + ticket actions),
  sync card (pending count, last sync time, per-change state), offline
  proof block (network badge, service-worker state, storage size —
  carried over from the MVP's Offline page), failed-operation list with
  retry.
- **Empty:** "Nothing yet today."

### 4.7 Profile

- **Purpose:** me, my property, my app.
- **Elements:** staff card (name, role, property), property switcher
  (Phase 4), theme switcher (§5.4), large-text toggle, legal links
  (Terms / Privacy / Cookies / DPA), device info (device ID, app version,
  storage used), logout. Manager/owner extras: Reports, checklist
  templates, staff assignments (links into the Suite admin).
- **States:** logout asks once ("Log out? Unsynced changes will sync
  when you sign back in — nothing is lost.").

### 4.8 Sheets, dialogs, feedback

- **Bottom sheets** for forms (new ticket, note, inspection sign-off):
  drag handle, title, fields, primary action pinned at the bottom.
- **Toasts** for sync feedback ("3 changes synced", "Saved offline —
  will sync"), never for errors that need action.
- **Offline banner:** a thin bar under the top bar when offline ("You're
  offline — changes save on this device"), not a blocking dialog.
- **Error states:** a failed sync shows the item with a retry button
  inline — never a full-screen error for a partial failure.

---

## 5. Colour — themed token system

The palette below **extends the app's existing colours**
(`styles.css`, verified 5 Nov 2026) — it does not replace them. The
MVP's cream/teal/terracotta identity is the brand; this section turns
it into a switchable theme system.

### 5.1 How theming works (so themes switch easily)

- **One source of truth:** a token file (`design-tokens.json` — values
  only, no code) that both clients read. The PWA consumes it as CSS
  custom properties; Android consumes it as a Material 3 colour scheme
  built from the same seed colours.
- **PWA mechanism:** semantic custom properties on `:root`, with
  overrides under `html[data-theme="dark"]` and
  `html[data-theme="high-contrast"]`. The theme is set from Profile
  (§4.7) and persisted; `auto` follows `prefers-color-scheme`.
- **Android mechanism:** Material 3 colour roles (`primary`,
  `onPrimary`, `surface`, …) generated from the same seed colours;
  the theme switch in Profile writes to DataStore; Compose reads the
  scheme. The token *names* match the web names so a designer changes
  one value and both clients move.
- **Rule:** components use **tokens only** — never a raw hex value in a
  component. A hex value anywhere except the token file is a bug.

### 5.2 Light theme (default) — the existing palette, tokenised

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#f5efe3` (cream) | App background |
| `--color-surface` | `#fffdf7` (card) | Cards, sheets, inputs |
| `--color-surface-2` | `#ece4cd` | Pressed / hover surfaces, code chips |
| `--color-text` | `#1c2420` (ink) | Primary text |
| `--color-text-muted` | `#666666` | Secondary text, metadata |
| `--color-primary` | `#226355` (teal) | Primary buttons, active nav, links |
| `--color-primary-strong` | `#1d3a2f` (teal-dark) | Top bar, headings, primary pressed |
| `--color-accent` | `#a94e24` (terracotta) | Badges, active tab underline, highlights |
| `--color-border` | `#ddd3bd` (line) | Card borders, dividers |
| `--color-overlay` | `rgba(28,36,32,.5)` | Sheet scrim |

### 5.3 Status colours (same in every theme)

Status is **never colour alone** — every status has an icon + a text
label (§6.1). The colours are the same across themes so staff learn
them once; only their lightness shifts in dark mode.

| Status | Light | Dark | Text on it |
|---|---|---|---|
| Ready | `#226355` teal | `#4da08a` | white |
| Dirty | `#a94e24` terracotta | `#d97b4a` | white |
| Cleaning | `#b7791f` amber | `#d9a441` | white / ink |
| Inspected | `#2b6cb0` blue | `#6aa6dd` | white |
| Out of order | `#718096` grey | `#9aa7b8` | white |

Ticket priority reuses the same scale: low = grey, medium = blue,
high = terracotta, urgent = `#9b2c2c` dark red.

### 5.4 Dark theme

- Background `#171c19`, surface `#222825`, surface-2 `#2e3531`, text
  `#f5efe3`, muted `#a8b0a6`, border `#3a423d`.
- Primary teal lightens to `#4da08a` (readable on dark); accent
  terracotta lightens to `#d97b4a`. Status colours use the Dark column
  of §5.3.
- Photos and the logo mark do not invert. The top bar stays teal-dark
  in both themes.

### 5.5 High-contrast theme (accessibility)

- Pure black background `#000000`, white text `#ffffff`, borders
  `#ffffff` (2 px), primary `#00c2a8` on black, focus ring 3 px solid
  `#ffd166`. Status pills gain a 2 px white outline. This theme exists
  for low-vision staff and outdoor glare — it is a first-class theme,
  not a debug mode.

### 5.6 Contrast targets (measured, not assumed)

- Text on background/surface: **≥ 4.5:1** (WCAG AA).
- UI components and focus indicators: **≥ 3:1**.
- Every token pair is checked at theme-definition time (tool:
  `npx @scope/contrast-check` or any WCAG checker) and re-checked
  whenever a token value changes. A failing pair blocks the change.

---

## 6. Components

### 6.1 Status pill

Rounded-full, 12 px bold uppercase-first text + a 12 px icon (check /
broom / eye / alert / pause). Background = status colour (§5.3), text
white. Never colour alone — the icon and the word carry the meaning if
the colour can't be seen.

### 6.2 Checklist row

44 px minimum row height, 20 px checkbox (teal accent), label 16 px,
"done by + time" in muted 12 px on the right. Done rows: label
struck-through, muted. The whole row is tappable, not just the box.

### 6.3 Room card / ticket card

Surface background, 1 px border, 10 px radius, 14–16 px padding.
Title 18 px semibold; metadata 13 px muted; status pill top-right.
Pressed state: border goes `--color-primary`. No shadows (flat, fast,
prints cleanly).

### 6.4 Bottom sheet

Slides from the bottom, drag handle, title 20 px, fields full-width,
primary action pinned to the bottom of the sheet (above the nav, not
under it). Scrim = `--color-overlay`; tap scrim or swipe down to dismiss
— but never dismiss a sheet with unsaved input without asking.

### 6.5 Buttons

- Primary: teal fill, white text, 8 px radius, 48 px tall minimum.
- Secondary: transparent, teal-dark border, teal-dark text.
- Danger: terracotta-red text + border (no fill).
- Disabled: 40% opacity, no pointer events. A disabled primary button
  always has a reason in muted text beneath it ("Select a room first").

### 6.6 Touch targets & motion

- Minimum touch target **44×44 dp** (48 preferred). The bottom nav,
  checklist rows and primary buttons all clear this.
- Motion: 150–200 ms ease-out for sheets and tab changes; nothing
  bounces. `prefers-reduced-motion` disables all non-essential motion.

---

## 7. In-app icon system (not the app icon)

- **Style:** 24 px grid, 2 px stroke, rounded caps and joins. Outlined
  for inactive states, filled for active nav (§3.2). One set, drawn once:
  inline SVG in the PWA, vector drawables on Android.
- **Required set:** home, rooms (door), tickets (wrench), activity
  (clock), profile (person), search, filter, camera, check, check-circle,
  alert, sync, wifi-off, chevron-left, plus, close, logout, sun/moon
  (theme), text-size (large text), shield (legal), refresh (retry).
- **Rule:** no emoji as UI icons, no raster icons. Every icon has an
  accessible label (screen readers read the label, not the shape).

---

## 8. Typography

- **No webfonts.** The offline promise forbids external requests, so
  there is no Google Fonts (or any hosted font) in the app. Both clients
  use system stacks.
- **PWA:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Noto Sans", "Noto Sans Bengali", "SolaimanLipi", sans-serif`.
  Display/headings: `Georgia, "Times New Roman", serif` (the existing
  editorial voice — kept).
- **Android:** Roboto (system) + Noto Sans Bengali (system on most
  devices, with fallback). Headings use the same serif only if the
  device has one; otherwise Roboto bold — never bundle a font file for
  headings.
- **Scale:** display 28/32 · title 20/24 · body 16/24 · small 14/20 ·
  caption 12/16 (size/line-height px). **Large-text mode** scales the
  whole scale ×1.25 and must not break any screen (verified in QA).
- **Numbers:** tabular figures for counts and times (so the dashboard
  doesn't jump as numbers change).

---

## 9. Accessibility & localisation

- **WCAG 2.1 AA** is the bar (§5.6 for contrast; §6.6 for targets;
  TalkBack/keyboard pass in QA).
- Status, priority and sync state are never colour-only (§5.3, §6.1).
- All strings live in a strings file (EN + BN from Phase 2) — no
  hardcoded user-facing text in components. Bengali is a first-class
  locale, not a translation afterthought: the type scale and layouts
  are checked in Bengali too.
- **Brand voice:** short, plain, staff-friendly. "Room 04 is ready."
  not "Turnover complete." Bengali tone: respectful, simple, no jargon.

---

## 10. Designer handoff — what happens next

1. **Founder picks:** a tagline (§1.3) and a mark direction (§1.4).
2. **Designer delivers** §1.5 (logo + icon set + brand sheet).
3. **Cosmo applies:** the mark replaces the placeholder brand mark and
   the PWA icons (same filenames, §2.2); tokens move into
   `design-tokens.json`; the top tabs become the bottom nav (§3) — all
   as build work tracked in `TO-DO.md` Phase 2/3, not in this document.
4. **Verify:** the mark at 16 px, the icon on a real launcher, the nav
   on a real phone one-handed, dark + high-contrast themes on device.

---

*Design plan prepared 5 November 2026 by Cosmo for Md Amir Hossain.
Companion to `PLAN.md` v1.3 and `TO-DO.md`. No design assets are made
here — this document is the brief and the build spec.*
