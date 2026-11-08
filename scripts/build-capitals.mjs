// One-off script that builds data/capitals.json. The app never calls these
// sources; it only reads the generated JSON file.
//
// Run from the project root:  node scripts/build-capitals.mjs
//
// Sources (both free, no API key):
// - mledoze/countries (ODbL): UN membership, country names and capital names.
// - Natural Earth 10m populated places (public domain): capital coordinates.
//
// Rules:
// - UN member states only (193), so the list is clear and defensible.
// - Countries with several capitals use the first one mledoze lists, unless
//   overridden below.

import { writeFile, mkdir } from 'node:fs/promises';

const COUNTRIES_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const PLACES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson';

// Countries mledoze marks as UN members that are not (observer states).
const NOT_UN_MEMBERS = new Set(['VAT']);

// Capital name to use when the first listed one isn't the best choice, keyed by ISO alpha-3 code.
const CAPITAL_OVERRIDES = {
  GNQ: 'Malabo',      // Ciudad de la Paz is the designated capital but not yet functioning
  MNG: 'Ulaanbaatar', // current spelling
};

// Coordinates for capitals Natural Earth doesn't include.
const COORD_OVERRIDES = {
  NRU: { lat: -0.5477, lng: 166.9209 }, // Yaren, Nauru
};

const getJson = async url => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
};

const normalise = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');

const [countries, places] = await Promise.all([getJson(COUNTRIES_URL), getJson(PLACES_URL)]);

// Natural Earth places that are national capitals (adm0cap = 1), grouped by country code.
const capitalPlaces = new Map();
for (const { properties: p } of places.features) {
  if (p.adm0cap !== 1) continue;
  for (const code of new Set([p.adm0_a3, p.sov_a3])) {
    if (!capitalPlaces.has(code)) capitalPlaces.set(code, []);
    capitalPlaces.get(code).push(p);
  }
}
// Any Natural Earth place by normalised name, for capitals not flagged adm0cap.
const placesByName = new Map();
for (const { properties: p } of places.features) {
  for (const n of [p.name, p.nameascii, p.namealt].filter(Boolean)) {
    const key = normalise(n);
    if (!placesByName.has(key)) placesByName.set(key, []);
    placesByName.get(key).push(p);
  }
}

const capitals = [];
const problems = [];
for (const c of countries.filter(c => c.unMember && !NOT_UN_MEMBERS.has(c.cca3))) {
  const name = CAPITAL_OVERRIDES[c.cca3] ?? c.capital?.[0];
  if (!name) { problems.push(`${c.name.common}: no capital listed`); continue; }

  if (COORD_OVERRIDES[c.cca3]) {
    capitals.push({ capital: name, country: c.name.common, code: c.cca2, ...COORD_OVERRIDES[c.cca3] });
    continue;
  }

  const sameName = p => [p.name, p.nameascii, p.namealt].filter(Boolean).some(n => normalise(n) === normalise(name));
  const inCountry = p => p.adm0_a3 === c.cca3 || p.sov_a3 === c.cca3 || p.iso_a2 === c.cca2;
  const flagged = capitalPlaces.get(c.cca3) ?? [];
  const place =
    flagged.find(sameName) ??
    (placesByName.get(normalise(name)) ?? []).filter(inCountry).sort((a, b) => b.pop_max - a.pop_max)[0] ??
    (flagged.length === 1 ? flagged[0] : undefined);

  if (!place) { problems.push(`${c.name.common}: no coordinates for "${name}"`); continue; }
  if (!sameName(place)) problems.push(`${c.name.common}: "${name}" matched Natural Earth "${place.name}" (check)`);

  capitals.push({
    capital: name,
    country: c.name.common,
    code: c.cca2,
    lat: Number(place.latitude.toFixed(4)),
    lng: Number(place.longitude.toFixed(4)),
  });
}

capitals.sort((a, b) => a.country.localeCompare(b.country));
await mkdir('data', { recursive: true });
await writeFile('data/capitals.json', JSON.stringify(capitals, null, 1) + '\n');
console.log(`Wrote ${capitals.length} capitals to data/capitals.json`);
if (problems.length) console.warn('Needs attention:\n- ' + problems.join('\n- '));
