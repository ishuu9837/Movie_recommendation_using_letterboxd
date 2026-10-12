# Deploy MRS by Letterboxd

The ZIP is a source package with a ready-built dist/ directory. Extract it first. The project root contains index.html, package.json and vercel.json.

## Vercel source deployment

Import the extracted project through your repository or supported Vercel project workflow. Use:

- Framework preset: Other
- Root directory: the extracted MRS-by-Letterboxd directory
- Build command: node scripts/build.mjs
- Output directory: dist
- Node.js: 20 or later
- Environment variables: none required

vercel.json already declares the build/output and response headers. Historical code in legacy/ is not part of the built website. Do not select legacy/ or data/ as the deployment root. The site's full name is MRS by Letterboxd.

## Static hosting

Publish the contents of dist/, including _headers on a compatible host. The _headers format is host-specific; a plain web server must set security-headers.json values in its own configuration. Serve over HTTPS. Do not double-click index.html with a file:// URL: ES modules require an HTTP origin.

## Local verification

```sh
python3 scripts/preview.py
npm test
npm run build
node scripts/check-release.mjs
```

The preview server serves http://127.0.0.1:4173 with configured security headers. The release check validates assets, local links, syntax, safe links, source/build equality and header configurations.

## After publication

Test the entrance and demo, themes, Discover and All films, details/Surprise me, watchlist, remembered preferences, privacy settings and all policy links. Confirm the Gmail card opens a draft to founder@ishuu.me. Inspect actual responses for CSP, nosniff, no-referrer, permissions policy and HSTS; configuration is not proof of delivery. A new hostname starts with separate browser storage.

Sign-in remains a labelled demo with read-only example fields, not real authentication. Add real server-side authentication/authorization before introducing private accounts or sensitive data. The existing Sites project metadata is included only to preserve this project's identity; it contains no secret. The current Sites static host does not deliver the configured security response headers, so its successful publication does not certify header delivery on another host.

The original Vercel URL was unchanged during the initial package review. The subsequent GitHub main-branch update triggered a successful Vercel deployment on 12 October 2026; the new live UI and configured response headers were verified at https://movie-recommendation-using-letterbo.vercel.app. Follow FINAL_REPORT.md and SECURITY.md for evidence and limitations.
