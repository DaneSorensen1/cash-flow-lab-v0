# Content Guide — extending Cash Flow Lab

## Taxonomy (every problem carries this metadata)
`section` foundation | operating | investing | financing | capstone · `family` purpose | classification | timing | noncash | gain_loss | actual_cash | reconciliation · `concept` (see `CONCEPTS` in `js/curriculum/concepts.js`) · `skill` locate, compute_change, interpret, recognition_cash_connect, adjustment_direction, adjustment_amount, classify_section, derive_actual_cash, place_line, total_section, reconcile, explain, integrated · `scaffoldLevel` 0–5 · `tier` 1–4 · `direction` increase | decrease | gain | loss | inflow | outflow | none · `sourceComplexity` isolated | statement_fragment | highlighted_full_statement | full_statement.

## Problem object (what every generator returns)
```js
{ id, seed, concept, section, family, tier, scaffoldLevel, direction, sourceComplexity,
  title, instruction?, assumption?,
  source: { story? | facts? | incomeStatement? | balanceSheet? (rows: {concept,label,group,begin,end,focus}) | supplemental? , highlight?, note? },
  steps: [ { skill, type: 'choice'|'multi'|'direction_amount'|'number'|'place', prompt,
             options?: [{ text, correct, m /*misconception code*/, fb /*targeted feedback*/ }],
             expected?, wrong?: { [value]: [code, feedback] }, fallback?, line?, correct?: section, fb?: { section: [code, feedback] } } ],
  line: { label, amount, section } | null, secondLine?, hints: [WHERE, SEE, INTERPRET, CONNECT, ACT], explain }
```
The UI validates against the same object the tests check, so a content error fails `npm test`.

## Adding a timing account
1. Add an entry to `TIMING` in `concepts.js`: label, kind (asset|liability), territory, side, order, `meaning`/`connect`/`act` for both directions, `wrongSign` codes + feedback, `assumption`, `story`.
2. Add it to `OPERATING_CURRENT_ASSETS` or `..._LIABILITIES` in `accounting.js` and to `MEANING_POOL`.
3. Add a module in `modules.js` (header + story teach + L1/L2/L3 problems + explain milestone) and list the concept in `CONCEPTS` and `PRACTICE_CONCEPTS`.
4. Add a row to `contextRows()` in `generators.js` so it appears on statement fragments.
5. Run tests; add a case to `tests/accounting.test.mjs`.

## Adding a problem screen to a module
`{ type:'problem', gen:'timing'|'noncash'|'gainloss'|'classify'|'actualcash'|'scan'|'matrix'|'miniop', params:{...} }` — seeds derive from student + module + screen, so every student gets different numbers but the same structure, reproducible from the attempt log.

## Feedback rules
- Never "Incorrect, try again." Every distractor has a misconception code (M01–M30 in `MISCONCEPTIONS`) and a sentence that names the mistake and gives the reasoning, not just the answer.
- On a miss the runner shows the feedback plus the previous step's question ("Step back"), so remediation moves backward through the chain.
- Correct feedback is one sentence; the full reasoning is in `explain` and shown at the last step.
- Language: "revenue recognized", "cash collected from customers", "the account increased by", "actual cash proceeds". Never "move the gain to Investing"; the gain is removed from Operating and the proceeds go in Investing.

## Numeric rules
Multiples of $100 in learning problems (changes $100–$900), nonnegative balances, no decimals. Capstone figures hand-calculable. Generators use `mulberry32(hashSeed(...))` only; no `Math.random` in content.

## Misconception codes
M01 NI = cash · M02 balance not change · M03 reversed change · M04 A/R up = cash up · M05 A/R down subtract · M06 A/P up = cash paid · M07 A/P down add · M08 A/R vs Unearned · M09 A/P vs Prepaid · M10 Unearned already earned · M11 Prepaid as expense · M12 Inventory as expense · M13 Inventory/A/P offset · M14 shortcut on non-operating · M15 adjusts Cash · M16 depreciation as cash · M17 gain added · M18 loss subtracted · M19 gain as proceeds · M20 book value as proceeds · M21 PPE change as cash · M22 borrowing as revenue · M23 repayment as expense · M24 stock as revenue · M25 dividends as expense · M26 noncash deal as cash flow · M27 wrong section · M28 change vs balance · M29 double count · M30 omitted supplemental item.

## Complete A/R example
`timingProblem({ concept:'accounts_receivable', direction:'increase', scaffoldLevel:1, seed:1 })` yields: locate (6 territories) → compute_change (Increased/Decreased + amount; M02/M03 feedback) → interpret (4 meanings from the pool; wrong ones map to M03/M08) → recognition_cash_connect (correct vs reversed vs "same", M04/M01) → adjustment_direction (Add/Subtract/No adjustment, M04/M01) → place_line (Operating; M27 elsewhere), with `line = { label:'Increase in Accounts Receivable', amount:-change, section:'operating' }` and five hints.
