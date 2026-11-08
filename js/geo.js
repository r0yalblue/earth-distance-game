// Pure geographic maths. No DOM or globe code here, so it can be unit tested in Node.

const EARTH_RADIUS_KM = 6371;
const KM_TO_MILES = 0.621371;

const toRad = deg => deg * Math.PI / 180;

// Great-circle distance in km between two {lat, lng} points (haversine formula).
export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export const kmToMiles = km => km * KM_TO_MILES;

// Midpoint longitude that takes the short way round, across the antimeridian if needed.
export function midLng(a, b) {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  const m = a + d / 2;
  return m > 180 ? m - 360 : m < -180 ? m + 360 : m;
}

// Rough camera target between two points: good enough for framing the view.
export const midpoint = (a, b) => ({ lat: (a.lat + b.lat) / 2, lng: midLng(a.lng, b.lng) });

// Whole number with thousands separators, e.g. 16994 -> "16,994".
export const formatNumber = n => Math.round(n).toLocaleString('en-GB');
