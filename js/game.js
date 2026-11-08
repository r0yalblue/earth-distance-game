// Game rules for Play mode that don't touch the page: choosing capital pairs
// and building the shareable result. Pure functions, so they can be unit tested.

import { distanceKm } from './geo.js';

export const ROUNDS = 3;
export const MIN_PAIR_KM = 300;
export const SITE_URL = 'https://r0yalblue.github.io/earth-distance-game/';

// Picks `rounds` pairs of capitals at least `minKm` apart, using each capital
// at most once per game. `random` can be swapped out to make tests repeatable.
export function pickPairs(capitals, { rounds = ROUNDS, minKm = MIN_PAIR_KM, random = Math.random } = {}) {
  const pool = [...capitals];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const pairs = [];
  while (pairs.length < rounds && pool.length >= 2) {
    const a = pool.shift();
    const index = pool.findIndex(b => distanceKm(a, b) >= minKm);
    if (index === -1) continue; // nothing far enough from `a`; drop it
    const [b] = pool.splice(index, 1);
    pairs.push({ a, b, actualKm: distanceKm(a, b) });
  }
  return pairs;
}

// Text for the "Copy result" button, e.g.
//   Earth Distance 🌍 241/300
//   Paris → Lima: 87
//   ...
//   https://r0yalblue.github.io/earth-distance-game/
export function resultText(rounds) {
  const total = rounds.reduce((sum, r) => sum + r.score, 0);
  const lines = rounds.map(r => `${r.a.capital} → ${r.b.capital}: ${r.score}`);
  return [`Earth Distance 🌍 ${total}/${rounds.length * 100}`, ...lines, SITE_URL].join('\n');
}
