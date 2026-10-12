export interface Movie{id:string;title:string;year:number;language:string;director:string;genres:string[];rating:number;runtime:number;tagline:string;description:string;poster:string;studios:string[];format:string;votes:number;link:string}
export interface Taste{liked:string[];genres:string[];avoid:string[];mood:string[];languages:string[]}
export const MOODS:Record<string,{label:string;genres:string[]}>={
 comfort:{label:'Cozy & warm',genres:['Comedy','Romance','Animation']},edge:{label:'Edge of my seat',genres:['Thriller','Crime','Action','Horror']},
 feels:{label:'Ugly crying',genres:['Drama','Romance']},laugh:{label:'Laugh out loud',genres:['Comedy']},mind:{label:'Mind-bending',genres:['Science Fiction','Mystery','Fantasy']},
 slow:{label:'Slow burn',genres:['Thriller','Mystery','Drama']},masala:{label:'Big masala energy',genres:['Action','Adventure','Comedy']},love:{label:'Falling in love',genres:['Romance']}};
