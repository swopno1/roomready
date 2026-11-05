// RoomReady — offline-first housekeeping. All data lives in localStorage.
// Zero network calls: no fetch, no CDN, no analytics. The service worker
// (sw.js) caches every local asset on first load.

const STORE_KEY = 'roomready.v1';

const CHECKLIST = [
  'Change bed linen',
  'Fresh towels & toiletries',
  'Vacuum & mop floors',
  'Bathroom deep clean',
  'Check minibar & restock',
  'AC, lights & sockets check',
  'Balcony / veranda tidy',
  'Final walkthrough',
];

const SEED_ROOMS = [
  // [unit name, type, status, assignee]
  ['Terracotta Villa 01', 'Terracotta Villa', 'ready', 'Rina'],
  ['Terracotta Villa 02', 'Terracotta Villa', 'dirty', 'Rina'],
  ['Terracotta Villa 03', 'Terracotta Villa', 'cleaning', 'Karim'],
  ['Terracotta Villa 04', 'Terracotta Villa', 'ooo', '—'],
  ['Bamboo Cottage 01', 'Bamboo Cottage', 'ready', 'Shila'],
  ['Bamboo Cottage 02', 'Bamboo Cottage', 'dirty', 'Shila'],
  ['Bamboo Cottage 03', 'Bamboo Cottage', 'cleaning', 'Rina'],
  ['Bamboo Cottage 04', 'Bamboo Cottage', 'inspected', 'Karim'],
  ['Bamboo Cottage 05', 'Bamboo Cottage', 'ready', 'Shila'],
  ['Bamboo Cottage 06', 'Bamboo Cottage', 'dirty', 'Karim'],
  ['Clay House Suite 01', 'Clay House Suite', 'ready', 'Rina'],
  ['Clay House Suite 02', 'Clay House Suite', 'cleaning', 'Shila'],
  ['Clay House Suite 03', 'Clay House Suite', 'dirty', 'Karim'],
  ['Clay House Suite 04', 'Clay House Suite', 'inspected', 'Rina'],
  ['Palm Loft 01', 'Palm Loft', 'ready', 'Shila'],
  ['Palm Loft 02', 'Palm Loft', 'dirty', 'Rina'],
  ['Palm Loft 03', 'Palm Loft', 'cleaning', 'Karim'],
  ['Palm Loft 04', 'Palm Loft', 'ready', 'Shila'],
  ['Earth Lodge 01', 'Earth Lodge', 'dirty', 'Karim'],
  ['Earth Lodge 02', 'Earth Lodge', 'cleaning', 'Rina'],
  ['Earth Lodge 03', 'Earth Lodge', 'ready', 'Shila'],
];

const SEED_TICKETS = [
  { room: 'Terracotta Villa 04', title: 'AC not cooling in bedroom', priority: 'urgent', status: 'open' },
  { room: 'Bamboo Cottage 02', title: 'Leaky tap in bathroom', priority: 'high', status: 'open' },
  { room: 'Earth Lodge 01', title: 'Replace cracked window pane', priority: 'medium', status: 'open' },
  { room: 'Clay House Suite 03', title: 'Wi-Fi extender offline (room only)', priority: 'low', status: 'done' },
];

const STATUS_LABEL = {
  ready: 'Ready', dirty: 'Dirty', cleaning: 'Cleaning',
  inspected: 'Inspected', ooo: 'Out of order',
};
const NEXT_STATUS = {
  dirty: 'cleaning', cleaning: 'inspected', inspected: 'ready',
  ready: 'dirty', ooo: 'dirty',
};
const NEXT_LABEL = {
  dirty: 'Start cleaning', cleaning: 'Mark inspected', inspected: 'Mark ready',
  ready: 'Mark dirty', ooo: 'Return to service',
};

// ---------- store ----------
function seed() {
  const rooms = SEED_ROOMS.map(([name, type, status, assignee], i) => ({
    id: 'r' + (i + 1),
    name, type, status, assignee,
    updatedAt: Date.now(),
    checks: status === 'ready' || status === 'inspected'
      ? CHECKLIST.map(() => true)
      : CHECKLIST.map(() => false),
    note: '',
  }));
  const tickets = SEED_TICKETS.map((t, i) => ({
    id: 't' + (i + 1), ...t, createdAt: Date.now() - (i + 1) * 3600e3,
  }));
  return { rooms, tickets, seq: { room: rooms.length + 1, ticket: tickets.length + 1 } };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted storage: reseed */ }
  const data = seed();
  save(data);
  return data;
}
function save(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }

let db = load();
let currentRoom = null;

// ---------- helpers ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const timeAgo = (ts) => {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.round(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.round(h / 24) + 'd ago';
};
const roomProgress = (r) => r.checks.filter(Boolean).length + '/' + r.checks.length;

// ---------- views ----------
function showView(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
  const el = $('#view-' + name);
  if (el) el.classList.add('active');
  if (name === 'dashboard') renderDashboard();
  if (name === 'rooms') renderRooms();
  if (name === 'tickets') renderTickets();
  if (name === 'about') renderAbout();
  window.scrollTo(0, 0);
}
$$('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
$('#backToRooms').addEventListener('click', () => showView('rooms'));

function renderDashboard() {
  const rooms = db.rooms;
  const count = (s) => rooms.filter(r => r.status === s).length;
  $('#stats').innerHTML = [
    [rooms.length, 'Rooms'],
    [count('ready'), 'Ready'],
    [count('dirty'), 'Dirty'],
    [count('cleaning'), 'Cleaning'],
    [db.tickets.filter(t => t.status === 'open').length, 'Open tickets'],
  ].map(([n, l]) => `<div class="stat"><strong>${n}</strong><span>${l}</span></div>`).join('');

  const attention = rooms.filter(r => r.status === 'ooo' || r.status === 'dirty');
  $('#attentionList').innerHTML = attention.length
    ? attention.map(roomCard).join('')
    : '<div class="card"><p class="muted">Nothing needs attention. All rooms are on track.</p></div>';

  const turnover = rooms.filter(r => r.status === 'cleaning' || r.status === 'inspected');
  $('#turnoverList').innerHTML = turnover.length
    ? turnover.map(roomCard).join('')
    : '<div class="card"><p class="muted">No rooms in turnover right now.</p></div>';
  bindRoomCards();
}

function roomCard(r) {
  return `<article class="card room-card" data-room="${r.id}">
    <div class="room-head">
      <h3>${esc(r.name)}</h3>
      <span class="pill ${r.status}">${STATUS_LABEL[r.status]}</span>
    </div>
    <div class="room-type">${esc(r.type)} · ${esc(r.assignee)} · updated ${timeAgo(r.updatedAt)}</div>
    <div class="progress"><div style="width:${(r.checks.filter(Boolean).length / r.checks.length) * 100}%"></div></div>
    <div class="room-meta"><span>Checklist ${roomProgress(r)}</span></div>
  </article>`;
}

function bindRoomCards() {
  $$('.room-card').forEach(c => c.addEventListener('click', () => openRoom(c.dataset.room)));
}

function renderRooms() {
  const q = ($('#roomSearch').value || '').toLowerCase();
  const f = $('#statusFilter').value;
  const list = db.rooms.filter(r =>
    (!f || r.status === f) &&
    (!q || (r.name + ' ' + r.type + ' ' + r.assignee).toLowerCase().includes(q)));
  $('#roomList').innerHTML = list.length
    ? list.map(roomCard).join('')
    : '<div class="card"><p class="muted">No rooms match.</p></div>';
  bindRoomCards();
}
$('#roomSearch').addEventListener('input', renderRooms);
$('#statusFilter').addEventListener('change', renderRooms);

function openRoom(id) {
  const r = db.rooms.find(x => x.id === id);
  if (!r) return;
  currentRoom = id;
  const done = r.checks.filter(Boolean).length;
  $('#roomDetail').innerHTML = `
    <div class="card">
      <div class="room-head"><h2>${esc(r.name)}</h2><span class="pill ${r.status}">${STATUS_LABEL[r.status]}</span></div>
      <p class="muted">${esc(r.type)} · Assigned to ${esc(r.assignee)} · updated ${timeAgo(r.updatedAt)}</p>
      <div class="progress"><div style="width:${(done / r.checks.length) * 100}%"></div></div>
      <p>Checklist ${done}/${r.checks.length} complete</p>
      <div class="btn-row">
        <button class="btn primary" id="advanceStatus">${NEXT_LABEL[r.status]}</button>
        ${r.status !== 'ooo' ? '<button class="btn danger" id="markOoo">Mark out of order</button>' : ''}
      </div>
    </div>
    <div class="card">
      <h2>Turnover checklist</h2>
      ${CHECKLIST.map((task, i) => `
        <label class="check">
          <input type="checkbox" data-check="${i}" ${r.checks[i] ? 'checked' : ''}>
          <span class="${r.checks[i] ? 'done' : ''}">${esc(task)}</span>
        </label>`).join('')}
    </div>
    <div class="card">
      <h2>Room note</h2>
      <p class="muted">${esc(r.note) || 'No note yet.'}</p>
      <div class="btn-row">
        <button class="btn small" id="editNote">Add / edit note</button>
      </div>
    </div>`;
  showView('room');
  $('#advanceStatus').addEventListener('click', () => {
    r.status = NEXT_STATUS[r.status];
    if (r.status === 'ready') r.checks = CHECKLIST.map(() => true);
    if (r.status === 'dirty') r.checks = CHECKLIST.map(() => false);
    r.updatedAt = Date.now();
    save(db); openRoom(id);
  });
  const oooBtn = $('#markOoo');
  if (oooBtn) oooBtn.addEventListener('click', () => {
    r.status = 'ooo'; r.updatedAt = Date.now(); save(db); openRoom(id);
  });
  $$('#roomDetail input[type=checkbox]').forEach(cb => cb.addEventListener('change', () => {
    r.checks[+cb.dataset.check] = cb.checked;
    r.updatedAt = Date.now(); save(db); openRoom(id);
  }));
  $('#editNote').addEventListener('click', () => {
    const note = prompt('Room note for ' + r.name + ':', r.note || '');
    if (note !== null) { r.note = note.slice(0, 200); r.updatedAt = Date.now(); save(db); openRoom(id); }
  });
}

function renderTickets() {
  const sel = $('#ticketRoom');
  sel.innerHTML = db.rooms.map(r => `<option value="${esc(r.name)}">${esc(r.name)}</option>`).join('');
  const open = db.tickets.filter(t => t.status === 'open');
  const done = db.tickets.filter(t => t.status === 'done');
  $('#ticketCount').textContent = open.length;
  const card = (t) => `<article class="card">
    <div class="room-head"><h3>${esc(t.title)}</h3><span class="pill ${t.status}">${t.status}</span></div>
    <div class="room-meta">
      <span>${esc(t.room)}</span>
      <span class="pill ${t.priority}">${t.priority}</span>
      <span>${timeAgo(t.createdAt)}</span>
    </div>
    ${t.status === 'open' ? `<div class="btn-row"><button class="btn small" data-close="${t.id}">Mark done</button></div>` : ''}
  </article>`;
  $('#ticketList').innerHTML =
    (open.length ? open.map(card).join('') : '<div class="card"><p class="muted">No open tickets.</p></div>') +
    (done.length ? '<h2>Resolved</h2>' + done.map(card).join('') : '');
  $$('#ticketList [data-close]').forEach(b => b.addEventListener('click', () => {
    const t = db.tickets.find(x => x.id === b.dataset.close);
    if (t) { t.status = 'done'; save(db); renderTickets(); renderDashboard(); }
  }));
}
$('#ticketForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#ticketTitle').value.trim();
  if (!title) return;
  db.tickets.unshift({
    id: 't' + (db.seq.ticket++),
    room: $('#ticketRoom').value,
    title,
    priority: $('#ticketPriority').value,
    status: 'open',
    createdAt: Date.now(),
  });
  save(db);
  $('#ticketTitle').value = '';
  renderTickets();
});

// ---------- network indicator ----------
function renderNet() {
  const online = navigator.onLine;
  $('#netBadge').classList.toggle('offline', !online);
  $('#netLabel').textContent = online ? 'Online' : 'Offline — still working';
  const proof = $('#proofNet');
  if (proof) proof.textContent = online ? 'Online (app works either way)' : 'Offline — app fully functional';
}
window.addEventListener('online', renderNet);
window.addEventListener('offline', renderNet);

function renderAbout() {
  renderNet();
  $('#proofSW').textContent = ('serviceWorker' in navigator)
    ? (navigator.serviceWorker.controller ? 'Active — app cached' : 'Registered — reload once to activate')
    : 'Not supported by this browser';
  try {
    const bytes = (localStorage.getItem(STORE_KEY) || '').length;
    $('#proofStore').textContent = `${db.rooms.length} rooms, ${db.tickets.length} tickets · ${(bytes / 1024).toFixed(1)} KB on-device`;
  } catch (e) {
    $('#proofStore').textContent = 'Unavailable';
  }
}
$('#resetDemo').addEventListener('click', () => {
  if (confirm('Reset all rooms, checklists and tickets to the demo seed data?')) {
    db = seed(); save(db); renderDashboard(); showView('dashboard');
  }
});

// ---------- boot ----------
renderNet();
renderTickets();
showView('dashboard');
