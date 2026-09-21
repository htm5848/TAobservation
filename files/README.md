# PHYS 211 Observation Tool

A standalone, iPad-friendly classroom-observation tool for PHYS 211 mentor TAs. Separate from (and independent of) the main Physics TA Hub — this is the research/observation piece only.

## What it does

1. A mentor TA enters their UIUC NetID (no password — it's just used to label the export).
2. They set up a session: discussion section (auto-fills the TA being observed), date, and number of tables in the room (adjustable 2–12, default 6).
3. During the observation they can:
   - **Observe page:** on the left, tap the classroom map to log where the observed TA is, with a timestamp (tables are fixed and can be added/removed; the podium can be dragged to match the room), with the running position log directly below. On the right, a compact checklist (Introduction → Discussion Problems): tap a statement to check it, and tap **Note** for an optional comment.
   - **Comments page** (switch with the Observe / Comments toggle in the top bar): qualitative reflection — *What went best*, *What needs improvement*, and *Additional comments*.
   - Watch a running timer (pause/resume if needed) that tracks total time observed.
4. "End & Export" stops the timer and downloads a single CSV with everything: session info, total time, the full checklist (checked/unchecked + comments), the timestamped position log, and the qualitative comments.

## No backend, by design

Like the main TA Hub, this is plain HTML/CSS/JS with no build step and no server — it can be hosted for free on GitHub Pages. Each mentor TA's data lives only in their own browser tab until they export the CSV; there's no shared database. Collect the exported CSVs (e.g. a shared Drive folder or email) to aggregate observation time and checklist data across TAs and sessions.

A lightweight autosave (`localStorage`) protects against an accidental tab reload mid-observation on the same device — it is not a sync mechanism between devices.

## File structure

```
index.html        # NetID entry, setup, observation workspace, done screen
css/styles.css     # All styles — tokens shared visually with the main TA Hub
js/main.js         # Roster data, checklist data, state, map/timer/CSV logic
```

## Updating the TA roster or checklist

Both live as plain arrays at the top of `js/main.js`:

- `TA_ROSTER` — one row per discussion section (`section`, `days`, `time`, `room`, `ta`). Pulled from the PHYS 211 course schedule at https://physics.illinois.edu/academics/courses/phys211 (discussion "D__" sections only; lab "L__" sections excluded) — **verify this against the live schedule each semester**, section assignments change.
- `CHECKLIST` — an array of `{ category, items: [...] }`, in display order (currently Introduction → Discussion Problems — TA Questioning). Edit statement text, reorder categories, or add/remove items freely; the checklist UI and CSV export rebuild from this automatically.

## Deploying to GitHub Pages

This is a brand-new, separate site — it does not touch the existing `ta-pd-website` repo or live URL.

```bash
cd /path/to/phys211-observation-hub
git init
git add index.html css/styles.css js/main.js README.md .gitignore
git commit -m "Initial commit: PHYS 211 observation tool"
git branch -M main
git remote add origin https://github.com/<your-username>/<new-repo-name>.git
git push -u origin main
```

Then in the new repo's Settings → Pages, set the source to the `main` branch (root). The site will be live at `https://<your-username>.github.io/<new-repo-name>/` within about a minute.

## Testing notes

Verified with an automated browser pass (iPad landscape, portrait, and a smaller landscape viewport): NetID → setup → section autofill → Observe page → tables stay put when dragged → podium drags without logging a spurious point and logs when tapped → adding tables up to 16 with no overlaps (podium position preserved) → compact checklist with notes → Comments page → reload/resume restores everything → CSV export includes the qualitative comments, with no app errors.
