# CLAUDE.md: Earth Distance Game

## Purpose
- Personal learning project. Jeremy uses it to learn software development with AI agents, including releasing a game to the web and to the Google Play Store.
- Players are a small number of Jeremy's friends. There is no monetisation.
- The full product brief is in `docs/product_brief.md`. Read it before starting new work.

## Constraints
- **Cost:** £0 for hosting, APIs, libraries and subscriptions. Bitrise Remote Development Environments (RDE) cost Jeremy nothing personally, so they are allowed.
- **Architecture:** always choose the simplest architecture that meets the requirements. The web app is static files only, with no backend and no build step.
- **Hosting:** GitHub Pages (free for public repositories), serving `main` from the repository root at https://r0yalblue.github.io/earth-distance-game/. Every merge to `main` goes live.
- **Source control:** public repository `r0yalblue/earth-distance-game`. Run `gh auth switch --user r0yalblue` before any `gh` command. Commits use the noreply identity `Jeremy Palmer <54328869+r0yalblue@users.noreply.github.com>`, set in the repository's local git config, never Jeremy's work email. In a fresh clone (for example in an RDE), set it with `git config user.name` and `git config user.email` before the first commit.
- **Branch protection on `main`:** every change goes through a pull request (no approvals needed, since Jeremy cannot approve his own PRs), the `test` check must pass, the rule applies to admins, and force pushes and deletion are blocked.
- **Libraries:** pin exact versions when loading from a CDN. The globe.gl `<script>` tag has a Subresource Integrity (`integrity`) hash; when upgrading globe.gl, recompute it (SHA-384 of the exact file, checked against the npm package) or the globe will not load.

## Product decisions (as of 08/11/2026)
- Two modes, chosen on launch:
  - **Measure:** search two cities (Open-Meteo geocoding) and see the arc and distance.
  - **Play:** 3 rounds; each round shows two national capitals with no markers; the player types a distance in km.
- Click-to-drop pins on the globe have been removed as unnecessary UX complexity.
- **Scoring:** points per round = 100 × (1 − |guess − actual| ÷ actual), never below 0. A game totals 300. Jeremy may fine-tune the curve later.
- **Sharing:** a "Copy result" button produces text to paste into a chat. No accounts, no leaderboard, no backend.
- **Capitals data:** `data/capitals.json`, the 193 UN member states only (no observers such as Vatican City or Palestine, no partially recognised states). Generated once by `node scripts/build-capitals.mjs` from mledoze/countries (names, UN membership) and Natural Earth (coordinates); the app never calls an API in Play mode. Manual corrections live in that script.
- **Pairs:** 3 per game, each at least 300 km apart, with no capital used twice in a game.
- **Distance:** Vincenty's formula on the WGS-84 ellipsoid (`distanceKm` in `js/geo.js`), falling back to haversine for nearly antipodal points. Rounded to the nearest km for display; scores use the unrounded value.

## Development environment
- The web app is developed locally on Jeremy's Mac.
- Serve it with `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000. Opening `index.html` from disk does not work (ES modules and WebGL textures are blocked on `file://`). Always bind to 127.0.0.1; Claude's auto mode blocks servers exposed to the network.
- Work happens on a feature branch per phase, merged to `main` through a pull request that Jeremy reviews.
- Run `npm test` (Node built-in test runner, no dependencies) before committing. GitHub Actions runs the same tests on every PR; do not merge with failing checks.
- Keep game logic in pure modules (`js/geo.js`, `js/scoring.js`, `js/game.js`) with tests in `tests/`.
- The Android phase moves to a Bitrise RDE, so Jeremy learns that workflow. This file and the product brief are committed so the context travels with the code.
- The web app went live on 08/11/2026. The Android approach (Capacitor wrapper or native Kotlin rewrite) is the first decision of Phase 5: present the trade-offs and a plan to Jeremy before building.
- Known issue, deliberately deferred: on phones the card can cover the top end of north-south arcs (camera framing).

## Working with Jeremy
- Plan before implementing, and get Jeremy's approval on the approach.
- Explain changes so Jeremy understands them; this is a learning project.
- Use British English, dd/mm/yyyy dates and no em dashes.

## Roadmap
1. Repository setup (README, `.gitignore`, this file, product brief). Done.
2. Restructure into separate files; add the Measure/Play mode picker; keep a copy of the globe textures in the repository. Done.
3. Build Play mode (capitals, scoring, copy result); switch distance to Vincenty. Done.
4. Unit tests for distance and scoring (Node built-in test runner); GitHub Actions; deploy to GitHub Pages. Done.
5. Android app and Google Play Store listing (in a Bitrise RDE). Next.

Other possible improvements (zoom detail, other worlds) are listed in the product brief; none is chosen yet.
