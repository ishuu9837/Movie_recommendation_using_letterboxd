# MRS by Letterboxd — Code Explanation

This file explains the purpose of every project file and the main parts inside it.

## 1. `index.html` — Frontend

This is the complete user interface. It contains the HTML structure, CSS styling, and browser JavaScript so the project can run without a frontend build tool.

### `<head>`

| Part | Why it is used |
| --- | --- |
| `meta charset` | Lets the page display normal text and special characters correctly. |
| `meta viewport` | Makes the layout responsive on phones and tablets. |
| `title` | Sets the browser-tab title to **MRS by Letterboxd**. |
| Google Fonts link | Loads the Manrope, Playfair Display, and DM Mono typefaces used by the interface. |

### CSS visual system

| CSS section | Why it is used |
| --- | --- |
| `:root` variables | Stores reusable colours such as glass, aqua, border, and text colours in one place. |
| `.sea`, `body::before`, `body::after` | Creates the water-like background with CSS gradients instead of image files. |
| `.glass` | Gives panels the transparent, blurred glass appearance using `backdrop-filter`. |
| `.card` | Defines the simple text-only movie card layout. |
| `.movie-link` | Makes the Letterboxd link a prominent coloured button. |
| `@keyframes` | Adds entrance, floating, pulsing, and card animations. |
| `prefers-reduced-motion` | Disables non-essential animation for visitors who have motion reduction enabled in their device settings. |
| `@media` queries | Changes the grid and form layout for smaller screens. |

### Page sections

| HTML section | Why it is used |
| --- | --- |
| Navigation | Shows the MRS by Letterboxd name and a shortcut to the submission form. |
| Hero | Introduces the product without using a banner image. |
| Finder | Contains the title search, language, year, and genre controls. |
| Film grid (`#movies`) | Receives dynamically generated movie cards from JavaScript. |
| Model key features | Explains the ML ranking, filters, language coverage, and fallback behaviour. |
| Community shelf | Lets visitors add a title, metadata, and a Letterboxd link during the current browser session. |

### Movie catalogue

`const movies = [...]` stores the starter movie collection in the browser. Each movie has:

- `title`: displayed movie name
- `year`: release year
- `language`: used by the language filter
- `director`: used by local keyword search
- `genres`: used by genre filtering and ML matching
- `rating`: displayed Letterboxd-style rating and ranking signal
- `link`: destination of the Letterboxd button

This local catalogue is deliberately kept as a fallback. The page remains usable when opened as a local file or when the API is temporarily unavailable.

### JavaScript functions

| Function / code | Why it is used |
| --- | --- |
| `$()` | Short helper for selecting elements by CSS selector. |
| `esc()` | Escapes user-provided text before it is added to HTML, preventing injected HTML from being rendered. |
| `showMovies()` | Creates the text-only movie cards and updates the results count. |
| `render()` | Reads the current filters, immediately shows local results, then asks the ML API for ranked results. |
| `fetch('/api/recommend')` | Sends the query, selected language, period, and selected genre to the Python ML backend. |
| `try/catch` around `fetch` | Keeps the frontend working when it is viewed locally, hosted statically, or the backend is offline. |
| Genre filter listener | Changes the selected genre button and runs a fresh recommendation search. |
| Add-film form listener | Validates that the submitted URL is a Letterboxd domain, then adds the recommendation to the in-memory catalogue. |

## 2. `api/recommend.py` — ML backend

This is a Python serverless API for Vercel. It runs at `POST /api/recommend` after deployment.

| Part | Why it is used |
| --- | --- |
| `CATALOGUE` | Supplies the backend's film records: title, year, language, genres, rating, and Letterboxd slug. |
| `MOVIES` | Converts the compact catalogue tuples into named dictionary fields that are easy to return as JSON. |
| `MultiLabelBinarizer` | Converts multiple genres such as `Action` and `Drama` into numerical feature vectors suitable for ML comparison. |
| `GENRE_MATRIX` | Stores the genre-vector representation of every movie once, rather than rebuilding it for every request. |
| `recommend(payload)` | Applies filters, calculates similarity scores, combines similarity with rating, and sorts the recommendations. |
| `cosine_similarity` | Measures how close the selected genre vector is to each movie's genre vector. A higher score means a better genre match. |
| `0.75 * similarity + 0.25 * rating_score` | Gives genre relevance the most importance while still preferring higher-rated movies. |
| `handler(BaseHTTPRequestHandler)` | Provides the format Vercel uses to execute a basic Python serverless endpoint. |
| `do_POST()` | Reads the JSON request from the frontend and returns the ML-ranked movie list as JSON. |
| `do_OPTIONS()` | Supports browser CORS preflight checks. |

### API request example

```json
{
  "query": "",
  "language": "Telugu",
  "period": "All",
  "genres": ["Drama"]
}
```

### API response fields

Each returned movie includes its normal movie fields plus `match_score`, a value from 0 to 100 that represents the combined ML recommendation score.

## 3. `requirements.txt` — Python packages

| Package | Why it is used |
| --- | --- |
| `numpy` | Provides numerical-array support used by the ML libraries. |
| `scikit-learn` | Provides `MultiLabelBinarizer` and `cosine_similarity` for the recommendation model. |

Vercel reads this file during deployment and installs these packages for the Python function.

## 4. `vercel.json` — Deployment settings

This file tells Vercel about the serverless function configuration.

| Setting | Why it is used |
| --- | --- |
| `$schema` | Enables Vercel configuration validation and editor autocomplete. |
| `api/recommend.py` | Identifies the ML endpoint to configure. |
| `maxDuration: 10` | Allows the endpoint up to ten seconds to respond, including cold-start and ML package loading time. |

## 5. `README.md` — Project documentation

The README gives new developers and reviewers a quick explanation of the product, ML formula, requirements, local use, and Vercel deployment process.

## Request flow

```text
Visitor selects a genre / language / period
              ↓
index.html shows immediate local fallback results
              ↓
index.html POSTs filters to /api/recommend
              ↓
recommend.py encodes genres and calculates cosine similarity
              ↓
API returns ML-ranked recommendations
              ↓
index.html replaces the grid with ML-ranked results
```

> Important: community submissions currently live only in the active browser session. They are not written into the ML backend catalogue or a database.
