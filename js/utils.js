// Small shared helpers. No DOM assumptions.
export function mulberry32(seed){ let a = seed >>> 0; return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function hashSeed(str){ let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function pick(rng, arr){ return arr[Math.floor(rng()*arr.length)]; }
export function shuffle(rng, arr){ const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j = Math.floor(rng()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
export function money(n){ const v = Math.round(Math.abs(n)); const s = v.toLocaleString('en-US'); return n < 0 ? `(${s})` : s; }
export function dollars(n){ return (n<0?'-':'') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US'); }
export function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
export function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
