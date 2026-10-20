# PHYS 211 Observation Tool

An iPad-friendly classroom-observation tool for PHYS 211 mentor TAs at UIUC.

**Live site:** https://htm5848.github.io/TAobservation/

## How a mentor TA uses it

1. Enter your UIUC NetID (no password — it only labels the export).
2. Pick the discussion section (the TA's name fills in), the date, and the number of tables in the room.
3. During the discussion:
   - **Map (left):** tap a table, anywhere in its area, the podium, or the front of the room each time the TA moves. Each tap is timestamped. Drag the podium to match the room; add or remove tables with − / +.
   - **Checklist (right):** tap a statement when you see it; tap **Note** to add a comment.
   - **Comments tab:** what went best, what needs improvement, and anything else.
4. Tap **End & Export**. If the comments are empty you'll be reminded (you can still export and add them to the CSV later).
5. Files you get:
   - **CSV** — session info, total time, the checklist (checked / comment), the timestamped TA position log, and the comments.
   - **PNG** — the room map with every TA position: dot size = time spent there, color = order (red → purple).

   On iPad the CSV downloads automatically; tap **Download position map (PNG)** on the last screen to save the map. Both go to the Files app → Downloads.

## Data and privacy

There is no server or database. Everything stays in the observer's browser until they export, and nothing is sent anywhere. Collect the exported files (shared folder or email) to analyze them.

The in-progress observation is also kept in the browser's local storage, so an accidental reload or closed tab on the **same device** can be resumed. It does not sync between devices.

## Updating the tool

All content lives in plain arrays at the top of `js/main.js`:

- **`TA_ROSTER`** — one row per discussion section (`section`, `days`, `time`, `room`, `ta`). From the [PHYS 211 course page](https://physics.illinois.edu/academics/courses/phys211) (discussion "D__" sections only). **Check this at the start of every semester** — TA assignments change.
- **`CHECKLIST`** — categories and statements, in display order. The page and the CSV both rebuild from it.

Don't change the checklist while an observation is in progress on someone's device: saved checkmarks are stored by position in the list.

## Files

```
index.html       Screens: NetID, setup, observation, comments reminder, done
css/styles.css   All styles
js/main.js       Roster, checklist, map, timer, CSV and PNG export
```

Plain HTML/CSS/JavaScript — no build step. Pushing to `main` updates the live site through GitHub Pages in about a minute.
