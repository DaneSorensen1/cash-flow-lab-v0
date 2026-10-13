// Mastery model: evidence per concept × skill, weighted by how independent the success was. Spec section 44.
import { CONCEPTS } from '../curriculum/concepts.js';
export const WEIGHTS = { guided_hint:0.35, guided:0.55, independent_hint:0.70, independent:1.00, mixed:1.15, integrated:1.25 };

export function evidenceWeight({ scaffoldLevel, hintsUsed, revealed, correct, tier }){
  if (!correct || revealed) return 0;
  if (tier >= 4) return WEIGHTS.integrated; if (tier === 3) return WEIGHTS.mixed;
  if (scaffoldLevel <= 2) return hintsUsed ? WEIGHTS.guided_hint : WEIGHTS.guided;
  return hintsUsed ? WEIGHTS.independent_hint : WEIGHTS.independent;
}

// mastery = { [concept]: { [skill]: [ {w, max, dir, tier, scaffoldLevel, revealed, ts} ... ] } }
export function recordEvidence(mastery, { concept, skill, correct, scaffoldLevel, hintsUsed, revealed, tier, direction, ts }){
  mastery[concept] = mastery[concept] || {}; const arr = mastery[concept][skill] = mastery[concept][skill] || [];
  const max = tier >= 4 ? WEIGHTS.integrated : tier === 3 ? WEIGHTS.mixed : scaffoldLevel <= 2 ? WEIGHTS.guided : WEIGHTS.independent;
  arr.push({ w: evidenceWeight({ scaffoldLevel, hintsUsed, revealed, correct, tier }), max, correct: !!correct, dir: direction || 'none', tier, scaffoldLevel, revealed: !!revealed, ts: ts || Date.now() });
  if (arr.length > 40) arr.splice(0, arr.length - 40);
  return mastery;
}

export function skillSummary(entries, cfg){ const win = (cfg && cfg.recentWindow) || 6; const recent = entries.slice(-win); if (!recent.length) return { ratio:null, n:0, independent:0 };
  const got = recent.reduce((s,e)=>s+e.w,0), max = recent.reduce((s,e)=>s+e.max,0); return { ratio: max ? got/max : 0, n: recent.length, independent: recent.filter(e=>e.scaffoldLevel>=3).length, recent }; }

// Student-facing state for one concept. Thresholds come from config.mastery.
export function conceptState(mastery, concept, cfg, introduced){
  const m = mastery[concept] || {}; const skills = (CONCEPTS[concept] && CONCEPTS[concept].skills) || Object.keys(m);
  const all = skills.flatMap(s => m[s] || []); if (!all.length) return introduced ? 'learning' : 'not_started';
  const win = (cfg && cfg.recentWindow) || 6; const recent = all.sort((a,b)=>a.ts-b.ts).slice(-Math.max(win, 8));
  const independent = recent.filter(e => e.scaffoldLevel >= 3);
  const got = recent.reduce((s,e)=>s+e.w,0), max = recent.reduce((s,e)=>s+e.max,0); const ratio = max ? got/max : 0;
  const dirs = new Set(recent.filter(e=>e.correct).map(e=>e.dir)); const needsBoth = ['accounts_receivable','accounts_payable','unearned_revenue','prepaid_expenses','inventory','accrued_liabilities','gain_loss'].includes(concept);
  const bothOk = !needsBoth || (dirs.has('increase') && dirs.has('decrease')) || (dirs.has('gain') && dirs.has('loss'));
  const mixedOk = recent.some(e => e.correct && e.tier >= 3); const lastThreeNoReveal = recent.slice(-3).every(e => !e.revealed);
  const secure = (cfg && cfg.secureThreshold) || 0.75, master = (cfg && cfg.masteryThreshold) || 0.85;
  if (independent.length >= 5 && ratio >= master && mixedOk && bothOk && lastThreeNoReveal) return 'mastered';
  if (independent.length >= 3 && ratio >= secure && bothOk) return 'secure';
  if (independent.length) return 'practicing';
  return 'learning';
}
export const STATE_LABELS = { not_started:'Not started', learning:'Learning', practicing:'Practicing', secure:'Secure', mastered:'Mastered' };
export function weakSkills(mastery, concept, cfg){ const m = mastery[concept] || {}; return Object.keys(m).map(s => ({ skill:s, ...skillSummary(m[s], cfg) })).filter(x => x.n >= 2 && x.ratio < 0.6).sort((a,b)=>a.ratio-b.ratio); }
