// Tableau de bord des favoris (reddtastic.com/#favoris) : aperçus du jour, collections, glisser-déposer.
let home = null, homeFilter = 'all', undoSnap = null, toastTimer = 0, dragKey = null, homeSig = '', homeOpener = null;
const brokenThumbs = new Set();
const $h = sel => home.querySelector(sel);
const esc = str => String(str).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const favOf = key => favState.favs.find(f => f.key === key);

function openHome() {
  if (home) return;
  home = document.createElement('div');
  home.id = 'rdh';
  home.setAttribute('role', 'dialog');
  home.setAttribute('aria-modal', 'true');
  home.setAttribute('aria-labelledby', 'rdh-h');
  home.innerHTML = `
    <header class="rdh-top">
      <h1 id="rdh-h">Favoris</h1>
      <div class="rdh-tabs" role="tablist" aria-label="Filtrer les favoris">
        <button role="tab" data-f="all">Tous <span class="rdh-c"></span></button>
        <button role="tab" data-f="r">Subreddits <span class="rdh-c"></span></button>
        <button role="tab" data-f="u">Utilisateurs <span class="rdh-c"></span></button>
      </div>
      <div class="rdh-actions">
        <button class="rdh-btn" data-h="group" aria-label="Nouvelle collection">${icon('plus')}<span>Nouvelle collection</span></button>
        <button class="rdh-btn" data-h="refresh" aria-label="Actualiser les aperçus">${icon('refresh')}<span>Actualiser les aperçus</span></button>
        <button class="rdh-icon" data-h="close" aria-label="Fermer (Échap)" title="Fermer (Échap)">${icon('close')}</button>
      </div>
    </header>
    <main class="rdh-body"></main>
    <div class="rdh-toast" role="status" aria-live="polite"></div>`;

  home.addEventListener('click', onHomeClick);
  home.addEventListener('change', onHomeChange);
  home.addEventListener('keydown', onHomeKey);
  home.addEventListener('dragstart', onDragStart);
  home.addEventListener('dragover', onDragOver);
  home.addEventListener('drop', onDrop);
  home.addEventListener('dragend', onDragEnd);
  // Aperçu expiré ou supprimé : lettre de remplacement, nouvel essai à la prochaine actualisation.
  home.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName !== 'IMG') return;
    brokenThumbs.add(img.getAttribute('src'));
    const f = favOf(img.closest('[data-key]')?.dataset.key);
    if (f) f.thumbDay = null;
    img.replaceWith(placeholder(f ? favName(f.key) : '?'));
  }, true);
  home.addEventListener('load', e => e.target.tagName === 'IMG' && e.target.classList.add('is-in'), true);

  homeOpener = document.activeElement;
  homeSig = '';
  favListeners.add(renderHome);
  document.body.append(home);
  document.documentElement.classList.add('rdp-open');
  if (location.hash !== '#favoris') history.replaceState(null, '', location.pathname + location.search + '#favoris');
  renderHome();
  $h('[data-f]').focus();
  refreshThumbs();
}

function closeHome() {
  if (!home) return;
  favListeners.delete(renderHome);
  home.remove();
  home = null;
  document.documentElement.classList.remove('rdp-open');
  if (location.hash === '#favoris') history.replaceState(null, '', location.pathname + location.search);
  if (homeOpener?.isConnected) homeOpener.focus();
}

const usableThumb = f => f.thumb && !brokenThumbs.has(f.thumb);
const thumbHTML = f => usableThumb(f)
  ? `<img src="${esc(f.thumb)}" alt="" draggable="false" loading="lazy" decoding="async">`
  : placeholder(favName(f.key)).outerHTML;

const placeholder = name => {
  const span = document.createElement('span');
  span.className = 'rdh-ph';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = (name.split('/')[1] || '?').charAt(0).toUpperCase();
  return span;
};

function tile(f) {
  const name = favName(f.key), sort = favSort(f.key);
  const groups = ['', ...favState.groups];
  const opts = groups.map(g => `<option value="${esc(g)}"${g === f.group ? ' selected' : ''}>${g ? esc(g) : 'Non classés'}</option>`).join('');
  return `
    <article class="rdh-tile${!usableThumb(f) && needsThumb(f) ? ' is-loading' : ''}" draggable="true" data-key="${esc(f.key)}">
      <a class="rdh-link" href="${esc(f.key)}#diaporama" draggable="false" aria-label="Lancer le diaporama ${esc(name)}${sort ? ', ' + esc(sort) : ''}">
        ${thumbHTML(f)}
        <span class="rdh-play" aria-hidden="true">${icon('play')}</span>
        <span class="rdh-cap"><span class="rdh-name">${esc(name)}</span>${sort ? `<span class="rdh-sort">${esc(sort)}</span>` : ''}</span>
      </a>
      <div class="rdh-tools">
        <button class="rdh-tool" data-h="left" aria-label="Déplacer ${esc(name)} vers la gauche" title="Déplacer vers la gauche">${icon('left')}</button>
        <button class="rdh-tool" data-h="right" aria-label="Déplacer ${esc(name)} vers la droite" title="Déplacer vers la droite">${icon('right')}</button>
        ${favState.groups.length ? `<select class="rdh-move" data-h="move" aria-label="Collection de ${esc(name)}" title="Changer de collection">${opts}</select>` : ''}
        <button class="rdh-tool is-danger" data-h="remove" aria-label="Retirer ${esc(name)} des favoris" title="Retirer des favoris">${icon('trash')}</button>
      </div>
    </article>`;
}

// Seuls les aperçus ont changé : mise à jour sur place, sans recréer la grille (pas de clignotement ni de survol perdu).
function patchThumbs() {
  for (const t of home.querySelectorAll('.rdh-tile')) {
    const f = favOf(t.dataset.key);
    if (!f) continue;
    t.classList.toggle('is-loading', !usableThumb(f) && needsThumb(f));
    const img = t.querySelector('img');
    if (usableThumb(f) ? img?.getAttribute('src') !== f.thumb : img) {
      (img || t.querySelector('.rdh-ph')).outerHTML = thumbHTML(f);
    }
  }
}

function renderHome() {
  if (!home) return;
  const sig = JSON.stringify([homeFilter, favState.groups, favState.favs.map(f => [f.key, f.group])]);
  if (sig === homeSig) return patchThumbs();
  homeSig = sig;
  // Garde le focus clavier sur le même contrôle après le re-rendu.
  const a = document.activeElement;
  const keep = home.contains(a) && { key: a.closest('[data-key]')?.dataset.key, h: a.dataset.h, group: a.dataset.old };

  const favs = favState.favs;
  const counts = { all: favs.length, r: favs.filter(f => f.key.startsWith('/r/')).length, u: favs.filter(f => f.key.startsWith('/u/')).length };
  home.querySelectorAll('[data-f]').forEach(b => {
    b.setAttribute('aria-selected', b.dataset.f === homeFilter);
    b.tabIndex = b.dataset.f === homeFilter ? 0 : -1; // un seul onglet dans l'ordre Tab ; les flèches passent aux autres
    b.querySelector('.rdh-c').textContent = counts[b.dataset.f];
  });

  const visible = f => homeFilter === 'all' || f.key.startsWith(`/${homeFilter}/`);
  const body = $h('.rdh-body');
  if (!favs.length && !favState.groups.length) {
    body.innerHTML = `
      <div class="rdh-empty">
        <span class="rdh-empty-mark">${icon('star')}</span>
        <h2>Aucun favori pour l'instant</h2>
        <p>Ouvre le diaporama d'un subreddit ou d'un utilisateur, puis clique sur l'étoile dans la barre (ou touche <kbd>S</kbd>). Il apparaîtra ici avec un aperçu renouvelé chaque jour.</p>
      </div>`;
    return;
  }

  const sections = ['', ...favState.groups].map(g => {
    const list = favs.filter(f => f.group === g && visible(f));
    if (g === '' && !list.length && favState.groups.length) return '';
    const gi = favState.groups.indexOf(g), last = favState.groups.length - 1;
    const head = g
      ? `<input class="rdh-gname" value="${esc(g)}" data-old="${esc(g)}" aria-label="Nom de la collection" spellcheck="false">
         <span class="rdh-n">${list.length}</span>
         <span class="rdh-gtools">
           <button class="rdh-icon" data-h="gup" data-old="${esc(g)}" aria-label="Monter la collection ${esc(g)}" title="Monter la collection"${gi === 0 ? ' disabled' : ''}>${icon('up')}</button>
           <button class="rdh-icon" data-h="gdown" data-old="${esc(g)}" aria-label="Descendre la collection ${esc(g)}" title="Descendre la collection"${gi === last ? ' disabled' : ''}>${icon('down')}</button>
           <button class="rdh-icon rdh-del" data-h="delgroup" data-old="${esc(g)}" aria-label="Supprimer la collection ${esc(g)}" title="Supprimer la collection">${icon('trash')}</button>
         </span>`
      : favState.groups.length ? `<h2>Non classés</h2><span class="rdh-n">${list.length}</span>` : '';
    return `
      <section class="rdh-sec" data-group="${esc(g)}">
        ${head ? `<div class="rdh-sec-head">${head}</div>` : ''}
        <div class="rdh-grid">${list.map(tile).join('') || '<p class="rdh-hint">Glisse un favori ici, ou choisis cette collection dans le menu d\'un favori.</p>'}</div>
      </section>`;
  }).join('');
  body.innerHTML = favs.some(visible) || favState.groups.length
    ? sections
    : `<div class="rdh-empty"><h2>Aucun ${homeFilter === 'r' ? 'subreddit' : 'utilisateur'} en favori</h2><p>Les autres favoris restent dans l'onglet Tous.</p></div>`;

  if (keep) {
    const sel = keep.key
      ? `[data-key="${CSS.escape(keep.key)}"] [data-h="${keep.h}"]`
      : keep.group !== undefined ? `[data-old="${CSS.escape(keep.group)}"]${keep.h ? `[data-h="${keep.h}"]` : ''}` : keep.h ? `[data-h="${keep.h}"]` : null;
    (sel && home.querySelector(sel))?.focus();
  }
}

function toast(msg, undo) {
  const t = $h('.rdh-toast');
  t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button data-h="undo">Annuler</button>' : ''}`;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 6000);
}
const snapshot = () => (undoSnap = structuredClone(favState));

function onHomeClick(e) {
  const tab = e.target.closest('[data-f]');
  if (tab) {
    homeFilter = tab.dataset.f;
    return renderHome();
  }
  const btn = e.target.closest('button[data-h]');
  if (!btn) return;
  const f = favOf(btn.closest('[data-key]')?.dataset.key);
  switch (btn.dataset.h) {
    case 'close':
      return closeHome();
    case 'refresh':
      toast('Actualisation des aperçus…');
      return refreshThumbs(true).then(() => home && toast('Aperçus à jour.'));
    case 'group': {
      let n = 1, name;
      do name = `Collection ${n++}`; while (favState.groups.includes(name));
      favState.groups.push(name);
      saveFavs();
      const input = home.querySelector(`.rdh-gname[data-old="${CSS.escape(name)}"]`);
      input?.focus();
      input?.select();
      return;
    }
    case 'gup':
    case 'gdown':
      moveGroup(favState, btn.dataset.old, btn.dataset.h === 'gup' ? -1 : 1);
      return saveFavs();
    case 'delgroup': {
      const name = btn.dataset.old;
      snapshot();
      favState.groups = favState.groups.filter(g => g !== name);
      favState.favs.forEach(x => x.group === name && (x.group = ''));
      saveFavs();
      return toast(`Collection « ${name} » supprimée, ses favoris sont dans Non classés.`, true);
    }
    case 'remove':
      snapshot();
      favState.favs = favState.favs.filter(x => x !== f);
      saveFavs();
      return toast(`${favName(f.key)} retiré des favoris.`, true);
    case 'left':
    case 'right': {
      const same = favState.favs.filter(x => x.group === f.group);
      const i = same.indexOf(f);
      if (btn.dataset.h === 'left' && i > 0) moveFavIn(favState, f.key, f.group, same[i - 1].key);
      else if (btn.dataset.h === 'right' && i < same.length - 1) moveFavIn(favState, f.key, f.group, same[i + 2]?.key ?? null);
      else return;
      return saveFavs();
    }
    case 'undo':
      if (!undoSnap) return;
      favState = undoSnap;
      undoSnap = null;
      saveFavs();
      return $h('.rdh-toast').classList.remove('is-on');
  }
}

function onHomeChange(e) {
  const el = e.target;
  if (el.matches('.rdh-move')) {
    moveFavIn(favState, el.closest('[data-key]').dataset.key, el.value, null);
    return saveFavs();
  }
  if (el.matches('.rdh-gname')) {
    const old = el.dataset.old, name = el.value.trim();
    if (!name || name === old) return void (el.value = old);
    if (favState.groups.includes(name)) {
      el.value = old;
      return toast(`Une collection s'appelle déjà « ${name} ».`);
    }
    favState.groups[favState.groups.indexOf(old)] = name;
    favState.favs.forEach(f => f.group === old && (f.group = name));
    saveFavs();
  }
}

function onHomeKey(e) {
  if (e.target.matches('.rdh-gname')) {
    if (e.key === 'Enter') e.target.blur();
    if (e.key === 'Escape') {
      e.target.value = e.target.dataset.old;
      e.target.blur();
      e.stopPropagation();
    }
    return;
  }
  if (e.key === 'Escape') closeHome();
  // Flèches gauche/droite entre les onglets de filtre (motif tablist).
  const tab = e.target.closest('[data-f]');
  if (tab && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    const tabs = [...home.querySelectorAll('[data-f]')];
    const next = tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    homeFilter = next.dataset.f;
    renderHome();
    next.focus();
  }
}

const clearMarks = () => home.querySelectorAll('.drop-before, .drop-after, .drop-into').forEach(el => el.classList.remove('drop-before', 'drop-after', 'drop-into'));

function onDragStart(e) {
  const t = e.target.closest?.('.rdh-tile');
  if (!t) return;
  dragKey = t.dataset.key;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragKey);
  t.classList.add('is-dragging');
}

function onDragOver(e) {
  const sec = dragKey && e.target.closest('.rdh-sec');
  if (!sec) return;
  e.preventDefault();
  clearMarks();
  const t = e.target.closest('.rdh-tile');
  if (!t) return sec.classList.add('drop-into');
  if (t.dataset.key === dragKey) return;
  const r = t.getBoundingClientRect();
  t.classList.add(e.clientX < r.left + r.width / 2 ? 'drop-before' : 'drop-after');
}

function onDrop(e) {
  const sec = dragKey && e.target.closest('.rdh-sec');
  if (!sec) return;
  e.preventDefault();
  const t = e.target.closest('.rdh-tile');
  let before = null;
  if (t?.classList.contains('drop-before')) before = t.dataset.key;
  else if (t?.classList.contains('drop-after')) {
    let n = t.nextElementSibling;
    if (n?.dataset.key === dragKey) n = n.nextElementSibling;
    before = n?.dataset.key ?? null;
  } else if (t) return; // lâché sur lui-même
  moveFavIn(favState, dragKey, sec.dataset.group, before);
  saveFavs();
}

function onDragEnd() {
  dragKey = null;
  if (!home) return;
  clearMarks();
  home.querySelector('.is-dragging')?.classList.remove('is-dragging');
}
