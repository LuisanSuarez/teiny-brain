const KEY = 'tao-of-life-v1';
const seed = [
  { id: crypto.randomUUID(), title: 'Presence before optimization', body: 'Tonight, rest is strategy. Be where you are.', favorite: true, lived: false, createdAt: Date.now() },
  { id: crypto.randomUUID(), title: 'Small honest steps', body: 'One clean action beats ten grand plans.', favorite: false, lived: true, createdAt: Date.now() }
];

const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') ?? seed;
const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));
let items = load();

const $ = (id) => document.getElementById(id);
const form = $('maximForm');
const list = $('list');
let editingId = null;

function render() {
  list.innerHTML = '';
  for (const item of [...items].sort((a,b)=>b.createdAt-a.createdAt)) {
    const node = $('itemTpl').content.firstElementChild.cloneNode(true);
    node.dataset.id = item.id;
    node.querySelector('h3').textContent = item.title;
    node.querySelector('.body').textContent = item.body;
    node.querySelector('.meta').textContent = `${item.favorite ? '★ Favorite' : '☆'} · ${item.lived ? 'Lived today' : 'Not lived yet'}`;
    node.querySelector('[data-act="favorite"]').textContent = item.favorite ? 'Unfavorite' : 'Favorite';
    node.querySelector('[data-act="lived"]').textContent = item.lived ? 'Mark not lived' : 'Mark lived';
    list.appendChild(node);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('title').value.trim();
  const body = $('body').value.trim();
  const favorite = $('favorite').checked;
  const lived = $('lived').checked;
  if (!title || !body) return;

  if (editingId) {
    items = items.map(i => i.id === editingId ? { ...i, title, body, favorite, lived } : i);
    editingId = null;
  } else {
    items.push({ id: crypto.randomUUID(), title, body, favorite, lived, createdAt: Date.now() });
  }
  form.reset();
  save(items); render();
});

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const card = e.target.closest('.item');
  const id = card.dataset.id;
  const item = items.find(i => i.id === id);
  if (!item) return;
  const act = btn.dataset.act;

  if (act === 'delete') items = items.filter(i => i.id !== id);
  if (act === 'favorite') item.favorite = !item.favorite;
  if (act === 'lived') item.lived = !item.lived;
  if (act === 'edit') {
    editingId = id;
    $('title').value = item.title;
    $('body').value = item.body;
    $('favorite').checked = item.favorite;
    $('lived').checked = item.lived;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  save(items); render();
});

$('beforeBedToggle').addEventListener('click', () => {
  document.body.classList.toggle('before-bed');
});

render();
