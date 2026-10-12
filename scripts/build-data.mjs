// Converts the legacy 15 MB catalogue.js into a compact public/catalogue.json (provenance fields dropped).
import {writeFileSync} from 'node:fs';import {pathToFileURL} from 'node:url';
const {MOVIES}=await import(pathToFileURL(process.argv[2]||'../MRS-by-Letterboxd/catalogue.js').href);
const out=MOVIES.map(m=>({id:m.id,title:m.title,year:m.year,language:m.language,director:m.director||'',genres:m.genres,rating:m.rating,
 runtime:m.runtime||0,tagline:m.tagline||'',description:m.description||'',poster:m.poster||m.posterSource||'',studios:m.studios||[],
 format:m.format||'Film',votes:m.ratingCount||0,link:m.link||''}));
writeFileSync('public/catalogue.json',JSON.stringify(out));console.log(out.length,'films');
