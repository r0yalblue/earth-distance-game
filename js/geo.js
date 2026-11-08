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

// WGS-84 ellipsoid (the model GPS uses): the Earth is slightly flattened at the poles.
const WGS84_A = 6378137;            // equatorial radius, metres
const WGS84_F = 1 / 298.257223563;  // flattening
const WGS84_B = (1 - WGS84_F) * WGS84_A; // polar radius, metres

// Distance in km along the WGS-84 ellipsoid (Vincenty's inverse formula).
// Accurate to well under a metre. Returns null if the iteration fails to
// converge, which can only happen for nearly antipodal points.
export function vincentyKm(a, b) {
  const f = WGS84_F;
  const L = toRad(b.lng - a.lng);
  const U1 = Math.atan((1 - f) * Math.tan(toRad(a.lat)));
  const U2 = Math.atan((1 - f) * Math.tan(toRad(b.lat)));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let lambda = L;
  let sinSigma, cosSigma, sigma, cos2Alpha, cos2SigmaM;
  for (let i = 0; i < 200; i++) {
    const sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(
      (cosU2 * sinLambda) ** 2 +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2
    );
    if (sinSigma === 0) return 0; // same point
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    cos2Alpha = 1 - sinAlpha ** 2;
    // On the equator cos2Alpha is 0, and this term is 0 too.
    cos2SigmaM = cos2Alpha !== 0 ? cosSigma - 2 * sinU1 * sinU2 / cos2Alpha : 0;
    const C = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
    const previous = lambda;
    lambda = L + (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
    if (Math.abs(lambda - previous) < 1e-12) {
      const uSq = cos2Alpha * (WGS84_A ** 2 - WGS84_B ** 2) / WGS84_B ** 2;
      const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (
        cosSigma * (-1 + 2 * cos2SigmaM ** 2) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)
      ));
      return WGS84_B * A * (sigma - deltaSigma) / 1000;
    }
  }
  return null; // did not converge
}

// The distance the app uses everywhere: ellipsoidal, with a spherical fallback.
export const distanceKm = (a, b) => vincentyKm(a, b) ?? haversineKm(a, b);

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
