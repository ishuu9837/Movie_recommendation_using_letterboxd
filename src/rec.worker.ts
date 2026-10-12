import {Index} from './recommender';import type {Movie,Taste} from './types';
let idx:Index;
self.onmessage=(e:MessageEvent<{rid:number;t:string;movies?:Movie[];id?:string;taste?:Taste}>)=>{
 const {rid,t}=e.data;let r:unknown;
 if(t==='init'){idx=new Index(e.data.movies!);r=true}else if(t==='similar')r=idx.similar(e.data.id!);else if(t==='foryou')r=idx.forYou(e.data.taste!);
 (self as unknown as Worker).postMessage({rid,r});
};
