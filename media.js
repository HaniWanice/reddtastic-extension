// Transforme un post de l'API Reddtastic (format listing Reddit) en liste de médias affichables.
function mediaOf(p) {
  const dec = u => u && u.replace(/&amp;/g, '&');
  const rv = p.secure_media?.reddit_video;
  if (rv) return [{ type: 'video', hls: dec(rv.hls_url), mp4: dec(rv.fallback_url) }];

  if (p.media_metadata) {
    // shortcut: sans gallery_data, l'ordre suit les clés de media_metadata, peut différer de Reddit.
    const ids = p.gallery_data?.items?.map(i => i.media_id) ?? Object.keys(p.media_metadata);
    return ids.map(id => p.media_metadata[id]).filter(m => m?.status === 'valid').map(m =>
      // i.redd.it = fichier original ; m.s.u (preview.redd.it) = même taille mais recompressé, gardé en secours.
      m.e === 'Image' ? { type: 'image', src: m.m && m.id ? `https://i.redd.it/${m.id}.${m.m.split('/')[1]}` : dec(m.s.u), alt: dec(m.s.u) }
      : m.e === 'AnimatedImage' ? (m.s.mp4 ? { type: 'video', mp4: dec(m.s.mp4) } : { type: 'image', src: dec(m.s.gif) })
      : m.e === 'RedditVideo' ? { type: 'video', hls: dec(m.hlsUrl) }
      : null).filter(Boolean);
  }

  const url = p.url || '';
  if (/\.gifv$/i.test(url)) return [{ type: 'video', mp4: url.replace(/\.gifv$/i, '.mp4') }];
  if (/\.(jpe?g|png|webp|gif)$/i.test(url)) return [{ type: 'image', src: url }];

  const img = p.preview?.images?.[0];
  const mp4 = img?.variants?.mp4?.source?.url;
  if (mp4) return [{ type: 'video', mp4: dec(mp4) }];
  return img ? [{ type: 'image', src: dec(img.source.url) }] : [];
}

// Aperçu léger (~640 px de large) pour le tableau de bord des favoris.
function thumbOf(p) {
  const dec = u => u && u.replace(/&amp;/g, '&');
  const pick = list => list?.length ? list.find(r => (r.width ?? r.x) >= 640) || list[list.length - 1] : null;
  const r = pick(p.preview?.images?.[0]?.resolutions);
  if (r) return dec(r.url);
  const m = p.media_metadata && Object.values(p.media_metadata).find(m => m.status === 'valid' && m.p?.length);
  return dec(pick(m?.p)?.u) || null;
}

if (typeof module !== 'undefined') module.exports = { mediaOf, thumbOf };
