// Measure mode: search two cities and show the distance between them.

import { haversineKm, kmToMiles, formatNumber } from './geo.js';

const GEOCODER = 'https://geocoding-api.open-meteo.com/v1/search';
const DEBOUNCE_MS = 300;

export function createMeasure(root, globe) {
  const inputs = [root.querySelector('#from'), root.querySelector('#to')];
  const lists = [root.querySelector('#from-sugg'), root.querySelector('#to-sugg')];
  const msg = root.querySelector('.measure-msg');
  const result = root.querySelector('.measure-result');
  const distEl = root.querySelector('.measure-dist');
  const subEl = root.querySelector('.measure-sub');
  const slots = [null, null];

  function setSlot(i, place) {
    slots[i] = place;
    inputs[i].value = place.name;
    lists[i].hidden = true;
    render();
  }

  function render() {
    const [a, b] = slots;
    if (a && b) {
      const km = haversineKm(a, b);
      globe.showRoute(a, b, km);
      distEl.textContent = `${formatNumber(km)} km`;
      subEl.textContent = `${formatNumber(kmToMiles(km))} miles · ${a.name} to ${b.name}`;
      result.hidden = false;
      msg.hidden = true;
    } else {
      const chosen = slots.filter(Boolean);
      globe.showPoints(chosen);
      if (chosen[0]) globe.flyTo(chosen[0]);
      result.hidden = true;
      msg.hidden = false;
    }
  }

  function reset() {
    slots[0] = slots[1] = null;
    inputs.forEach(input => { input.value = ''; });
    lists.forEach(list => { list.hidden = true; });
    msg.textContent = 'Search for two cities to measure the distance between them.';
    render();
  }

  function showSuggestions(i, results) {
    const ul = lists[i];
    ul.replaceChildren();
    if (!results.length) {
      const li = document.createElement('li');
      li.textContent = 'No matches';
      ul.append(li);
    }
    results.forEach(c => {
      const li = document.createElement('li');
      li.append(document.createTextNode(c.name + ' '));
      const region = document.createElement('small');
      region.textContent = [c.admin1, c.country].filter(Boolean).join(', ');
      li.append(region);
      // mousedown fires before the input's blur, so the click isn't lost.
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        setSlot(i, { name: c.name + (c.country ? ', ' + c.country : ''), lat: c.latitude, lng: c.longitude });
      });
      ul.append(li);
    });
    ul.hidden = false;
  }

  // Debounced search per input; a request id discards responses that arrive out of order.
  inputs.forEach((input, i) => {
    let timer;
    let requestId = 0;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      if (slots[i]) { slots[i] = null; render(); }
      const query = input.value.trim();
      if (query.length < 2) { lists[i].hidden = true; return; }
      timer = setTimeout(async () => {
        const id = ++requestId;
        try {
          const url = `${GEOCODER}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
          const data = await (await fetch(url)).json();
          if (id !== requestId) return;
          showSuggestions(i, data.results || []);
        } catch {
          lists[i].hidden = true;
          msg.textContent = 'City search failed. Check your connection.';
        }
      }, DEBOUNCE_MS);
    });
    input.addEventListener('blur', () => { lists[i].hidden = true; });
  });

  root.querySelector('.measure-reset').addEventListener('click', reset);

  return {
    enter() { reset(); },
    exit() { reset(); globe.clear(); },
  };
}
