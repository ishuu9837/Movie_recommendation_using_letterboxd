# MRS by Letterboxd — final deployment report

Release review: 12 October 2026. Application version: 5.1.0.

**Result: local application and deployment-artifact checks passed.** The configured Vercel deployment has not been executed in this review. The existing Sites publication remains private; publishing to a new public audience is a separate action.

## Reviewed flow

Entrance → clearly labelled demo sign-in → privacy choice → browser-local catalogue and recommendation model → rendered films → optional saved preferences/watchlist. There is no application API, SQL database, authentication service or required secret. The original public Vercel URL and the private Sites URL are separate deployments.

## Evidence and results

| Area | Result | Evidence |
| --- | --- | --- |
| Catalogue | Passed | All 8,493 source rows represented; unique film URLs/IDs; no extra catalogue titles. |
| Model and security checks | Passed | 16 Node tests; ranking, filters, Discover restriction, unsafe URLs, escaping, tampered preferences, literal SQL/script search and CSP configuration. |
| Entry and sign-in | Passed | Enter/close/Escape, four demo providers, read-only example fields, password visibility, demo recovery/registration. |
| Discovery and navigation | Passed | Five language actions, eight mood toggles, all main views, combined filters, five sort modes, clear filters, pagination and recent-film shelf. |
| Film actions | Passed | Surprise me, details, similar films, favourites, watched state, watchlist additions and export CSV content. |
| Preferences and privacy | Passed | Save/reload, conflicts, reset, JSON export, confirmed/cancelled clear, reduced motion, device appearance, consent removal and visit-only choices. |
| Storage resilience | Passed | Cross-tab revocation prevents persistent writes; blocked local/session storage keeps main flows usable. |
| Keyboard/accessibility basics | Passed | Search shortcut, modal focus containment, Escape/back behaviour, semantic labels and focus styling. Not an assistive-technology certification. |
| Responsive layout | Passed | Cinema/settings/themes at 360, 390, 768, 1024 and 1440 CSS px; sign-in at 360, 390, 768, 1265 and 2030 px. No horizontal overflow in tested states. |
| Policies and contact | Passed | All policy routes/settings/back links; Gmail compose targets founder@ishuu.me without sending an email. |
| Browser errors | Passed locally | No uncaught JavaScript or unexpected console/CSP errors in normal flows; deliberate inline-script attempt is blocked. |
| Image integrity | Passed | 107 bundled raster assets decode; bundled SVG assets parse. External posters remain subject to host availability and have fallbacks. |
| Static output | Passed | 52 local references checked; 10 JS/module syntax checks; 135 deployment files; source/build byte equality; no raw data, docs, tests or legacy API in dist. |
| Header configuration | Passed configuration/local checks | Vercel configuration and emitted Cloudflare header rules match security-headers.json. |
| Current Sites header delivery | Known limitation | Prior authenticated live checks found the static host does not deliver configured response headers. Meta CSP/no-referrer remain active. See SECURITY.md. |

The element review covers shared controls and representative rendered states rather than claiming every combination of 8,493 film cards was clicked. docs/evidence/element-inventory.json records visible interactive elements across 14 states. All film records and relevant local poster paths are checked programmatically.

## Findings and resolutions

The older browser scripts matched both guest-entry and registration buttons after the sign-in redesign. Selectors were corrected to target the intended guest action. Native dialog close state is asynchronous; the final control check waits for the hidden state. Neither finding required an application change. No unresolved functional failure was found in the final review.

The previous reference-design review corrected desktop form placement and passed combined visual comparison. Existing entrance/mobile-menu fixes remain verified. The current app is intentionally a demo; it must not be presented as production account authentication.

## Package and deployment

The final ZIP contains runtime source, the current catalogue, bundled assets/licenses, scripts/tests, built dist output, design.md, readme.md, PROJECT_HISTORY.log, this report, SECURITY.md, VERIFICATION.md, design-qa.md and DEPLOYMENT.md. Git history/credentials, environment files and tooling caches are excluded. RELEASE.json identifies the exact source commit. FILE_MANIFEST.json supplies per-file SHA-256 values, and a sibling .sha256 file verifies the ZIP itself.

Deploy the project source with the supplied vercel.json, or serve dist/ on compatible static hosting. Verify delivered security headers, deep links and optional-storage behaviour on the actual chosen origin before treating a new publication as verified. No real account/database/API configuration is required. See DEPLOYMENT.md.

## Practical limits

Absolute security is not guaranteed; this is a scoped source/browser/artifact review, not a penetration-test certification. Saved choices are browser-local and do not transfer across domains. Ratings and metadata are snapshots. Real sign-in, cross-device sync and backend account storage are not implemented. Current Sites response-header delivery is limited; Vercel delivery is configured but remains to be verified after that deployment. Image/illustration rights and platform access remain the operator's responsibility.
