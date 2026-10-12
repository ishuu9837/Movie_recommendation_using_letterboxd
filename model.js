export const MOODS=[
{id:'comfort',title:'Cozy & warm',icon:'coffee',genres:['Comedy','Romance','Animation'],collection:'Stories that feel like home'},
{id:'edge',title:'Edge of my seat',icon:'bolt',genres:['Thriller','Crime','Action','Horror'],collection:'One more plot twist'},
{id:'feels',title:'Ugly crying',icon:'heart',genres:['Drama','Romance'],collection:'For the beautifully heartbroken'},
{id:'laugh',title:'Laugh out loud',icon:'smile',genres:['Comedy'],collection:'A little lighter, a little brighter'},
{id:'mind',title:'Mind-bending',icon:'sparkles',genres:['Science Fiction','Mystery','Fantasy'],collection:'A different kind of reality'},
{id:'slow',title:'Late-night slow burn',icon:'moon',genres:['Thriller','Mystery','Drama'],collection:'The quiet before the plot twist'},
{id:'masala',title:'Big masala energy',icon:'masala',genres:['Action','Adventure','Comedy'],collection:'Go big. Stay for the story.'},
{id:'love',title:'Falling in love',icon:'heart',genres:['Romance'],collection:'A shelf for the romantics'}
];
export const normalise=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function cosine(a,b){let d=0,aa=0,bb=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];aa+=a[i]**2;bb+=b[i]**2}return aa&&bb?d/Math.sqrt(aa*bb):0}
export function createModel(movies,liked,moodId,preferences={}){
 const genres=[...new Set(movies.flatMap(m=>m.genres))].sort(),languages=[...new Set(movies.map(m=>m.language))].sort(),vectors=new Map(),scores=new Map(),affinities=new Map();
 const vector=m=>{if(!vectors.has(m.id))vectors.set(m.id,[...genres.map(g=>Number(m.genres.includes(g))),...languages.map(l=>m.language===l?.35:0),...[0,1,2].map(e=>(m.year>=2020?2:m.year>=2010?1:0)===e?.2:0)]);return vectors.get(m.id)};
 const favourites=movies.filter(m=>liked.has(m.id)),mood=MOODS.find(m=>m.id===moodId),profile=Array(genres.length+languages.length+3).fill(0);
 if(favourites.length)favourites.forEach(m=>vector(m).forEach((v,i)=>profile[i]+=v/favourites.length));
 for(const g of preferences.genres||[]){const i=genres.indexOf(g);if(i>=0)profile[i]+=1.4}for(const l of preferences.languages||[]){const i=languages.indexOf(l);if(i>=0)profile[genres.length+i]+=1.0}
 if(mood)mood.genres.forEach(g=>{const i=genres.indexOf(g);if(i>=0)profile[i]+=1.1});
 const personal=favourites.length>0||(preferences.genres?.length||0)>0||(preferences.languages?.length||0)>0,hasProfile=profile.some(Boolean);
 const affinity=m=>{if(!affinities.has(m.id))affinities.set(m.id,hasProfile?cosine(profile,vector(m)):0);return affinities.get(m.id)};
 const score=m=>{if(!scores.has(m.id))scores.set(m.id,hasProfile?.75*affinity(m)+.25*(m.rating||0)/5:(m.rating||0)/5);return scores.get(m.id)};
 const reason=m=>{if(mood&&m.genres.some(g=>mood.genres.includes(g)))return `Fits your ${mood.title.toLowerCase()} mood`;if(preferences.languages?.includes(m.language))return `One of your preferred languages: ${m.language}`;if(preferences.genres?.some(g=>m.genres.includes(g)))return `Matches your ${m.genres.find(g=>preferences.genres.includes(g)).toLowerCase()} taste`;if(favourites.length){let best=null,bestScore=-1;for(const f of favourites){const s=cosine(vector(m),vector(f));if(s>bestScore){bestScore=s;best=f}}return `Because you love ${best.title}`}return `${m.language} · ${m.genres[0]||'Cinema'}`};
 return {genres,languages,vector,affinity,score,reason,personal,hasProfile};
}
export function filterMovies(movies,state,sets,model){
 const q=(state.query||'').toLowerCase().trim(),mood=MOODS.find(x=>x.id===state.mood);
 return movies.filter(m=>{
 if(state.view==='discover'&&(!(m.year>=2020&&m.year<=2026)||m.rating<4||m.format==='Series'))return false;
 if(state.view==='watchlist'&&!sets.saved.has(m.id))return false;
 if(state.view==='foryou'&&state.avoid?.some(g=>m.genres.includes(g)))return false;
 if(state.view==='foryou'&&sets.liked.has(m.id))return false;
 if(state.hideWatched&&sets.watched.has(m.id))return false;
 if(state.language!=='all'&&m.language!==state.language)return false;
 if(state.genre!=='all'&&!m.genres.includes(state.genre))return false;
 if(state.format&&state.format!=='all'&&state.format!==m.format)return false;
 if(state.era==='older'&&m.year>=2000)return false;
 if(state.era!=='all'&&state.era!=='older'&&Math.floor(m.year/10)*10!==Number(state.era))return false;
 if(state.runtime!=='all'&&(!m.runtime||m.runtime>=Number(state.runtime)))return false;
 if(m.rating<Number(state.rating))return false;
 if(mood&&!m.genres.some(g=>mood.genres.includes(g)))return false;
 if(q&&!`${m.title} ${m.director||''} ${m.language} ${m.genres.join(' ')}`.toLowerCase().includes(q))return false;
 return true;
 }).sort((a,b)=>state.view==='discover'||state.sort==='rating'?b.rating-a.rating||b.year-a.year:state.sort==='newest'?b.year-a.year||b.rating-a.rating:state.sort==='title'?a.title.localeCompare(b.title):state.sort==='runtime'?(a.runtime||9999)-(b.runtime||9999):model.score(b)-model.score(a)||b.rating-a.rating);
}
export function parseCSV(text){text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else if(quoted||field==='')quoted=!quoted;else field+=c}else if(c===','&&!quoted){row.push(field);field=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field=''}else field+=c}if(quoted)throw new Error('The CSV contains an unfinished quoted field.');row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows}
export function matchImport(rows,movies){if(rows.length<2)throw new Error('Choose a CSV with a header and at least one film.');const h=rows[0].map(x=>x.trim().toLowerCase()),ti=h.findIndex(x=>['name','title','film','film title'].includes(x)),yi=h.findIndex(x=>['year','date'].includes(x)),ri=h.indexOf('rating');if(ti<0)throw new Error('This CSV needs a Name or Title column, like a Letterboxd export.');const index=new Map();for(const m of movies){const k=normalise(m.title);if(!index.has(k))index.set(k,[]);index.get(k).push(m)}const matched=[],unmatched=[];rows.slice(1).forEach(row=>{const title=(row[ti]||'').trim();if(!title)return;const year=yi>=0?Number(row[yi]):0,movie=(index.get(normalise(title))||[]).find(m=>!year||m.year===year);if(movie)matched.push({movie,rating:ri>=0&&row[ri].trim()!==''?Number(row[ri]):null});else unmatched.push(title)});return {matched,unmatched}}
