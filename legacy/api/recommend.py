"""Vercel serverless recommendation endpoint for MRS by Letterboxd."""
import json
from http.server import BaseHTTPRequestHandler

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer


CATALOGUE = [
    ("RRR", 2022, "Telugu", ["Action", "Drama"], 4.1, "rrr-2022"),
    ("Jersey", 2019, "Telugu", ["Drama", "Sport"], 4.0, "jersey-2019"),
    ("C/o Kancharapalem", 2018, "Telugu", ["Drama", "Romance"], 4.2, "c-o-kancharapalem"),
    ("Eega", 2012, "Telugu", ["Fantasy", "Action"], 3.8, "eega"),
    ("Mahanati", 2018, "Telugu", ["Drama", "Biography"], 4.1, "mahanati"),
    ("Sita Ramam", 2022, "Telugu", ["Romance", "Drama"], 3.9, "sita-ramam"),
    ("3 Idiots", 2009, "Hindi", ["Comedy", "Drama"], 4.2, "3-idiots"),
    ("Zindagi Na Milegi Dobara", 2011, "Hindi", ["Comedy", "Drama"], 4.0, "zindagi-na-milegi-dobara"),
    ("The Lunchbox", 2013, "Hindi", ["Romance", "Drama"], 4.0, "the-lunchbox"),
    ("Andhadhun", 2018, "Hindi", ["Thriller", "Comedy"], 3.9, "andhadhun"),
    ("Laapataa Ladies", 2024, "Hindi", ["Comedy", "Drama"], 4.1, "laapataa-ladies"),
    ("Dangal", 2016, "Hindi", ["Drama", "Sport"], 3.7, "dangal"),
    ("In the Mood for Love", 2000, "English", ["Romance", "Drama"], 4.4, "in-the-mood-for-love"),
    ("The Dark Knight", 2008, "English", ["Action", "Thriller"], 4.3, "the-dark-knight"),
    ("Whiplash", 2014, "English", ["Drama", "Music"], 4.4, "whiplash-2014"),
    ("Past Lives", 2023, "English", ["Romance", "Drama"], 4.1, "past-lives"),
    ("Everything Everywhere All at Once", 2022, "English", ["Action", "Comedy"], 4.1, "everything-everywhere-all-at-once"),
    ("The Batman", 2022, "English", ["Action", "Thriller"], 3.8, "the-batman"),
    ("Dune: Part Two", 2024, "English", ["Science Fiction", "Action"], 4.1, "dune-part-two"),
    ("Super Deluxe", 2019, "Tamil", ["Drama", "Crime"], 4.1, "super-deluxe-2019"),
    ("Vikram", 2022, "Tamil", ["Action", "Thriller"], 3.8, "vikram-2022"),
    ("Kumbalangi Nights", 2019, "Malayalam", ["Drama", "Comedy"], 4.2, "kumbalangi-nights"),
    ("Jallikattu", 2019, "Malayalam", ["Thriller", "Drama"], 3.7, "jallikattu"),
    ("Parasite", 2019, "Korean", ["Thriller", "Drama"], 4.2, "parasite-2019"),
    ("The Handmaiden", 2016, "Korean", ["Romance", "Thriller"], 4.2, "the-handmaiden"),
    ("The Wailing", 2016, "Korean", ["Horror", "Thriller"], 3.9, "the-wailing"),
    ("Spirited Away", 2001, "Japanese", ["Animation", "Fantasy"], 4.5, "spirited-away"),
    ("Shoplifters", 2018, "Japanese", ["Drama", "Crime"], 4.0, "shoplifters"),
]

MOVIES = [
    {"title": title, "year": year, "language": language, "genres": genres,
     "rating": rating, "link": f"https://letterboxd.com/film/{slug}/"}
    for title, year, language, genres, rating, slug in CATALOGUE
]
ENCODER = MultiLabelBinarizer().fit([movie["genres"] for movie in MOVIES])
GENRE_MATRIX = ENCODER.transform([movie["genres"] for movie in MOVIES])


def recommend(payload):
    genres = [genre for genre in payload.get("genres", []) if genre in ENCODER.classes_]
    language = payload.get("language", "All")
    period = payload.get("period", "All")
    query = str(payload.get("query", "")).strip().lower()
    requested = ENCODER.transform([genres])[0] if genres else None

    ranked = []
    for index, movie in enumerate(MOVIES):
        if language != "All" and movie["language"] != language:
            continue
        if period == "2020" and movie["year"] < 2020:
            continue
        if period == "2010" and not 2010 <= movie["year"] < 2020:
            continue
        if period == "2000" and movie["year"] >= 2010:
            continue
        searchable = " ".join([movie["title"], movie["language"], *movie["genres"]]).lower()
        if query and query not in searchable:
            continue
        similarity = float(cosine_similarity([requested], [GENRE_MATRIX[index]])[0][0]) if requested is not None else 0.0
        rating_score = movie["rating"] / 5
        score = (0.75 * similarity + 0.25 * rating_score) if requested is not None else rating_score
        ranked.append({**movie, "match_score": round(score * 100)})
    return sorted(ranked, key=lambda movie: (movie["match_score"], movie["rating"]), reverse=True)


class handler(BaseHTTPRequestHandler):
    def _send(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode("utf-8"))

    def do_OPTIONS(self):
        self._send(200, {})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length) or "{}")
            results = recommend(payload)
            self._send(200, {"movies": results, "algorithm": "genre-cosine-similarity"})
        except (ValueError, json.JSONDecodeError) as error:
            self._send(400, {"error": str(error)})

