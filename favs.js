// Favoris : chrome.storage.local (source principale) + cookie reddtastic.com (copie de secours), fusionnés au chargement.
const FAV_COOKIE = 'rdp_favs';
// shortcut: 8 cookies × 3500 car. ≈ 700 favoris max ; au-delà, garder seulement chrome.storage.
const COOKIE_CHUNK = 3500, COOKIE_MAX = 8;

// Clé = chemin + tri, sans le hash : "/r/photo?sort=top&t=week". Deux tris = deux favoris.
function favKey(loc) {
  const m = loc.pathname.match(/^\/(r|u|user)\/([^/?#]+)/);
  if (!m) return null;
  const q = new URLSearchParams(loc.search), keep = new URLSearchParams();
  for (const k of ['sort', 't']) if (q.get(k)) keep.set(k, q.get(k));
  const s = keep.toString();
  return `/${m[1] === 'r' ? 'r' : 'u'}/${m[2]}${s ? '?' + s : ''}`;
}

const favName = key => decodeURIComponent(key.split('?')[0].slice(1));
const SORT_LABEL = { hot: 'Hot', new: 'Nouveaux', top: 'Top', rising: 'En hausse' };
const T_LABEL = { hour: 'heure', day: 'jour', week: 'semaine', month: 'mois', year: 'année', all: 'toujours' };
function favSort(key) {
  const q = new URLSearchParams(key.split('?')[1] || '');
  const s = q.get('sort'), t = q.get('t');
  return s ? (SORT_LABEL[s] || s) + (t ? ` · ${T_LABEL[t] || t}` : '') : '';
}

// Le cookie ne garde que l'ordre, les clés et les collections : les aperçus se régénèrent.
const favsToCookie = st => JSON.stringify({ g: st.groups, f: st.favs.map(f => [f.key, f.group]) });
function favsFromCookie(str) {
  try {
    const o = JSON.parse(str);
    return { groups: o.g || [], favs: (o.f || []).map(([key, group]) => ({ key, group: group || '' })) };
  } catch {
    return null;
  }
}

// a prioritaire (ordre, aperçus) ; b n'apporte que ce qui manque dans a.
function mergeFavs(a, b) {
  const keys = new Set(a.favs.map(f => f.key));
  return { groups: [...new Set([...a.groups, ...b.groups])], favs: [...a.favs, ...b.favs.filter(f => !keys.has(f.key))] };
}

// Déplace key dans group, juste avant beforeKey, ou en fin de group si beforeKey est null.
function moveFavIn(st, key, group, beforeKey) {
  const i = st.favs.findIndex(f => f.key === key);
  if (i < 0 || key === beforeKey) return;
  const [f] = st.favs.splice(i, 1);
  f.group = group;
  let at = beforeKey ? st.favs.findIndex(x => x.key === beforeKey) : -1;
  if (at < 0) {
    const lastInGroup = st.favs.map(x => x.group).lastIndexOf(group);
    at = lastInGroup < 0 ? st.favs.length : lastInGroup + 1;
  }
  st.favs.splice(at, 0, f);
}

// Monte (dir = -1) ou descend (dir = 1) une collection dans l'ordre d'affichage.
function moveGroup(st, name, dir) {
  const i = st.groups.indexOf(name), j = i + dir;
  if (i < 0 || j < 0 || j >= st.groups.length) return;
  [st.groups[i], st.groups[j]] = [st.groups[j], st.groups[i]];
}

if (typeof module !== 'undefined') {
  module.exports = { favKey, favName, favSort, favsToCookie, favsFromCookie, mergeFavs, moveFavIn, moveGroup };
} else {
  var favState = { groups: [], favs: [] }; // favs : { key, group, thumb, thumbDay }
  var favListeners = new Set();
  const notify = () => favListeners.forEach(fn => fn());

  const readCookie = () => {
    const jar = Object.fromEntries(document.cookie.split('; ').map(c => [c.slice(0, c.indexOf('=')), c.slice(c.indexOf('=') + 1)]));
    let s = '';
    for (let i = 0; jar[FAV_COOKIE + i]; i++) s += jar[FAV_COOKIE + i];
    return s ? favsFromCookie(decodeURIComponent(s)) : null;
  };
  const writeCookie = st => {
    const s = encodeURIComponent(favsToCookie(st));
    for (let i = 0; i < COOKIE_MAX; i++) {
      const part = s.slice(i * COOKIE_CHUNK, (i + 1) * COOKIE_CHUNK);
      document.cookie = `${FAV_COOKIE}${i}=${part}; path=/; SameSite=Lax; Secure; max-age=${part ? 315360000 : 0}`;
    }
  };

  // 3e copie : chrome.storage.sync (suit le compte Edge, survit à une réinstallation si la synchro est active).
  // Quota : 8 Ko par clé → découpe en favBackup0…n.
  const SYNC_CHUNK = 7000;
  const readSync = async () => {
    const all = await chrome.storage.sync.get(null).catch(() => ({}));
    let s = '';
    for (let i = 0; all['favBackup' + i]; i++) s += all['favBackup' + i];
    return s ? favsFromCookie(s) : null;
  };
  const writeSync = async compact => {
    const chunks = {};
    for (let i = 0; i * SYNC_CHUNK < compact.length; i++) chunks['favBackup' + i] = compact.slice(i * SYNC_CHUNK, (i + 1) * SYNC_CHUNK);
    const stale = Object.keys(await chrome.storage.sync.get(null).catch(() => ({}))).filter(k => k.startsWith('favBackup') && !(k in chunks));
    await chrome.storage.sync.set(chunks).catch(e => console.warn('[favoris] copie sync impossible', e));
    if (stale.length) chrome.storage.sync.remove(stale).catch(() => {});
  };

  // Le cookie et la copie sync ne changent que si l'ordre, les clés ou les collections changent (pas les aperçus) :
  // évite d'épuiser le quota d'écritures sync pendant l'actualisation des aperçus.
  let lastCompact = null;
  const writeBackups = force => {
    const compact = favsToCookie(favState);
    if (!force && compact === lastCompact) return;
    lastCompact = compact;
    writeCookie(favState);
    writeSync(compact);
  };

  const EMPTY = { groups: [], favs: [] };
  var loadFavs = async () => {
    const { favState: st } = await chrome.storage.local.get('favState');
    favState = [readCookie(), await readSync()].reduce((acc, b) => mergeFavs(acc, b || EMPTY), st || EMPTY);
    chrome.storage.local.set({ favState });
    writeBackups(true); // resynchronise les trois copies
    notify();
  };
  var saveFavs = () => {
    chrome.storage.local.set({ favState });
    writeBackups();
    notify();
  };
  // Synchronise les autres onglets reddtastic ouverts.
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area !== 'local' || !ch.favState?.newValue || JSON.stringify(ch.favState.newValue) === JSON.stringify(favState)) return;
    favState = ch.favState.newValue;
    lastCompact = favsToCookie(favState); // l'onglet d'origine a déjà écrit les copies
    notify();
  });

  var isFav = key => favState.favs.some(f => f.key === key);
  var toggleFav = key => {
    if (isFav(key)) favState.favs = favState.favs.filter(f => f.key !== key);
    else favState.favs.unshift({ key, group: '' });
    saveFavs();
  };

  const today = () => new Date().toDateString();
  var needsThumb = f => f.thumbDay !== today();
  // Aperçu du jour : meilleur post du jour pour un subreddit (repli sur hot), dernier post pour un utilisateur.
  var refreshThumb = async f => {
    const { pathname } = new URL(f.key, location.origin);
    const tries = pathname.startsWith('/r/') ? ['?sort=top&t=day', '?sort=hot'] : ['?sort=new'];
    let ok = false;
    for (const search of tries) {
      const r = await fetch(apiFor({ pathname, search }, 25)).catch(() => null);
      if (!r?.ok) continue;
      ok = true;
      const thumb = (await r.json()).data.children.map(c => thumbOf(c.data)).find(Boolean);
      if (thumb) {
        f.thumb = thumb;
        break;
      }
    }
    if (ok) f.thumbDay = today(); // en cas d'erreur réseau, on réessaiera à la prochaine ouverture
  };
  var refreshThumbs = async (force = false) => {
    const queue = favState.favs.filter(f => force || needsThumb(f));
    if (force) queue.forEach(f => (f.thumbDay = null));
    notify();
    const worker = async () => {
      for (let f; (f = queue.shift()); ) {
        await refreshThumb(f);
        saveFavs();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  };
}
