# 🌍 Earth Distance Game: Product Brief

*Personal learning project · Owner: Jeremy Palmer · 08/11/2026*

## 🚨 Problem
Jeremy wants to learn how to build a game and ship it to real users, including a Google Play Store listing, using AI agents as the development partner. Tutorials and toy examples stop short of the parts that matter: version control, hosting, mobile packaging and store submission.

- **Gap in experience:** no first-hand experience of taking a game from idea to public URL to app store.
- **Gap in agent workflow:** no real project yet to practise directing, reviewing and understanding agent-written code.

## 🏁 Success metrics
- **Primary:** the web app is hosted and publicly available to anyone with the link.
- **Secondary:** the app is published on the Google Play Store.
- **Guardrail:** running costs stay at £0.

## 🎯 Target customer
- **Most urgent:** Jeremy, as the learner building it end to end.
- **Next:** a small group of friends playing casually on their phones and comparing scores in a group chat.
- **Not the target:** the general public, serious geography competitors, or anyone who would pay.

## 🎁 Solution
A globe-based web game with two choices on launch: **Measure** or **Play**.

1. Player opens the link on a phone or desktop and chooses Measure or Play.
2. **Measure:** they search for two cities and see the arc and distance on the globe.
3. **Play:** they see two capital names, with no markers on the globe, and type a distance guess in km.
4. The globe draws the arc, then shows the real distance, their error and points out of 100.
5. After 3 rounds, they see a total out of 300 and copy a shareable result.

| Phase / Option | Solution description | Status |
|---|---|---|
| Measure | Search two cities (Open-Meteo), see the arc and distance | Built |
| Play | 3 capital rounds, score = 100 × (1 − \|error\| ÷ actual), floored at 0 | Built |
| Click-to-drop pins | Click the globe to set points | Rejected (adds UX complexity) |
| Hosting | Static site on GitHub Pages (https://r0yalblue.github.io/earth-distance-game/) | Live |
| Android: Capacitor wrapper | Package the web code as a Play Store app | Under consideration |
| Android: native Kotlin rewrite | Rebuild natively with Jetpack Compose | Under consideration |

The Android approach is deliberately unresolved until the web game is live.

**Possible next improvements** (none chosen yet)

| Improvement | What it involves | Main trade-off |
|---|---|---|
| 1. Android app | Capacitor wrapper or native Kotlin rewrite, published to the Play Store, built in a Bitrise RDE | Delivers the secondary metric; Kotlin teaches more but means rewriting the game |
| 2. Zoom detail | Upgrade Globe.gl from 2.34.4 to 2.35.0 or later and use its tile engine (`globeTileEngineUrl`) so the surface sharpens as players zoom; NASA GIBS imagery is free and public domain | Imagery must have no place-name labels (they would reveal the capitals in Play); more data use; does not work offline |
| 3. Other worlds | Same Globe.gl code with a Moon or Mars texture (NASA, USGS); features such as craters and landing sites from the USGS Gazetteer of Planetary Nomenclature replace capitals | `js/geo.js` needs each world's radius or ellipsoid as a parameter; gas giants have no fixed surface features, so they cannot be played |

**Risks**
- **CDN or texture links break:** hot-linked images and libraries could change. Keep a copy of the textures in the repo and pin library versions.
- **Open-Meteo goes away or limits usage:** only Measure depends on it. Play uses bundled data.
- **Scoring feels unfair:** linear percentage scoring may need tuning after friends play. The formula lives in one function.
- **Play Store friction:** developer account, review and testing-track rules may take longer than expected. Start the Android phase with time to spare.

## 📐 Scope

| In Scope | Out of Scope | Later |
|---|---|---|
| Launch choice: Measure or Play | Click-to-drop pins | Android app and Play Store listing |
| Play: 3 rounds, score out of 300 | Accounts or logins | Scoring curve tuning |
| Copy-to-clipboard result text | Online leaderboard or backend | Daily challenge (same pairs for everyone) |
| Bundled capitals data (193 UN members) | Monetisation, ads, analytics | Miles option in Play |
| GitHub repo (`r0yalblue`) and GitHub Pages | Paid APIs or hosting | Difficulty levels (e.g. same continent) |
| Unit tests for distance and scoring | Real-time multiplayer | Personal best stored on the device |
| | Map styles with place-name labels | Zoom detail (tiled imagery) |
| | Gas giants as playable worlds | Other worlds (Moon, Mars) |

## ✅ Requirements
- **Cost:** £0 for hosting, APIs and libraries.
- **Platform:** works in current mobile and desktop browsers, usable one-handed on a phone.
- **Architecture:** static files only, with no backend and no build step.
- **Source control:** public repo `earth-distance-game` under GitHub account `r0yalblue`.
- **Accuracy:** ellipsoidal distance on WGS-84 (Vincenty's formula), rounded to the nearest km.

## ❓ Open Questions

| Question | Owner | Target date |
|---|---|---|
| Android approach: Capacitor wrapper or native Kotlin? | Jeremy | When web launch is complete |
| Which improvement comes next: Android app, zoom detail or other worlds? | Jeremy | Not set |

Resolved on 08/11/2026: pairs closer than 300 km are excluded; only the 193 UN member states are included (no observers or partially recognised states).

## 📈 Competitor analysis

| Product | What it tests | Distance guessing? | Cost |
|---|---|---|---|
| GeoGuessr | Locating a Street View scene | Indirect (scored by distance from the true spot) | Paid subscription |
| Worldle | Identifying a country from its shape | Shows distance as a hint, not as the challenge | Free |
| Globle | Finding a mystery country on a globe | Proximity colours as a hint | Free |
| Google Earth "measure distance" | Nothing (a tool, not a game) | Yes, but no challenge or scoring | Free |
| **Earth Distance Game (today)** | Measuring distances, guessing distances between capitals | Yes, the core of Play | Free |

**Verdict:** no popular free game makes distance estimation itself the challenge, which leaves a small but clear niche for a game played with friends.

## 🔗 Links
- Original design conversation: https://claude.ai/share/fe7667f7-7be2-4317-8c96-1aa6232e177e
- Iteration 1 artifact: https://claude.ai/artifact/DUAtyQkQ6zocU1Ka8rBoJj
- Globe.gl: https://globe.gl
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
- GitHub Pages: https://pages.github.com
- NASA GIBS (tiled Earth imagery): https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api
- USGS Gazetteer of Planetary Nomenclature: https://planetarynames.wr.usgs.gov
- NASA SVS CGI Moon Kit: https://svs.gsfc.nasa.gov/4720
