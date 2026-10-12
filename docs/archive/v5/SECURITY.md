# Security review — MRS version 5

## Scope and trust boundaries

The deployed application is static HTML, CSS, ES modules, catalogue data and assets. It has no application server API, SQL driver, database, credential store or real sign-in system. The host’s access control is separate from the clearly labelled local demo. Build-time Python/Node scripts and historical examples are excluded from the deployed application.

The reviewed flow is: entry → demo selection → privacy choice → catalogue/model → rendered results → optional local storage. Contact navigation opens a Gmail draft. External image requests go only to the permitted poster host. No server action is triggered by searching or changing preferences.

## Measures

- Dynamic title, synopsis, genre, ID, date and preference labels are escaped before templating. Text is never passed to eval, new Function, SQL or a shell.
- Film links require HTTPS and the exact Letterboxd host and film-path shape. Poster links require permitted local asset paths or the exact HTTPS poster host. Credentials, lookalike domains, unexpected ports, unsafe schemes and local path traversal are rejected.
- Catalogue generation validates every source URL, poster host, rating range, unique URL and unique stable ID. Runtime URL checks are applied again before rendering.
- Stored film IDs are filtered against the current catalogue. Preference values are constrained to available languages/genres, supported moods, rating/runtime choices and theme enums. Removed catalogue titles and arbitrary stored custom films cannot be reintroduced.
- CSP allows only same-origin scripts/styles/fonts, restricts images, disables object/plugin embedding, base-URL changes and form submission, and restricts framing to the site and supported host surfaces. No inline event handlers or eval are used.
- Response-header configuration includes no-referrer, nosniff, restricted browser permissions and HTTPS HSTS. A meta CSP also applies to the application. Cloudflare _headers and Vercel configuration are generated from one header definition.
- External links use noopener/noreferrer. Gmail navigation does not send an email. Blob downloads are revoked after use; watchlist CSV output protects cells starting with formula characters.
- Demo choices collect no passwords, email addresses, provider tokens or real identity. Session markers grant no server permissions. Browser storage errors fall back to the current visit with a visible notice.
- Optional preference storage requires a privacy choice. Revocation clears current/legacy personal keys. Cross-tab revocation is respected through storage events and consent reads.

## Verification

Unit/data tests check complete catalogue coverage, rejection of unsafe URLs and hostile stored choices, escaped markup, literal SQL-style searches, preference constraints and CSP directives. Browser checks exercise the user flow under enforced headers, tampered local storage and an attempted inline script. Expected CSP blocking is distinguished from application errors. Header delivery is checked separately from local behaviour where authenticated publication access permits it.

## Publication evidence

Authenticated Chrome on the private Sites URL confirms the 8,493-title catalogue, entry/demo/preferences flow and all three legal pages work without uncaught JavaScript errors. The page-level CSP is active: the host's injected inline script is blocked, while application modules still run. The host injection is not allowed by adding unsafe-inline.

The current Sites static host does **not** deliver the configured CSP, nosniff, referrer-policy, permissions-policy or HSTS response headers. The application retains its meta CSP and meta no-referrer policy, and requests use HTTPS. The _headers file is retained for compatible static hosting and vercel.json configures equivalent response headers for a future Vercel publication; neither is claimed as delivered on the current Sites URL. Response-only framing and browser-feature restrictions therefore remain a hosting limitation. That limitation applies to Sites. After the GitHub repository update on 12 October 2026, Vercel automatically deployed the new version. HTTPS responses from https://movie-recommendation-using-letterbo.vercel.app return the configured CSP, nosniff, no-referrer, permissions policy and HSTS headers; the new catalogue/UI are present. The earlier Sites-only review did not redeploy Vercel.

## Limits

Absolute security cannot be guaranteed. This review is not a penetration-test certification. The demo is not real authentication and must never be used for private accounts or authorization. localStorage is plaintext and editable by people using the browser profile; do not store sensitive information there. Hosting-provider access, transport, future changes, browser vulnerabilities and external services are outside this application review. Posters can fail or be unavailable, and snapshots can be inaccurate. Public launch or addition of real accounts/APIs requires a new threat model, real authorization, appropriate server-side validation and further testing.

## Reference

Cloudflare documents response-header rules for static assets at https://developers.cloudflare.com/workers/static-assets/headers/. The presence of a _headers file alone is configuration evidence; it is not a substitute for checking delivered headers.
