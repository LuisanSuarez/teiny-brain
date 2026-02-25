const KEY = 'tao-of-life-v3';
const PHRASE_KEY = 'tao-sync-phrase';
const seed = [
  { id: crypto.randomUUID(), title: 'Presence before optimization', body: 'Tonight, rest is strategy. Be where you are.', note: 'Do one slow breath before opening another tab.', favorite: true, lived: false, createdAt: Date.now() },
  { id: crypto.randomUUID(), title: 'Small honest steps', body: 'One clean action beats ten grand plans.', note: 'Pick one promise and keep it today.', favorite: false, lived: true, createdAt: Date.now() },
  { id: crypto.randomUUID(), title: 'Protect your weirdness', body: 'If a plan feels too respectable, add one tiny wild move.', note: 'Wild does not mean reckless. It means alive.', favorite: false, lived: false, createdAt: Date.now() },
  { id: crypto.randomUUID(), title: 'Ship before shame', body: 'Create first, cringe later, improve forever.', note: '', favorite: false, lived: false, createdAt: Date.now() }
];

const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') ?? seed;
const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));
let items = load();
let editingId = null;
let focusMode = false;
let focusIndex = 0;
let showNote = false;
let chromeHidden = false;
let spiceLevel = Number(localStorage.getItem('tao-spice-level') || 1);

const oraclePrompts = [
  'What are you pretending is hard that is really just one decision?',
  'If tonight had one sacred move, what would it be?',
  'What would Future-You thank you for doing in 12 minutes?',
  'Illegal-feeling-but-legal move: what polite rule can you stop obeying?',
  'What are you over-explaining because you are avoiding action?'
];

const $ = (id) => document.getElementById(id);
const form = $('maximForm');
const list = $('list');
const syncPhraseInput = $('syncPhrase');
const phraseHint = $('phraseHint');

const sorted = () => [...items].sort((a, b) => b.createdAt - a.createdAt);

function renderList() {
  list.innerHTML = '';
  for (const item of sorted()) {
    const node = $('itemTpl').content.firstElementChild.cloneNode(true);
    node.dataset.id = item.id;
    node.querySelector('h3').textContent = item.title;
    node.querySelector('.body').textContent = item.body;
    node.querySelector('.meta').textContent = `${item.favorite ? '★ Favorite' : '☆'} · ${item.lived ? 'Lived today' : 'Not lived yet'}${item.note ? ' · Has note' : ''}`;
    node.querySelector('[data-act="favorite"]').textContent = item.favorite ? 'Unfavorite' : 'Favorite';
    node.querySelector('[data-act="lived"]').textContent = item.lived ? 'Mark not lived' : 'Mark lived';
    list.appendChild(node);
  }
}

function renderFocus() {
  const arr = sorted();
  const card = $('focusItem');
  if (!arr.length) {
    card.innerHTML = '<p class="focus-maxim">No maxims yet. Add one to begin.</p>';
    return;
  }

  focusIndex = Math.max(0, Math.min(focusIndex, arr.length - 1));
  const item = arr[focusIndex];

  card.innerHTML = `
    <h3>${item.title}</h3>
    <p class="focus-maxim">${item.body}</p>
    ${showNote && item.note ? `<div class="focus-note">${item.note}</div>` : ''}
    <div class="meta">Card ${focusIndex + 1} of ${arr.length} · ${item.favorite ? '★ Favorite' : '☆'} · ${item.lived ? 'Lived today' : 'Not lived yet'}</div>
  `;

  $('expandBtn').textContent = showNote ? 'Hide note' : 'Expand note';
  $('chromeBtn').textContent = chromeHidden ? 'Show UI' : 'Hide UI';
}

function applySpice() {
  document.body.classList.remove('spice-1', 'spice-2', 'spice-3');
  document.body.classList.add(`spice-${spiceLevel}`);
  $('spiceBadge').textContent = ['calm', 'zesty', 'feral'][spiceLevel - 1] || 'calm';
}

function showOracle() {
  const pick = oraclePrompts[Math.floor(Math.random() * oraclePrompts.length)];
  const box = $('oracleText');
  box.hidden = false;
  box.textContent = `Oracle: ${pick}`;
  setFocusMode(true);
}

function cycleSpice() {
  spiceLevel = spiceLevel >= 3 ? 1 : spiceLevel + 1;
  localStorage.setItem('tao-spice-level', String(spiceLevel));
  applySpice();
}

function render() {
  renderList();
  renderFocus();
}

function setFocusMode(on) {
  focusMode = on;
  document.body.classList.toggle('focus-mode', focusMode);
  $('focusCard').hidden = !focusMode;
  if (!focusMode) {
    setChromeHidden(false);
  }
  showNote = false;
  renderFocus();
}

function randomFocus() {
  const arr = sorted();
  if (!arr.length) return;
  focusIndex = Math.floor(Math.random() * arr.length);
  setFocusMode(true);
  renderFocus();
}

function moveFocus(step) {
  const arr = sorted();
  if (!arr.length) return;
  focusIndex = (focusIndex + step + arr.length) % arr.length;
  renderFocus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('title').value.trim();
  const body = $('body').value.trim();
  const note = $('note').value.trim();
  const favorite = $('favorite').checked;
  const lived = $('lived').checked;
  if (!title || !body) return;

  if (editingId) {
    items = items.map((i) => (i.id === editingId ? { ...i, title, body, note, favorite, lived } : i));
    editingId = null;
  } else {
    items.push({ id: crypto.randomUUID(), title, body, note, favorite, lived, createdAt: Date.now() });
  }

  form.reset();
  save(items);
  render();
});

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const card = e.target.closest('.item');
  const id = card.dataset.id;
  const item = items.find((i) => i.id === id);
  if (!item) return;
  const act = btn.dataset.act;

  if (act === 'delete') items = items.filter((i) => i.id !== id);
  if (act === 'favorite') item.favorite = !item.favorite;
  if (act === 'lived') item.lived = !item.lived;
  if (act === 'focus') {
    const arr = sorted();
    focusIndex = arr.findIndex((x) => x.id === id);
    setFocusMode(true);
  }
  if (act === 'edit') {
    editingId = id;
    $('title').value = item.title;
    $('body').value = item.body;
    $('note').value = item.note || '';
    $('favorite').checked = item.favorite;
    $('lived').checked = item.lived;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  save(items);
  render();
});

const WORD_A = ['quiet','solar','velvet','wild','lunar','honest','ember','violet','tiny','feral','golden','midnight','gentle','bright'];
const WORD_B = ['river','lantern','falcon','cactus','thunder','harbor','forest','echo','comet','orbit','signal','mirror','summit','breeze'];
const WORD_C = ['spark','ritual','compass','pilgrim','anchor','cipher','atlas','phoenix','mojo','pocket','oracle','drift','pulse','beacon'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generatePhrase() {
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 6);
  const phrase = `${rand(WORD_A)}-${rand(WORD_B)}-${rand(WORD_C)}-${suffix}`;
  syncPhraseInput.value = phrase;
  localStorage.setItem(PHRASE_KEY, phrase);
  phraseHint.textContent = 'Generated. Collision chance is extremely low for personal use.';
}

function getPhrase() {
  return syncPhraseInput.value.trim();
}

function savePhrase() {
  const phrase = getPhrase();
  if (!phrase) return alert('Enter a sync phrase first.');
  localStorage.setItem(PHRASE_KEY, phrase);
  alert('Sync phrase saved locally.');
}

function exportPack() {
  const phrase = getPhrase();
  const payload = { phrase, exportedAt: new Date().toISOString(), items };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tao-life-pack.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importPack() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data.items)) return alert('Invalid pack file.');
    items = data.items;
    if (data.phrase) {
      syncPhraseInput.value = data.phrase;
      localStorage.setItem(PHRASE_KEY, data.phrase);
    }
    save(items);
    render();
    alert('Pack imported.');
  };
  input.click();
}

function sendPhraseEmail() {
  const phrase = getPhrase();
  if (!phrase) return alert('Enter a sync phrase first.');
  const subject = encodeURIComponent('My Tao of Life sync phrase');
  const body = encodeURIComponent(`Save this phrase safely:\n\n${phrase}\n\n(From Tao of Life)`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

$('focusModeToggle').addEventListener('click', () => setFocusMode(!focusMode));
$('beforeBedToggle').addEventListener('click', () => document.body.classList.toggle('before-bed'));
$('randomBtn').addEventListener('click', randomFocus);
$('oracleBtn').addEventListener('click', showOracle);
$('prevBtn').addEventListener('click', () => moveFocus(-1));
$('nextBtn').addEventListener('click', () => moveFocus(1));
$('expandBtn').addEventListener('click', () => {
  showNote = !showNote;
  renderFocus();
});
function setChromeHidden(on) {
  chromeHidden = on;
  document.body.classList.toggle('chrome-hidden', chromeHidden);
  $('revealUiBtn').hidden = !chromeHidden;
  renderFocus();
}

$('chromeBtn').addEventListener('click', () => setChromeHidden(!chromeHidden));
$('spiceBtn').addEventListener('click', cycleSpice);
$('revealUiBtn').addEventListener('click', () => setChromeHidden(false));
$('savePhraseBtn').addEventListener('click', savePhrase);
$('genPhraseBtn').addEventListener('click', generatePhrase);
$('copyPhraseBtn').addEventListener('click', async () => {
  const phrase = getPhrase();
  if (!phrase) return alert('Enter a sync phrase first.');
  await navigator.clipboard.writeText(phrase);
  alert('Phrase copied.');
});
$('emailPhraseBtn').addEventListener('click', sendPhraseEmail);
$('exportPackBtn').addEventListener('click', exportPack);
$('importPackBtn').addEventListener('click', importPack);

document.addEventListener('keydown', (e) => {
  if (!focusMode) return;
  if (e.key === 'ArrowLeft') moveFocus(-1);
  if (e.key === 'ArrowRight') moveFocus(1);
  if (e.key === ' ') {
    e.preventDefault();
    showNote = !showNote;
    renderFocus();
  }
  if (e.key.toLowerCase() === 'c') {
    setChromeHidden(!chromeHidden);
  }
  if (e.key.toLowerCase() === 'r') randomFocus();
  if (e.key.toLowerCase() === 'o') showOracle();
  if (e.key.toLowerCase() === 's') cycleSpice();
});

syncPhraseInput.value = localStorage.getItem(PHRASE_KEY) || '';
applySpice();
render();
