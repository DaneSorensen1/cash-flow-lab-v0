// Concept metadata, plain-English stories, misconception codes, feedback, and hint chains.
// Wording follows the spec's language rules (section 7). Terminology for Unearned/Deferred is applied by term().

export const MISCONCEPTIONS = {
  M01:'Treats Net Income as operating cash', M02:'Uses ending balance instead of the change', M03:'Reverses beginning/end change calculation',
  M04:'Thinks A/R increase means cash increased', M05:'Thinks A/R decrease should subtract', M06:'Thinks A/P increase means cash was paid',
  M07:'Thinks A/P decrease should add', M08:'Confuses A/R with Unearned Revenue', M09:'Confuses A/P/accrual with Prepaid Expense',
  M10:'Thinks Unearned Revenue is already earned revenue', M11:'Treats Prepaid increase as current expense only', M12:'Treats Inventory increase as an expense rather than working-capital cash use',
  M13:'Fails to recognize Inventory/A/P offset on credit purchase', M14:'Applies asset/liability shortcut to non-operating account', M15:'Adjusts the Cash account itself',
  M16:'Treats depreciation as current cash outflow', M17:'Adds a gain instead of subtracting it', M18:'Subtracts a loss instead of adding it',
  M19:'Uses gain/loss amount as Investing cash proceeds', M20:'Uses book value as sale proceeds', M21:'Uses PPE balance change as cash amount without support',
  M22:'Treats borrowing as revenue', M23:'Treats debt principal repayment as expense/Operating', M24:'Treats stock issuance as revenue', M25:'Treats dividends as operating expense',
  M26:'Includes noncash investing/financing transaction as cash flow', M27:'Places correct amount in wrong SCF section', M28:'Confuses cash change with ending Cash balance',
  M29:'Double-counts an item in Operating and Investing/Financing', M30:'Omits an item not directly visible on the Balance Sheet'
};

export const SKILLS = ['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','adjustment_amount','classify_section','derive_actual_cash','place_line','total_section','reconcile','explain','integrated'];
export const SKILL_LABELS = { locate:'Find it', compute_change:'Calculate change', interpret:'Explain meaning', recognition_cash_connect:'Cash connection', adjustment_direction:'Adjustment', adjustment_amount:'Amount', classify_section:'Classify section', derive_actual_cash:'Actual cash', place_line:'Placement', total_section:'Totals', reconcile:'Reconcile', explain:'Explain', integrated:'Integrated' };

export const TERRITORIES = [
  { id:'income_statement', name:'Income Statement', find:'Net Income; depreciation/amortization; gains/losses' },
  { id:'current_assets', name:'Balance Sheet — operating current assets', find:'Timing differences: A/R, Inventory, Prepaids' },
  { id:'current_liabilities', name:'Balance Sheet — operating current liabilities', find:'Timing differences: A/P, Accrued Liabilities, Unearned Revenue' },
  { id:'long_term_assets', name:'Balance Sheet — long-term assets / investments', find:'Clues for Investing; actual cash usually needs supplemental information' },
  { id:'debt_equity', name:'Balance Sheet — debt and equity', find:'Clues for Financing; actual cash usually needs supplemental information' },
  { id:'supplemental', name:'Supplemental information', find:'Purchases, sale proceeds, borrowing, repayments, dividends, noncash deals' },
  { id:'cash', name:'Cash account', find:'The target change to explain. Never a working-capital adjustment.' }
];

// Timing accounts ------------------------------------------------------------------------------
export const TIMING = {
  accounts_receivable: {
    label:'Accounts Receivable', short:'A/R', kind:'asset', territory:'current_assets', side:'revenue', order:'recognition_first',
    meaning: { increase:'Customers owe Beacon more than before.', decrease:'Customers owe Beacon less than before.' },
    connect: { increase:'Cash collected from customers was LESS than the revenue Net Income recognized.', decrease:'Cash collected from customers was MORE than the revenue recognized this period.' },
    act: { increase:'Net Income counted revenue that has not become cash yet. Subtract the increase.', decrease:'Beacon collected revenue that Net Income counted in an earlier period. Add the decrease.' },
    wrongSign: { increase:['M04','You treated the A/R increase as if it were cash coming in. A/R is money customers still owe, not cash collected. Net Income counted that revenue; the cash has not arrived, so subtract.'], decrease:['M05','A/R fell because customers paid down what they owed. That cash arrived now, but the revenue was counted in an earlier period, so Net Income is behind cash here. Add the decrease.'] },
    assumption:'For these introductory problems, assume A/R changes come from ordinary customer billing and collection.',
    story:{ increase:'Beacon performs $1,000 of repair work, collects $700, and is still owed $300.', decrease:'Beacon started the period owed $500 by customers, recognized $800 of new revenue, and collected $1,000 in cash.' }
  },
  accounts_payable: {
    label:'Accounts Payable', short:'A/P', kind:'liability', territory:'current_liabilities', side:'expense', order:'recognition_first',
    meaning: { increase:'Beacon owes suppliers more than before.', decrease:'Beacon owes suppliers less than before.' },
    connect: { increase:'Cash paid to suppliers was LESS than the operating cost Net Income recognized.', decrease:'Cash paid to suppliers was MORE than the cost recognized this period.' },
    act: { increase:'Net Income already felt a cost whose cash has not left yet. Add the increase.', decrease:'Beacon paid cash for costs Net Income recognized earlier. Subtract the decrease.' },
    wrongSign: { increase:['M06','A/P went up because more cost was recognized than paid. Net Income went down before all the cash went out, so the reconciliation adds the unpaid portion back.'], decrease:['M07','A/P went down because Beacon paid off bills recognized earlier. Cash left now without a matching current expense, so subtract the decrease.'] },
    assumption:'Assume A/P changes come from ordinary supplier bills and payments.',
    story:{ increase:'Beacon incurs $500 of utility expense, pays $300, and still owes $200.', decrease:'Beacon owed suppliers $900, recognized $600 of new bills, and paid $800.' }
  },
  accrued_liabilities: {
    label:'Accrued Liabilities', short:'Accrued', kind:'liability', territory:'current_liabilities', side:'expense', order:'recognition_first',
    meaning: { increase:'Beacon owes more for expenses already incurred (such as wages) that are not paid yet.', decrease:'Beacon owes less for previously incurred expenses.' },
    connect: { increase:'Cash paid for these expenses was LESS than the expense Net Income recognized.', decrease:'Cash paid was MORE than the expense recognized this period.' },
    act: { increase:'An expense reduced Net Income without a current cash payment. Add the increase.', decrease:'Beacon paid cash for expenses recognized earlier. Subtract the decrease.' },
    wrongSign: { increase:['M06','Accrued wages rose because employees earned pay that has not been paid yet. The expense hit Net Income; the cash did not leave. Add the increase.'], decrease:['M07','Accrued liabilities fell because Beacon paid amounts expensed earlier. Cash left now; subtract the decrease.'] },
    assumption:'Assume accrued liabilities change only from ordinary expense accrual and payment.',
    story:{ increase:'Employees earn $400 of wages; only $300 is paid by year-end.', decrease:'Beacon owed $300 of accrued wages, incurred $500 more, and paid $700.' }
  },
  unearned_revenue: {
    label:'Unearned Revenue', short:'Unearned', kind:'liability', territory:'current_liabilities', side:'revenue', order:'cash_first',
    meaning: { increase:'Beacon holds more customer cash for work it has not done yet.', decrease:'Beacon has done more of the work customers paid for earlier.' },
    connect: { increase:'Cash received from customers was MORE than the revenue Net Income recognized.', decrease:'Revenue recognized was MORE than cash received this period.' },
    act: { increase:'Cash is ahead of Net Income here. Add the increase.', decrease:'Net Income counted revenue whose cash arrived in an earlier period. Subtract the decrease.' },
    wrongSign: { increase:['M10','An increase means customers paid for work not done yet. That cash arrived now, but Net Income has not counted it as revenue. Cash is ahead, so add.'], decrease:['M10','A decrease means Beacon earned revenue that customers paid for earlier. Net Income counts it now; the cash came earlier. Subtract the decrease.'] },
    assumption:'Assume Unearned Revenue changes only from ordinary deposits and later delivery of the work.',
    story:{ increase:'Beacon receives $600 of customer deposits; by year-end it has earned only $400.', decrease:'Beacon held $500 of deposits, received $200 more, and earned $400 of the deposits.' }
  },
  prepaid_expenses: {
    label:'Prepaid Expenses', short:'Prepaids', kind:'asset', territory:'current_assets', side:'expense', order:'cash_first',
    meaning: { increase:'Beacon has paid for more future benefit (insurance, rent) than before.', decrease:'Beacon has used up some benefit it paid for earlier.' },
    connect: { increase:'Cash paid was MORE than the expense Net Income recognized.', decrease:'Expense recognized was MORE than cash paid this period.' },
    act: { increase:'Cash left before Net Income recorded the expense. Subtract the increase.', decrease:'Net Income was reduced by expense paid for earlier. Add the decrease.' },
    wrongSign: { increase:['M11','Paying in advance moved cash out now, but the expense will reach Net Income later. Cash is behind Net Income here, so subtract the increase.'], decrease:['M11','Using up a prepaid puts expense into Net Income without a current cash payment. Add the decrease.'] },
    assumption:'Assume prepaid changes come from ordinary prepayments and their later use.',
    story:{ increase:'Beacon pays $600 for future insurance; only $400 is used by year-end.', decrease:'Beacon started with $500 prepaid, paid $300 more, and used $600 of coverage.' }
  },
  inventory: {
    label:'Inventory', short:'Inventory', kind:'asset', territory:'current_assets', side:'expense', order:'cash_first',
    meaning: { increase:'Beacon holds more unsold goods than before.', decrease:'Beacon sold more goods than it replaced.' },
    connect: { increase:'Cash (or credit) was tied up in goods whose cost has not reached Net Income yet.', decrease:'Cost of Goods Sold in Net Income includes goods paid for in an earlier period.' },
    act: { increase:'Cash has been tied up in inventory that has not yet reached expense. Subtract the increase.', decrease:'Net Income was reduced by COGS whose cash left earlier. Add the decrease.' },
    wrongSign: { increase:['M12','Buying inventory is not an expense yet; it becomes Cost of Goods Sold when sold. Until then, the working-capital adjustment treats the increase as cash tied up. Subtract.'], decrease:['M12','Inventory fell because old goods were sold. COGS reduced Net Income, but that cash left earlier. Add the decrease.'] },
    assumption:'Assume inventory changes come from ordinary purchases and sales. If goods were bought on credit, the A/P adjustment offsets the unpaid part.',
    story:{ increase:'Beacon buys $100 of inventory for cash and sells none of it by period-end.', decrease:'Beacon sells $60 of inventory bought last period and buys no replacement.' }
  }
};

// Reusable "what does it mean" option pool so distractors come from other accounts (diagnoses M08/M09).
export const MEANING_POOL = [
  { concept:'accounts_receivable', direction:'increase', text:'Customers owe us more.' }, { concept:'accounts_receivable', direction:'decrease', text:'Customers owe us less.' },
  { concept:'accounts_payable', direction:'increase', text:'We owe suppliers more.' }, { concept:'accounts_payable', direction:'decrease', text:'We owe suppliers less.' },
  { concept:'unearned_revenue', direction:'increase', text:'Customers paid us for more work we have not done yet.' }, { concept:'unearned_revenue', direction:'decrease', text:'We finished more work customers had already paid for.' },
  { concept:'prepaid_expenses', direction:'increase', text:'We paid for more future benefit in advance.' }, { concept:'prepaid_expenses', direction:'decrease', text:'We used up benefit we had paid for earlier.' },
  { concept:'inventory', direction:'increase', text:'We hold more unsold goods.' }, { concept:'inventory', direction:'decrease', text:'We sold more goods than we replaced.' },
  { concept:'accrued_liabilities', direction:'increase', text:'We owe more for expenses already incurred but unpaid.' }, { concept:'accrued_liabilities', direction:'decrease', text:'We paid down expenses incurred earlier.' },
  { concept:'cash', direction:'increase', text:'Cash itself went up.' }
];

export const CONCEPTS = {
  cash_change: { label:'The Cash Mystery', section:'foundation', skills:['reconcile'] },
  three_sections: { label:'The Three Sections', section:'foundation', skills:['classify_section','place_line'] },
  indirect_bridge: { label:'Why Net Income Is Not Cash', section:'foundation', skills:['recognition_cash_connect','adjustment_direction'] },
  accounts_receivable: { label:'Accounts Receivable', section:'operating', family:'timing', skills:['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  accounts_payable: { label:'Accounts Payable', section:'operating', family:'timing', skills:['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  accrued_liabilities: { label:'Accrued Liabilities', section:'operating', family:'timing', skills:['compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  unearned_revenue: { label:'Unearned Revenue', section:'operating', family:'timing', skills:['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  prepaid_expenses: { label:'Prepaid Expenses', section:'operating', family:'timing', skills:['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  inventory: { label:'Inventory', section:'operating', family:'timing', skills:['locate','compute_change','interpret','recognition_cash_connect','adjustment_direction','place_line'] },
  timing_matrix: { label:'Timing Connections', section:'operating', family:'timing', skills:['interpret','classify_section'] },
  depreciation: { label:'Noncash Items', section:'operating', family:'noncash', skills:['locate','recognition_cash_connect','adjustment_direction','place_line'] },
  gain_loss: { label:'Gains & Losses', section:'operating', family:'gain_loss', skills:['derive_actual_cash','adjustment_direction','place_line','classify_section'] },
  investing: { label:'Investing', section:'investing', family:'actual_cash', skills:['locate','classify_section','derive_actual_cash','place_line'] },
  financing: { label:'Financing', section:'financing', family:'actual_cash', skills:['locate','classify_section','derive_actual_cash','place_line'] },
  noncash_investing_financing: { label:'Noncash Deals', section:'financing', family:'actual_cash', skills:['classify_section'] },
  full_statement: { label:'Complete Statement', section:'capstone', family:'reconciliation', skills:['integrated','total_section','reconcile'] }
};

// Hint chain for timing accounts, ordered WHERE -> SEE -> INTERPRET -> CONNECT -> ACT.
export function timingHints(concept, dir, term){
  const c = TIMING[concept]; const where = c.territory === 'current_assets' ? 'Current Assets' : 'Current Liabilities';
  return [
    `WHERE: Look in ${where} on the comparative Balance Sheet for ${term(c.label)}.`,
    `SEE: Compare the ending balance with the beginning balance. Ending − Beginning = change.`,
    `INTERPRET: ${c.meaning[dir]}`,
    `CONNECT: ${c.connect[dir]}`,
    `ACT: ${c.act[dir]}`
  ];
}

export function applyTerm(cfg){ const t = (cfg && cfg.terminology && cfg.terminology.unearnedRevenue) || 'Unearned Revenue'; return (label) => label.replace('Unearned Revenue', t); }
