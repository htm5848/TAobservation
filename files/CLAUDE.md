# PHYS 211 Observation Tool — CLAUDE.md

Project context and conventions for AI-assisted development. This is a **separate site** from the main Physics TA Hub (`ta-pd-website`) — it only covers the research/observation workflow, and does not touch that repo.

---

## Project Overview

An iPad-friendly single-page tool for PHYS 211 mentor TAs to observe discussion-section TAs and record structured + qualitative data. No login beyond a NetID text field, no backend — data lives in the browser until exported as CSV.

**Status:** Not yet deployed. See README.md for the GitHub Pages push steps.

---

## File Structure

```
phys211-observation-hub/
├── index.html        # 4 screens: NetID → Setup → Observation workspace → Done
├── css/
│   └── styles.css    # Design tokens (shared visual language with ta-pd-website), touch-target sizing, responsive rules
├── js/
│   └── main.js        # TA_ROSTER, CHECKLIST data, all app state + logic
└── README.md
```

No build step, no framework, no package manager — same conventions as the main TA Hub.

---

## Screens (`showScreen(id)` in main.js)

| Screen ID | Purpose |
|---|---|
| `screen-netid` | NetID entry, no password |
| `screen-setup` | Section dropdown (autofills TA name), date, table-count stepper |
| `screen-observe` | Sticky topbar (session info, **Observe / Comments** page switch, timer, End & Export) + two pages via `showObsPage(page)`: **Observe** = classroom map with position log below it (sticky, left) and compact checklist (right); **Comments** = qualitative comments (What went best / What needs improvement / Additional comments) |
| `screen-done` | Export confirmation + re-download / start another observation |

---

## Data Model (`obsSession` object in main.js)

```js
{
  netid, section, ta, date, tableCount,
  tables: [{ id }],                      // just table ids — positions are computed, not stored (see Classroom Map)
  podium: { pos: {x,y} },                // the ONE movable object; top-left as % of the map canvas (null until first render)
  positions: [{ wallTime, elapsedSec, desc, nearTable, x, y }],  // TA-location log, one entry per tap; x/y are % of the map canvas (nearTable holds "Table N" or "Podium")
  checklist: { "c{categoryIdx}_{itemIdx}": { checked, comment } },  // categoryIdx follows CHECKLIST's current order — see note below
  bestComments, improveComments, overallComments,   // Comments page: "What went best", "What needs improvement", "Additional comments"
  accumMs, segmentStart, timerRunning,    // timer bookkeeping — see currentElapsedSeconds()
  totalSeconds,                            // set once, at endObservation()
  active, createdAt, endedAt,
}
```

Autosaved (debounced) to `localStorage["phys211obs_session_v1"]` on every meaningful change. `tryResume()` offers to restore it on load if a session was left `active`.

---

## Classroom Map Interaction

**Tables are fixed; only the podium moves.** Tables are laid out automatically by `computeMapLayout()` (percent of the canvas, ~4:3 boxes) and can be **added/removed** with the "+ Add table" / "−" buttons (2–16 tables; the last table is dropped when removing). Adding or removing re-spaces all tables; dots logged earlier stay where they were tapped. Tables are never draggable.

- Tapping a **table** logs that table's exact center ("Table N"); each node has its own `click` handler with `stopPropagation()`.
- The **podium** is the one draggable object (`attachPodiumDrag`). It uses **Pointer Events**, not HTML5 drag-and-drop — iPadOS Safari doesn't fire `draggable`/`ondrop` for touch. Moving >6px = drag (repositions, logs nothing); no movement = tap (logs "At the podium" at its center). Its position is stored in `obsSession.podium.pos` (%), so it survives re-renders, resizes, and resume. Keep the drag-vs-tap distinction and the `if (!drag) return;` guards.
- Tapping **open floor** (`logObsPosition`) logs the tap location, or "Near Table N" if within ~55px of a table's center (the podium isn't included in that proximity check — tap it directly).
- Dots are positioned in % and re-created from `obsSession.positions` by `redrawDots()` on every `renderObsMap()` (that's what restores dots on resume and after Undo).
- `renderObsMap()` measures the canvas, so it returns early when the canvas is hidden (Comments page). It's re-run on `showObsPage("observe")` and on window resize/rotation (debounced).
- Canvas height is `clamp(300px, 100dvh − 340px, 640px)` so the map, log, and controls fit an iPad viewport; the left column is sticky while the checklist scrolls.

## Timer

Tracked as `accumMs` (completed running segments) + an optional open `segmentStart` (current running segment). `currentElapsedSeconds()` is the single source of truth — always compute elapsed time through it rather than reading `#obs-timer` back.

---

## CSV Export (`buildCSV()`)

One CSV per observation, in one file: session metadata (incl. total time), the full checklist (all statements, checked or not, with comments), the timestamped position log, and a `=== QUALITATIVE COMMENTS ===` section with What went best / What needs improvement / Additional comments. Column layout is intentionally simple/readable over strictly tidy — see README for how a researcher aggregates multiple exports.

---

## Updating the roster or checklist

Both are plain arrays at the top of `js/main.js` — `TA_ROSTER` and `CHECKLIST`. No other code needs to change when you edit them; the dropdown, checklist UI, and CSV export all read from these arrays directly. `CHECKLIST` is currently ordered Introduction → Discussion Problems — TA Questioning (the old "General" category was removed); reordering the array reorders the UI and the CSV automatically. Note that checklist item ids (`c{categoryIdx}_{itemIdx}`) are positional, so reordering categories changes which id maps to which statement — harmless for a fresh session, but it means an in-progress `localStorage` autosave from before a reorder should be treated as stale (discard it via the resume prompt) rather than resumed.

The checklist is deliberately compact (one ~46px row per statement, checkbox + text + a "Note" button). Tapping **Note** (`toggleNote`) expands a comment box under that row; rows that already have a note start expanded and show an orange "Note ●". `countChecked()` counts only ids that exist in the current `CHECKLIST`, so stale checks from an old autosave (e.g. the removed General category) can't inflate the progress count.

The Observe page is two columns (map 1.25fr / checklist 1fr) down to ~700px wide, then collapses to one column (map on top, checklist below).

---

## Things to Keep in Mind

- **No backend, no auth** — the NetID field is a label, not a credential. Don't build anything here that assumes it's securing data.
- **No build step** — edit the three files directly, refresh to see changes.
- **iPad is the primary target** — keep tap targets ≥44px, avoid hover-only affordances, avoid native HTML5 drag-and-drop (the map has no dragging at all now).
- **localStorage autosave is a single-device safety net only**, not multi-user sync. If real-time cross-device aggregation is ever needed, that requires adding an actual backend (out of scope for this build).
