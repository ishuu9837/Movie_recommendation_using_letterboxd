import {readJSON} from './security.js';
import {canRemember} from './preferences.js';
const modes=['dark','light','system'];let mode=canRemember()?readJSON('mrs-v5-theme','dark'):'dark';if(!modes.includes(mode))mode='dark';
const media=matchMedia('(prefers-color-scheme: light)');
export const themeChoice=()=>mode;
export function applyTheme(value,{save=true}={}){if(!modes.includes(value))return;mode=value;document.documentElement.dataset.theme=mode==='system'?(media.matches?'light':'dark'):mode;document.querySelectorAll('[data-theme-value]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeValue===mode)));if(save&&canRemember())try{localStorage.setItem('mrs-v5-theme',JSON.stringify(mode))}catch{}window.dispatchEvent(new CustomEvent('mrs:theme',{detail:mode}))}
applyTheme(mode,{save:false});media.addEventListener('change',()=>{if(mode==='system')applyTheme(mode,{save:false})});document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-value]');if(b)applyTheme(b.dataset.themeValue)});
