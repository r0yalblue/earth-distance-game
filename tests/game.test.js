import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pickPairs, resultText, ROUNDS, MIN_PAIR_KM, SITE_URL } from '../js/game.js';

const capitals = JSON.parse(await readFile(new URL('../data/capitals.json', import.meta.url)));

// Small seeded random number generator (mulberry32), so each test run picks the same pairs.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('capitals data has the 193 UN member states with valid coordinates', () => {
  assert.equal(capitals.length, 193);
  assert.equal(new Set(capitals.map(c => c.code)).size, 193);
  for (const c of capitals) {
    assert.ok(c.capital && c.country, `missing name in ${JSON.stringify(c)}`);
    assert.ok(c.lat >= -90 && c.lat <= 90 && c.lng >= -180 && c.lng <= 180, `bad coordinates for ${c.capital}`);
  }
  assert.ok(!capitals.some(c => c.code === 'VA'), 'Vatican City is an observer, not a member');
});

test('every game has 3 pairs, each at least 300 km apart, with no capital used twice', () => {
  for (let seed = 1; seed <= 500; seed++) {
    const pairs = pickPairs(capitals, { random: seededRandom(seed) });
    assert.equal(pairs.length, ROUNDS);
    const names = pairs.flatMap(p => [p.a.capital, p.b.capital]);
    assert.equal(new Set(names).size, names.length, `seed ${seed} reused a capital`);
    for (const p of pairs) assert.ok(p.actualKm >= MIN_PAIR_KM, `seed ${seed}: ${p.a.capital}-${p.b.capital} too close`);
  }
});

test('the same seed always gives the same game', () => {
  const first = pickPairs(capitals, { random: seededRandom(42) });
  const second = pickPairs(capitals, { random: seededRandom(42) });
  assert.deepEqual(first, second);
});

test('result text has the score, one line per round and the link', () => {
  const rounds = [
    { a: { capital: 'Paris' }, b: { capital: 'Lima' }, score: 87 },
    { a: { capital: 'Cairo' }, b: { capital: 'Oslo' }, score: 92 },
    { a: { capital: 'Tokyo' }, b: { capital: 'Accra' }, score: 62 },
  ];
  assert.equal(
    resultText(rounds),
    `Earth Distance 🌍 241/300\nParis → Lima: 87\nCairo → Oslo: 92\nTokyo → Accra: 62\n${SITE_URL}`
  );
});
