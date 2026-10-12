import {cp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),dist=new URL('dist/',root);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const file of ['index.html','styles.css','app.js','model.js','catalogue.js','icons.js','security.js','theme.js','preferences.js','legal.js','privacy.html','cookies.html','terms.html','assets'])await cp(new URL(file,root),new URL(file,dist),{recursive:true});
const headers=JSON.parse(await readFile(new URL('security-headers.json',root),'utf8'));await writeFile(new URL('_headers',dist),'/*\n'+Object.entries(headers).map(([key,value])=>`  ${key}: ${value}`).join('\n')+'\n');
console.log('MRS by Letterboxd: static build and security headers ready in dist/');
