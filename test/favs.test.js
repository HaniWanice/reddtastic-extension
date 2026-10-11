// Lancer : node test/favs.test.js
const assert = require('node:assert');
const { favKey, favName, favSort, favsToCookie, favsFromCookie, mergeFavs, moveFavIn, moveGroup } = require('../favs.js');

const loc = (pathname, search = '') => ({ pathname, search });
assert.strictEqual(favKey(loc('/r/photo')), '/r/photo');
assert.strictEqual(favKey(loc('/r/photo/', '?sort=top&t=week&foo=1')), '/r/photo?sort=top&t=week');
assert.strictEqual(favKey(loc('/user/Bob')), '/u/Bob');
assert.strictEqual(favKey(loc('/news')), null);
assert.strictEqual(favName('/r/photo?sort=top'), 'r/photo');
assert.strictEqual(favSort('/r/photo?sort=top&t=week'), 'Top · semaine');
assert.strictEqual(favSort('/r/photo'), '');

const st = { groups: ['Paysages'], favs: [{ key: '/r/a', group: '', thumb: 'x' }, { key: '/u/b', group: 'Paysages' }] };
assert.deepStrictEqual(favsFromCookie(favsToCookie(st)), { groups: ['Paysages'], favs: [{ key: '/r/a', group: '' }, { key: '/u/b', group: 'Paysages' }] });
assert.strictEqual(favsFromCookie('pas du json'), null);

// fusion : a garde ses aperçus et son ordre, b ajoute seulement les absents
const m = mergeFavs(st, { groups: ['Paysages', 'Autre'], favs: [{ key: '/u/b', group: '' }, { key: '/r/c', group: 'Autre' }] });
assert.deepStrictEqual(m.groups, ['Paysages', 'Autre']);
assert.deepStrictEqual(m.favs.map(f => f.key + ':' + f.group), ['/r/a:', '/u/b:Paysages', '/r/c:Autre']);
assert.strictEqual(m.favs[0].thumb, 'x');

// déplacements
const s2 = { groups: ['G'], favs: ['1', '2', '3'].map(k => ({ key: k, group: '' })).concat({ key: '4', group: 'G' }) };
const order = () => s2.favs.map(f => f.key + f.group).join(' ');
moveFavIn(s2, '3', '', '1');
assert.strictEqual(order(), '3 1 2 4G');
moveFavIn(s2, '3', '', null); // fin du groupe '' (avant les éléments de G)
assert.strictEqual(order(), '1 2 3 4G');
moveFavIn(s2, '1', 'G', null);
assert.strictEqual(order(), '2 3 4G 1G');
moveFavIn(s2, '2', 'G', '4');
assert.strictEqual(order(), '3 2G 4G 1G');
moveFavIn(s2, '4', 'Vide', null); // groupe sans élément : en fin de liste
assert.strictEqual(order(), '3 2G 1G 4Vide');


// ordre des collections
const s3 = { groups: ['A', 'B', 'C'], favs: [] };
moveGroup(s3, 'C', -1);
assert.deepStrictEqual(s3.groups, ['A', 'C', 'B']);
moveGroup(s3, 'A', -1); // déjà en tête : rien
moveGroup(s3, 'B', 1); // déjà en fin : rien
assert.deepStrictEqual(s3.groups, ['A', 'C', 'B']);

console.log('favs.test.js OK');
