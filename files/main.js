/* ═══════════════════════════════════════════════════════════════════════
   PHYS 211 Observation Tool — main.js
   Standalone research-observation site. No backend — everything lives in
   this browser tab (with a localStorage safety-net autosave) until the
   mentor TA exports a CSV.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── PHYS 211 discussion-section roster ─────────────────────────────────
   Pulled from https://physics.illinois.edu/academics/courses/phys211
   (Discussion "D__" sections only — lab "L__" sections intentionally
   excluded). Double-check this against the live course schedule each
   semester and edit below — it's just a plain array. */
const TA_ROSTER = [
  { section: "D2A", days: "Tue",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Grant Gallier" },
  { section: "D2B", days: "Tue",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Rebecca Chan" },
  { section: "D2E", days: "Tue",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Aryan Tiwari" },
  { section: "D2F", days: "Tue",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Layla Ahmed" },
  { section: "D2J", days: "Tue",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Logan Mueller" },
  { section: "D2K", days: "Tue",        time: "12:00–1:50 PM",  room: "147 Loomis", ta: "Koichiro Takahashi" },
  { section: "D2M", days: "Tue",        time: "2:00–3:50 PM",   room: "147 Loomis", ta: "Hana Suna Kimlee" },
  { section: "D2N", days: "Tue",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Rebecca Chan" },
  { section: "D2R", days: "Tue",        time: "4:00–5:50 PM",   room: "137 Loomis", ta: "Shahana Lahiri" },
  { section: "D2S", days: "Tue",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Andrew Clarke" },
  { section: "D3A", days: "Wed",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D3B", days: "Wed",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Olivia Bitcon" },
  { section: "D3E", days: "Wed",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Logan Mueller" },
  { section: "D3F", days: "Wed",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Christian Farina" },
  { section: "D3J", days: "Wed",        time: "12:00–1:50 PM",  room: "147 Loomis", ta: "Liam Patrick McGoldrick" },
  { section: "D3K", days: "Wed",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Feyisola Nana" },
  { section: "D3M", days: "Wed",        time: "2:00–3:50 PM",   room: "137 Loomis", ta: "Nishad Manohar" },
  { section: "D3N", days: "Wed",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D3R", days: "Wed",        time: "4:00–5:50 PM",   room: "147 Loomis", ta: "Hana Suna Kimlee" },
  { section: "D3S", days: "Wed",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Feyisola Nana" },
  { section: "D4A", days: "Thu",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D4B", days: "Thu",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Grant Gallier" },
  { section: "D4E", days: "Thu",        time: "10:00–11:50 AM", room: "147 Loomis", ta: "Olivia Bitcon" },
  { section: "D4F", days: "Thu",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Daniela M Girotti-Hernandez" },
  { section: "D4J", days: "Thu",        time: "12:00–1:50 PM",  room: "137 Loomis", ta: "Logan Mueller" },
  { section: "D4K", days: "Thu",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Koichiro Takahashi" },
  { section: "D4M", days: "Thu",        time: "2:00–3:50 PM",   room: "147 Loomis", ta: "Shahana Lahiri" },
  { section: "D4N", days: "Thu",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Olivia Bitcon" },
  { section: "D4R", days: "Thu",        time: "4:00–5:50 PM",   room: "137 Loomis", ta: "Andrew Clarke" },
  { section: "D4S", days: "Thu",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D5A", days: "Fri",        time: "8:00–9:50 AM",   room: "147 Loomis", ta: "Hao-Chien Wang" },
  { section: "D5B", days: "Fri",        time: "8:00–9:50 AM",   room: "143 Loomis", ta: "Nishad Manohar" },
  { section: "D5E", days: "Fri",        time: "10:00–11:50 AM", room: "137 Loomis", ta: "Timothy Matthew Chung" },
  { section: "D5F", days: "Fri",        time: "10:00–11:50 AM", room: "143 Loomis", ta: "Aryan Tiwari" },
  { section: "D5J", days: "Fri",        time: "12:00–1:50 PM",  room: "137 Loomis", ta: "Feyisola Nana" },
  { section: "D5K", days: "Fri",        time: "12:00–1:50 PM",  room: "143 Loomis", ta: "Koichiro Takahashi" },
  { section: "D5M", days: "Fri",        time: "2:00–3:50 PM",   room: "137 Loomis", ta: "Liam Patrick McGoldrick" },
  { section: "D5N", days: "Fri",        time: "2:00–3:50 PM",   room: "143 Loomis", ta: "Nishad Manohar" },
  { section: "D5R", days: "Fri",        time: "4:00–5:50 PM",   room: "143 Loomis", ta: "Georgios Karikos" },
  { section: "D5S", days: "Fri",        time: "4:00–5:50 PM",   room: "147 Loomis", ta: "Andrew Clarke" },
];

/* ── Observation checklist (transcribed from the mentor observation form) ─ */
const CHECKLIST = [
  {
    category: "Introduction",
    items: [
      "Previews discussion content.",
      "Reviews prior material (in 10 mins or less)",
      "Clearly states the instructions and learning goals for the discussion.",
      "All writing on board is large and legible.",
      "Relates current content to past and future material.",
      "Motivates student participation.",
    ],
  },
  {
    category: "Discussion Problems — TA Questioning",
    items: [
      "Listens carefully to students' comments, answers, and questions.",
      "Checks student answers and asks additional questions where appropriate.",
      "Uses hints and questions to help students construct their own understanding (rather than just giving answers)",
      "Recognizes what students do not understand.",
      "Gives students enough time to respond to questions.",
      "Refrains from answering own questions.",
      "Encourages students to answer difficult questions by providing cues and encouragement.",
      "Makes students comfortable with asking/answering questions.",
      "Provides individual and group feedback.",
      "Allows productive student discussion to proceed uninterrupted.",
      "Provides encouragement and recognition of effort",
      "Encourages peer discussion and collaboration.",
      "Gets to all tables at an appropriate pace.",
    ],
  },
];

const STORAGE_KEY = "phys211obs_session_v1";
const LAST_NETID_KEY = "phys211obs_last_netid";

let currentNetID = "";
let obsSession = null;   // the active/observed session object
let tickHandle = null;
let autosaveTimer = null;

/* ── Small utilities ───────────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function csvField(v) {
  if (v === undefined || v === null) v = "";
  v = String(v);
  if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
  return v;
}

function formatTime(totalSeconds) {
  totalSeconds = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function currentElapsedSeconds() {
  if (!obsSession) return 0;
  let ms = obsSession.accumMs || 0;
  if (obsSession.timerRunning && obsSession.segmentStart) ms += Date.now() - obsSession.segmentStart;
  return Math.round(ms / 1000);
}

function autosave() {
  if (!obsSession) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obsSession)); } catch (e) { /* storage unavailable — non-fatal */ }
  }, 350);
}

function clearAutosave() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
}

/* ── Screen 1: NetID entry ─────────────────────────────────────────────── */
function submitNetID() {
  const input = $("netid-input");
  const val = input.value.trim();
  if (!val) {
    $("netid-error").classList.remove("hidden");
    input.focus();
    return;
  }
  $("netid-error").classList.add("hidden");
  currentNetID = val;
  try { localStorage.setItem(LAST_NETID_KEY, val); } catch (e) { /* ignore */ }
  $("setup-observer-label").textContent = "Observer: " + currentNetID;
  resetSetupForm();
  showScreen("screen-setup");
}

function switchUser() {
  if (obsSession && obsSession.active) {
    if (!confirm("Switch NetID now? Your in-progress observation stays saved on this device and you (or whoever enters the same flow) can resume it later.")) return;
  }
  currentNetID = "";
  $("netid-input").value = "";
  showScreen("screen-netid");
  $("netid-input").focus();
}

/* ── Screen 2: Setup ───────────────────────────────────────────────────── */
function populateSectionDropdown() {
  const sel = $("setup-section");
  const sorted = TA_ROSTER.slice().sort((a, b) => a.section.localeCompare(b.section));
  sorted.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.section;
    opt.textContent = `${r.section} — ${r.ta} (${r.days} ${r.time})`;
    sel.appendChild(opt);
  });
}

function onSectionChange() {
  const code = $("setup-section").value;
  const row = TA_ROSTER.find(r => r.section === code);
  $("setup-ta-name").value = row ? row.ta : "";
}

function resetSetupForm() {
  $("setup-section").value = "";
  $("setup-ta-name").value = "";
  $("setup-table-count").value = 6;
  const today = new Date();
  $("setup-date").value = today.toISOString().slice(0, 10);
  $("setup-warning").style.display = "none";
}

function stepTables(delta) {
  const input = $("setup-table-count");
  let v = parseInt(input.value || "6", 10) + delta;
  v = Math.max(2, Math.min(16, v));
  input.value = v;
}

function startObservation() {
  const section = $("setup-section").value;
  const ta = $("setup-ta-name").value;
  const date = $("setup-date").value;
  const n = parseInt($("setup-table-count").value || "6", 10);
  const warn = $("setup-warning");

  if (!section) {
    warn.textContent = "Please select a discussion section before starting.";
    warn.style.display = "block";
    return;
  }
  if (!date) {
    warn.textContent = "Please set the observation date.";
    warn.style.display = "block";
    return;
  }
  warn.style.display = "none";

  obsSession = {
    netid: currentNetID,
    section, ta, date,
    tableCount: n,
    tables: Array.from({ length: n }, (_, i) => ({ id: i + 1 })),
    podium: { pos: null },          // the only movable object on the map; {x,y} in % of canvas
    positions: [],
    checklist: {},
    bestComments: "",
    improveComments: "",
    overallComments: "",
    accumMs: 0,
    segmentStart: Date.now(),
    timerRunning: true,
    totalSeconds: null,
    active: true,
    createdAt: new Date().toISOString(),
  };

  $("obs-title").textContent = `${section} · ${ta}`;
  $("obs-sub").textContent = `Observer ${currentNetID} · ${formatDateNice(date)}`;
  $("map-table-count").value = n;
  $("obs-timer-btn").textContent = "Pause";
  $("obs-comment-best").value = "";
  $("obs-comment-improve").value = "";
  $("obs-overall-comments").value = "";

  showScreen("screen-observe");
  renderChecklist();
  renderPosLog();
  showObsPage("observe");

  clearInterval(tickHandle);
  tickHandle = setInterval(tick, 1000);
  tick();
  autosave();
}

function formatDateNice(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Timer ──────────────────────────────────────────────────────────────── */
function tick() {
  $("obs-timer").textContent = formatTime(currentElapsedSeconds());
}

function toggleObsTimer() {
  if (!obsSession) return;
  const btn = $("obs-timer-btn");
  if (obsSession.timerRunning) {
    obsSession.accumMs += Date.now() - obsSession.segmentStart;
    obsSession.segmentStart = null;
    obsSession.timerRunning = false;
    btn.textContent = "Resume";
  } else {
    obsSession.segmentStart = Date.now();
    obsSession.timerRunning = true;
    btn.textContent = "Pause";
  }
  tick();
  autosave();
}

/* ── Pages (Observe / Comments) ─────────────────────────────────────────── */
function showObsPage(page) {
  document.querySelectorAll(".obs-tab").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  $("obs-page-observe").classList.toggle("hidden", page !== "observe");
  $("obs-page-comments").classList.toggle("hidden", page !== "comments");
  window.scrollTo(0, 0);
  if (page === "observe") renderObsMap();   // needs a visible canvas to measure
}

/* ── Classroom map ──────────────────────────────────────────────────────
   Tables are fixed: they're laid out automatically (as % of the canvas) and
   can be added/removed with the +/− buttons, but never dragged. The PODIUM is
   the one movable object — drag it to match the room; a tap (no movement)
   logs the TA at the podium. */
let mapLayout = { tables: [] };
const FRONT_STRIP_PX = 30;   // height of the "front of room" label strip

function stepTablesLive(delta) {
  if (!obsSession) return;
  let n = obsSession.tableCount + delta;
  n = Math.max(2, Math.min(16, n));
  if (n === obsSession.tableCount) return;
  if (n > obsSession.tableCount) {
    for (let i = obsSession.tableCount; i < n; i++) obsSession.tables.push({ id: i + 1 });
  } else {
    obsSession.tables = obsSession.tables.slice(0, n);
  }
  obsSession.tableCount = n;
  $("map-table-count").value = n;
  renderObsMap();
  autosave();
}

function computeMapLayout(tables, rect) {
  const n = tables.length;
  const areaX = 4, areaW = 92;
  const areaY = (100 / rect.height) * 100;          // leave ~100px up front for the label + podium
  const areaH = 97 - areaY;
  const cols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const cellW = areaW / cols, cellH = areaH / rows;
  const w = cellW * 0.8;
  const h = Math.min(cellH * 0.8, ((w / 100 * rect.width) * 0.75) / rect.height * 100);  // keep tables roughly 4:3
  return tables.map((t, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    return {
      id: t.id, w, h,
      x: areaX + col * cellW + (cellW - w) / 2,
      y: areaY + row * cellH + (cellH - h) / 2,
    };
  });
}

function renderObsMap() {
  const canvas = $("obs-canvas");
  if (!canvas || !obsSession) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;   // canvas hidden (Comments page)
  canvas.querySelectorAll(".map-table-node, .map-landmark-node").forEach(n => n.remove());

  // Podium (draggable). Default: front-left, under the label strip.
  if (!obsSession.podium) obsSession.podium = { pos: null };
  if (!obsSession.podium.pos) obsSession.podium.pos = { x: 4, y: ((FRONT_STRIP_PX + 8) / rect.height) * 100 };
  const pos = obsSession.podium.pos;
  const podium = document.createElement("div");
  podium.className = "map-landmark-node podium";
  podium.style.left = pos.x + "%";
  podium.style.top = pos.y + "%";
  podium.innerHTML = '<div class="lm-label">PODIUM</div>';
  canvas.appendChild(podium);
  attachPodiumDrag(podium, pos, () => {
    const r = canvas.getBoundingClientRect();
    logAt(pos.x + (podium.offsetWidth / 2) / r.width * 100,
          pos.y + (podium.offsetHeight / 2) / r.height * 100, "At the podium", "Podium");
  });

  // Tables (fixed)
  mapLayout.tables = computeMapLayout(obsSession.tables, rect);
  mapLayout.tables.forEach(t => {
    const node = document.createElement("div");
    node.className = "map-table-node";
    node.style.left = t.x + "%";
    node.style.top = t.y + "%";
    node.style.width = t.w + "%";
    node.style.height = t.h + "%";
    node.innerHTML = `<div class="t-label">TABLE</div><div class="t-num">${t.id}</div>`;
    node.addEventListener("click", e => {
      e.stopPropagation();
      logAt(t.x + t.w / 2, t.y + t.h / 2, `Table ${t.id}`, `Table ${t.id}`);
    });
    canvas.appendChild(node);
  });

  redrawDots();
}

/* Pointer-based drag for the podium only (works for mouse AND touch; HTML5
   drag-and-drop does not fire on iPadOS). Moving more than ~6px = drag
   (repositions, logs nothing); no movement = tap (onTap logs the position). */
function attachPodiumDrag(node, pos, onTap) {
  let drag = null;
  node.addEventListener("click", e => e.stopPropagation());
  node.addEventListener("pointerdown", e => {
    e.stopPropagation();
    drag = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
    try { node.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  node.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    const r = $("obs-canvas").getBoundingClientRect();
    const wPct = node.offsetWidth / r.width * 100, hPct = node.offsetHeight / r.height * 100;
    const minY = FRONT_STRIP_PX / r.height * 100;
    pos.x = Math.max(0, Math.min(drag.ox + dx / r.width * 100, 100 - wPct));
    pos.y = Math.max(minY, Math.min(drag.oy + dy / r.height * 100, 100 - hPct));
    node.style.left = pos.x + "%";
    node.style.top = pos.y + "%";
  });
  node.addEventListener("pointerup", () => {
    if (!drag) return;
    if (drag.moved) autosave(); else onTap();
    drag = null;
  });
  node.addEventListener("pointercancel", () => { drag = null; });
}

/* Tap on a table or the podium: log the exact center of that object. */
function logAt(xPct, yPct, desc, near) {
  if (!obsSession) return;
  const x = Math.round(xPct), y = Math.round(yPct);
  drawDot(x, y, obsSession.positions.length + 1);
  addPositionLog(desc, near, x, y);
}

/* Tap on open floor: log where they tapped, or "Near Table N" if close to one. */
function logObsPosition(event) {
  if (event.target.closest(".map-table-node, .map-landmark-node")) return;
  if (!obsSession) return;
  const rect = $("obs-canvas").getBoundingClientRect();
  const xPct = ((event.clientX - rect.left) / rect.width) * 100;
  const yPct = ((event.clientY - rect.top) / rect.height) * 100;

  let nearest = null, minDist = Infinity;
  mapLayout.tables.forEach(t => {
    const dx = (xPct - (t.x + t.w / 2)) / 100 * rect.width;
    const dy = (yPct - (t.y + t.h / 2)) / 100 * rect.height;
    const d = Math.hypot(dx, dy);
    if (d < minDist) { minDist = d; nearest = t; }
  });
  const near = minDist < 55 ? nearest : null;
  const x = Math.round(xPct), y = Math.round(yPct);
  const desc = near ? `Near Table ${near.id}` : `Open area (${x}%, ${y}%)`;

  drawDot(x, y, obsSession.positions.length + 1);
  addPositionLog(desc, near ? `Table ${near.id}` : "", x, y);
}

function drawDot(xPct, yPct, num) {
  const dot = document.createElement("div");
  dot.className = "map-dot";
  dot.style.left = xPct + "%";
  dot.style.top = yPct + "%";
  const label = document.createElement("span");
  label.className = "dot-num";
  label.textContent = num;
  dot.appendChild(label);
  $("obs-canvas").appendChild(dot);
}

function redrawDots() {
  const canvas = $("obs-canvas");
  canvas.querySelectorAll(".map-dot").forEach(d => d.remove());
  if (!obsSession) return;
  obsSession.positions.forEach((p, i) => drawDot(p.x, p.y, i + 1));
}

function addPositionLog(desc, nearTable, xPct, yPct) {
  obsSession.positions.push({
    wallTime: new Date().toLocaleTimeString(),
    elapsedSec: currentElapsedSeconds(),
    desc, nearTable, x: xPct, y: yPct,
  });
  renderPosLog();
  autosave();
}

function undoLastPosition() {
  if (!obsSession || !obsSession.positions.length) return;
  obsSession.positions.pop();
  redrawDots();
  renderPosLog();
  autosave();
}

function renderPosLog() {
  const log = $("obs-pos-log");
  const count = $("obs-pos-count");
  if (!log || !obsSession) return;
  log.innerHTML = obsSession.positions.slice().reverse().map(p => `
    <div class="map-log-row">
      <span class="map-log-time">${formatTime(p.elapsedSec)}</span>
      <span class="map-log-desc">${p.desc}</span>
    </div>`).join("") || `<div class="map-log-empty">Tap the map to start logging the TA's location</div>`;
  count.textContent = `${obsSession.positions.length} position${obsSession.positions.length === 1 ? "" : "s"} logged`;
}

/* ── Checklist ──────────────────────────────────────────────────────────── */
const CHECK_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M2 8l4 4 8-8"/></svg>';

function renderChecklist() {
  const container = $("checklist-container");
  if (!container || !obsSession) return;
  container.innerHTML = CHECKLIST.map((cat, ci) => `
    <div class="check-category">
      <div class="check-category-title">${cat.category}</div>
      ${cat.items.map((text, ii) => {
        const id = `c${ci}_${ii}`;
        const st = obsSession.checklist[id] || { checked: false, comment: "" };
        const hasNote = !!(st.comment && st.comment.trim());
        return `<div class="check-item ${st.checked ? "checked" : ""} ${hasNote ? "open" : ""}" id="item-${id}">
          <div class="check-item-row" onclick="toggleCheck('${id}')">
            <div class="check-box">${st.checked ? CHECK_SVG : ""}</div>
            <div class="check-item-text">${text}</div>
          </div>
          <button type="button" class="note-btn ${hasNote ? "has-note" : ""}" onclick="toggleNote('${id}')">Note</button>
          <textarea class="check-comment" placeholder="Optional note…" oninput="updateComment('${id}', this.value)">${escapeHTML(st.comment)}</textarea>
        </div>`;
      }).join("")}
    </div>`).join("");
  updateChecklistProgress();
}

function toggleNote(id) {
  const el = $("item-" + id);
  if (!el) return;
  el.classList.toggle("open");
  if (el.classList.contains("open")) el.querySelector(".check-comment").focus();
}

function escapeHTML(s) {
  return String(s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function toggleCheck(id) {
  if (!obsSession) return;
  if (!obsSession.checklist[id]) obsSession.checklist[id] = { checked: false, comment: "" };
  obsSession.checklist[id].checked = !obsSession.checklist[id].checked;
  const el = $("item-" + id);
  if (el) {
    el.classList.toggle("checked", obsSession.checklist[id].checked);
    el.querySelector(".check-box").innerHTML = obsSession.checklist[id].checked ? CHECK_SVG : "";
  }
  updateChecklistProgress();
  autosave();
}

function updateComment(id, val) {
  if (!obsSession) return;
  if (!obsSession.checklist[id]) obsSession.checklist[id] = { checked: false, comment: "" };
  obsSession.checklist[id].comment = val;
  const btn = document.querySelector(`#item-${id} .note-btn`);
  if (btn) btn.classList.toggle("has-note", !!val.trim());
  autosave();
}

/* Counts only ids that exist in the current CHECKLIST, so stale entries in an
   old autosave (e.g. from the removed "General" category) can't inflate it. */
function countChecked() {
  let n = 0;
  CHECKLIST.forEach((cat, ci) => cat.items.forEach((_, ii) => {
    const st = obsSession.checklist[`c${ci}_${ii}`];
    if (st && st.checked) n++;
  }));
  return n;
}

function updateChecklistProgress() {
  const total = CHECKLIST.reduce((sum, c) => sum + c.items.length, 0);
  $("checklist-progress").textContent = `${countChecked()} / ${total} checked`;
}

/* ── Qualitative comments (page 2) ─────────────────────────────────────── */
function bindComments() {
  [["obs-comment-best", "bestComments"],
   ["obs-comment-improve", "improveComments"],
   ["obs-overall-comments", "overallComments"]].forEach(([id, key]) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => {
      if (obsSession) { obsSession[key] = el.value; autosave(); }
    });
  });
}

/* ── End & export ──────────────────────────────────────────────────────── */
let lastCSV = null;
let lastFilename = null;

function endObservation() {
  if (!obsSession) return;
  if (!confirm("End this observation and export the CSV? You can download it again afterward if needed.")) return;

  if (obsSession.timerRunning) {
    obsSession.accumMs += Date.now() - obsSession.segmentStart;
    obsSession.segmentStart = null;
    obsSession.timerRunning = false;
  }
  clearInterval(tickHandle);
  obsSession.totalSeconds = currentElapsedSeconds();
  obsSession.active = false;
  obsSession.endedAt = new Date().toISOString();

  lastCSV = buildCSV(obsSession);
  lastFilename = buildFilename(obsSession);
  downloadCSV(lastCSV, lastFilename);
  clearAutosave();

  const checkedCount = countChecked();
  const totalItems = CHECKLIST.reduce((s, c) => s + c.items.length, 0);
  $("done-summary").textContent =
    `${obsSession.ta} · ${obsSession.section} · ${formatDateNice(obsSession.date)} — ` +
    `${formatTime(obsSession.totalSeconds)} observed, ${checkedCount}/${totalItems} checklist items, ${obsSession.positions.length} positions logged.`;

  showScreen("screen-done");
}

function downloadCSVAgain() {
  if (lastCSV) downloadCSV(lastCSV, lastFilename);
}

function newObservation() {
  obsSession = null;
  resetSetupForm();
  showScreen("screen-setup");
}

function buildFilename(s) {
  const safe = str => String(str).replace(/[^a-z0-9]+/gi, "_");
  return `phys211_obs_${safe(s.section)}_${s.date}_${safe(s.netid)}.csv`;
}

function buildCSV(s) {
  const lines = [];
  lines.push("PHYS 211 Discussion Observation Export");
  lines.push(`Exported,${csvField(new Date().toLocaleString())}`);
  lines.push(`Observer NetID,${csvField(s.netid)}`);
  lines.push(`TA Observed,${csvField(s.ta)}`);
  lines.push(`Section,${csvField(s.section)}`);
  lines.push(`Observation Date,${csvField(s.date)}`);
  lines.push(`Number of Tables,${csvField(s.tableCount)}`);
  lines.push(`Total Observation Time,${csvField(formatTime(s.totalSeconds))}`);
  lines.push(`Total Observation Time (seconds),${csvField(s.totalSeconds)}`);
  lines.push("");
  lines.push("=== CHECKLIST ===");
  lines.push(["Category", "Statement", "Checked", "Comment"].map(csvField).join(","));
  CHECKLIST.forEach((cat, ci) => {
    cat.items.forEach((text, ii) => {
      const id = `c${ci}_${ii}`;
      const st = s.checklist[id] || { checked: false, comment: "" };
      lines.push([cat.category, text, st.checked ? "Yes" : "No", st.comment || ""].map(csvField).join(","));
    });
  });
  lines.push("");
  lines.push("=== TA POSITION LOG ===");
  lines.push(["#", "WallClockTime", "ElapsedSeconds", "Description", "Location", "X%", "Y%"].map(csvField).join(","));
  s.positions.forEach((p, i) => {
    lines.push([i + 1, p.wallTime, p.elapsedSec, p.desc, p.nearTable || "", p.x, p.y].map(csvField).join(","));
  });
  lines.push("");
  lines.push("=== QUALITATIVE COMMENTS ===");
  lines.push(["Prompt", "Comment"].map(csvField).join(","));
  lines.push(["What went best", s.bestComments || ""].map(csvField).join(","));
  lines.push(["What needs improvement", s.improveComments || ""].map(csvField).join(","));
  lines.push(["Additional comments", s.overallComments || ""].map(csvField).join(","));
  return lines.join("\n");
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ── Resume an in-progress observation (localStorage safety net) ─────────
   Static hosting means nothing syncs between devices — this only protects
   against an accidental tab reload on the SAME iPad mid-observation. */
function tryResume() {
  let saved;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    saved = JSON.parse(raw);
  } catch (e) { return; }
  if (!saved || !saved.active) return;

  let ms = saved.accumMs || 0;
  if (saved.timerRunning && saved.segmentStart) ms += Date.now() - saved.segmentStart;
  const elapsedMin = Math.round(ms / 60000);

  const resume = confirm(
    `You have an in-progress observation for ${saved.ta} (${saved.section}), about ${elapsedMin} min logged.\n\nResume it? (Cancel discards it.)`
  );
  if (!resume) { clearAutosave(); return; }

  obsSession = saved;
  if (obsSession.segmentStart) obsSession.accumMs += Date.now() - obsSession.segmentStart;
  obsSession.segmentStart = null;
  obsSession.timerRunning = false;
  currentNetID = obsSession.netid;

  $("setup-observer-label").textContent = "Observer: " + currentNetID;
  $("obs-title").textContent = `${obsSession.section} · ${obsSession.ta}`;
  $("obs-sub").textContent = `Observer ${obsSession.netid} · ${formatDateNice(obsSession.date)}`;
  $("map-table-count").value = obsSession.tableCount;
  $("obs-comment-best").value = obsSession.bestComments || "";
  $("obs-comment-improve").value = obsSession.improveComments || "";
  $("obs-overall-comments").value = obsSession.overallComments || "";
  $("obs-timer-btn").textContent = "Resume";

  showScreen("screen-observe");
  renderChecklist();
  renderPosLog();
  showObsPage("observe");
  tick();
  autosave();
}

/* ── Init ───────────────────────────────────────────────────────────────── */
populateSectionDropdown();
bindComments();
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (obsSession && !$("obs-page-observe").classList.contains("hidden") && !$("screen-observe").classList.contains("hidden")) renderObsMap(); }, 150);
});
try {
  const remembered = localStorage.getItem(LAST_NETID_KEY);
  if (remembered) $("netid-input").value = remembered;
} catch (e) { /* ignore */ }
tryResume();
