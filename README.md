# MRS by Letterboxd — 5.1

An independent, browser-local movie discovery website with 8,493 titles from the latest supplied catalogue. The earlier catalogue is replaced. Not affiliated with Letterboxd.

## What is included

- Entry page with updated RRR and Dune: Part Two movie cards.
- Full-screen sign-in inspired by the supplied reference: original 3D character illustration, example email/password fields, password visibility, demo recovery/register controls, and Google, Apple, email or guest entry. Fields are read-only; no credential collection or real provider connection.
- MRS wordmark without a dot; the full site name is MRS by Letterboxd.
- Dark/light appearance switch and an optional device-appearance setting.
- Discover for highest-rated 2020–2026 films rated 4.0+, full-library search and filters, eight moods and five current languages.
- Surprise me, film details, similar films, favourites, watched status and watchlists.
- Preferences for languages, genres, exclusions, mood, runtime, rating, appearance and motion. Explicit optional persistence, reset, export and clear-data controls.
- Updated cookie settings, privacy/terms pages, three-step How it works and a Gmail contact card for founder@ishuu.me.
- Removed pictured toolbar options: Your taste, Choose favourites, CSV import, Add a film and toolbar How it works. How it works now has its own section and footer link.

## Run

No runtime application dependencies, database, API key or environment secret are required. Use HTTP for ES modules:

```sh
python3 scripts/preview.py
```

Open http://127.0.0.1:4173. The preview server applies the same security headers as the build. Do not open index.html using file://.

## Check and build

Node 20+:

```sh
npm test
npm run build
node scripts/check-release.mjs
```

The build produces static output in dist/, including a Cloudflare-compatible _headers file. Vercel headers are also declared in vercel.json, with the static dist output and framework preset Other. Historical Python code under legacy/ is not deployed. Source data, documentation and tests are not copied to the public build.

`python3 scripts/import-catalogue.py` rebuilds the catalogue from data/catalogue.csv. Film URLs, poster hosts, ratings, unique URLs and stable IDs are validated during generation. Film identities preserve saved choices for matching titles; they do not add films outside the current catalogue. Directors absent from the source remain unknown unless a matching earlier film had verified metadata.

## Storage and demo behaviour

There is no real MRS account, authentication API, database, OAuth or cross-device sync. Demo state is a tab-session marker. The hosting platform can require its own sign-in for the private publication, independently of this demo.

Essential storage remembers the privacy choice and tab entry/demo state. Optional localStorage remembers film selections, cinema preferences and theme only when allowed. Without permission, choices work for this visit. Revoking permission clears current and legacy profile keys. Export is available; import is deliberately removed from this version. Browser storage is editable by its owner and is not a security boundary.

## Security and limitations

No SQL database or query endpoint exists, so SQL injection has no application query surface. Search text is compared to film metadata and is never evaluated as code. Dynamic text is escaped, links/images are restricted to permitted HTTPS hosts, stored choices are validated and CSP excludes inline/eval scripts. HTTPS, no-referrer, nosniff and restrictive feature policies are configured. See SECURITY.md for evidence and limits. Live Sites verification confirms that meta CSP works, but the current static host does not deliver the configured response headers. Those host-dependent restrictions are documented in SECURITY.md. These measures do not guarantee absolute security or turn demo sign-in into real authentication.

Film posters may be supplied by an external host; failed images have visible fallbacks. Fonts, icons, entrance cards and selected shelf images are bundled. Image rights remain with their owners. Ratings/counts are dated snapshots, not live statistics.

## Project documents

- design.md: visual system, journeys, responsiveness and accessibility.
- SECURITY.md: threat model, hardening, tests and remaining limits.
- VERIFICATION.md: current test and browser evidence.
- PROJECT_HISTORY.log: chronological account of known versions, decisions, fixes and boundaries.
- FINAL_REPORT.md: final element/file review, checks, evidence and known limits.
- DEPLOYMENT.md: build and hosting instructions.
- docs/evidence/element-inventory.json: interactive elements across 14 reviewed states.

The current Sites project is updated independently of the original Vercel URL. The user requested the final source ZIP after reviewing version 5. It includes this sign-in update, runtime source, catalogue, assets, build output and project documents; Git credentials and local tooling caches are excluded.
