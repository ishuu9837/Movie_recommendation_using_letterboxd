import type {Movie,Taste} from './types';import {MOODS} from './types';
type Vec=Map<number,number>;
const STOP=new Set('a an and are as at be by for from has he her his in is it its of on or she that the their they this to was were who with after into when while about over than then them out up one two'.split(' '));
const tok=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>2&&!STOP.has(w));
export class Index{
 vocab=new Map<string,number>();idf:number[]=[];vecs:Vec[]=[];byId=new Map<string,number>();C=0;
 constructor(public movies:Movie[]){
  const docs=movies.map(m=>[...tok(`${m.tagline} ${m.description}`),...m.genres.flatMap(g=>Array(3).fill('g:'+g.toLowerCase())),
   ...(m.director?Array(2).fill('d:'+m.director.toLowerCase()):[]),...m.studios.map(s=>'s:'+s.toLowerCase()),'l:'+m.language.toLowerCase()]);
  const df=new Map<number,number>();
  docs.forEach(d=>new Set(d).forEach(w=>{let i=this.vocab.get(w);if(i===undefined){i=this.vocab.size;this.vocab.set(w,i)}df.set(i,(df.get(i)||0)+1)}));
  this.idf=[];df.forEach((c,i)=>this.idf[i]=Math.log((1+movies.length)/(1+c))+1);
  docs.forEach((d,n)=>{const tf=new Map<number,number>();d.forEach(w=>{const i=this.vocab.get(w)!;tf.set(i,(tf.get(i)||0)+1)});
   let norm=0;tf.forEach((c,i)=>{const v=(1+Math.log(c))*this.idf[i];tf.set(i,v);norm+=v*v});norm=Math.sqrt(norm)||1;tf.forEach((v,i)=>tf.set(i,v/norm));
   this.vecs.push(tf);this.byId.set(movies[n].id,n)});
  this.C=movies.reduce((s,m)=>s+m.rating,0)/movies.length;
 }
 bayes(m:Movie,k=200){return (m.votes/(m.votes+k))*m.rating+(k/(m.votes+k))*this.C}
 dot(a:Vec,b:Vec){if(a.size>b.size)[a,b]=[b,a];let s=0;a.forEach((v,i)=>{const w=b.get(i);if(w)s+=v*w});return s}
 similar(id:string,k=8){const i=this.byId.get(id);if(i===undefined)return[];const v=this.vecs[i];
  return this.movies.map((m,j)=>({id:m.id,s:j===i?-1:this.dot(v,this.vecs[j])*.85+(this.bayes(m)/5)*.15})).sort((a,b)=>b.s-a.s).slice(0,k).map(x=>x.id)}
 profile(t:Taste){const p:Vec=new Map();const add=(v:Vec,w:number)=>v.forEach((x,i)=>p.set(i,(p.get(i)||0)+x*w));
  t.liked.forEach(id=>{const i=this.byId.get(id);if(i!==undefined)add(this.vecs[i],1/Math.max(1,t.liked.length))});
  const key=(w:string,x:number)=>{const i=this.vocab.get(w);if(i!==undefined)p.set(i,(p.get(i)||0)+x*this.idf[i]*.35)};
  t.genres.forEach(g=>key('g:'+g.toLowerCase(),1));t.languages.forEach(l=>key('l:'+l.toLowerCase(),1));
  t.mood.forEach(m=>MOODS[m]?.genres.forEach(g=>key('g:'+g.toLowerCase(),.8)));return p}
 forYou(t:Taste,k=60){const p=this.profile(t);if(!p.size)return[];const seen=new Set(t.liked);
  return this.movies.filter(m=>!seen.has(m.id)&&!m.genres.some(g=>t.avoid.includes(g))).map(m=>({m,s:this.dot(p,this.vecs[this.byId.get(m.id)!])*.75+(this.bayes(m)/5)*.25}))
   .sort((a,b)=>b.s-a.s).slice(0,k).map(x=>({id:x.m.id,score:x.s}))}
}
