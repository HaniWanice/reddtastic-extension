// Diaporama plein écran alimenté par l'API JSON de Reddtastic (même origine, pas de quota Reddit).
const DEFAULTS = { duration: 6, muted: true, volume: 0.5, controls: true, upscale: true };
let s = { ...DEFAULTS };
let root = null, api = null, favK = null, items = [], idx = 0, after = null, done = false, loading = null, paused = false, timer = 0, hls = null, loadError = null;

const save = () => chrome.storage.local.set(s);
const $ = sel => root.querySelector(sel);

// limit : l'API répond 500 sous 25.
function apiFor(loc, limit = 100) {
  const m = loc.pathname.match(/^\/(r|u|user)\/([^/?#]+)/);
  if (!m) return null;
  const q = new URLSearchParams(loc.search);
  const sort = q.get('sort') || (m[1] === 'r' ? 'hot' : 'new');
  const base = m[1] === 'r' ? `subreddits/posts?v=3&subreddits=${m[2]}` : `users/posts?v=3&username=${m[2]}`;
  return `/api/reddit/${base}&sort=${sort}&limit=${limit}` + (q.get('t') ? `&t=${q.get('t')}` : '');
}

function load() {
  if (done) return Promise.resolve();
  return loading ||= (async () => {
    try {
      const r = await fetch(api + (after ? `&after=${after}` : ''));
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = (await r.json()).data;
      for (const { data: p } of d.children)
        mediaOf(p).forEach((m, i, all) => items.push({ ...m, post: p, n: i + 1, of: all.length }));
      after = d.after;
      done = !after;
    } catch (e) {
      console.warn('[diaporama] chargement impossible', e);
      loadError = e.message;
      done = true;
    } finally {
      loading = null;
    }
  })();
}

async function go(i) {
  i = Math.max(0, i);
  if (i >= items.length && !done) await load();
  idx = i >= items.length ? 0 : i;
  if (items.length - idx < 10) load();
  show();
}

function schedule() {
  clearTimeout(timer);
  if (!paused && items[idx]?.type === 'image') timer = setTimeout(() => go(idx + 1), s.duration * 1000);
}

function show() {
  if (!root) return;
  clearTimeout(timer);
  hls?.destroy();
  hls = null;
  const it = items[idx], stage = $('.rdp-stage');
  stage.replaceChildren();
  updateBar();
  if (!it) {
    const p = document.createElement('p');
    p.className = 'rdp-msg';
    p.textContent = loadError
      ? `Reddtastic ne répond pas (${loadError}). Réessaie dans un moment : ferme puis relance le diaporama.`
      : 'Aucune photo ni vidéo sur cette page.';
    return void stage.replaceChildren(p);
  }
  const skip = () => items[idx] === it && go(idx + 1);

  let el;
  if (it.type === 'video') {
    el = document.createElement('video');
    el.muted = s.muted;
    el.volume = s.volume;
    el.playsInline = true;
    // Le mp4 de Reddit n'a pas de piste audio : le son passe par le flux HLS, lu via hls.js (Edge/Chrome ne lisent pas le HLS nativement).
    if (it.hls && Hls.isSupported()) {
      // Démarre au niveau le plus haut au lieu du plus bas (sinon pixelisé les premières secondes) ; l'ABR redescend si le débit ne suit pas.
      hls = new Hls({ autoStartLoad: false });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.startLevel = hls.levels.length - 1;
        hls.startLoad();
      });
      hls.on(Hls.Events.ERROR, (_, d) => {
        if (!d.fatal) return;
        hls.destroy();
        hls = null;
        if (!it.mp4) return skip();
        el.onerror = skip;
        el.src = it.mp4;
        if (!paused) el.play().catch(() => {});
      });
      hls.loadSource(it.hls);
      hls.attachMedia(el);
    } else {
      el.onerror = skip;
      el.src = it.mp4 || it.hls;
    }
    const t0 = Date.now();
    // Attend la fin de la vidéo ; un clip plus court que la durée réglée est rejoué jusqu'à l'atteindre.
    el.onended = () => (Date.now() - t0 < s.duration * 1000 ? el.play() : go(idx + 1));
    if (!paused) el.play().catch(() => { el.muted = true; el.play().catch(() => {}); });
  } else {
    el = new Image();
    el.alt = it.post.title;
    el.onload = schedule;
    el.onerror = () => (it.alt && el.src !== it.alt ? (el.src = it.alt) : skip());
    el.src = it.src;
  }
  stage.append(el);

  const p = it.post, author = $('.rdp-author'), sub = $('.rdp-sub');
  author.textContent = `u/${p.author}`;
  author.href = p.author && p.author !== '[deleted]' ? `/u/${p.author}#diaporama` : '';
  sub.textContent = `r/${p.subreddit}`;
  sub.href = `/r/${p.subreddit}#diaporama`;
  $('.rdp-reddit').href = `https://www.reddit.com${p.permalink}`;
  $('.rdp-title').textContent = p.title;
  $('.rdp-count').textContent = it.of > 1 ? `Galerie ${it.n} / ${it.of}` : '';

  const next = items[idx + 1];
  if (next?.type === 'image') new Image().src = next.src;
}

function setBtn(a, iconName, label, pressed) {
  const b = $(`[data-a=${a}]`);
  b.innerHTML = icon(iconName);
  b.setAttribute('aria-label', label);
  b.title = label;
  if (pressed !== undefined) b.setAttribute('aria-pressed', pressed);
}

function updateBar() {
  if (!root) return;
  root.classList.toggle('rdp-hide', !s.controls);
  root.classList.toggle('rdp-noup', !s.upscale);
  setBtn('pause', paused ? 'play' : 'pause', paused ? 'Lecture (espace)' : 'Pause (espace)');
  const silent = s.muted || !s.volume;
  setBtn('mute', silent ? 'muted' : 'sound', silent ? 'Activer le son (m)' : 'Couper le son (m)');
  $('.rdp-vol-range').value = sliderFromVol(s.volume);
  // Une décimale sous 10 % : c'est là que le curseur est précis.
  $('.rdp-vol-val').textContent = s.muted ? 'Muet' : `${(s.volume * 100).toLocaleString('fr', { maximumFractionDigits: s.volume < 0.1 ? 1 : 0 })} %`;
  setBtn('controls', s.controls ? 'eye' : 'eyeOff', s.controls ? 'Masquer les contrôles (h)' : 'Afficher les contrôles (h)');
  setBtn('upscale', 'upscale', s.upscale ? 'Petites photos : agrandies (u)' : 'Petites photos : taille réelle (u)', s.upscale);
  const fav = favK && isFav(favK);
  setBtn('star', 'star', fav ? 'Retirer des favoris (s)' : 'Ajouter aux favoris (s)', !!fav);
  $('[data-a=star]').hidden = !favK;
  $('.rdp-dur').value = s.duration;
  $('.rdp-pos').textContent = `${items.length ? idx + 1 : 0} / ${items.length}${done ? '' : '+'}`;
}

const actions = {
  first: () => go(0),
  prev: () => go(idx - 1),
  next: () => go(idx + 1),
  pause() {
    paused = !paused;
    const v = $('video');
    if (v) paused ? v.pause() : v.play().catch(() => {});
    updateBar();
    schedule();
  },
  mute() {
    s.muted = !s.muted;
    if (!s.muted && !s.volume) s.volume = volFromSlider(50); // réactiver le son à 0 % ne servirait à rien
    applyVolume();
    save();
  },
  volUp: () => setSlider(sliderFromVol(s.volume) + 5),
  volDown: () => setSlider(sliderFromVol(s.volume) - 5),
  controls() {
    s.controls = !s.controls;
    save();
    updateBar();
  },
  show: () => actions.controls(),
  upscale() {
    s.upscale = !s.upscale;
    save();
    updateBar();
  },
  star: () => favK && toggleFav(favK),
  reddit: () => $('.rdp-reddit').href && window.open($('.rdp-reddit').href, '_blank', 'noopener'),
  home() {
    close();
    openHome();
  },
  fs: () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(() => {}),
  close,
};
const KEYS = { Home: 'first', d: 'first', ArrowLeft: 'prev', ArrowRight: 'next', ArrowUp: 'volUp', ArrowDown: 'volDown', ' ': 'pause', m: 'mute', r: 'reddit', h: 'controls', u: 'upscale', s: 'star', f: 'fs', Escape: 'close' };

function applyVolume() {
  const v = $('video');
  if (v) {
    v.muted = s.muted;
    v.volume = s.volume;
  }
  updateBar();
}

// Position du curseur (0–100) → volume ; bouger le curseur réactive le son.
function setSlider(p) {
  s.volume = volFromSlider(Math.min(100, Math.max(0, p)));
  s.muted = s.volume === 0;
  applyVolume();
  clearTimeout(setSlider.t);
  setSlider.t = setTimeout(save, 300); // pas une écriture de stockage par pixel de glissement
}

function onKey(e) {
  if (e.target.matches?.('input') && e.key !== 'Escape') return;
  const a = KEYS[e.key];
  if (!a || e.ctrlKey || e.metaKey || e.altKey) return;
  e.preventDefault();
  e.stopPropagation();
  actions[a]();
}

async function open() {
  if (root) return;
  api = apiFor(location);
  if (!api) return;
  favK = favKey(location);
  items = []; idx = 0; after = null; done = false; loading = null; paused = false; loadError = null;
  root = document.createElement('div');
  root.id = 'rdp';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Diaporama');
  root.innerHTML = `
    <div class="rdp-stage"><p class="rdp-msg">Chargement…</p></div>
    <div class="rdp-info">
      <div class="rdp-who"><a class="rdp-author" target="_blank" rel="noopener" title="Diaporama de cet utilisateur (nouvel onglet)"></a><span aria-hidden="true">·</span><a class="rdp-sub" target="_blank" rel="noopener" title="Diaporama de ce subreddit (nouvel onglet)"></a><span aria-hidden="true">·</span><a class="rdp-reddit" target="_blank" rel="noopener" title="Ouvrir ce post sur Reddit (r)">Voir sur Reddit${icon('external')}</a></div>
      <div class="rdp-title"></div>
      <div class="rdp-count"></div>
    </div>
    <button data-a="show" class="rdp-show" aria-label="Afficher les contrôles (h)" title="Afficher les contrôles (h)">${icon('eye')}</button>
    <div class="rdp-bar">
      <button data-a="first" aria-label="Revenir au début (Début ou d)" title="Revenir au début (Début ou d)">${icon('first')}</button>
      <button data-a="prev" aria-label="Précédent (←)" title="Précédent (←)">${icon('prev')}</button>
      <button data-a="pause"></button>
      <button data-a="next" aria-label="Suivant (→)" title="Suivant (→)">${icon('next')}</button>
      <span class="rdp-sep"></span>
      <label class="rdp-durbox" title="Durée d'affichage des images, minimum pour les vidéos">${icon('timer')}<input class="rdp-dur" type="number" min="1" max="300" aria-label="Durée par média en secondes"><span>s</span></label>
      <div class="rdp-vol">
        <div class="rdp-vol-pop"><div class="rdp-vol-card">
          <output class="rdp-vol-val"></output>
          <input class="rdp-vol-range" type="range" min="0" max="100" step="1" aria-label="Volume (↑ ↓)">
        </div></div>
        <button data-a="mute"></button>
      </div>
      <button data-a="upscale"></button>
      <button data-a="controls"></button>
      <button data-a="fs" aria-label="Plein écran (f)" title="Plein écran (f)">${icon('fullscreen')}</button>
      <span class="rdp-sep"></span>
      <button data-a="star" class="rdp-star"></button>
      <button data-a="home" aria-label="Favoris" title="Favoris">${icon('grid')}</button>
      <span class="rdp-pos"></span>
      <button data-a="close" aria-label="Fermer (Échap)" title="Fermer (Échap)">${icon('close')}</button>
    </div>`;
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a) actions[a]();
  });
  $('.rdp-dur').addEventListener('change', e => {
    s.duration = Math.min(300, Math.max(1, Number(e.target.value) || DEFAULTS.duration));
    save();
    updateBar();
    schedule();
  });
  $('.rdp-vol-range').addEventListener('input', e => setSlider(Number(e.target.value)));
  $('.rdp-vol').addEventListener('wheel', e => {
    e.preventDefault();
    setSlider(sliderFromVol(s.volume) + (e.deltaY < 0 ? 5 : -5));
  }, { passive: false });
  favListeners.add(updateBar);
  document.body.append(root);
  document.documentElement.classList.add('rdp-open');
  document.addEventListener('keydown', onKey, true);
  root.requestFullscreen?.().catch(() => {}); // refusé sans clic (onglet ouvert par lien) : touche f
  updateBar();
  await load();
  go(0);
}

function close() {
  if (!root) return;
  clearTimeout(timer);
  hls?.destroy();
  hls = null;
  favListeners.delete(updateBar);
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  document.removeEventListener('keydown', onKey, true);
  document.documentElement.classList.remove('rdp-open');
  root.remove();
  root = null;
  if (location.hash === '#diaporama') history.replaceState(null, '', location.pathname + location.search);
}

const launcher = document.createElement('div');
launcher.id = 'rdp-launch';
launcher.innerHTML = `
  <button class="rdp-l-home" title="Favoris">${icon('grid')}<span>Favoris</span></button>
  <button class="rdp-l-play" title="Diaporama des posts de cette page">${icon('play')}<span>Diaporama</span></button>`;
launcher.querySelector('.rdp-l-home').onclick = () => openHome();
launcher.querySelector('.rdp-l-play').onclick = open;
const syncLauncher = () => (launcher.querySelector('.rdp-l-play').hidden = !apiFor(location));
setInterval(syncLauncher, 1000); // Reddtastic navigue sans recharger la page
syncLauncher();
document.body.append(launcher);

function route() {
  if (location.hash === '#diaporama') {
    closeHome();
    open();
  } else if (location.hash === '#favoris') {
    close();
    openHome();
  }
}
window.addEventListener('hashchange', route);
chrome.storage.local.get(DEFAULTS, async v => {
  s = v;
  await loadFavs();
  route();
});
