# I⚡H — Movie Intelligence Platform

> AI-powered movie recommendations by **genre** and **language**.  
> Trained on 9,411 Letterboxd films · 19 genres · 27 languages.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Push to GitHub

```bash
# 1. Create a new repo on github.com (name it e.g. "ih-movies")
# 2. In your terminal, navigate to this folder:

cd IH_app_v2

# 3. Initialize git and push:
git init
git add .
git commit -m "feat: initial I⚡H movie recommender"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ih-movies.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New Project"**
3. Import your **ih-movies** repository
4. Vercel auto-detects the config from `vercel.json`
5. Click **Deploy** — done! ✅

Your site will be live at: `https://ih-movies.vercel.app`

> **Note**: The Python API functions in `/api/` use Vercel's Python runtime.  
> The ML inference runs client-side (JavaScript cosine similarity) for speed.  
> The `/api/recommend` and `/api/stats` endpoints are available as serverless fallbacks.

---

## 🧠 ML Model Architecture

| Component | Detail |
|---|---|
| Algorithm | MultiLabel Binarizer + Cosine Similarity |
| Feature | Binary genre vectors (19 dimensions) |
| Scoring | 60% genre match · 30% normalized rating · 10% log-popularity |
| Language filter | Pre-filter pool before scoring |
| Dataset | 9,411 Letterboxd films |

---

## 📁 Project Structure

```
IH_app_v2/
├── index.html              ← Main frontend (static, no build needed)
├── vercel.json             ← Vercel routing config
├── requirements.txt        ← Python deps for Vercel serverless
├── public/
│   └── movies_data.json    ← Processed dataset (9,411 films)
├── api/
│   ├── recommend.py        ← POST /api/recommend (serverless)
│   └── stats.py            ← GET /api/stats (serverless)
└── README.md
```

---

## 🖥️ Local Development

```bash
# Simple static server (no Python needed — ML runs in browser)
npx serve .
# or
python3 -m http.server 3000
# Visit http://localhost:3000
```

---

## 🔌 API Reference

### `POST /api/recommend`
```json
{
  "genres": ["Action", "Thriller"],
  "languages": ["English", "Korean"],
  "top_n": 20,
  "sort_by": "relevance"
}
```
Response:
```json
{
  "movies": [{ "title": "...", "rating": 4.1, "match_score": 100, ... }],
  "total": 20,
  "genres": ["Action", "Thriller"],
  "languages": ["English", "Korean"]
}
```

### `GET /api/stats`
Returns dataset stats: total movies, avg rating, genre/language distribution.

---

## 🌐 Supported Languages
English · Japanese · French · Italian · Korean · Spanish · German · Chinese · Cantonese · Danish · Russian · Swedish · Polish · Portuguese · Romanian · Dutch · Persian · Norwegian · Arabic · Czech · Hungarian · Greek · Hindi · Indonesian · Thai · Turkish · Silent

## 🎬 Supported Genres
Action · Adventure · Animation · Comedy · Crime · Documentary · Drama · Family · Fantasy · History · Horror · Music · Mystery · Romance · Science Fiction · Thriller · War · Western · TV Movie
