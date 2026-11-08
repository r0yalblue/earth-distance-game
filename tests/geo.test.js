import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vincentyKm, haversineKm, distanceKm, midLng, kmToMiles, formatNumber } from '../js/geo.js';

// Degrees, minutes, seconds to decimal degrees.
const dms = (d, m, s) => Math.sign(d) * (Math.abs(d) + m / 60 + s / 3600);

test('Vincenty matches the published reference case (Flinders Peak to Buninyong)', () => {
  // Vincenty (1975): 54,972.271 m on the ellipsoid used here.
  const flindersPeak = { lat: dms(-37, 57, 3.72030), lng: dms(144, 25, 29.52440) };
  const buninyong = { lat: dms(-37, 39, 10.15610), lng: dms(143, 55, 35.38390) };
  assert.ok(Math.abs(vincentyKm(flindersPeak, buninyong) - 54.972271) < 0.000001);
});

test('one degree of longitude along the equator is 111.319 km on WGS-84', () => {
  assert.equal(Number(vincentyKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 }).toFixed(3)), 111.319);
});

test('distance from a point to itself is zero', () => {
  const p = { lat: 51.5, lng: -0.12 };
  assert.equal(vincentyKm(p, p), 0);
  assert.equal(distanceKm(p, p), 0);
});

test('distance is the same in both directions', () => {
  const london = { lat: 51.5019, lng: -0.1187 };
  const sydney = { lat: -33.8688, lng: 151.2093 };
  assert.ok(Math.abs(distanceKm(london, sydney) - distanceKm(sydney, london)) < 1e-6);
});

test('London to Sydney is about 16,989 km (Vincenty), within 0.5% of haversine', () => {
  const london = { lat: 51.5019, lng: -0.1187 };
  const sydney = { lat: -33.8688, lng: 151.2093 };
  const km = distanceKm(london, sydney);
  assert.equal(Math.round(km), 16989);
  assert.ok(Math.abs(km - haversineKm(london, sydney)) / km < 0.005);
});

test('nearly antipodal points fall back to haversine instead of failing', () => {
  const a = { lat: 0, lng: 0 };
  const b = { lat: 0.5, lng: 179.7 };
  assert.equal(vincentyKm(a, b), null);
  assert.equal(distanceKm(a, b), haversineKm(a, b));
});

test('midLng takes the short way round, including across the date line', () => {
  assert.equal(midLng(10, 30), 20);
  assert.equal(midLng(170, -170), 180);
  assert.equal(midLng(-170, 170), -180);
});

test('kmToMiles and formatNumber', () => {
  assert.equal(Math.round(kmToMiles(100)), 62);
  assert.equal(formatNumber(16989.3), '16,989');
  assert.equal(formatNumber(999.5), '1,000');
});
