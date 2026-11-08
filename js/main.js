// App entry point: builds the globe and switches between screens.
// Screens are driven by the URL hash (#measure, #play), so the browser's
// Back button (and later Android's) returns to the start screen.

import { createGlobe } from './globe.js';
import { createMeasure } from './measure.js';
import { createPlay } from './play.js';

const globe = createGlobe(document.getElementById('globe'));

const screens = {
  home: { el: document.getElementById('home'), enter() { globe.clear(); globe.setAutoRotate(true); }, exit() { globe.setAutoRotate(false); } },
  measure: { el: document.getElementById('measure') },
  play: { el: document.getElementById('play') },
};
Object.assign(screens.measure, createMeasure(screens.measure.el, globe));
Object.assign(screens.play, createPlay(screens.play.el, globe));

let current = null;

function show(name) {
  const next = screens[name] ? name : 'home';
  if (next === current) return;
  if (current) {
    screens[current].exit();
    screens[current].el.hidden = true;
  }
  current = next;
  screens[current].el.hidden = false;
  screens[current].enter();
}

const route = () => show(location.hash.slice(1));
addEventListener('hashchange', route);
route();
