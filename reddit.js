// Sur reddit.com (avec ou sans compte) : boutons qui ouvrent la même page sur Reddtastic.
const REDDTASTIC = 'https://reddtastic.com';
const SORTS = ['hot', 'new', 'top']; // tris proposés par Reddtastic

// /r/photo/top/?t=week → https://reddtastic.com/r/photo?sort=top&t=week#diaporama ; null si la page n'a pas d'équivalent.
function reddtasticUrl(loc) {
  const q = new URLSearchParams(loc.search);
  // Mur de connexion ou de contenu adulte : la page visée est dans ?dest=.
  if (/^\/(login|account|over18)/.test(loc.pathname) && q.get('dest')) {
    try {
      return reddtasticUrl(new URL(q.get('dest'), 'https://www.reddit.com'));
    } catch {
      return null;
    }
  }
  const m = loc.pathname.match(/^\/(r|u|user)\/([^/?#]+)(?:\/([^/?#]+))?/);
  if (!m) return null;
  const [, kind, name, seg] = m;
  const out = new URLSearchParams();
  const sort = SORTS.includes(seg) ? seg : q.get('sort');
  if (kind === 'r') {
    if (SORTS.includes(sort) && sort !== 'hot') out.set('sort', sort);
    if (sort === 'top' && q.get('t')) out.set('t', q.get('t'));
    return `${REDDTASTIC}/r/${name}${out.size ? '?' + out : ''}#diaporama`;
  }
  if (SORTS.includes(sort) && sort !== 'new') out.set('sort', sort);
  return `${REDDTASTIC}/u/${name}${out.size ? '?' + out : ''}#diaporama`;
}

if (typeof module !== 'undefined') {
  module.exports = { reddtasticUrl };
} else {
  const bar = document.createElement('div');
  bar.id = 'rdp-launch';
  bar.className = 'rdp-on-reddit';
  bar.innerHTML = `
    <a class="rdp-l-home" href="${REDDTASTIC}/#favoris" title="Mes favoris sur Reddtastic">${icon('grid')}<span>Favoris</span></a>
    <a class="rdp-l-play" title="Ouvrir cette page en diaporama sur Reddtastic">${icon('play')}<span>Diaporama</span></a>`;
  const play = bar.querySelector('.rdp-l-play');
  // Reddit navigue sans recharger la page : on recalcule le lien.
  const sync = () => {
    const url = reddtasticUrl(location);
    play.hidden = !url;
    if (url) play.href = url;
  };
  sync();
  setInterval(sync, 1000);
  document.documentElement.append(bar); // <html> plutôt que <body> : Reddit remplace parfois le body
}
