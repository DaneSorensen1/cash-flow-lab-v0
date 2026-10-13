// Seeded problem generators. Every generator returns a complete problem object with its own solution,
// so the UI validates against the same numbers the tests check. No eval, no DOM.
import { mulberry32, hashSeed, pick, shuffle, dollars } from '../utils.js';
import { TIMING, MEANING_POOL, timingHints, TERRITORIES } from './concepts.js';
import { computeChange, direction as dirOf, workingCapitalAdjustment, saleOfPPE, classifyEvent } from '../accounting.js';

const STEP = (skill, type, prompt, extra={}) => Object.assign({ skill, type, prompt }, extra);
const nice = (rng, lo, hi, step=100) => lo + step * Math.floor(rng() * ((hi - lo) / step + 1));
const addLine = (label, amount) => ({ label, amount });

// ---------- Balance-sheet context rows (distractors for statement fragments) ----------
function contextRows(rng, focusConcept, focus){
  const rows = [
    { concept:'cash', label:'Cash', group:'current_assets', begin: nice(rng,2000,9000), end: nice(rng,2000,9000) },
    { concept:'accounts_receivable', label:'Accounts Receivable', group:'current_assets' },
    { concept:'inventory', label:'Inventory', group:'current_assets' },
    { concept:'prepaid_expenses', label:'Prepaid Expenses', group:'current_assets' },
    { concept:'equipment', label:'Equipment (net)', group:'long_term_assets', begin: nice(rng,12000,30000), end: nice(rng,12000,30000) },
    { concept:'accounts_payable', label:'Accounts Payable', group:'current_liabilities' },
    { concept:'accrued_liabilities', label:'Accrued Liabilities', group:'current_liabilities' },
    { concept:'unearned_revenue', label:'Unearned Revenue', group:'current_liabilities' },
    { concept:'notes_payable', label:'Notes Payable (long-term)', group:'debt_equity', begin: nice(rng,5000,15000), end: nice(rng,5000,15000) },
    { concept:'common_stock', label:'Common Stock', group:'debt_equity', begin: nice(rng,5000,15000), end: nice(rng,5000,20000) }
  ];
  for (const r of rows){ if (r.begin === undefined){ r.begin = nice(rng,300,1500); r.end = nice(rng,300,1500); } }
  const f = rows.find(r => r.concept === focusConcept); f.begin = focus.begin; f.end = focus.end; f.focus = true;
  return rows;
}

// ---------- Working-capital timing problems ----------
export function timingProblem({ concept, direction, scaffoldLevel=2, sourceComplexity='statement_fragment', seed, term=(s)=>s }){
  const rng = mulberry32(hashSeed(`${concept}|${direction}|${scaffoldLevel}|${sourceComplexity}|${seed}`));
  const c = TIMING[concept]; const label = term(c.label);
  const change = nice(rng, 100, 900); const begin = nice(rng, 300, 1500);
  const end = direction === 'increase' ? begin + change : Math.max(100, begin - change);
  const realChange = computeChange(begin, end); const dir = dirOf(realChange); const amt = Math.abs(realChange);
  const adj = workingCapitalAdjustment(concept, realChange);
  const lineLabel = `${dir==='increase'?'Increase':'Decrease'} in ${label}`;
  const steps = [];
  const where = c.territory;
  if (scaffoldLevel <= 1 && sourceComplexity !== 'isolated'){
    steps.push(STEP('locate','choice',`WHERE: To handle ${label}, which part of the financial statements do you look at first?`, {
      options: shuffle(rng, TERRITORIES.filter(t=>t.id!=='cash').map(t => ({ text: t.name, correct: t.id === where, m: t.id==='income_statement' ? 'M30' : 'M27', fb: `Not there. ${label} is a timing account; its change lives in the ${where==='current_assets'?'current assets':'current liabilities'} section of the comparative Balance Sheet.` })))
    }));
  }
  steps.push(STEP('compute_change','direction_amount',`SEE: What happened to ${label}?`, { expected:{ direction: dir, amount: amt }, begin, end, label }));
  if (scaffoldLevel <= 2){
    const correctMeaning = MEANING_POOL.find(m => m.concept === concept && m.direction === dir);
    const others = shuffle(rng, MEANING_POOL.filter(m => !(m.concept === concept && m.direction === dir))).slice(0,3);
    steps.push(STEP('interpret','choice',`INTERPRET: ${label} ${dir}d ${dollars(amt)}. What does that mean in plain English?`, {
      options: shuffle(rng, [{ text: correctMeaning.text, correct:true }, ...others.map(o => ({ text:o.text, correct:false, m: o.concept===concept ? 'M03' : (c.side==='revenue' ? 'M08' : 'M09'), fb: o.concept===concept ? `That is the opposite direction. ${label} ${dir}d, so: ${c.meaning[dir]}` : `That describes a different account. ${label} is about ${c.side==='revenue'?'customers and revenue':'costs the company has incurred or paid for'}. Here: ${c.meaning[dir]}` })) ])
    }));
    const connectWrong = c.connect[dir === 'increase' ? 'decrease' : 'increase'];
    steps.push(STEP('recognition_cash_connect','choice',`CONNECT: Compared with what Net Income recognized, what happened to cash for this account?`, {
      options: shuffle(rng, [{ text: c.connect[dir], correct:true }, { text: connectWrong, correct:false, m: c.wrongSign[dir][0], fb: c.wrongSign[dir][1] }, { text:'They were the same; no cash difference.', correct:false, m:'M01', fb:`If they were the same, ${label} would not have changed. It ${dir}d ${dollars(amt)}, so recognition and cash were ${dollars(amt)} apart.` }])
    }));
  }
  const adjAmount = Math.abs(adj); const correctAct = adj > 0 ? `Add ${dollars(adjAmount)}` : `Subtract ${dollars(adjAmount)}`;
  const wrongAct = adj > 0 ? `Subtract ${dollars(adjAmount)}` : `Add ${dollars(adjAmount)}`;
  const actOpts = [{ text: correctAct, correct:true }, { text: wrongAct, correct:false, m: c.wrongSign[dir][0], fb: c.wrongSign[dir][1] }, { text:'No adjustment', correct:false, m:'M01', fb:`Net Income and operating cash differ here by ${dollars(amt)}, so an adjustment is needed: ${c.act[dir]}` }];
  if (scaffoldLevel >= 3 && end !== amt) actOpts.push({ text: (adj > 0 ? 'Add ' : 'Subtract ') + dollars(end), correct:false, m:'M02', fb:`${dollars(end)} is the ending balance. The adjustment uses the change (${dollars(amt)}), not the balance.` });
  steps.push(STEP('adjustment_direction','choice',`ACT: To convert Net Income toward operating cash, what do we do with the ${dollars(amt)} ${dir} in ${label}?`, { options: shuffle(rng, actOpts) }));
  steps.push(STEP('place_line','place',`PLACE: Where does "${lineLabel} ${adj<0?'(':''}${dollars(adjAmount).slice(1)}${adj<0?')':''}" belong?`, { line: addLine(lineLabel, adj), correct:'operating', fb:{ investing:['M27',`Timing adjustments reconcile Net Income to operating cash; they always sit in Operating. Investing is for actual cash paid or received for long-term assets.`], financing:['M27',`This is a working-capital adjustment, part of the Operating reconciliation. Financing is for lenders and owners.`], noncash:['M27',`This line adjusts Net Income; it belongs inside the Operating section, not the noncash disclosure.`] } }));
  const source = { balanceSheet: sourceComplexity === 'isolated' ? [{ concept, label, group: where, begin, end, focus:true }] : contextRows(rng, concept, { begin, end }), highlight: sourceComplexity === 'full_statement' ? null : where, isolated: sourceComplexity === 'isolated' };
  return { id:`${concept.toUpperCase()}-${dir.toUpperCase()}-L${scaffoldLevel}`, seed, concept, section:'operating', family:'timing', tier: scaffoldLevel<=1?1:scaffoldLevel<=3?2:3, scaffoldLevel, direction: dir, sourceComplexity,
    title: scaffoldLevel >= 4 ? 'Handle the operating adjustment' : `${label}: ${dir}`, instruction: scaffoldLevel >= 3 ? `Handle the ${label} adjustment.` : null,
    assumption: c.assumption, source, steps, line: { label: lineLabel, amount: adj, section:'operating' },
    hints: timingHints(concept, dir, term),
    explain: `${label} went from ${dollars(begin)} to ${dollars(end)}: ${dir==='increase'?'an increase':'a decrease'} of ${dollars(amt)}. ${c.meaning[dir]} ${c.connect[dir]} ${c.act[dir]} On the statement: ${lineLabel}, ${dollars(adj)}, in Operating.` };
}

// ---------- Depreciation / amortization ----------
export function noncashProblem({ kind='depreciation', scaffoldLevel=2, seed }){
  const rng = mulberry32(hashSeed(`${kind}|${scaffoldLevel}|${seed}`)); const amt = nice(rng, 200, 1500); const label = kind === 'amortization' ? 'Amortization Expense' : 'Depreciation Expense';
  const steps = [];
  if (scaffoldLevel <= 2){
    steps.push(STEP('locate','choice',`WHERE: Where do you find ${label}?`, { options: shuffle(rng, [{ text:'Income Statement', correct:true }, { text:'Balance Sheet — current assets', correct:false, m:'M27', fb:`${label} is an expense for the period; it is on the Income Statement (or in supplemental information).` }, { text:'Supplemental information only', correct:false, m:'M30', fb:`Sometimes, but first check the Income Statement: ${label} is an expense line there.` }]) }));
    steps.push(STEP('recognition_cash_connect','choice',`CONNECT: When Beacon recorded ${dollars(amt)} of ${label.toLowerCase()}, did ${dollars(amt)} of cash leave this period?`, { options: shuffle(rng, [{ text:'No. It reduced Net Income, but no cash left for it this period.', correct:true }, { text:`Yes. ${dollars(amt)} of cash was paid for ${kind}.`, correct:false, m:'M16', fb:`${label} is an allocation of a cost paid earlier (when the asset was bought; that cash was Investing then). Recording it now moves no cash.` }, { text:'Yes, and it also belongs in Investing.', correct:false, m:'M16', fb:`The purchase of the asset was Investing in the year it was bought. ${label} itself moves no cash in any section.` }]) }));
  }
  steps.push(STEP('adjustment_direction','choice',`ACT: Net Income is ${dollars(amt)} lower because of ${label.toLowerCase()}. What do we do when reconciling to operating cash?`, { options: shuffle(rng, [{ text:`Add back ${dollars(amt)}`, correct:true }, { text:`Subtract ${dollars(amt)}`, correct:false, m:'M16', fb:`Subtracting would treat it like a cash payment made twice. Net Income already went down; cash did not. Add it back.` }, { text:'No adjustment', correct:false, m:'M16', fb:`Net Income is ${dollars(amt)} below operating cash because of this noncash expense. Add it back.` }]) }));
  steps.push(STEP('place_line','place',`PLACE: Where does "${label} ${dollars(amt).slice(1)}" belong?`, { line: addLine(label, amt), correct:'operating', fb:{ investing:['M16','The asset purchase was Investing when it happened. The add-back reconciles Net Income, so it sits in Operating.'], financing:['M27','Depreciation has nothing to do with lenders or owners. It is an Operating add-back.'], noncash:['M27','It is noncash, but it is not a noncash investing/financing deal. It is an Operating add-back.'] } }));
  return { id:`${kind.toUpperCase()}-L${scaffoldLevel}`, seed, concept:'depreciation', section:'operating', family:'noncash', tier: scaffoldLevel<=2?1:2, scaffoldLevel, direction:'none', sourceComplexity:'statement_fragment',
    title: label, source: { incomeStatement: [{ label:'Revenue', amount: nice(rng,8000,20000) }, { label:'Operating Expenses', amount: -nice(rng,3000,7000) }, { label, amount: -amt, focus:true }], note:`Net Income already includes the ${dollars(amt)} expense.` },
    steps, line: { label, amount: amt, section:'operating' },
    hints: [`WHERE: ${label} is on the Income Statement.`, `SEE: It reduced Net Income by ${dollars(amt)}.`, `CONNECT: No cash was paid for ${kind} this period; the asset's cash left when it was bought.`, `ACT: Net Income is below cash by ${dollars(amt)}, so add it back.`],
    explain: `${label} of ${dollars(amt)} reduced Net Income without any current cash payment. To reconcile Net Income toward operating cash, add back ${dollars(amt)} in Operating.` };
}

// ---------- Gain / loss on sale of equipment ----------
export function gainLossProblem({ kind='gain', scaffoldLevel=2, seed }){
  const rng = mulberry32(hashSeed(`gl|${kind}|${scaffoldLevel}|${seed}`));
  const cost = nice(rng, 2000, 12000); const accDep = nice(rng, 500, cost - 500); const bv = cost - accDep;
  const diff = nice(rng, 100, Math.min(900, bv - 100)); const proceeds = kind === 'gain' ? bv + diff : bv - diff;
  const s = saleOfPPE({ cost, accumulatedDepreciation: accDep, proceeds }); const g = Math.abs(s.gainLoss);
  const steps = [];
  if (scaffoldLevel <= 2) steps.push(STEP('derive_actual_cash','number',`SEE: Book value is cost minus accumulated depreciation. What is the ${kind} on the sale?`, { expected: g, unit:'$', wrong: { [proceeds]: ['M19', `${dollars(proceeds)} is the cash proceeds, not the ${kind}. ${kind==='gain'?'Gain':'Loss'} = proceeds − book value = ${dollars(proceeds)} − ${dollars(bv)}.`], [bv]: ['M20', `${dollars(bv)} is the book value. The ${kind} is proceeds minus book value: ${dollars(proceeds)} − ${dollars(bv)} = ${dollars(g)}.`] }, fallback:`${kind==='gain'?'Gain':'Loss'} = proceeds − book value. Book value = ${dollars(cost)} − ${dollars(accDep)} = ${dollars(bv)}; proceeds ${dollars(proceeds)}; difference ${dollars(g)}.` }));
  steps.push(STEP('adjustment_direction','choice',`ACT: Net Income includes the ${dollars(g)} ${kind}. What happens to it in the Operating section?`, { options: shuffle(rng, [{ text: kind==='gain' ? `Subtract ${dollars(g)}` : `Add back ${dollars(g)}`, correct:true }, { text: kind==='gain' ? `Add ${dollars(g)}` : `Subtract ${dollars(g)}`, correct:false, m: kind==='gain'?'M17':'M18', fb: kind==='gain' ? `The gain raised Net Income, but the sale's cash belongs in Investing. Remove the gain from Operating: subtract it.` : `The loss lowered Net Income, but no operating cash left because of it. Add the loss back so Operating is not understated.` }, { text:`Move the ${dollars(g)} ${kind} to Investing`, correct:false, m:'M19', fb:`The ${kind} is an accounting difference, not cash. Investing reports the actual cash proceeds, ${dollars(proceeds)}. The ${kind} is removed from Operating.` }]) }));
  steps.push(STEP('derive_actual_cash','choice',`ACT: What amount goes in the Investing section for this sale?`, { options: shuffle(rng, [{ text:`${dollars(proceeds)} (cash proceeds)`, correct:true }, { text:`${dollars(g)} (the ${kind})`, correct:false, m:'M19', fb:`Investing reports actual cash. The cash that came in was ${dollars(proceeds)}; the ${kind} is just the difference from book value.` }, { text:`${dollars(bv)} (book value)`, correct:false, m:'M20', fb:`Book value is what the records said the asset was worth, not what the buyer paid. Cash received was ${dollars(proceeds)}.` }]) }));
  steps.push(STEP('place_line','place',`PLACE: Where does "Proceeds from Sale of Equipment ${dollars(proceeds).slice(1)}" belong?`, { line: addLine('Proceeds from Sale of Equipment', proceeds), correct:'investing', fb:{ operating:['M29','The sale is an Investing activity. Only the gain/loss removal touches Operating, and that is a separate line.'], financing:['M27','Selling equipment involves a buyer, not lenders or owners. Investing.'], noncash:['M26','Cash was received, so it is a real cash flow: Investing.'] } }));
  const glLine = kind === 'gain' ? addLine('Gain on Sale of Equipment', -g) : addLine('Loss on Sale of Equipment', g);
  return { id:`${kind.toUpperCase()}-SALE-L${scaffoldLevel}`, seed, concept:'gain_loss', section:'operating', family:'gain_loss', tier: scaffoldLevel<=2?1:2, scaffoldLevel, direction: kind, sourceComplexity:'statement_fragment',
    title: `${kind==='gain'?'Gain':'Loss'} on sale of equipment`, source: { facts: [['Equipment cost', dollars(cost)], ['Accumulated depreciation', dollars(accDep)], ['Sold for (cash)', dollars(proceeds)]], note:`The Income Statement shows a ${dollars(g)} ${kind} on sale of equipment.` },
    steps, line: glLine, secondLine: { label:'Proceeds from Sale of Equipment', amount: proceeds, section:'investing' },
    hints: [`SEE: Book value = cost − accumulated depreciation = ${dollars(bv)}.`, `SEE: ${kind==='gain'?'Gain':'Loss'} = proceeds − book value = ${dollars(g)}.`, `CONNECT: The ${kind} is inside Net Income, but the cash from the sale is an Investing cash flow.`, `ACT: ${kind==='gain'?'Subtract the gain from':'Add the loss back in'} Operating; put the ${dollars(proceeds)} proceeds in Investing.`],
    explain: `Book value ${dollars(bv)}; proceeds ${dollars(proceeds)}; ${kind} ${dollars(g)}. The ${kind} is removed from Operating (${kind==='gain'?'subtract':'add back'} ${dollars(g)}), and the actual ${dollars(proceeds)} cash proceeds go in Investing.` };
}

// ---------- Transaction classification (sections + noncash boundary) ----------
const EVENTS = [
  { kind:'borrow', text:(a)=>`Beacon borrows ${a} cash from the bank by signing a note.`, sign:1, label:'Proceeds from Note Payable', wrong:{ operating:['M22','Borrowed money is not revenue. It is cash from a lender: Financing.'], investing:['M27','A loan is a deal with a lender, not a long-term asset. Financing.'] } },
  { kind:'repay_principal', text:(a)=>`Beacon repays ${a} of note principal in cash.`, sign:-1, label:'Repayment of Note Payable', wrong:{ operating:['M23','Repaying principal is not an expense; it returns a lender\'s money. Financing.'], investing:['M27','Debt is a lender relationship, not a long-term asset. Financing.'] } },
  { kind:'issue_stock', text:(a)=>`Beacon receives ${a} cash from owners for common stock.`, sign:1, label:'Proceeds from Issuing Common Stock', wrong:{ operating:['M24','Selling stock is not revenue; it is cash from owners. Financing.'], investing:['M27','Owners\' money coming in is Financing, not Investing.'] } },
  { kind:'pay_dividends', text:(a)=>`Beacon pays ${a} of cash dividends to shareholders.`, sign:-1, label:'Dividends Paid', wrong:{ operating:['M25','Dividends are not an operating expense; they are cash returned to owners. Financing.'], investing:['M27','Dividends go to owners. Financing.'] } },
  { kind:'buy_ppe', text:(a)=>`Beacon buys equipment for ${a} cash.`, sign:-1, label:'Purchase of Equipment', wrong:{ operating:['M27','Equipment is a long-term asset; buying it is Investing, not a day-to-day operating cost.'], financing:['M27','No lender or owner is involved. Buying a long-term asset is Investing.'] } },
  { kind:'sell_ppe', text:(a)=>`Beacon sells old equipment for ${a} cash.`, sign:1, label:'Proceeds from Sale of Equipment', wrong:{ operating:['M29','Selling a long-term asset is Investing. Only a gain or loss on it touches Operating.'], financing:['M27','The buyer is not a lender or owner. Investing.'] } },
  { kind:'buy_land', text:(a)=>`Beacon buys land for ${a} cash.`, sign:-1, label:'Purchase of Land', wrong:{ operating:['M27','Land is a long-term asset: Investing.'], financing:['M27','No lender or owner involved. Investing.'] } },
  { kind:'collect_customers', text:(a)=>`Beacon collects ${a} cash from customers for repairs.`, sign:1, label:'Cash collected from customers', wrong:{ investing:['M27','Customers paying for repairs is the normal business: Operating.'], financing:['M27','Customers are not lenders or owners. Operating.'] } },
  { kind:'pay_employees', text:(a)=>`Beacon pays employees ${a} for normal work.`, sign:-1, label:'Cash paid to employees', wrong:{ investing:['M27','Wages are a normal operating cost, not a long-term asset.'], financing:['M27','Employees are not lenders or owners. Operating.'] } },
  { kind:'pay_suppliers', text:(a)=>`Beacon pays suppliers ${a} for parts used in repairs.`, sign:-1, label:'Cash paid to suppliers', wrong:{ investing:['M27','Parts for repairs are normal operating costs.'], financing:['M27','Suppliers are not lenders or owners. Operating.'] } },
  { kind:'noncash_note_for_equipment', text:(a)=>`Beacon acquires ${a} of equipment by signing a ${a} note payable. No cash changes hands.`, sign:0, label:'Equipment acquired by issuing note (noncash)', wrong:{ investing:['M26','No cash moved, so there is no Investing outflow. Follow the cash: this is a noncash investing/financing deal, disclosed separately.'], financing:['M26','No cash came in from the lender; the lender provided equipment, not cash. Noncash disclosure.'], operating:['M26','Nothing about this is a cash flow at all. It is disclosed as a noncash investing/financing transaction.'] } }
];
export function classifyProblem({ kinds=null, seed, scaffoldLevel=2 }){
  const rng = mulberry32(hashSeed(`cls|${(kinds||[]).join(',')}|${scaffoldLevel}|${seed}`));
  const pool = kinds ? EVENTS.filter(e => kinds.includes(e.kind)) : EVENTS; const ev = pick(rng, pool); const amt = nice(rng, 500, 8000, 500); const text = ev.text(dollars(amt));
  const correct = classifyEvent(ev.kind);
  const opts = ['operating','investing','financing'].concat(scaffoldLevel >= 2 || correct==='noncash' ? ['noncash'] : []).map(s => ({ text: s==='noncash' ? 'Noncash disclosure (no cash flow)' : s[0].toUpperCase()+s.slice(1), value:s, correct: s===correct, m: (ev.wrong[s]||['M27'])[0], fb: (ev.wrong[s]||[null,'Not that section.'])[1] }));
  const steps = [STEP('classify_section','choice',`Why did cash move? Choose the section.`, { options: opts })];
  const line = correct === 'noncash' ? null : { label: ev.label, amount: ev.sign * amt, section: correct };
  return { id:`CLS-${ev.kind.toUpperCase()}`, seed, concept: correct === 'noncash' ? 'noncash_investing_financing' : (correct==='operating' ? 'three_sections' : correct), section: correct==='noncash'?'financing':correct, family:'classification', tier: scaffoldLevel<=1?1:2, scaffoldLevel, direction: ev.sign>0?'inflow':ev.sign<0?'outflow':'none', sourceComplexity:'isolated', title:'Classify the cash event', source:{ story: text }, steps, line,
    hints: ['Ask: is this the normal business (Operating), a long-term asset or investment (Investing), or a lender/owner (Financing)?', correct==='noncash' ? 'Did any cash actually move? If not, it is not a cash flow.' : `Think about who is on the other side of the deal.`], explain: correct==='noncash' ? 'No cash moved, so it is a noncash investing/financing transaction, disclosed separately but excluded from all three sections.' : `${text} Cash moved because of ${correct==='operating'?'normal business activity':correct==='investing'?'a long-term asset':'a lender or owner'}: ${correct[0].toUpperCase()+correct.slice(1)}.` };
}

// ---------- Actual cash for Investing/Financing from balance change + supplemental facts ----------
export function actualCashProblem({ kind='investing', seed, scaffoldLevel=3 }){
  const rng = mulberry32(hashSeed(`ac|${kind}|${scaffoldLevel}|${seed}`));
  if (kind === 'investing'){
    const begin = nice(rng, 10000, 30000, 1000); const purchase = nice(rng, 2000, 9000, 500); const soldCost = nice(rng, 1000, Math.min(6000, purchase-500), 500); const end = begin + purchase - soldCost; const proceeds = nice(rng, 300, soldCost, 100);
    const steps = [
      STEP('derive_actual_cash','choice',`Equipment (at cost) went from ${dollars(begin)} to ${dollars(end)}. Can we conclude Beacon paid ${dollars(end-begin)} cash for equipment?`, { options: shuffle(rng, [{ text:'No. The balance change mixes purchases and disposals; use supplemental information for actual cash.', correct:true }, { text:`Yes. Investing outflow = ${dollars(end-begin)}.`, correct:false, m:'M21', fb:`The balance rose ${dollars(end-begin)} only because a ${dollars(purchase)} purchase was partly offset by removing ${dollars(soldCost)} of sold equipment. Use the supplemental facts for actual cash.` }]) }),
      STEP('derive_actual_cash','number',`Supplemental: equipment was purchased for ${dollars(purchase)} cash, and old equipment (cost ${dollars(soldCost)}) was sold for ${dollars(proceeds)} cash. What cash outflow goes in Investing for the purchase?`, { expected: purchase, unit:'$', wrong:{ [end-begin]:['M21',`${dollars(end-begin)} is the net balance change, not the cash paid. The purchase was ${dollars(purchase)}.`], [soldCost]:['M20',`${dollars(soldCost)} is the cost of the equipment sold, not what was paid for the new equipment.`] }, fallback:`The purchase line uses the cash actually paid: ${dollars(purchase)}.` }),
      STEP('place_line','place',`PLACE: Where do "Purchase of Equipment (${dollars(purchase).slice(1)})" and "Proceeds from Sale of Equipment ${dollars(proceeds).slice(1)}" belong?`, { line: addLine('Purchase of Equipment', -purchase), correct:'investing', fb:{ operating:['M27','Buying and selling long-term assets is Investing.'], financing:['M27','No lender or owner is involved. Investing.'], noncash:['M26','Cash moved in both deals, so they are real Investing cash flows.'] } })
    ];
    return { id:'INV-ACTUAL-CASH', seed, concept:'investing', section:'investing', family:'actual_cash', tier:2, scaffoldLevel, direction:'outflow', sourceComplexity:'statement_fragment', title:'Actual cash for equipment', source:{ balanceSheet:[{ concept:'equipment', label:'Equipment (at cost)', group:'long_term_assets', begin, end, focus:true }], supplemental:[`Equipment was purchased for ${dollars(purchase)} cash.`, `Equipment that cost ${dollars(soldCost)} was sold for ${dollars(proceeds)} cash.`], highlight:'long_term_assets' }, steps, line:{ label:'Purchase of Equipment', amount:-purchase, section:'investing' }, secondLine:{ label:'Proceeds from Sale of Equipment', amount: proceeds, section:'investing' },
      hints:['WHERE: Long-term assets tell you where to investigate; supplemental facts tell you the cash.', 'SEE: The balance change = purchases − cost of items sold. It is not a cash number.', 'ACT: Purchase paid in cash → Investing outflow; proceeds received → Investing inflow.'], explain:`Equipment rose ${dollars(end-begin)}, but that nets a ${dollars(purchase)} purchase against ${dollars(soldCost)} of equipment sold. Investing shows the actual cash: Purchase of Equipment (${dollars(purchase).slice(1)}) and Proceeds from Sale ${dollars(proceeds)}.` };
  }
  const begin = nice(rng, 5000, 20000, 1000); const borrowed = nice(rng, 2000, 8000, 500); const repaid = nice(rng, 1000, borrowed, 500); const end = begin + borrowed - repaid;
  const steps = [
    STEP('derive_actual_cash','choice',`Notes Payable went from ${dollars(begin)} to ${dollars(end)}. Supplemental: Beacon borrowed ${dollars(borrowed)} and repaid ${dollars(repaid)} of principal. What goes in Financing?`, { options: shuffle(rng, [{ text:`Two lines: Proceeds from Note ${dollars(borrowed)} and Repayment of Note (${dollars(repaid).slice(1)})`, correct:true }, { text:`One line: ${dollars(end-begin)} net change`, correct:false, m:'M21', fb:`Statements report the actual cash in and out separately: ${dollars(borrowed)} borrowed and ${dollars(repaid)} repaid. The net change is a clue, not the answer.` }, { text:`Repayment in Operating (it is an expense), borrowing in Financing`, correct:false, m:'M23', fb:`Repaying principal is not an expense. Both the borrowing and the repayment are Financing.` }]) }),
    STEP('place_line','place',`PLACE: Where does "Repayment of Note Payable (${dollars(repaid).slice(1)})" belong?`, { line: addLine('Repayment of Note Payable', -repaid), correct:'financing', fb:{ operating:['M23','Principal repayment is cash returned to a lender: Financing.'], investing:['M27','A lender, not a long-term asset: Financing.'], noncash:['M26','Cash was paid, so it is a real Financing outflow.'] } })
  ];
  return { id:'FIN-ACTUAL-CASH', seed, concept:'financing', section:'financing', family:'actual_cash', tier:2, scaffoldLevel, direction:'outflow', sourceComplexity:'statement_fragment', title:'Actual cash from lenders', source:{ balanceSheet:[{ concept:'notes_payable', label:'Notes Payable', group:'debt_equity', begin, end, focus:true }], supplemental:[`Beacon borrowed ${dollars(borrowed)} cash by issuing a note.`, `Beacon repaid ${dollars(repaid)} of note principal in cash.`], highlight:'debt_equity' }, steps, line:{ label:'Proceeds from Note Payable', amount: borrowed, section:'financing' }, secondLine:{ label:'Repayment of Note Payable', amount:-repaid, section:'financing' },
    hints:['WHERE: Debt and equity accounts show where to look; supplemental facts give the cash.', 'ACT: Report borrowing and repayment as separate Financing lines.'], explain:`Notes Payable changed by ${dollars(end-begin)} net, but Financing reports the actual cash: ${dollars(borrowed)} borrowed (inflow) and ${dollars(repaid)} repaid (outflow).` };
}

// ---------- Statement scan: which rows are operating timing accounts ----------
export function scanProblem({ seed, scaffoldLevel=3 }){
  const rng = mulberry32(hashSeed(`scan|${scaffoldLevel}|${seed}`));
  const rows = contextRows(rng, 'accounts_receivable', { begin: nice(rng,500,1500), end: nice(rng,500,1500) }); rows.forEach(r => delete r.focus);
  const correct = rows.filter(r => ['accounts_receivable','inventory','prepaid_expenses','accounts_payable','accrued_liabilities','unearned_revenue'].includes(r.concept)).map(r => r.concept);
  const wrongFb = { cash:['M15','Cash is the target we are explaining. It is never a working-capital adjustment.'], equipment:['M14','Equipment is a long-term asset. Its cash belongs in Investing, found through supplemental facts.'], notes_payable:['M14','Long-term debt is Financing. The current-asset/liability shortcut does not apply to it.'], common_stock:['M14','Common Stock belongs to owners: Financing, not an operating timing account.'] };
  const steps = [STEP('locate','multi','Which accounts on this Balance Sheet create operating timing adjustments? Select all that apply.', { options: rows.map(r => ({ text: r.label, value: r.concept, correct: correct.includes(r.concept), m:(wrongFb[r.concept]||[])[0], fb:(wrongFb[r.concept]||[])[1] })), missingFb:'You left out an operating timing account. Every operating current asset (except Cash) and every operating current liability creates one.' })];
  return { id:'SCAN-BS', seed, concept:'timing_matrix', section:'operating', family:'timing', tier:3, scaffoldLevel, direction:'none', sourceComplexity: scaffoldLevel >= 4 ? 'full_statement' : 'highlighted_full_statement', title:'Scan the Balance Sheet', source:{ balanceSheet: rows, highlight: scaffoldLevel >= 4 ? null : 'current' }, steps, line:null,
    hints:['Operating timing accounts are the current assets except Cash, and the current liabilities that come from day-to-day business.', 'Skip Cash (the target), long-term assets (Investing), and debt/equity (Financing).'], explain:'A/R, Inventory, Prepaids, A/P, Accrued Liabilities and Unearned Revenue are operating timing accounts. Cash is the target; Equipment is Investing territory; Notes Payable and Common Stock are Financing territory.' };
}

// ---------- Timing matrix sorting ----------
const MATRIX_STORIES = [
  { text:'Beacon received cash from a customer before doing the repair work.', order:'cash_first', side:'revenue', concept:'unearned_revenue' },
  { text:'Beacon finished a repair and billed the customer, who will pay next month.', order:'recognition_first', side:'revenue', concept:'accounts_receivable' },
  { text:'Beacon paid a year of insurance in advance.', order:'cash_first', side:'expense', concept:'prepaid_expenses' },
  { text:'Beacon received the electric bill for this month and will pay it next month.', order:'recognition_first', side:'expense', concept:'accounts_payable' },
  { text:'Employees worked the last week of December; payday is in January.', order:'recognition_first', side:'expense', concept:'accrued_liabilities' },
  { text:'Beacon bought bike parts for resale and has not sold them yet.', order:'cash_first', side:'expense', concept:'inventory' }
];
export function matrixProblem({ seed, term=(s)=>s }){
  const rng = mulberry32(hashSeed(`matrix|${seed}`)); const st = pick(rng, MATRIX_STORIES);
  const cells = [['recognition_first','revenue','Recognition first · Revenue (A/R)'],['cash_first','revenue',`Cash first · Revenue (${term('Unearned Revenue')})`],['recognition_first','expense','Recognition first · Expense (A/P, Accrued)'],['cash_first','expense','Cash first · Expense (Prepaids, Inventory)']];
  const steps = [STEP('interpret','choice',`Which cell of the timing map does this story belong in?`, { options: cells.map(([o,s,t]) => ({ text:t, correct: o===st.order && s===st.side, m: s!==st.side ? (st.side==='revenue'?'M08':'M09') : 'M10', fb: s!==st.side ? `This story is about ${st.side==='revenue'?'revenue (a customer)':'a cost the company incurs or pays'}, not the other side.` : `Think about which came first here: ${st.order==='cash_first'?'the cash moved before anything was recognized':'something was recognized before cash moved'}.` })) })];
  return { id:'MATRIX', seed, concept:'timing_matrix', section:'operating', family:'timing', tier:2, scaffoldLevel:3, direction:'none', sourceComplexity:'isolated', title:'Sort the timing story', source:{ story: st.text }, steps, line:null, hints:['First: did cash move before or after recognition?', 'Second: is this about revenue (customers) or expense/cost?'], explain:`${st.text} ${st.order==='cash_first'?'Cash came first':'Recognition came first'}, on the ${st.side} side: ${term(TIMING[st.concept].label)}.` };
}

// ---------- Mini Operating section (total it) ----------
export function miniOperatingProblem({ seed, term=(s)=>s }){
  const rng = mulberry32(hashSeed(`miniop|${seed}`)); const ni = nice(rng, 2000, 9000, 100);
  const pool = ['accounts_receivable','accounts_payable','prepaid_expenses','unearned_revenue','inventory','accrued_liabilities'];
  const chosen = shuffle(rng, pool).slice(0, 3); const rows = chosen.map(c => { const begin = nice(rng,300,1500), end = nice(rng,300,1500) ; return { concept:c, label: term(TIMING[c].label), group: TIMING[c].territory, begin, end }; }).filter(r => r.begin !== r.end);
  const dep = nice(rng, 200, 1200); const lines = [{ label:'Net Income', amount: ni }, { label:'Depreciation Expense', amount: dep }];
  for (const r of rows){ const ch = r.end - r.begin; lines.push({ label:`${ch>0?'Increase':'Decrease'} in ${r.label}`, amount: workingCapitalAdjustment(r.concept, ch) }); }
  const total = lines.reduce((s,l)=>s+l.amount,0);
  const steps = [STEP('total_section','number','Build the Operating section: start with Net Income, add the depreciation add-back, apply each timing adjustment, and enter Net Cash Provided by Operating Activities.', { expected: total, unit:'$', wrong:{ [ni]:['M01','That is Net Income unchanged. The adjustments move it toward operating cash.'] }, fallback:`Net Income ${dollars(ni)} + depreciation ${dollars(dep)} ${rows.map(r=>{const ch=r.end-r.begin; const a=workingCapitalAdjustment(r.concept,ch); return `${a>=0?'+':'−'} ${dollars(Math.abs(a))} (${r.label} ${ch>0?'up':'down'})`;}).join(' ')} = ${dollars(total)}.` })];
  return { id:'MINI-OPERATING', seed, concept:'full_statement', section:'operating', family:'reconciliation', tier:3, scaffoldLevel:3, direction:'none', sourceComplexity:'statement_fragment', title:'Build the Operating section', source:{ incomeStatement:[{ label:'Net Income', amount: ni, focus:true }, { label:'Depreciation Expense (included above)', amount:-dep, focus:true }], balanceSheet: rows.map(r=>Object.assign({focus:true},r)), highlight:null }, steps, line:null, solution: lines,
    hints:['Start with Net Income. Add back depreciation.', 'Operating current asset up → subtract; down → add. Operating current liability up → add; down → subtract.', 'Add every line, keeping signs.'], explain: `Lines: ${lines.map(l=>`${l.label} ${dollars(l.amount)}`).join('; ')}. Total ${dollars(total)}.` };
}
