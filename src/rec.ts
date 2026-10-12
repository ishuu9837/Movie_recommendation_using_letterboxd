import type {Movie,Taste} from './types';
const w=new Worker(new URL('./rec.worker.ts',import.meta.url),{type:'module'});let n=0;const pending=new Map<number,(v:any)=>void>();
w.onmessage=e=>{pending.get(e.data.rid)?.(e.data.r);pending.delete(e.data.rid)};
const call=<T,>(m:object)=>new Promise<T>(res=>{const rid=++n;pending.set(rid,res);w.postMessage({rid,...m})});
export const init=(movies:Movie[])=>call<boolean>({t:'init',movies});
export const similar=(id:string)=>call<string[]>({t:'similar',id});
export const forYou=(taste:Taste)=>call<{id:string;score:number}[]>({t:'foryou',taste});
