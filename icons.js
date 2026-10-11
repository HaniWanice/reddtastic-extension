// Icônes SVG maison, trait 1.75, viewBox 24 : un seul style pour tout le diaporama et le tableau de bord.
const ICON_PATHS = {
  play: '<path d="M7.5 4.8v14.4L19 12z" fill="currentColor"/>',
  pause: '<path d="M8.5 5v14M15.5 5v14"/>',
  prev: '<path d="M6 5v14M18 5.5 9 12l9 6.5z"/>',
  next: '<path d="M18 5v14M6 5.5 15 12l-9 6.5z"/>',
  muted: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="m4 4 16 16"/>',
  fullscreen: '<path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.8.9-4.2 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.2-4.1 5.8-.9z"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  upscale: '<path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/>',
  timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.3 1.8M9.5 3h5"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.9 12.5h9.2L17.5 7"/>',
  up: '<path d="m5.5 14.5 6.5-6.5 6.5 6.5"/>',
  down: '<path d="m5.5 9.5 6.5 6.5 6.5-6.5"/>',
  left: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  right: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M17.5 13.5v5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M19.5 10A7.8 7.8 0 0 0 5.6 7.2L4.5 8.5M4.5 4.5v4h4M4.5 14a7.8 7.8 0 0 0 13.9 2.8l1.1-1.3m0 4v-4h-4"/>',
};
const icon = (name, cls = '') =>
  `<svg class="rdi ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
