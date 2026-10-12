import {useEffect,useMemo,useRef,useState,useDeferredValue} from 'react';
import type {Movie} from './types';import {MOODS} from './types';import {useStore} from './store';import * as rec from './rec';
type View='discover'|'all'|'foryou'|'watchlist';const PAGE=24;
const img=(m:Movie)=>m.poster.startsWith('http')?m.poster:import.meta.env.BASE_URL+m.poster;
function Card({m,onOpen,reason}:{m:Movie;onOpen:(m:Movie)=>void;reason?:string}){
 const {liked,saved,toggle}=useStore();
 return <article className="film"><button className="poster" onClick={()=>onOpen(m)} aria-label={`${m.title} details`}>
  <img src={img(m)} alt={`${m.title} poster`} loading="lazy" referrerPolicy="no-referrer" onError={e=>(e.currentTarget.style.visibility='hidden')}/><span className="badge">★ {m.rating.toFixed(1)}</span></button>
  <div className="actions"><button aria-pressed={liked.includes(m.id)} onClick={()=>toggle('liked',m.id)} aria-label={`Love ${m.title}`}>♥</button>
  <button aria-pressed={saved.includes(m.id)} onClick={()=>toggle('saved',m.id)} aria-label={`Watchlist ${m.title}`}>🔖</button></div>
  <h3>{m.title}</h3><p>{m.language} · {m.year}</p>{reason&&<p className="reason">{reason}</p>}</article>}
function Detail({m,movies,onOpen,onClose}:{m:Movie;movies:Map<string,Movie>;onOpen:(m:Movie)=>void;onClose:()=>void}){
 const [sim,setSim]=useState<Movie[]>([]);const {watched,toggle}=useStore();const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{ref.current?.showModal()},[]);useEffect(()=>{rec.similar(m.id).then(ids=>setSim(ids.slice(0,4).map(i=>movies.get(i)!).filter(Boolean)))},[m.id,movies]);
 return <dialog ref={ref} onClose={onClose} onClick={e=>e.target===ref.current&&onClose()}><div className="detail"><img src={img(m)} alt=""/>
  <div><h2>{m.title}</h2><p className="meta">{m.year} · {m.language}{m.runtime?` · ${m.runtime} min`:''}{m.director?` · ${m.director}`:''}</p>
  <p>{m.genres.join(' · ')} · ★ {m.rating.toFixed(2)} ({m.votes.toLocaleString()} ratings)</p>{m.tagline&&<p><em>{m.tagline}</em></p>}<p>{m.description}</p>
  <button onClick={()=>toggle('watched',m.id)} aria-pressed={watched.includes(m.id)}>{watched.includes(m.id)?'Watched ✓':'Mark watched'}</button>{' '}
  {m.link&&<a href={m.link} target="_blank" rel="noopener noreferrer">Letterboxd ↗</a>}<button className="x" onClick={onClose}>Close</button></div></div>
  <h3>More like this</h3><div className="grid small">{sim.map(s=><Card key={s.id} m={s} onOpen={onOpen}/>)}</div></dialog>}
export default function App(){
 const [movies,setMovies]=useState<Movie[]>([]);const [ready,setReady]=useState(false);const [view,setView]=useState<View>('discover');
 const [q,setQ]=useState('');const dq=useDeferredValue(q);const [lang,setLang]=useState('all');const [genre,setGenre]=useState('all');const [minR,setMinR]=useState(0);
 const [mood,setMood]=useState<string|null>(null);const [sort,setSort]=useState('rating');const [limit,setLimit]=useState(PAGE);const [open,setOpen]=useState<Movie|null>(null);
 const [fy,setFy]=useState<{id:string;score:number}[]>([]);const s=useStore();const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{document.documentElement.dataset.theme=s.theme},[s.theme]);
 useEffect(()=>{fetch(import.meta.env.BASE_URL+'catalogue.json').then(r=>r.json()).then(async(d:Movie[])=>{setMovies(d);await rec.init(d);setReady(true)})},[]);
 const byId=useMemo(()=>new Map(movies.map(m=>[m.id,m])),[movies]);
 const langs=useMemo(()=>[...new Set(movies.map(m=>m.language))].sort(),[movies]);const genres=useMemo(()=>[...new Set(movies.flatMap(m=>m.genres))].sort(),[movies]);
 useEffect(()=>{if(view==='foryou'&&ready)rec.forYou({liked:s.liked,genres:s.genres,avoid:s.avoid,languages:s.languages,mood:mood?[mood]:[]}).then(setFy)},[view,ready,s.liked,s.genres,s.avoid,s.languages,mood]);
 const list=useMemo(()=>{const t=dq.trim().toLowerCase(),mg=mood?MOODS[mood].genres:null;
  if(view==='foryou')return fy.map(x=>byId.get(x.id)!).filter(m=>m&&(lang==='all'||m.language===lang)&&m.rating>=minR);
  const r=movies.filter(m=>(view!=='discover'||(m.year>=2020&&m.rating>=4&&m.format!=='Series'))&&(view!=='watchlist'||s.saved.includes(m.id))&&(lang==='all'||m.language===lang)
   &&(genre==='all'||m.genres.includes(genre))&&m.rating>=minR&&(!mg||m.genres.some(g=>mg.includes(g)))&&(!t||`${m.title} ${m.director} ${m.genres.join(' ')} ${m.language}`.toLowerCase().includes(t)));
  return r.sort((a,b)=>sort==='newest'?b.year-a.year:sort==='title'?a.title.localeCompare(b.title):b.rating-a.rating||b.votes-a.votes)},[movies,view,dq,lang,genre,minR,mood,sort,fy,byId,s.saved]);
 useEffect(()=>setLimit(PAGE),[view,dq,lang,genre,minR,mood,sort]);
 useEffect(()=>{const o=new IntersectionObserver(e=>e[0].isIntersecting&&setLimit(l=>l+PAGE),{rootMargin:'600px'});end.current&&o.observe(end.current);return()=>o.disconnect()},[list]);
 const tabs:[View,string][]=[['discover','Discover'],['all','All films'],['foryou','For you'],['watchlist',`Watchlist (${s.saved.length})`]];
 return <><header><b>MRS <small>by Letterboxd</small></b><nav>{tabs.map(([v,l])=><button key={v} aria-current={view===v} onClick={()=>setView(v)}>{l}</button>)}</nav>
  <button onClick={()=>s.setTheme(s.theme==='dark'?'light':'dark')} aria-label="Toggle theme">{s.theme==='dark'?'☀':'☾'}</button></header>
  <main><div className="bar"><input type="search" placeholder="Search title, director, genre…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search"/>
   <select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language"><option value="all">All languages</option>{langs.map(l=><option key={l}>{l}</option>)}</select>
   <select value={genre} onChange={e=>setGenre(e.target.value)} aria-label="Genre" disabled={view==='foryou'}><option value="all">All genres</option>{genres.map(g=><option key={g}>{g}</option>)}</select>
   <select value={minR} onChange={e=>setMinR(+e.target.value)} aria-label="Minimum rating">{[0,3,3.5,4,4.2].map(r=><option key={r} value={r}>{r?`${r}+`:'Any rating'}</option>)}</select>
   <select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort" disabled={view==='foryou'}><option value="rating">Top rated</option><option value="newest">Newest</option><option value="title">A–Z</option></select></div>
   <div className="moods">{Object.entries(MOODS).map(([k,v])=><button key={k} aria-pressed={mood===k} onClick={()=>setMood(mood===k?null:k)}>{v.label}</button>)}
    <button onClick={()=>{const p=list[Math.floor(Math.random()*list.length)];p&&setOpen(p)}}>🎲 Surprise me</button></div>
   {view==='foryou'&&<details className="prefs"><summary>Tune my taste</summary>{[['genres','More of',genres],['avoid','Skip',genres],['languages','Languages',langs]].map(([k,l,opts])=>
    <fieldset key={k as string}><legend>{l as string}</legend>{(opts as string[]).map(o=><label key={o}><input type="checkbox" checked={(s as any)[k as string].includes(o)}
     onChange={e=>s.setPref(k as any,e.target.checked?[...(s as any)[k as string],o]:(s as any)[k as string].filter((x:string)=>x!==o))}/>{o}</label>)}</fieldset>)}
    <button onClick={()=>confirm('Clear favourites, watchlist and preferences from this browser?')&&s.clear()}>Clear my data</button></details>}
   <p className="count" role="status">{ready?`${list.length.toLocaleString()} films`:'Loading catalogue…'}{view==='foryou'&&!fy.length&&ready?' — love a few films or pick genres to get picks':''}</p>
   <div className="grid">{list.slice(0,limit).map(m=><Card key={m.id} m={m} onOpen={setOpen} reason={view==='foryou'?'Matched to your taste':undefined}/>)}</div><div ref={end}/></main>
  {open&&<Detail m={open} movies={byId} onOpen={setOpen} onClose={()=>setOpen(null)}/>}</>}
