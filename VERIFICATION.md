# Verification — MRS version 5, 11 October 2026

## Catalogue and model

All 8,493 rows in the latest supplied catalogue are represented by 8,493 unique film URLs and stable IDs. Earlier catalogues and curated additions do not add titles to this version. Languages: English 6,616; Telugu 649; Tamil 647; Hindi 300; Malayalam 281. Matching film identities preserve eligible saved choices. Source filenames do not appear in public UI copy.

Sixteen Node model/data/security tests pass. Coverage includes complete input coverage, no extra titles, URL/ID uniqueness, Discover's 2020–2026/4.0+ film-only ranking, combined filters, personal recommendations, explicit preference boosts/exclusions, watched-film controls, stable saved IDs, unsafe URL rejection, escaped hostile text, constrained stored choices, literal SQL/script search strings, CSP directives and removal of the pictured toolbar.

## Browser verification

Headless Chrome with the configured response headers exercised:

- Entry and both replacement posters; Google, Apple, email and guest demo choices. No credentials are collected.
- Essential-only use, optional persistence, profile/preferences save and reload, conflicts, reset/export/clear, and later consent revocation.
- Surprise me, details, favourite/watched/watchlist choices, complete-library search, and literal hostile search strings.
- Exact contact copy and Gmail compose target addressed to founder@ishuu.me; safe external-link attributes.
- Privacy/cookie/terms routes, each page's storage settings and appearance controls.
- Dark/light layouts and entry/settings flows at 360, 390, 768, 1024 and 1440 CSS pixels, with no horizontal overflow.
- Tampered local preferences/film IDs ignored, and an attempted inline script blocked by CSP.
- Cross-tab revocation removing optional data and preventing further persistent writes, while current-visit choices remain usable.
- Disabled localStorage/sessionStorage: entry, demo, watchlist and preferences still work without uncaught JavaScript errors.

Normal flows produced no JavaScript page errors or unexpected CSP errors. The intentional inline-script security probe produced the expected CSP rejection.

## Findings resolved

The Python preview server's default connection backlog caused intermittent reset requests for module files during repeated browser contexts. Its queue is now 128; the complete browser suite passes after the change. This was a local preview transport failure.

Mobile entrance cards inherited an earlier bottom offset and overlapped the entry action. The offset is reset and the cards now follow the copy in normal flow. Opening a modal also closes the mobile navigation. Settled light-mode captures wait for colour transitions; white panels and dark text were checked visually and through computed styles.

## Build and release boundary

The static build includes runtime files and assets only; source data, project documents, tests and historical Python code are excluded. Security headers are generated from security-headers.json for Cloudflare and configured for Vercel. Authenticated live checks confirm the new catalogue, demo/preferences and privacy/cookie/terms pages. No uncaught JavaScript errors occurred. The page-level CSP blocks an inline script injected by the host, while application modules run. The current Sites static host does not deliver the configured security response headers; meta CSP/meta no-referrer remain active and Vercel/Cloudflare-compatible configurations are retained. This response-header limitation is documented in SECURITY.md; it is not reported as a passed delivery check.

No application API, SQL database or real authentication exists. This is a scoped review, not a guarantee of absolute security. The private Sites publication and original public Vercel deployment are separate. The requested source ZIP awaits the user's approval of the final files.

## Version 5.1 sign-in update

Browser verification at 2030, 1265, 768, 390 and 360 CSS pixels passes for the full-screen reference-inspired sign-in. Google/Apple/email/guest, example-password visibility, recovery explanation and registration/guest entry work without page/console errors or horizontal overflow. Email/password inputs are read-only examples; no credentials are sent or stored. The large reference viewport has no vertical dialog overflow. Source and implementation were compared together, with a vertical-placement correction followed by fresh evidence; design QA passes. The user explicitly requested the final ZIP, which includes this update.

## Final deployment review — 12 October 2026

The final review reran the 16 unit/model/security tests, complete cinema/privacy browser flow, sign-in at five widths, cross-tab/blocked-storage checks and expanded control coverage. All pass. The expanded pass covers all language/mood actions, filters/sorts/reset/pagination, recent films, keyboard search and modal focus, similar films, CSV export contents, preference reset/device appearance, cancelled clear, About and policy/back links. Fourteen rendered states are inventoried in docs/evidence/element-inventory.json. A source/build audit checks 52 local references, 10 syntax modules, 135 static output files, header consistency and byte equality. All 107 bundled raster images decode and SVGs parse. No functional application changes were needed. Full evidence and limits are in FINAL_REPORT.md; packaging steps are in DEPLOYMENT.md.

## GitHub/Vercel publication confirmation

The GitHub checkout passed the same 16 tests, static build and release-file checks. Main-branch upgrade commit 84b058b10f6f33b229afea402ad1b5671fe1e3b0 triggered a successful Vercel deployment. HTTPS checks confirm the new site at https://movie-recommendation-using-letterbo.vercel.app and delivery of all configured security response headers. The previous missing-header limitation remains specific to the separate Sites static publication.
