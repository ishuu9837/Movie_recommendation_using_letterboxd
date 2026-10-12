import {describe,it,expect} from 'vitest';import {Index} from './recommender';import type {Movie} from './types';
const mk=(id:string,genres:string[],description:string,rating=4,votes=1000):Movie=>({id,title:id,year:2022,language:'English',director:'',genres,rating,runtime:100,tagline:'',description,poster:'',studios:[],format:'Film',votes,link:''});
const ms=[mk('a',['Action'],'spies chase a stolen weapon across europe'),mk('b',['Action'],'a spy hunts a stolen weapon through europe'),mk('c',['Romance'],'two lovers meet on a train in vienna'),mk('d',['Romance'],'lovers reunite in paris')];
describe('Index',()=>{
 it('ranks the nearest film first',()=>expect(new Index(ms).similar('a',1)).toEqual(['b']));
 it('respects avoided genres',()=>{const r=new Index(ms).forYou({liked:['a'],genres:[],avoid:['Action'],mood:[],languages:[]});expect(r.every(x=>!['a','b'].includes(x.id))).toBe(true)});
 it('returns nothing without a taste signal',()=>expect(new Index(ms).forYou({liked:[],genres:[],avoid:[],mood:[],languages:[]})).toEqual([]));
 it('shrinks ratings with few votes toward the mean',()=>{const i=new Index([mk('x',[],'x',5,5),mk('y',[],'y',3,5000)]);expect(i.bayes(i.movies[0])).toBeLessThan(5)})});
