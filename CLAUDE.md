# CLAUDE.md: Earth Distance Game

## Purpose
- Personal learning project. Jeremy uses it to learn software development with AI agents, including releasing a game to the web and to the Google Play Store.
- Players are a small number of Jeremy's friends. There is no monetisation.
- The full product brief is in `docs/product_brief.md`. Read it before starting new work.

## Constraints
- **Cost:** £0 for hosting, APIs, libraries and subscriptions. Bitrise Remote Development Environments (RDE) cost Jeremy nothing personally, so they are allowed.
- **Architecture:** always choose the simplest architecture that meets the requirements. The web app is static files only, with no backend and no build step.
- **Hosting:** GitHub Pages (free for public repositories).
- **Source control:** public repository `r0yalblue/earth-distance-game`. Run `gh auth switch --user r0yalblue` before any `gh` command. Commits use the repository-local noreply email, not Jeremy's work email.
- **Libraries:** pin exact versions when loading from a CDN.

## Product decisions (as of 08/11/2026)
- Two modes, chosen on launch:
  - **Measure:** search two cities (Open-Meteo geocoding) and see the arc and distance.
  - **Play:** 3 rounds; each round shows two national capitals with no markers; the player types a distance in km.
- Click-to-drop pins on the globe have been removed as unnecessary UX complexity.
- **Scoring:** points per round = 100 × (1 − |guess − actual| ÷ actual), never below 0. A game totals 300. Jeremy may fine-tune the curve later.
- **Sharing:** a "Copy result" button produces text to paste into a chat. No accounts, no leaderboard, no backend.
- **Capitals data:** bundled as a static JSON file, with no API calls in Play mode.
- **Distance:** haversine great-circle distance, rounded to the nearest km.

## Development environment
- The web app is developed locally on Jeremy's Mac.
- Serve it with `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000. Opening `index.html` from disk does not work (ES modules and WebGL textures are blocked on `file://`). Always bind to 127.0.0.1; Claude's auto mode blocks servers exposed to the network.
- Work happens on a feature branch per phase, merged to `main` through a pull request that Jeremy reviews.
- The Android phase moves to a Bitrise RDE, so Jeremy learns that workflow. This file and the product brief are committed so the context travels with the code.
- The Android approach (Capacitor wrapper or native Kotlin rewrite) is undecided until the web app is live.

## Working with Jeremy
- Plan before implementing, and get Jeremy's approval on the approach.
- Explain changes so Jeremy understands them; this is a learning project.
- Use British English, dd/mm/yyyy dates and no em dashes.

## Roadmap
1. Repository setup (README, `.gitignore`, this file, product brief). Done.
2. Restructure into separate files; add the Measure/Play mode picker; keep a copy of the globe textures in the repository. Done.
3. Build Play mode (capitals, scoring, copy result).
4. Unit tests for distance and scoring (Node built-in test runner); deploy to GitHub Pages.
5. Android app and Google Play Store listing (in a Bitrise RDE).
