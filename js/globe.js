// Wraps Globe.gl (loaded as a global `Globe` from the CDN script tag in index.html)
// so the rest of the app talks to a small, app-specific API.

import { midpoint } from './geo.js';

const ACCENT = '#ff8a3d';

export function createGlobe(container) {
  const globe = Globe()(container)
    .globeImageUrl('assets/earth-blue-marble.jpg')
    .backgroundImageUrl('assets/night-sky.png')
    .pointColor(() => ACCENT).pointAltitude(0.02).pointRadius(0.6)
    .pointLabel(p => p.name)
    // Altitude 0 draws the arc flush with the surface along the great circle,
    // so the line on screen is the route the distance is measured along.
    .arcColor(() => ['#ffd166', ACCENT]).arcStroke(0.6).arcAltitude(0)
    .width(innerWidth).height(innerHeight);

  addEventListener('resize', () => globe.width(innerWidth).height(innerHeight));

  const controls = globe.controls();
  controls.autoRotateSpeed = 0.4;

  return {
    // Slow spin, used behind the start screen.
    setAutoRotate(on) { controls.autoRotate = on; },

    // Markers only (no arc), e.g. when one city has been chosen.
    showPoints(points) {
      globe.pointsData(points);
      globe.arcsData([]);
    },

    // Two markers joined by an arc, with the camera framing the route.
    showRoute(a, b, km) {
      globe.pointsData([a, b]);
      globe.arcsData([{ startLat: a.lat, startLng: a.lng, endLat: b.lat, endLng: b.lng }]);
      const mid = midpoint(a, b);
      globe.pointOfView({ ...mid, altitude: Math.min(3.2, 1.2 + km / 9000) }, 1000);
    },

    flyTo({ lat, lng }, altitude = 1.8) {
      globe.pointOfView({ lat, lng, altitude }, 800);
    },

    clear() {
      globe.pointsData([]);
      globe.arcsData([]);
    },
  };
}
