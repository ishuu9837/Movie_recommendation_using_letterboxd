export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeFilmURL(value){try{const u=new URL(value);return u.protocol==='https:'&&u.host==='letterboxd.com'&&!u.username&&!u.password&&/^\/film\/[^/]+\/$/.test(u.pathname)?u.href:null}catch{return null}}
export function safePosterURL(value){if(typeof value!=='string')return null;if(/^assets\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp)$/.test(value)&&!value.includes('..'))return value;try{const u=new URL(value);return u.protocol==='https:'&&u.host==='a.ltrbxd.com'&&!u.username&&!u.password?u.href:null}catch{return null}}
export function readJSON(key,fallback,storage=null){try{return JSON.parse((storage||globalThis.localStorage).getItem(key))??fallback}catch{return fallback}}
export function validIDs(values,allowed){return Array.isArray(values)?[...new Set(values.filter(id=>typeof id==='string'&&allowed.has(id)))]:[]}
