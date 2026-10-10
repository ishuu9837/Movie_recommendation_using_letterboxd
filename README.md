# MRS for Letterboxd 2.0
Single-file film finder. `index.html` runs the whole recommender in the browser (genre + language + era vectors, cosine similarity to a taste profile built from the films you heart, blended 75/25 with Letterboxd rating, same weighting as the original Python model).

Deploy: push to GitHub and import into Vercel/Netlify, or upload `index.html` to any static host. No build step.
`api/recommend.py` is the original scikit-learn endpoint, kept for server-side use (not required by v2).
