// Lancer : node test/reddit.test.js
const assert = require('node:assert');
const { reddtasticUrl } = require('../reddit.js');
const { volFromSlider, sliderFromVol } = require('../volume.js');

const u = s => reddtasticUrl(new URL(s, 'https://www.reddit.com'));
assert.strictEqual(u('/r/photo/'), 'https://reddtastic.com/r/photo#diaporama');
assert.strictEqual(u('/r/photo/hot/'), 'https://reddtastic.com/r/photo#diaporama');
assert.strictEqual(u('/r/photo/top/?t=week'), 'https://reddtastic.com/r/photo?sort=top&t=week#diaporama');
assert.strictEqual(u('/r/photo/new/?t=week'), 'https://reddtastic.com/r/photo?sort=new#diaporama');
assert.strictEqual(u('/r/photo/rising/'), 'https://reddtastic.com/r/photo#diaporama'); // tri absent de Reddtastic
assert.strictEqual(u('/r/photo/comments/abc/titre/'), 'https://reddtastic.com/r/photo#diaporama');
assert.strictEqual(u('/user/Bob/submitted/?sort=top'), 'https://reddtastic.com/u/Bob?sort=top#diaporama');
assert.strictEqual(u('/u/Bob/'), 'https://reddtastic.com/u/Bob#diaporama');
// murs de connexion / contenu adulte pour les visiteurs sans compte
assert.strictEqual(u('/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fr%2Fphoto%2Ftop%2F%3Ft%3Dday'), 'https://reddtastic.com/r/photo?sort=top&t=day#diaporama');
assert.strictEqual(u('/over18?dest=https%3A%2F%2Fold.reddit.com%2Fr%2Fphoto%2F'), 'https://reddtastic.com/r/photo#diaporama');
assert.strictEqual(u('/'), null);
assert.strictEqual(u('/settings/'), null);

// volume : bornes, courbe cubique, aller-retour
assert.strictEqual(volFromSlider(0), 0);
assert.strictEqual(volFromSlider(100), 1);
assert.strictEqual(volFromSlider(50), 0.125);
for (const p of [0, 7, 33, 50, 81, 100]) assert.strictEqual(sliderFromVol(volFromSlider(p)), p);

console.log('reddit.test.js OK');
