# MRS by Letterboxd

A lightweight, static movie discovery interface for browsing curated films and opening their Letterboxd pages.

## What it does

- Search movies by title, director, or genre
- Filter by language and release period
- Browse Telugu, Hindi, English, Tamil, Malayalam, Korean, and Japanese cinema
- Explore genres including drama, romance, action, thriller, comedy, crime, science fiction, horror, animation, fantasy, and music
- Open every recommendation through a coloured **View on Letterboxd** button
- Submit a community recommendation with a Letterboxd film URL
- Use an animated, responsive water-glass interface

## Recommendation model features

The current version is a client-side catalogue discovery model. It does not train or call a backend ML service.

| Feature | How it works |
| --- | --- |
| Keyword matching | Matches a search term against a film's title, director, and genres. |
| Genre filtering | Filters the catalogue by the selected genre. |
| Language filtering | Limits results to the selected cinema language. |
| Period filtering | Lets visitors explore recent releases, the 2010s, or the 2000s. |
| Community input | Adds a submitted Letterboxd recommendation to the current browser session. |
| Letterboxd routing | Provides a direct link to the film's Letterboxd page. |

## Requirements

This project is a single static HTML page.

- A modern web browser
- Internet access only for Google Fonts and outbound Letterboxd links
- No Node.js, Python, database, build step, or API key is required

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```text
.
├── index.html         # MRS by Letterboxd frontend
├── README.md          # Project documentation
└── requirements.txt   # Documents that no Python packages are needed
```

## Deployment

Because the app is static, it can be deployed to GitHub Pages, Vercel, Netlify, or any static hosting provider. Set the published directory to the repository root.

## Notes

- Community-submitted films are stored only in the active browser session; refreshing the page removes them.
- Letterboxd details are not automatically fetched from the submitted URL. The user supplies the title and optional movie metadata.
