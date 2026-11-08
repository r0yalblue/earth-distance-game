# Earth Distance Game

A globe-based web game about distances between places on Earth.

- **Measure:** search for two cities and see the great-circle distance and arc on a 3D globe.
- **Play** (coming next): guess the distance in km between two national capitals over 3 rounds, scored out of 300.

This is a personal learning project for building a game with AI agents and shipping it to the web and, later, the Google Play Store. See [docs/product_brief.md](docs/product_brief.md) for the goals and scope.

## Running it

The app must be served over HTTP, because browsers block JavaScript modules and WebGL textures on pages opened straight from disk (`file://`). From the project folder:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000. No build step is needed. `--bind 127.0.0.1` keeps the server private to your machine.

City search uses the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api), so an internet connection is required.

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | Page shell and the three screens (start, Measure, Play) |
| `css/styles.css` | Styling |
| `js/main.js` | Entry point; switches screens based on the URL hash (`#measure`, `#play`) |
| `js/globe.js` | Globe.gl setup and a small API for markers, arcs and camera |
| `js/geo.js` | Pure maths (haversine distance, midpoint, formatting) |
| `js/measure.js` | Measure mode: city search and result |
| `js/play.js` | Play mode (placeholder until the capitals game is built) |
| `assets/` | Globe and background textures (from three-globe's examples; NASA Blue Marble imagery) |
| `docs/` | Product brief |

## Tech

- [Globe.gl](https://globe.gl) for the 3D globe (loaded from jsDelivr, pinned version)
- Plain HTML, CSS and JavaScript, with no framework and no build step
- Haversine formula for great-circle distance

## Status

Measure mode works. Play mode (capitals game) is next.
