import { test } from 'node:test'; import assert from 'node:assert/strict';
import * as A from '../js/accounting.js';
test('change and direction', () => { assert.equal(A.computeChange(200,500), 300); assert.equal(A.direction(-50), 'decrease'); assert.equal(A.direction(0), 'none'); });
test('working-capital adjustment directions', () => {
  assert.equal(A.workingCapitalAdjustment('accounts_receivable', 300), -300); assert.equal(A.workingCapitalAdjustment('accounts_receivable', -200), 200);
  assert.equal(A.workingCapitalAdjustment('inventory', 100), -100); assert.equal(A.workingCapitalAdjustment('prepaid_expenses', -200), 200);
  assert.equal(A.workingCapitalAdjustment('accounts_payable', 300), 300); assert.equal(A.workingCapitalAdjustment('accrued_liabilities', 100), 100); assert.equal(A.workingCapitalAdjustment('unearned_revenue', -200), -200);
  assert.throws(() => A.workingCapitalAdjustment('cash', 100)); assert.throws(() => A.workingCapitalAdjustment('notes_payable', 100)); });
test('depreciation add-back', () => { assert.equal(A.noncashAddBack(400), 400); assert.equal(A.noncashAddBack(-400), 400); });
test('gain/loss math and proceeds distinction', () => { const g = A.saleOfPPE({ cost:100, accumulatedDepreciation:40, proceeds:80 }); assert.equal(g.bookValue, 60); assert.equal(g.gainLoss, 20); assert.equal(g.kind, 'gain'); assert.equal(g.operatingAdjustment, -20); assert.equal(g.investingAmount, 80);
  const l = A.saleOfPPE({ cost:100, accumulatedDepreciation:40, proceeds:50 }); assert.equal(l.kind, 'loss'); assert.equal(l.operatingAdjustment, 10); assert.equal(l.investingAmount, 50); assert.equal(A.gainLossAdjustment('gain', 20), -20); assert.equal(A.gainLossAdjustment('loss', 10), 10); });
test('investing/financing classification and noncash exclusion', () => { assert.equal(A.classifyEvent('buy_ppe'), 'investing'); assert.equal(A.classifyEvent('sell_ppe'), 'investing'); assert.equal(A.classifyEvent('borrow'), 'financing'); assert.equal(A.classifyEvent('repay_principal'), 'financing'); assert.equal(A.classifyEvent('issue_stock'), 'financing'); assert.equal(A.classifyEvent('pay_dividends'), 'financing'); assert.equal(A.classifyEvent('noncash_note_for_equipment'), 'noncash'); assert.equal(A.classifyEvent('pay_interest'), 'operating'); assert.throws(() => A.classifyEvent('nope')); });
test('cash change and reconciliation', () => { assert.equal(A.cashChange(2600,-1200,2500), 3900); assert.equal(A.reconcileCash(5000, 3900), 8900); });
