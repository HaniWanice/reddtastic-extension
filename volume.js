// Curseur linéaire 0–100, volume réel = position³ : le haut du curseur fait chuter le volume vite,
// le bas donne beaucoup de course aux sons faibles (réglage précis à bas volume).
const volFromSlider = p => (p / 100) ** 3;
const sliderFromVol = v => Math.round(Math.cbrt(v) * 100);

if (typeof module !== 'undefined') module.exports = { volFromSlider, sliderFromVol };
