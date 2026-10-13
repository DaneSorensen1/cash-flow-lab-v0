// Local-first state. Saved after every meaningful action under cash_flow_lab_v1 (never collides with jea_v2).
export const SCHEMA_VERSION = 1; export const APP_VERSION = '1.0.0'; export const CONTENT_VERSION = '2026-10-13';
const KEY = 'cash_flow_lab_v1';
export function fresh(){ return { schemaVersion: SCHEMA_VERSION, appVersion: APP_VERSION, contentVersion: CONTENT_VERSION, identity:{ name:null, block:null }, uid:null,
  lesson:{ currentModule: 0, currentScreen: 0, completedModules: [], introducedConcepts: [], capstones: {} },
  mastery:{}, misconceptionCounts:{}, attempts:[], explanations:[], retryQueue:[], practice:{ counter:0, history:[], afterFocus:null, focusLock:null }, settings:{}, sessionId: Math.random().toString(36).slice(2,10), away:0 }; }
export function migrate(s){ if (!s || typeof s !== 'object') return fresh(); const f = fresh(); for (const k of Object.keys(f)) if (s[k] === undefined) s[k] = f[k]; if (!s.lesson.capstones) s.lesson.capstones = {}; if (!s.practice) s.practice = f.practice; s.schemaVersion = SCHEMA_VERSION; s.appVersion = APP_VERSION; return s; }
export function load(){ try { const raw = localStorage.getItem(KEY); return raw ? migrate(JSON.parse(raw)) : fresh(); } catch(e){ return fresh(); } }
export function save(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){ /* storage full or blocked: keep going in memory */ } }
export function reset(keepIdentity, s){ const f = fresh(); if (keepIdentity && s){ f.identity = s.identity; f.uid = s.uid; } save(f); return f; }
