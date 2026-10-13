// Practice selection: weight toward weak concepts, honor retry queue, avoid long runs. Spec sections 46-48.
import { mulberry32, hashSeed, pick } from '../utils.js';
import { conceptState } from './mastery.js';
import { CONCEPTS } from '../curriculum/concepts.js';

const STATE_WEIGHT = { not_started:0, learning:2.5, practicing:2.0, secure:1.0, mastered:0.5 };
export const PRACTICE_CONCEPTS = ['accounts_receivable','accounts_payable','accrued_liabilities','unearned_revenue','prepaid_expenses','inventory','timing_matrix','depreciation','gain_loss','investing','financing','noncash_investing_financing','full_statement'];

export function scheduleRetry(queue, { concept, direction, misconception, after, gapMin, gapMax, rng }){
  const gap = gapMin + Math.floor(rng() * (gapMax - gapMin + 1));
  queue.push({ concept, direction, misconception, due: after + gap }); return queue;
}

export function chooseConcept({ mastery, introduced, cfg, retryQueue, history, counter, seed, afterFocus, misconceptionCounts }){
  const rng = mulberry32(hashSeed(`sel|${seed}|${counter}`));
  const due = (retryQueue || []).filter(r => r.due <= counter && introduced.includes(r.concept));
  if (due.length && rng() < 0.8){ const r = due[0]; retryQueue.splice(retryQueue.indexOf(r), 1); return { concept: r.concept, direction: r.direction, reason:'retry' }; }
  const lastTwo = (history || []).slice(-2);
  const weights = PRACTICE_CONCEPTS.filter(c => introduced.includes(c)).map(c => {
    const st = conceptState(mastery, c, cfg, true); let w = STATE_WEIGHT[st] || 1;
    const lastSeen = [...(history||[])].reverse().findIndex(h => h === c); if (lastSeen === -1 || lastSeen > 6) w *= 1.3;
    if (afterFocus === c) w *= 1.8; if (lastTwo.length === 2 && lastTwo[0] === c && lastTwo[1] === c) w *= 0.15;
    if (misconceptionCounts) for (const code of Object.keys(misconceptionCounts)) if (misconceptionCounts[code] >= 2 && conceptForMisconception(code) === c) w *= 1.4;
    return { c, w };
  });
  const total = weights.reduce((s,x)=>s+x.w,0); if (!total) return { concept: introduced[introduced.length-1] || 'accounts_receivable', direction:null, reason:'fallback' };
  let r = rng() * total; for (const x of weights){ r -= x.w; if (r <= 0) return { concept: x.c, direction: null, reason:'weighted' }; }
  return { concept: weights[weights.length-1].c, direction:null, reason:'weighted' };
}
export function conceptForMisconception(code){ const map = { M04:'accounts_receivable', M05:'accounts_receivable', M06:'accounts_payable', M07:'accounts_payable', M08:'unearned_revenue', M09:'prepaid_expenses', M10:'unearned_revenue', M11:'prepaid_expenses', M12:'inventory', M13:'inventory', M14:'timing_matrix', M15:'timing_matrix', M16:'depreciation', M17:'gain_loss', M18:'gain_loss', M19:'gain_loss', M20:'gain_loss', M21:'investing', M22:'financing', M23:'financing', M24:'financing', M25:'financing', M26:'noncash_investing_financing' }; return map[code] || null; }

// Skill rotation for focus sets: varied skills on one concept (spec 48).
export function focusPlan(concept, size){
  const timing = ['accounts_receivable','accounts_payable','accrued_liabilities','unearned_revenue','prepaid_expenses','inventory'];
  if (timing.includes(concept)) return [ {scaffoldLevel:1, direction:'increase'}, {scaffoldLevel:2, direction:'decrease'}, {scaffoldLevel:3, direction:'increase'}, {scaffoldLevel:3, direction:'decrease'}, {scaffoldLevel:4, direction:'increase', sourceComplexity:'full_statement'}, {scaffoldLevel:4, direction:'decrease', sourceComplexity:'full_statement'} ].slice(0, size);
  return Array.from({length:size}, (_,i) => ({ scaffoldLevel: 2 + (i%3), salt:i }));
}
export function weakestConcept(mastery, introduced, cfg){ const order = ['learning','practicing','secure','mastered']; const cands = PRACTICE_CONCEPTS.filter(c=>introduced.includes(c)).map(c => ({ c, st: conceptState(mastery, c, cfg, true) })).filter(x => x.st !== 'mastered').sort((a,b)=>order.indexOf(a.st)-order.indexOf(b.st)); return cands[0] ? cands[0].c : null; }
