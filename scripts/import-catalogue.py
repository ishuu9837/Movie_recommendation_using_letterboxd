"""Build the catalogue from the current supplied source. No network calls."""
import csv, hashlib, json, pathlib, re, unicodedata
from urllib.parse import urlparse
root = pathlib.Path(__file__).resolve().parent.parent
read = lambda name: json.loads((root / 'data' / name).read_text())
def normal(t): return re.sub('[^a-z0-9]', '', unicodedata.normalize('NFKD', t).lower())
def key(m): return normal(m['title']), m['year']
identities = {m['link']: m for m in read('film-identities.json')}
series = {key(m) for m in read('series-classification.json')}
posters = read('local-posters.json')
with (root / 'data/catalogue.csv').open(newline='', encoding='utf-8-sig') as source:
    rows = list(csv.DictReader(source))
movies, ids, links = [], set(), set()
for i, row in enumerate(rows):
    title, year = row['name'], int(float(row['date']))
    link, poster = row['letterboxd_url'], row['poster_url']
    u, p = urlparse(link), urlparse(poster)
    if u.scheme != 'https' or u.netloc != 'letterboxd.com' or not re.fullmatch(r'/film/[^/]+/', u.path):
        raise ValueError(f'Unsafe film link at row {i+1}')
    if p.scheme != 'https' or p.netloc != 'a.ltrbxd.com': raise ValueError(f'Unsafe poster at row {i+1}')
    if link in links: raise ValueError(f'Duplicate film URL at row {i+1}')
    previous = identities.get(link)
    film_id = previous['id'] if previous else 'film-' + hashlib.sha256(link.encode()).hexdigest()[:20]
    if film_id in ids: raise ValueError(f'Duplicate stable ID at row {i+1}')
    is_series = (normal(title), year) in series or bool(re.search(r'\b(?:miniseries|mini-series|docuseries|docu-series|documentary series|animated series|television series|TV series|limited series)\b', row['description'], re.I))
    rating = float(row['rating'])
    if not 0 <= rating <= 5: raise ValueError(f'Invalid rating at row {i+1}')
    movie = dict(id=film_id, sourceId=row['id'], title=title, year=year, language=row['original_language'],
        director=previous['director'] if previous else '', genres=[x.strip() for x in row['genres'].split('|') if x.strip()],
        rating=rating, runtime=int(float(row['minute'])) if row['minute'] else None, tagline=row['tagline'],
        description=row['description'], poster=posters.get(film_id, poster), posterSource=poster,
        studios=[x.strip() for x in row['studios'].split('|') if x.strip()], languageMetadata=row['language_metadata'],
        format='Series' if is_series else 'Film', filmFormat=row['film_format'],
        ratingSource='Catalogue snapshot · ' + row['rating_as_of'], ratingAsOf=row['rating_as_of'],
        ratingCount=int(float(row['letterboxd_rating_count'])) if row['letterboxd_rating_count'] else None,
        ratingCountAsOf=row['rating_count_as_of'], releaseDate=row['release_date'],
        sourceProvenance=row['source_provenance'], ratingCountSource=row['rating_count_source'],
        franchisePublisher=row['franchise_publisher'], teluguExemption=row['is_telugu_filmography_exempt']=='True',
        teluguExemptionBasis=row['telugu_exemption_basis'], checklist=row['checklist_pass'],
        link=link, recent=year in (2025,2026) and not is_series, sourceRow=i+1)
    movies.append(movie); ids.add(film_id); links.add(link)
(root/'catalogue.js').write_text('export const MOVIES = '+json.dumps(movies,ensure_ascii=False,separators=(',',':'))+';\nexport const CSV_COUNT = '+str(len(rows))+';\n')
print(f'{len(movies):,} catalogue titles; links, ratings and IDs validated')
