# Earth Distance Game

A globe-based web game about distances between places on Earth.

- **Measure:** search for two cities and see the great-circle distance and arc on a 3D globe.
- **Play** (coming next): guess the distance in km between two national capitals over 3 rounds, scored out of 300.

This is a personal learning project for building a game with AI agents and shipping it to the web and, later, the Google Play Store. See [docs/product_brief.md](docs/product_brief.md) for the goals and scope.

## Running it

Open `globe-distance-cities.html` in a browser. No build step or server is needed.

City search uses the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api), so an internet connection is required.

## Tech

- [Globe.gl](https://globe.gl) for the 3D globe (loaded from jsDelivr, pinned version)
- Plain HTML, CSS and JavaScript, with no framework and no build step
- Haversine formula for great-circle distance

## Status

Early prototype. The single HTML file will be split into separate files in the next phase.
