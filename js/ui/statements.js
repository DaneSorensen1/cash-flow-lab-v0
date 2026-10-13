// Accounting-native HTML renderers: income statement, comparative balance sheet, SCF outline/builder.
import { money, dollars, esc } from '../utils.js';
const GROUPS = { current_assets:'Current Assets', long_term_assets:'Long-term Assets', current_liabilities:'Current Liabilities', debt_equity:'Long-term Debt & Equity' };

export function incomeStatementHTML(rows, { company='Beacon Bike & Repair', period='For the Year' }={}){
  let h = `<div class="stmt" role="table" aria-label="Income Statement"><div class="stmt-h"><div class="co">${esc(company).toUpperCase()}</div><div class="ti">Income Statement</div><div class="pe">${esc(period)}</div></div>`;
  let ni = 0; for (const r of rows){ if (r.label !== 'Net Income') ni += r.amount; h += `<div class="srow ${r.focus?'focus':''}" role="row"><span class="lbl">${esc(r.label)}</span><span class="val">${money(r.amount)}</span></div>`; }
  if (!rows.some(r=>r.label==='Net Income')) h += `<div class="srow total" role="row"><span class="lbl">Net Income</span><span class="val">${money(ni)}</span></div>`;
  return h + '</div>';
}

export function balanceSheetHTML(rows, { company='Beacon Bike & Repair', highlight=null, showChange=false, years=['Beginning','Ending'], dim=true }={}){
  let h = `<div class="stmt" role="table" aria-label="Comparative Balance Sheet"><div class="stmt-h"><div class="co">${esc(company).toUpperCase()}</div><div class="ti">Comparative Balance Sheet</div><div class="pe">December 31</div></div><div class="srow head"><span class="lbl"></span><span class="val">${years[0]}</span><span class="val">${years[1]}</span>${showChange?'<span class="val">Change</span>':''}</div>`;
  const order = ['current_assets','long_term_assets','current_liabilities','debt_equity'];
  for (const g of order){ const rs = rows.filter(r => (r.group||'current_assets') === g); if (!rs.length) continue;
    const hl = highlight === g || (highlight === 'current' && (g==='current_assets'||g==='current_liabilities'));
    h += `<div class="sgroup ${highlight && dim && !hl ? 'dim':''} ${hl?'hl':''}"><div class="srow grp" role="row"><span class="lbl">${GROUPS[g]}</span></div>`;
    for (const r of rs){ const ch = r.end - r.begin; h += `<div class="srow ${r.focus?'focus':''}" role="row" data-concept="${esc(r.concept||'')}"><span class="lbl">${esc(r.label)}</span><span class="val">${money(r.begin)}</span><span class="val">${money(r.end)}</span>${showChange?`<span class="val chg">${ch>0?'+':''}${money(ch)}</span>`:''}</div>`; }
    h += '</div>'; }
  return h + '</div>';
}

export function factsHTML(rows, title){ return `<div class="facts">${title?`<div class="facts-t">${esc(title)}</div>`:''}${rows.map(([k,v])=>`<div class="frow"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>`; }
export function supplementalHTML(items){ return `<div class="supp"><div class="facts-t">Supplemental information</div><ul>${items.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`; }

// SCF layout. lines = { operating:[], investing:[], financing:[], noncash:[] }. Shows subtotals when present.
export function scfHTML(lines, { company='Beacon Bike & Repair', beginCash=null, endCash=null, target=null, showTotals=true, placedKey=null, netIncomeFirst=true }={}){
  const sec = (title, arr, sub) => { const tot = arr.reduce((s,l)=>s+l.amount,0);
    return `<div class="scf-sec"><div class="scf-t">${title}</div>${arr.length? arr.map(l=>`<div class="srow ${l.key===placedKey?'just':''} ${l.indent?'ind':''}"><span class="lbl">${esc(l.label)}</span><span class="val">${money(l.amount)}</span></div>`).join('') : '<div class="srow empty"><span class="lbl">…</span></div>'}${showTotals&&arr.length?`<div class="srow total"><span class="lbl">${sub}</span><span class="val">${money(tot)}</span></div>`:''}</div>`; };
  const op = lines.operating || [], inv = lines.investing || [], fin = lines.financing || [];
  const opRows = op.map((l,i)=>Object.assign({}, l, { indent: i>0 }));
  if (op.length > 1) opRows.splice(1, 0, { label:'Adjustments to reconcile Net Income to net cash from operating activities:', amount:null, header:true });
  const opHtml = `<div class="scf-sec"><div class="scf-t">Cash Flows from Operating Activities</div>${op.length? opRows.map(l=> l.header ? `<div class="srow sub"><span class="lbl">${esc(l.label)}</span></div>` : `<div class="srow ${l.key===placedKey?'just':''} ${l.indent?'ind':''}"><span class="lbl">${esc(l.label)}</span><span class="val">${money(l.amount)}</span></div>`).join('') : '<div class="srow empty"><span class="lbl">…</span></div>'}${showTotals&&op.length?`<div class="srow total"><span class="lbl">Net Cash Provided by Operating Activities</span><span class="val">${money(op.reduce((s,l)=>s+l.amount,0))}</span></div>`:''}</div>`;
  const o = op.reduce((s,l)=>s+l.amount,0), i = inv.reduce((s,l)=>s+l.amount,0), f = fin.reduce((s,l)=>s+l.amount,0); const net = o+i+f;
  let h = `<div class="stmt scf"><div class="stmt-h"><div class="co">${esc(company).toUpperCase()}</div><div class="ti">Statement of Cash Flows</div><div class="pe">Indirect method · For the Year</div></div>${opHtml}${sec('Cash Flows from Investing Activities', inv, 'Net Cash from Investing Activities')}${sec('Cash Flows from Financing Activities', fin, 'Net Cash from Financing Activities')}`;
  if (showTotals && (op.length||inv.length||fin.length)) h += `<div class="scf-sec recon"><div class="srow total"><span class="lbl">Net ${net>=0?'Increase':'Decrease'} in Cash</span><span class="val">${money(net)}</span></div>${beginCash!==null?`<div class="srow"><span class="lbl">Beginning Cash</span><span class="val">${money(beginCash)}</span></div><div class="srow total dbl"><span class="lbl">Ending Cash</span><span class="val">${money(beginCash+net)}</span></div>`:''}</div>`;
  if (lines.noncash && lines.noncash.length) h += `<div class="scf-sec"><div class="scf-t">Noncash investing and financing activities</div>${lines.noncash.map(l=>`<div class="srow"><span class="lbl">${esc(l.label)}</span><span class="val">${money(l.amount)}</span></div>`).join('')}</div>`;
  return h + '</div>';
}
export function outlineHTML(){ return `<div class="stmt scf outline"><div class="scf-t">Cash Flows from Operating Activities</div><div class="scf-t">Cash Flows from Investing Activities</div><div class="scf-t">Cash Flows from Financing Activities</div><div class="scf-t">Net Increase / Decrease in Cash</div></div>`; }
export function checksumHTML(beginCash, endCash, current){ const target = endCash - beginCash; const ok = current === target; return `<div class="checksum ${current===null?'':ok?'ok':'off'}"><div class="cs-t">Cash target</div><div class="cs-row"><span>Beginning Cash</span><b>${dollars(beginCash)}</b></div><div class="cs-row"><span>Ending Cash</span><b>${dollars(endCash)}</b></div><div class="cs-row big"><span>Change to explain</span><b>${target>=0?'+':''}${dollars(target)}</b></div>${current!==null?`<div class="cs-row"><span>Your O + I + F</span><b>${current>=0?'+':''}${dollars(current)} ${ok?'✓ ties':'✗ does not tie yet'}</b></div>`:''}</div>`; }
