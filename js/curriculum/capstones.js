// Fixed, validated complete-statement scenarios. solveStatement() in accounting.js produces the official solution;
// tests assert every capstone ties exactly.
export const CAPSTONES = [
  {
    id:'cap1', title:'Guided complete statement', company:'Beacon Bike & Repair', guided:true, year:'20X2',
    netIncome: 2500, depreciation: 500, beginCash: 5000, endCash: 8900,
    incomeStatement: [{ label:'Revenue', amount: 24000 }, { label:'Operating Expenses', amount: -20800 }, { label:'Depreciation Expense', amount: -500 }, { label:'Gain on Sale of Equipment', amount: 200 }, { label:'Income Tax Expense', amount: -400 }],
    workingCapital: [
      { concept:'accounts_receivable', label:'Accounts Receivable', begin:1000, end:1500 },
      { concept:'prepaid_expenses', label:'Prepaid Expenses', begin:200, end:100 },
      { concept:'accounts_payable', label:'Accounts Payable', begin:600, end:900 },
      { concept:'unearned_revenue', label:'Unearned Revenue', begin:400, end:300 }
    ],
    otherBalances: [{ concept:'equipment', label:'Equipment (net)', group:'long_term_assets', begin:12000, end:12900 }, { concept:'notes_payable', label:'Notes Payable', group:'debt_equity', begin:4000, end:7000 }, { concept:'common_stock', label:'Common Stock', group:'debt_equity', begin:8000, end:8000 }, { concept:'retained_earnings', label:'Retained Earnings', group:'debt_equity', begin:5200, end:7200 }],
    sale: { cost: 1500, accumulatedDepreciation: 900, proceeds: 800 },
    transactions: [
      { kind:'sell_ppe', key:'sale_proceeds', label:'Proceeds from Sale of Equipment', cash: 800 },
      { kind:'buy_ppe', key:'purchase', label:'Purchase of Equipment', cash: -2000 },
      { kind:'borrow', key:'borrow', label:'Proceeds from Note Payable', cash: 3000 },
      { kind:'pay_dividends', key:'dividends', label:'Dividends Paid', cash: -500 }
    ],
    supplemental: ['Depreciation Expense was $500.', 'Equipment was sold for $800 cash. The sale produced a $200 gain.', 'Equipment was purchased for $2,000 cash.', 'The company borrowed $3,000 cash by issuing a note.', 'Dividends of $500 were paid in cash.']
  },
  {
    id:'cap2', title:'Integrated statement (less guided)', company:'Beacon Bike & Repair', guided:false, year:'20X3',
    netIncome: 4800, depreciation: 1200, beginCash: 6000, endCash: 9400,
    incomeStatement: [{ label:'Revenue', amount: 41000 }, { label:'Cost of Goods Sold', amount: -17500 }, { label:'Operating Expenses', amount: -16200 }, { label:'Depreciation Expense', amount: -1200 }, { label:'Loss on Sale of Equipment', amount: -300 }, { label:'Income Tax Expense', amount: -1000 }],
    workingCapital: [
      { concept:'accounts_receivable', label:'Accounts Receivable', begin:1500, end:2100 },
      { concept:'inventory', label:'Inventory', begin:2400, end:3000 },
      { concept:'prepaid_expenses', label:'Prepaid Expenses', begin:700, end:400 },
      { concept:'accounts_payable', label:'Accounts Payable', begin:900, end:1500 },
      { concept:'accrued_liabilities', label:'Accrued Liabilities', begin:500, end:300 },
      { concept:'unearned_revenue', label:'Unearned Revenue', begin:300, end:600 }
    ],
    otherBalances: [{ concept:'equipment', label:'Equipment (net)', group:'long_term_assets', begin:12900, end:13900 }, { concept:'notes_payable', label:'Notes Payable', group:'debt_equity', begin:7000, end:5500 }, { concept:'common_stock', label:'Common Stock', group:'debt_equity', begin:8000, end:10000 }, { concept:'retained_earnings', label:'Retained Earnings', group:'debt_equity', begin:7200, end:11300 }],
    sale: { cost: 3000, accumulatedDepreciation: 1200, proceeds: 1500 },
    transactions: [
      { kind:'buy_ppe', key:'purchase', label:'Purchase of Equipment', cash: -4000 },
      { kind:'sell_ppe', key:'sale_proceeds', label:'Proceeds from Sale of Equipment', cash: 1500 },
      { kind:'issue_stock', key:'stock', label:'Proceeds from Issuing Common Stock', cash: 2000 },
      { kind:'repay_principal', key:'repay', label:'Repayment of Note Payable', cash: -1500 },
      { kind:'pay_dividends', key:'dividends', label:'Dividends Paid', cash: -700 },
      { kind:'noncash_note_for_equipment', key:'noncash_equipment', label:'Equipment acquired by issuing a note (noncash)', amount: 2500 }
    ],
    supplemental: ['Depreciation Expense was $1,200.', 'Equipment with a book value of $1,800 was sold for $1,500 cash.', 'Equipment was purchased for $4,000 cash.', 'Additional equipment of $2,500 was acquired by signing a note payable; no cash changed hands.', 'Common stock was issued for $2,000 cash.', '$1,500 of note principal was repaid.', 'Dividends of $700 were paid.']
  }
];

// Candidate lines the builder offers (correct lines plus distractors mapped to misconceptions).
export function candidateLines(cap, solution){
  const lines = [];
  for (const sec of ['operating','investing','financing']) for (const l of solution[sec].lines) lines.push({ key:l.key, label:l.label, amount:l.amount, section:sec, correct:true });
  const dep = cap.depreciation; const sale = solution.operating.lines.find(l=>l.key.endsWith('_on_sale'));
  const g = sale ? Math.abs(sale.amount) : 0; const proceeds = cap.sale ? cap.sale.proceeds : 0; const bv = cap.sale ? cap.sale.cost - cap.sale.accumulatedDepreciation : 0;
  const d = [];
  if (dep) d.push({ key:'dep_wrong', label:'Depreciation Expense', amount:-dep, correctSection:null, m:'M16', fb:'Depreciation reduced Net Income without a cash payment. It is added back, not subtracted.' });
  if (sale){ d.push({ key:'gl_flip', label: sale.label, amount: -sale.amount, m: sale.amount<0?'M17':'M18', fb: sale.amount<0 ? 'The gain is removed from Operating: subtract it.' : 'The loss is added back in Operating.' }); d.push({ key:'gl_as_proceeds', label:'Proceeds from Sale of Equipment', amount: g, m:'M19', fb:`Investing reports the cash proceeds (${proceeds.toLocaleString()}), not the ${sale.amount<0?'gain':'loss'}.` }); d.push({ key:'bv_as_proceeds', label:'Proceeds from Sale of Equipment', amount: bv, m:'M20', fb:`Book value is not cash received. Proceeds were ${proceeds.toLocaleString()}.` }); }
  for (const w of cap.workingCapital){ const ch = w.end - w.begin; if (!ch) continue; const correct = solution.operating.lines.find(l=>l.key===w.concept); d.push({ key:w.concept+'_flip', label: correct.label, amount: -correct.amount, m: ['accounts_receivable','inventory','prepaid_expenses'].includes(w.concept) ? (ch>0?'M04':'M05') : (ch>0?'M06':'M07'), fb:`Wrong direction for ${w.label}. ${ch>0?'It increased':'It decreased'} ${Math.abs(ch).toLocaleString()}; ${['accounts_receivable','inventory','prepaid_expenses'].includes(w.concept) ? (ch>0?'an operating current asset increase is subtracted.':'an operating current asset decrease is added.') : (ch>0?'an operating current liability increase is added.':'an operating current liability decrease is subtracted.')}` }); if (w.end !== Math.abs(ch)) d.push({ key:w.concept+'_balance', label:`${ch>0?'Increase':'Decrease'} in ${w.label}`, amount: (correct.amount<0?-1:1)*w.end, m:'M02', fb:`${w.end.toLocaleString()} is the ending balance. Use the change: ${Math.abs(ch).toLocaleString()}.` }); }
  d.push({ key:'cash_adj', label:'Increase in Cash', amount: -(cap.endCash-cap.beginCash), m:'M15', fb:'Cash is the target the statement explains, never an adjustment inside it.' });
  const nc = solution.noncash[0]; if (nc) d.push({ key:'noncash_as_cash', label:'Purchase of Equipment (note)', amount:-nc.amount, m:'M26', fb:'No cash moved for the equipment bought with a note. It is disclosed separately, not placed in Investing or Financing.' });
  const eq = cap.otherBalances.find(b=>b.concept==='equipment'); if (eq) d.push({ key:'ppe_change', label:'Purchase of Equipment', amount: -(eq.end-eq.begin), m:'M21', fb:'The Equipment balance change is not the cash paid. Use the supplemental purchase amount.' });
  return { correct: lines, distractors: d.map(x => Object.assign({ correct:false }, x)) };
}
