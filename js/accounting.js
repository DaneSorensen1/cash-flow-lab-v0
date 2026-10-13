// Pure accounting logic for the Statement of Cash Flows (indirect method). No DOM, no eval.
// Used by both the UI and the tests, so a content bug shows up in tests.
export const OPERATING_CURRENT_ASSETS = ['accounts_receivable','inventory','prepaid_expenses'];
export const OPERATING_CURRENT_LIABILITIES = ['accounts_payable','accrued_liabilities','unearned_revenue'];

export function computeChange(begin, end){ return end - begin; }
export function direction(change){ return change > 0 ? 'increase' : change < 0 ? 'decrease' : 'none'; }
export function isOperatingTimingAccount(concept){ return OPERATING_CURRENT_ASSETS.includes(concept) || OPERATING_CURRENT_LIABILITIES.includes(concept); }

// Signed amount added to Net Income for a working-capital change (end - begin). Throws for non-operating accounts: classify first.
export function workingCapitalAdjustment(concept, change){
  if (OPERATING_CURRENT_ASSETS.includes(concept)) return -change;
  if (OPERATING_CURRENT_LIABILITIES.includes(concept)) return change;
  throw new Error(`Not an operating timing account: ${concept}`);
}
export function noncashAddBack(amount){ return Math.abs(amount); }

// Sale of PPE. proceeds - bookValue = gain (+) or loss (-). Operating removes it; Investing reports the proceeds.
export function saleOfPPE({cost, accumulatedDepreciation, proceeds}){
  const bookValue = cost - accumulatedDepreciation; const gainLoss = proceeds - bookValue;
  return { bookValue, gainLoss, kind: gainLoss > 0 ? 'gain' : gainLoss < 0 ? 'loss' : 'none', operatingAdjustment: -gainLoss, investingAmount: proceeds };
}
export function gainLossAdjustment(kind, amount){ const a = Math.abs(amount); return kind === 'gain' ? -a : kind === 'loss' ? a : 0; }

export function classifyEvent(kind){
  const map = { collect_customers:'operating', pay_employees:'operating', pay_suppliers:'operating', pay_interest:'operating',
    buy_ppe:'investing', sell_ppe:'investing', buy_land:'investing', buy_investment:'investing', sell_investment:'investing',
    borrow:'financing', repay_principal:'financing', issue_stock:'financing', pay_dividends:'financing', noncash_note_for_equipment:'noncash' };
  if (!(kind in map)) throw new Error('Unknown event kind ' + kind); return map[kind];
}
export function sumLines(lines){ return lines.reduce((s,l)=>s + l.amount, 0); }
export function cashChange(operating, investing, financing){ return operating + investing + financing; }
export function reconcileCash(beginCash, netChange){ return beginCash + netChange; }

// Full statement solution for a scenario. Lines carry stable keys so the builder can check placements.
export function solveStatement(sc){
  const op = [{ key:'net_income', label:'Net Income', amount: sc.netIncome }];
  if (sc.depreciation) op.push({ key:'depreciation', label:'Depreciation Expense', amount: noncashAddBack(sc.depreciation) });
  if (sc.amortization) op.push({ key:'amortization', label:'Amortization Expense', amount: noncashAddBack(sc.amortization) });
  if (sc.sale) { const s = saleOfPPE(sc.sale); if (s.kind !== 'none') op.push({ key: s.kind + '_on_sale', label: (s.kind==='gain'?'Gain':'Loss') + ' on Sale of Equipment', amount: s.operatingAdjustment }); }
  for (const acct of sc.workingCapital){
    const change = computeChange(acct.begin, acct.end); if (change === 0) continue;
    op.push({ key: acct.concept, label: `${direction(change)==='increase'?'Increase':'Decrease'} in ${acct.label}`, amount: workingCapitalAdjustment(acct.concept, change) });
  }
  const inv = [], fin = [], noncash = [];
  for (const t of sc.transactions){
    const section = classifyEvent(t.kind); const line = { key: t.key || t.kind, label: t.label, amount: t.cash };
    if (section === 'investing') inv.push(line); else if (section === 'financing') fin.push(line); else if (section === 'noncash') noncash.push({ key: t.key||t.kind, label: t.label, amount: t.amount });
  }
  const operating = sumLines(op), investing = sumLines(inv), financing = sumLines(fin);
  const netChange = cashChange(operating, investing, financing); const endingCash = reconcileCash(sc.beginCash, netChange);
  return { operating:{ lines: op, total: operating }, investing:{ lines: inv, total: investing }, financing:{ lines: fin, total: financing }, noncash, netChange, beginCash: sc.beginCash, endingCash, ties: endingCash === sc.endCash };
}
