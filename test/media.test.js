// Lancer : node test/media.test.js
const assert = require('node:assert');
const { mediaOf, thumbOf } = require('../media.js');

assert.deepStrictEqual(mediaOf({ url: 'https://i.redd.it/a.jpeg' }), [{ type: 'image', src: 'https://i.redd.it/a.jpeg' }]);

assert.deepStrictEqual(
  mediaOf({ url: 'https://v.redd.it/x', secure_media: { reddit_video: { hls_url: 'h?a=1&amp;b=2', fallback_url: 'm.mp4' } } }),
  [{ type: 'video', hls: 'h?a=1&b=2', mp4: 'm.mp4' }]);

// galerie : gallery_data impose l'ordre, les médias invalides sont ignorés
assert.deepStrictEqual(
  mediaOf({
    url: 'https://www.reddit.com/gallery/x',
    gallery_data: { items: [{ media_id: 'b' }, { media_id: 'a' }, { media_id: 'c' }] },
    media_metadata: {
      a: { status: 'valid', e: 'Image', id: 'a', m: 'image/png', s: { u: 'A' } },
      b: { status: 'valid', e: 'AnimatedImage', s: { mp4: 'B.mp4', gif: 'B.gif' } },
      c: { status: 'failed' },
    },
  }),
  [{ type: 'video', mp4: 'B.mp4' }, { type: 'image', src: 'https://i.redd.it/a.png', alt: 'A' }]);

// galerie sans gallery_data : ordre des clés
assert.deepStrictEqual(
  mediaOf({ media_metadata: { a: { status: 'valid', e: 'Image', s: { u: 'A' } }, b: { status: 'valid', e: 'Image', s: { u: 'B' } } } })
    .map(m => m.src), ['A', 'B']);

// lien RedGIFs : la copie vidéo de Reddit passe avant l'image d'aperçu
assert.deepStrictEqual(
  mediaOf({ url: 'https://www.redgifs.com/watch/x', preview: { images: [{ source: { url: 'P' }, variants: {} }], reddit_video_preview: { hls_url: 'h?a=1&amp;b=2', fallback_url: 'm.mp4' } } }),
  [{ type: 'video', hls: 'h?a=1&b=2', mp4: 'm.mp4' }]);

assert.deepStrictEqual(mediaOf({ url: 'https://i.imgur.com/x.gifv' }), [{ type: 'video', mp4: 'https://i.imgur.com/x.mp4' }]);

assert.deepStrictEqual(
  mediaOf({ url: 'https://example.com/page', preview: { images: [{ source: { url: 'P' }, variants: {} }] } }),
  [{ type: 'image', src: 'P' }]);

assert.deepStrictEqual(mediaOf({ url: 'https://www.reddit.com/r/photo/comments/x/' }), []);


// aperçu : première résolution >= 640, sinon la plus grande ; repli sur la galerie
assert.strictEqual(thumbOf({ preview: { images: [{ resolutions: [{ url: 'a', width: 320 }, { url: 'b&amp;c', width: 640 }, { url: 'd', width: 960 }] }] } }), 'b&c');
assert.strictEqual(thumbOf({ preview: { images: [{ resolutions: [{ url: 'a', width: 108 }, { url: 'z', width: 320 }] }] } }), 'z');
assert.strictEqual(thumbOf({ media_metadata: { x: { status: 'valid', p: [{ u: 'g1', x: 320 }, { u: 'g2', x: 640 }] } } }), 'g2');
assert.strictEqual(thumbOf({ url: 'https://www.reddit.com/r/x/comments/1/' }), null);

console.log('media.test.js OK');
