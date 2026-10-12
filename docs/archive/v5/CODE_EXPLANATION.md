# MRS by Letterboxd — code guide

The current version is a static browser-local application. The old serverless Python endpoint and duplicate nested site are removed from the active deployment; their previous versions remain in Git history. Historical Python example code under legacy/ is excluded from the build.

- index.html and styles.css: entrance, cinema layout, responsive controls and dark/light design.
- app.js: demo sign-in, rendering, search/filter actions, details, watchlist, cinema preferences and exports.
- catalogue.js: generated current catalogue with 8,493 entries.
- model.js: film-attribute recommendations, moods, ranking and filters.
- security.js: text escaping, URL validation and stored-ID constraints.
- preferences.js and theme.js: optional browser persistence, privacy settings and appearance.
- legal.js and policy pages: privacy/cookie controls and notices.
- scripts/import-catalogue.py: validated catalogue generation from data/catalogue.csv.
- scripts/build.mjs: explicit static build into dist/.
- scripts/check-release.mjs and tests/model.test.mjs: release integrity and model/security checks.

There is no application SQL database or real authentication backend. Sign-in is an explicitly labelled demo with read-only example fields. See README.md, design.md, FINAL_REPORT.md, SECURITY.md, VERIFICATION.md, DEPLOYMENT.md and PROJECT_HISTORY.log for current behaviour, evidence and limits.
