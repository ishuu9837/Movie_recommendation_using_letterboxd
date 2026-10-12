import {create} from 'zustand';import {persist} from 'zustand/middleware';
type L='liked'|'saved'|'watched';
interface S{liked:string[];saved:string[];watched:string[];genres:string[];avoid:string[];languages:string[];theme:'dark'|'light';
 toggle:(k:L,id:string)=>void;setPref:(k:'genres'|'avoid'|'languages',v:string[])=>void;setTheme:(t:'dark'|'light')=>void;clear:()=>void}
export const useStore=create<S>()(persist((set)=>({liked:[],saved:[],watched:[],genres:[],avoid:[],languages:[],
 theme:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark',
 toggle:(k,id)=>set(s=>({[k]:s[k].includes(id)?s[k].filter(x=>x!==id):[...s[k],id]} as Partial<S>)),
 setPref:(k,v)=>set({[k]:v} as Partial<S>),setTheme:theme=>set({theme}),clear:()=>set({liked:[],saved:[],watched:[],genres:[],avoid:[],languages:[]})}),
 {name:'mrs-v6',version:1}));
