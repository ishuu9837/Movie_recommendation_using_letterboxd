# MRS by Letterboxd

MRS by Letterboxd is a responsive movie discovery interface with a Python machine-learning recommendation backend.

## ML recommendation backend

`api/recommend.py` is a Vercel serverless API. It uses scikit-learn's `MultiLabelBinarizer` to convert each movie's genres into a feature vector, then ranks matching movies with cosine similarity.

The final recommendation score is:

- 75% genre cosine-similarity score
- 25% normalized Letterboxd rating

Language, period, and keyword filters are applied before ranking. The endpoint accepts a JSON request at `POST /api/recommend` and returns ranked movies with a `match_score`.

## Requirements

```bash
pip install -r requirements.txt
```

- Python 3.12 for the Vercel serverless function
- `numpy`
- `scikit-learn`

The frontend remains usable offline or on static hosts: it falls back to its built-in browser filters if the ML API is unavailable.

## Run locally

Open `index.html` in a browser for the static interface. To test the ML API, deploy to Vercel or use a local Vercel development environment:

```bash
npm install -g vercel
vercel dev
```

## Deploy

Import the GitHub repository into Vercel. Vercel detects `vercel.json`, installs `requirements.txt`, and exposes the ML endpoint at `/api/recommend`.
