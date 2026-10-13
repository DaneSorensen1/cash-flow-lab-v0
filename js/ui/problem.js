// Problem runner: renders a generated problem into the workbench (source | task | statement), runs its steps,
// gives targeted feedback, steps backward on a miss, and reports evidence per skill. Spec sections 36-39.
import { esc, dollars, shuffle, mulberry32, hashSeed } from '../utils.js';
import { incomeStatementHTML, balanceSheetHTML, factsHTML, supplementalHTML, scfHTML } from './statements.js';
import { MISCONCEPTIONS } from '../curriculum/concepts.js';

export function sourceHTML(src, { fadeScaffold=false }={}){
  if (!src) return '';
  let h = '';
  if (src.story) h += `<div class="story">${esc(src.story)}</div>`;
  if (src.facts) h += factsHTML(src.facts, 'Facts');
  if (src.incomeStatement) h += incomeStatementHTML(src.incomeStatement);
  if (src.balanceSheet){ if (src.isolated){ const r = src.balanceSheet[0]; h += `<div class="stmt mini"><div class="srow head"><span class="lbl">${esc(r.label)}</span><span class="val">Beginning</span><span class="val">Ending</span></div><div class="srow focus"><span class="lbl">${esc(r.label)}</span><span class="val">${r.begin.toLocaleString()}</span><span class="val">${r.end.toLocaleString()}</span></div></div>`; }
    else h += balanceSheetHTML(src.balanceSheet, { highlight: fadeScaffold ? null : src.highlight }); }
  if (src.supplemental) h += supplementalHTML(src.supplemental);
  if (src.note) h += `<div class="note">${esc(src.note)}</div>`;
  if (src.highlight && !fadeScaffold && !src.isolated && src.balanceSheet) h += `<div class="ignore">For this question, everything outside the highlighted section can be ignored.</div>`;
  return h;
}

export class ProblemRunner {
  constructor(problem, zones, opts){ this.p = problem; this.z = zones; this.opts = opts; this.i = 0; this.hintsUsed = 0; this.hintIdx = 0; this.revealed = false; this.results = []; this.wrongHere = 0; this.placed = { operating:[], investing:[], financing:[] }; this.t0 = Date.now(); }
  start(){ const p = this.p; this.z.source.innerHTML = sourceHTML(p.source, { fadeScaffold: p.scaffoldLevel >= 4 }); this.renderStatement(); this.renderStep(); }
  renderStatement(key){ this.z.statement.innerHTML = scfHTML(this.placed, { showTotals:false, placedKey:key }); }
  step(){ return this.p.steps[this.i]; }
  renderStep(){
    const p = this.p, s = this.step(); const n = p.steps.length;
    let h = `<div class="task-h"><div class="task-t">${esc(p.title||'')}</div><div class="task-m">Step ${this.i+1} of ${n}</div></div>`;
    if (p.instruction && this.i === 0) h += `<div class="instr">${esc(p.instruction)}</div>`;
    if (p.assumption && this.i === 0 && p.scaffoldLevel <= 2) h += `<div class="assume">${esc(p.assumption)}</div>`;
    h += `<div class="prompt">${esc(s.prompt)}</div>`;
    if (s.type === 'choice') h += `<div class="opts">${s.options.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o.text)}</button>`).join('')}</div>`;
    else if (s.type === 'multi') h += `<div class="opts multi">${s.options.map((o,k)=>`<label class="opt chk"><input type="checkbox" data-k="${k}"> ${esc(o.text)}</label>`).join('')}</div><button class="primary" id="submit">Check selection</button>`;
    else if (s.type === 'direction_amount') h += `<div class="da"><div class="seg" role="group" aria-label="Direction"><button class="seg-b" data-d="increase">Increased</button><button class="seg-b" data-d="decrease">Decreased</button></div><label class="amt">by $<input type="number" inputmode="numeric" id="amt" min="0" step="1" aria-label="Amount"></label><button class="primary" id="submit">Check</button></div>`;
    else if (s.type === 'number') h += `<div class="da"><label class="amt">$<input type="number" inputmode="numeric" id="amt" step="1" aria-label="Amount"></label><button class="primary" id="submit">Check</button></div>`;
    else if (s.type === 'place') h += `<div class="line-chip">${esc(s.line.label)} <b>${s.line.amount<0?'(':''}${Math.abs(s.line.amount).toLocaleString()}${s.line.amount<0?')':''}</b></div><div class="opts place">${['operating','investing','financing','noncash'].map(sec=>`<button class="opt" data-sec="${sec}">${sec==='noncash'?'Noncash disclosure / no cash-flow line':'Cash Flows from '+sec[0].toUpperCase()+sec.slice(1)+' Activities'}</button>`).join('')}</div>`;
    h += `<div id="fb" class="fb" aria-live="polite"></div><div class="task-f"><button class="link" id="hint" ${this.opts.hintsDisabled?'disabled':''}>Hint${this.hintIdx<(p.hints||[]).length?'':' (none left)'}</button><span class="muted small">${this.hintsUsed?this.hintsUsed+' hint'+(this.hintsUsed>1?'s':'')+' used':''}</span></div>`;
    this.z.task.innerHTML = h; this.wire();
    if (this.opts.onStepRendered) this.opts.onStepRendered();
  }
  wire(){ const s = this.step(), T = this.z.task; let dir = null;
    T.querySelectorAll('.opt[data-k]').forEach(b => b.onclick = () => this.answerChoice(+b.dataset.k, b));
    T.querySelectorAll('.opt[data-sec]').forEach(b => b.onclick = () => this.answerPlace(b.dataset.sec, b));
    T.querySelectorAll('.seg-b').forEach(b => b.onclick = () => { dir = b.dataset.d; T.querySelectorAll('.seg-b').forEach(x=>x.classList.toggle('on', x===b)); });
    const sub = T.querySelector('#submit'); if (sub) sub.onclick = () => { if (s.type==='multi') this.answerMulti(); else this.answerNumber(dir); };
    const amt = T.querySelector('#amt'); if (amt){ amt.focus(); amt.onkeydown = e => { if (e.key==='Enter') sub.click(); }; }
    T.querySelector('#hint').onclick = () => this.showHint();
  }
  showHint(){ const hints = this.p.hints || []; if (this.hintIdx >= hints.length){ this.feedback(`<b>Reveal:</b> ${esc(this.p.explain)}`, 'reveal'); this.revealed = true; this.afterReveal(); return; }
    this.hintsUsed++; const h = hints[this.hintIdx++]; this.feedback(`<b>Hint ${this.hintIdx}:</b> ${esc(h)}`, 'hint'); this.z.task.querySelector('#hint').textContent = this.hintIdx < hints.length ? 'Another hint' : 'Show the answer'; }
  afterReveal(){ const s = this.step(); this.record(s, false, null, true); this.z.task.querySelectorAll('.opt, #submit').forEach(b=>b.disabled=true); this.next(true); }
  feedback(html, kind){ const fb = this.z.task.querySelector('#fb'); fb.className = 'fb show ' + kind; fb.innerHTML = html; }
  record(s, correct, m, revealed=false){ const rec = { problemId:this.p.id, seed:this.p.seed, section:this.p.section, family:this.p.family, concept:this.p.concept, skill:s.skill, tier:this.p.tier, scaffoldLevel:this.p.scaffoldLevel, promptType:s.type, direction:this.p.direction, correct, hintsUsed:this.hintsUsed, revealed, misconceptionCode:m||null, elapsedMs: Date.now()-this.t0, firstTry: this.wrongHere===0 }; this.results.push(rec); if (this.opts.onAttempt) this.opts.onAttempt(rec); }
  markWrong(s, o, btn){ this.wrongHere++; if (btn) btn.classList.add('wrong'); const code = o && o.m; const why = o && o.fb ? o.fb : 'Not quite. Look again at the change and what it means for cash.';
    const back = this.i > 0 && this.wrongHere === 1 ? `<div class="stepback">Step back: ${esc(this.p.steps[this.i-1].prompt)}</div>` : '';
    this.feedback(`<b>Not yet.</b> ${esc(why)}${back}${this.wrongHere>=2?`<div class="stepback">Need the answer? Use the hint button, then try a fresh version of this problem.</div>`:''}`, 'wrong'); if (this.wrongHere===1) this.record(s, false, code); if (this.opts.onMisconception && code) this.opts.onMisconception(code); }
  answerChoice(k, btn){ const s = this.step(), o = s.options[k]; if (o.correct){ this.record(s, true, null); btn.classList.add('right'); this.z.task.querySelectorAll('.opt').forEach(b=>b.disabled=true); this.feedback(`<b>Correct.</b> ${this.i===this.p.steps.length-1?esc(this.p.explain):''}`, 'right'); this.next(); } else this.markWrong(s, o, btn); }
  answerMulti(){ const s = this.step(); const checked = [...this.z.task.querySelectorAll('input[type=checkbox]')].map((c,k)=>c.checked?k:null).filter(k=>k!==null);
    const wrongPick = checked.map(k=>s.options[k]).find(o=>!o.correct); const missing = s.options.some((o,k)=>o.correct && !checked.includes(k));
    if (!wrongPick && !missing){ this.record(s, true, null); this.feedback(`<b>Correct.</b> ${esc(this.p.explain)}`, 'right'); this.z.task.querySelectorAll('input,#submit').forEach(b=>b.disabled=true); this.next(); }
    else if (wrongPick) this.markWrong(s, wrongPick, null); else this.markWrong(s, { fb: s.missingFb }, null); }
  answerNumber(dir){ const s = this.step(); const v = Number(this.z.task.querySelector('#amt').value);
    if (s.type === 'direction_amount'){ if (!dir){ this.feedback('Choose Increased or Decreased first.', 'hint'); return; }
      const e = s.expected; if (dir === e.direction && v === e.amount){ this.record(s,true,null); this.feedback(`<b>Correct.</b> ${esc(s.label)} ${e.direction}d ${dollars(e.amount)} (${s.end.toLocaleString()} − ${s.begin.toLocaleString()}).`, 'right'); this.z.task.querySelectorAll('#submit,.seg-b,#amt').forEach(b=>b.disabled=true); this.next(); return; }
      if (dir !== e.direction && v === e.amount) return this.markWrong(s, { m:'M03', fb:`Ending − Beginning = change. ${s.end.toLocaleString()} is ${dollars(e.amount)} ${e.direction==='increase'?'higher':'lower'} than ${s.begin.toLocaleString()}, so it ${e.direction}d.` });
      if (v === s.end || v === s.begin) return this.markWrong(s, { m:'M02', fb:`${dollars(v)} is a balance, not the change. Subtract: ending ${s.end.toLocaleString()} − beginning ${s.begin.toLocaleString()}.` });
      return this.markWrong(s, { m: dir !== e.direction ? 'M03' : null, fb:`Check the arithmetic: ${s.end.toLocaleString()} − ${s.begin.toLocaleString()} = ${e.amount.toLocaleString()}, so it ${e.direction}d by ${dollars(e.amount)}.` }); }
    if (v === s.expected){ this.record(s,true,null); this.feedback(`<b>Correct.</b> ${dollars(v)}.`, 'right'); this.z.task.querySelectorAll('#submit,#amt').forEach(b=>b.disabled=true); this.next(); return; }
    const w = s.wrong && s.wrong[v]; this.markWrong(s, w ? { m:w[0], fb:w[1] } : { fb: s.fallback || 'Check the calculation.' }); }
  answerPlace(sec, btn){ const s = this.step(); if (sec === s.correct){ this.record(s,true,null); btn.classList.add('right'); this.z.task.querySelectorAll('.opt').forEach(b=>b.disabled=true); this.placed[sec].push(Object.assign({ key:'placed' }, s.line)); if (this.p.secondLine && this.p.secondLine.section !== sec) this.placed[this.p.secondLine.section].push(Object.assign({key:'second'}, this.p.secondLine)); if (this.p.line && this.p.line.section && this.p.line.section!==sec) this.placed[this.p.line.section].push(Object.assign({key:'first'}, this.p.line)); this.renderStatement('placed'); this.feedback(`<b>Placed.</b> ${esc(this.p.explain)}`, 'right'); if (this.opts.onPlaced) this.opts.onPlaced(); this.next(); } else { const w = s.fb && s.fb[sec]; this.markWrong(s, w ? { m:w[0], fb:w[1] } : { m:'M27', fb:'Not that section.' }, btn); } }
  next(afterReveal=false){ const last = this.i === this.p.steps.length - 1; const T = this.z.task; const f = T.querySelector('.task-f'); const b = document.createElement('button'); b.className = 'primary'; b.id = 'next'; b.textContent = last ? 'Continue' : 'Next step'; f.prepend(b); b.focus();
    b.onclick = () => { if (last || afterReveal) this.finish(); else { this.i++; this.wrongHere = 0; this.renderStep(); } }; }
  finish(){ const anyWrong = this.results.some(r=>!r.correct); const ok = !anyWrong && !this.revealed; if (this.opts.onDone) this.opts.onDone({ results:this.results, hintsUsed:this.hintsUsed, revealed:this.revealed, clean: ok, problem:this.p }); }
}
