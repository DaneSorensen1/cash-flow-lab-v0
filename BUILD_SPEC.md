# Cash Flow Lab
## Authoritative Learning, UX, Product, and Implementation Specification

**Status:** Build-ready specification  
**Audience:** Coding agent / product engineer implementing a classroom-ready Statement of Cash Flows learning application  
**Primary student audience:** High-school Advanced Accounting students who are new to the Statement of Cash Flows and currently find the topic confusing  
**Primary instructional scope:** Statement of Cash Flows, indirect method, U.S. GAAP introductory-course conventions  
**Expected first-use class period:** Approximately 90 minutes, with progress saved for later continuation  
**Deployment target:** Static GitHub Pages application with optional Firebase/Firestore class sync, no required server, no required AI API, no build step required for production  
**Working title:** `Cash Flow Lab` (make the displayed title configurable)

---

# 0. How to use this document

This file is the authoritative specification for the new application.

The accompanying **Journal Entry Arena** source is a **reference implementation for proven infrastructure and selected interaction ideas only**. It must **not** determine the learning sequence, visual structure, problem architecture, or UX of Cash Flow Lab when doing so would conflict with this specification.

Priority when making implementation decisions:

1. **Student understanding and conceptual coherence**
2. **Accounting correctness**
3. **A smooth, low-confusion learning progression**
4. **Clear diagnostic feedback and remediation**
5. **Reliable classroom operation**
6. **Ease of deployment and maintenance**
7. **Reuse of the old application's infrastructure**
8. **Cosmetic similarity to the old application**

If the legacy app and this specification disagree, **this specification wins**.

The coding agent should read this document fully before making architectural choices. It should then inspect the legacy source for reusable patterns such as Firebase sync, local persistence, class joining, adaptive selection, focus practice, dashboards, and GitHub Pages deployment.

Do not ask the teacher to make minor product decisions that can be resolved sensibly from this specification. Choose the option that most strongly supports a confused first-time learner, document the choice, build it, test it, and continue.

---

# 1. Executive vision

Cash Flow Lab should teach a student to **see the cash story underneath accrual accounting**.

The application must not primarily train memorized rules such as:

- “A/R increase = subtract.”
- “Inventory increase = subtract.”
- “A/P increase = add.”
- “Depreciation = add back.”

A student can memorize all of those and still have almost no useful mental model of a Statement of Cash Flows.

The desired outcome is a student who can look at financial information and reason:

> **What did accrual accounting record? What actually happened to cash? Why are those different? What information reveals the difference? What adjustment or cash flow follows? Where does it belong on the Statement of Cash Flows?**

By the end of the experience, the student should be able to construct a complete Statement of Cash Flows using the indirect method and explain the logic behind the major lines.

The product should create a progression from:

> “I have no idea what I am looking at.”

to:

> “I know where to look.”

to:

> “I know what this change means.”

to:

> “I can derive the adjustment.”

to:

> “I can build the entire statement systematically.”

The application is therefore part **interactive lesson**, part **guided financial-statement workbench**, part **adaptive practice system**, and part **diagnostic tool**.

It should feel more like learning to solve a coherent puzzle than taking a conventional multiple-choice quiz.

---

# 2. The instructional north star

The Statement of Cash Flows answers one large question:

# **Why did Cash change?**

The complete statement divides that answer into three stories:

| Section | Student-facing question |
|---|---|
| **Operating** | How much cash did the normal business actually generate or use? |
| **Investing** | What cash moved because the company bought or sold long-term resources or investments? |
| **Financing** | What cash moved between the company and lenders/owners? |

Those three stories must explain:

> **Beginning Cash + Net Change in Cash = Ending Cash**

The application should keep this destination visible enough that students never spend twenty minutes manipulating account signs while forgetting what problem they are solving.

A recurring visual should show:

**Operating + Investing + Financing = Net Change in Cash**

and, when appropriate:

**Beginning Cash + Net Change in Cash = Ending Cash**

Students should understand very early that the objective is not to “do adjustments” for their own sake. The adjustments exist because **Net Income is an accrual-based starting point, while the Operating section needs a cash-flow number**.

---

# 3. The central operating-section model

For the **indirect method**, Operating begins with Net Income and then fixes three broad reasons Net Income is not the same as operating cash:

1. **Timing differences**
   - Revenue or expense recognition and cash happened at different times.
2. **Noncash items**
   - Something changed Net Income without current cash moving, such as depreciation.
3. **Gains and losses**
   - Net Income contains an effect from a transaction whose actual cash belongs in another section, usually Investing.

This three-family structure is a non-negotiable organizing framework.

Students should repeatedly see:

> **Net Income → Timing + Noncash + Gains/Losses → Operating Cash Flow**

Do not present a long unstructured list of adjustments before students understand these three families.

---

# 4. Learning order is not the same as construction order

The product must distinguish two separate ideas.

## 4.1 Learning order

The order that best develops understanding can begin with very obvious cash movements, establish the purpose of the statement, then tackle the difficult Operating reconciliation carefully.

Recommended conceptual progression:

1. Why the Statement of Cash Flows exists
2. The three sections
3. A few obvious Investing/Financing cash movements
4. Why Net Income and operating cash differ
5. Operating timing differences
6. Operating noncash items
7. Operating gains/losses
8. Investing in greater depth
9. Financing in greater depth
10. Noncash investing/financing boundary cases
11. Complete-statement construction

## 4.2 Construction order

Once students build a real statement, train one consistent workflow:

1. Establish the **change-in-cash target**
2. Build **Operating**
3. Build **Investing**
4. Build **Financing**
5. Reconcile the three sections to the actual cash change
6. Confirm Beginning Cash + Net Change = Ending Cash

Within Operating, use a repeatable source-document scan:

1. Start with Net Income
2. Scan the **Income Statement / supplemental data** for:
   - depreciation/amortization and other noncash items
   - gains/losses
3. Scan the **operating current-asset/current-liability portion of the comparative Balance Sheet** for timing changes
4. Total Operating

Within Investing:

1. Scan long-term asset / investment accounts
2. Use supplemental transaction information to determine **actual cash paid or received**
3. Do not assume a balance-sheet change equals cash flow

Within Financing:

1. Scan debt and equity accounts
2. Use supplemental information to determine **actual cash received or paid**
3. Do not assume every balance change represents cash

The game can teach concepts in one order while training construction in this consistent procedure.

---

# 5. A permanent “where do I look?” map

A major source of confusion is not merely “What rule applies?” It is:

> **What statement am I supposed to look at, and what part of it matters?**

Cash Flow Lab must explicitly teach the territory.

Create a recurring “Statement Territory Map”:

| Information source | What students mainly find there |
|---|---|
| **Income Statement** | Net Income; depreciation/amortization; gains/losses |
| **Comparative Balance Sheet — operating current assets/liabilities** | Timing differences such as A/R, Inventory, Prepaids, A/P, Accrued Liabilities, Unearned Revenue |
| **Comparative Balance Sheet — long-term assets/investments** | Clues for Investing; actual cash often requires supplemental information |
| **Comparative Balance Sheet — debt and equity** | Clues for Financing; actual cash often requires supplemental information |
| **Supplemental Information** | Purchases, sale proceeds, debt issuance/repayment, dividends, noncash transactions, and other facts needed to derive actual cash |
| **Cash account** | The target change to explain; do not treat Cash itself as a working-capital adjustment |

This map should be introduced early, revisited before integrated problems, and accessible from the reference panel.

At the beginning, the app should **zoom/highlight** the relevant area and visually gray out irrelevant sections.

Later, supports fade:

**isolated rows → highlighted full statement → full statement with no highlighting**

This trains a search habit instead of a memorized list.

---

# 6. The recurring learning grammar

Across concepts, use the same reasoning sequence whenever it fits:

# **WHERE → SEE → INTERPRET → CONNECT → ACT → PLACE**

### WHERE
Where should I look?

### SEE
What changed, or what transaction occurred?

### INTERPRET
What does that mean in plain English?

### CONNECT
What does that imply about cash versus what accrual accounting / Net Income recorded?

### ACT
What calculation or adjustment follows?

### PLACE
Where does that amount belong on the Statement of Cash Flows?

This is the application's core learning grammar.

It should appear explicitly during early modules, become compact later, and eventually disappear as a visible scaffold once the student can perform the sequence independently.

The goal is **not** for every question forever to have six prompts. The goal is for those six prompts to become the student's internal thought process.

---

# 7. Language and explanation rules

Use highly consistent language.

Preferred phrases:

- “Revenue **recognized**”
- “Expense **recognized/incurred**”
- “Cash **collected from customers**”
- “Cash **paid**”
- “Beginning balance” and “Ending balance”
- “The account **increased/decreased by** …”
- “Net Income includes …”
- “To convert Net Income toward operating cash, **add/subtract** …”
- “Actual cash proceeds”
- “Actual cash paid”
- “This belongs in Operating / Investing / Financing”
- “Unearned Revenue (also called Deferred Revenue)” when first introduced

Avoid fuzzy language such as:

- “Expense accumulated” if it suggests the company chose when to incur it
- “Move the gain to Investing” — the **gain is removed from Operating; the actual sale proceeds go in Investing**
- “Asset up means cash down” as an unexplained universal law
- “Liability up means cash up” as an unexplained universal law
- “Equipment increased $4,000, so cash outflow was $4,000” without supporting transaction facts
- “Cash flow” when what is meant is “ending cash balance”

When a simplifying assumption is being used, say so visibly:

> **For this learning example, assume this account changed only because of ordinary operating timing.**

Do not quietly imply that an introductory shortcut is universal.

---

# 8. Scope and explicit non-scope for Version 1

## 8.1 Required core scope

### Operating — timing differences
- Accounts Receivable
- Unearned / Deferred Revenue
- Accounts Payable
- Accrued Liabilities
- Prepaid Expenses
- Inventory

### Operating — noncash
- Depreciation
- Amortization may be introduced as the same pattern, even if fewer practice items are used

### Operating — gains/losses
- Gain on sale of PPE
- Loss on sale of PPE

### Investing
- Purchase of equipment/PPE for cash
- Sale of equipment/PPE for cash
- Optional simple long-term investments if enabled by config

### Financing
- Borrowing / issuing debt for cash
- Repayment of debt principal
- Issuing common stock for cash
- Paying dividends

### Boundaries
- Noncash acquisition of long-term assets (e.g. equipment acquired by issuing a note): disclose separately; not a cash flow
- Interest may be omitted from generated problems unless explicitly enabled. If included under U.S. GAAP course conventions, interest paid is Operating and principal is Financing.

## 8.2 Do not require in Version 1 unless explicitly configured

- Foreign-currency effects
- Cash equivalents complexity
- Deferred taxes
- Detailed income-tax reconciliation
- Operating lease standard nuances
- Consolidation/acquisition accounting
- Restricted cash reconciliation
- Direct-method statement preparation
- Complex investment classifications
- Business combinations
- Highly technical GAAP/IFRS classification differences

The app may mention that real-world statements contain additional items, but it must not derail the learning path with them.

---

# 9. The student the product must be designed for

Assume the student:

- understands basic Balance Sheets and Income Statements
- has some familiarity with accrual accounting
- may understand A/R and A/P individually but not how they affect cash flow
- is easily overwhelmed by three statements plus supplemental information
- may confuse balances with flows
- may assume Net Income is “cash earned”
- may memorize signs without understanding why
- may not know where to look
- may have weak confidence in the topic
- may make one conceptual mistake that causes several downstream answers to be wrong

The UX must therefore minimize irrelevant cognitive load.

New complexity should be introduced intentionally.

When a problem teaches one concept, do not make the student simultaneously struggle with unfamiliar terminology, several unrelated accounts, awkward arithmetic, and a dense statement layout.

Difficulty should rise mainly by **removing scaffolding and combining concepts**, not by using ugly numbers.

---

# 10. Product modes

The student app should have four clear modes.

## 10.1 Learn — default first-use experience

A deliberately sequenced interactive lesson.

- Linear enough to build prerequisite knowledge
- Adaptive remediation within modules
- Soft gating rather than trapping students indefinitely
- Progress saves continuously
- Primary button on home: **Continue Learning**

## 10.2 Practice

Available after concepts are introduced.

- Mixed practice
- Adaptive weighting toward weak concepts/skills
- Focus practice on a chosen concept
- Spaced retries of mistakes
- Can be used after the first 90-minute lesson

## 10.3 Build a Statement

Capstone area.

- Guided full statement
- Less-guided full statement
- Independent full statement when unlocked
- Students can replay completed capstones

## 10.4 Reference

A concise, visual reference system:

- Statement Territory Map
- Three Operating families
- Timing 2×2 conceptual matrix
- Rules students have already derived
- Construction checklist
- Glossary

Reference must be available without losing the current problem.

---

# 11. Home / progress experience

After joining, the student should not land in a random question stream.

The home/progress page should make the learning journey visible.

Suggested hierarchy:

**FOUNDATION**
- The Cash Mystery
- The Three Sections
- Why Net Income Is Not Cash

**OPERATING**
- Timing Differences
  - Accounts Receivable
  - Accounts Payable & Accrued Liabilities
  - Unearned / Deferred Revenue
  - Prepaid Expenses
  - Inventory
  - Timing Connections
- Noncash Items
- Gains & Losses

**INVESTING**
- Actual cash from long-term assets

**FINANCING**
- Actual cash from lenders and owners

**BUILD**
- Guided Complete Statement
- Integrated Complete Statement

Each node should have a state such as:

- Not started
- Learning
- Practicing
- Secure
- Mastered

Do not lead with raw percentages for novices.

A student should be able to tap a completed or weak node later to practice it.

The primary home action should always be obvious:

> **Continue Learning**

Secondary actions:

> Practice weak areas  
> Build a statement  
> Reference  
> My progress

---

# 12. “What / Why / How I know” module header

Every new concept/module should begin with three very short lines.

Example for Accounts Receivable:

**What you’re learning:** What a change in Accounts Receivable tells us about cash collected versus revenue recognized.  
**Why it matters:** Net Income can count revenue before customers pay.  
**You’ll know you’ve got it when:** You can derive the cash-flow adjustment from the A/R change without relying on a memorized sign rule.

This should take only a few seconds to read.

It creates purpose before procedure and should be reused across the curriculum.

---

# 13. Core UX philosophy

## 13.1 Use accounting-native visuals

The visual language should be:

- miniature Income Statements
- comparative Balance Sheets
- Statement of Cash Flows rows
- highlighted statement regions
- simple timelines showing recognition and cash events
- arrows representing the reconciliation from Net Income to cash

Do **not** fill the app with generic business stock imagery.

The accounting documents themselves are the visual content.

## 13.2 Always distinguish balances from changes

Whenever a comparative account is shown:

| Account | Beginning | Ending | Change |
|---|---:|---:|---:|

The change should not appear automatically on the first independent attempt if calculating it is part of the skill.

Once entered correctly, visually reveal:

> **A/R increased $300**

Students must become fluent in the difference between a balance and a period-over-period change.

## 13.3 Keep source documents and destination connected

Whenever possible, show:

**source financial information → reasoning → cash-flow statement line**

The student should see where a number came from and where it goes.

## 13.4 Progressive disclosure

Do not show all data at once unless the student has reached that level.

Examples:

- Early A/R: only A/R beginning/end and a tiny revenue/cash story
- Later A/R: full current-asset section with A/R highlighted
- Later still: full Balance Sheet without highlight
- Capstone: comparative Balance Sheet + Income Statement + supplemental information

## 13.5 Never require drag-and-drop

Drag-and-drop may be offered as an enhancement on large screens, but all tasks must be completable by tap/click/keyboard.

On mobile, “select line → select destination” is more reliable than dragging.

## 13.6 No speed pressure

Do not rank students by speed.

Time may be collected privately for diagnostics, but the interface should not create a countdown unless a teacher explicitly enables an assessment mode.

---

# 14. Responsive workbench design

## Desktop / Chromebook target

For screens roughly 980px and wider, use a three-zone workbench:

```
┌─────────────────────┬──────────────────────┬─────────────────────┐
│ SOURCE DOCUMENTS    │ REASONING / TASK     │ CASH FLOW STATEMENT │
│                     │                      │                     │
│ Income Statement    │ WHERE                │ Operating           │
│ Balance Sheet       │ SEE                  │   Net Income        │
│ Supplemental Info   │ INTERPRET            │   A/R ..........    │
│                     │ CONNECT              │                     │
│ highlighted rows    │ ACT                  │ Investing           │
│                     │ PLACE                │ Financing           │
└─────────────────────┴──────────────────────┴─────────────────────┘
```

The exact proportions can vary. The principle is side-by-side source and destination.

## Tablet

Use two columns:

- source documents
- task + statement builder

or a compact document tab system.

## Mobile

Use a single-column experience with persistent access to all three pieces:

- top: compact module/progress bar
- source card
- reasoning task
- sticky action area
- **View Statement** button opens a bottom sheet/drawer containing the current SCF build

Do not force horizontal scrolling for primary interaction.

Tables may scroll horizontally only when unavoidable in full comparative statements.

---

# 15. First-run instructional journey overview

The Learn mode should use a deliberate sequence.

Approximate pacing is for design guidance only. Do not display a timer.

| Approximate range | Learning experience |
|---|---|
| 0–7 min | The cash-change mystery and three sections |
| 7–12 min | Obvious Investing/Financing cash classification |
| 12–20 min | Why Net Income differs from operating cash |
| 20–50 min | Operating timing differences |
| 50–58 min | Timing compression and interacting accounts |
| 58–65 min | Noncash items |
| 65–73 min | Gains/losses |
| 73–80 min | Investing and Financing from statements/supplemental info |
| 80–90+ min | Guided complete statement, then independent/integrated statement as time allows |

Students who need more time should continue later. Progress must save exactly.

Do not sacrifice understanding merely to fit an arbitrary 90-minute completion target.



---

# 16. Detailed learning sequence

This section is deliberately specific. It describes what students should experience, not merely what accounting topics should exist.

## 16.1 Module F1 — The Cash Mystery

### Purpose

Give the entire unit a destination before introducing rules.

### Opening screen

Use one continuing tutorial company for the guided first run. Recommended:

> **Beacon Bike & Repair**

It is useful because it can plausibly:
- provide services
- sell merchandise
- hold inventory
- bill customers
- accept deposits
- prepay insurance
- owe suppliers
- own equipment
- borrow money
- issue stock

Opening visual:

**Beginning Cash:** $10,000  
**Ending Cash:** $13,000

Ask:

> Cash increased by how much?

Student enters/selects **$3,000**.

Then reveal:

> **Our mission: explain the $3,000 increase.**

Show three empty containers:

**Operating + Investing + Financing = +$3,000**

No account-adjustment rules yet.

### Desired student takeaway

> “The Statement of Cash Flows explains why cash changed.”

### Common misconception to diagnose

- Student thinks the statement is trying to calculate Net Income
- Student confuses ending Cash with change in Cash

### Remediation

Use a simple number line:

$10,000 → $13,000 = **+$3,000 movement**

Then say:

> We already know where Cash ended. We are explaining what made it move there.

---

## 16.2 Module F2 — The Three Sections

### Purpose

Make the broad categories feel obvious before Operating becomes technical.

Present one simple cash event at a time.

Examples:

1. Bank lends Beacon $5,000.
2. Beacon buys equipment for $2,000 cash.
3. Beacon receives $3,000 from owners for stock.
4. Beacon receives cash from customers for repairs.
5. Beacon pays employees for normal work.

Ask:

> Why did cash move?

Use three large choices:

- Operating
- Investing
- Financing

After each answer, show a one-sentence explanation.

Preferred category descriptions:

**Operating:** cash connected to normal business activity  
**Investing:** cash connected to long-term assets/investments  
**Financing:** cash connected to lenders and owners

### Important note

Do not over-teach edge cases here.

The point is merely to create the three-bucket mental map.

### Placement interaction

After 3–5 classifications, show the outline of the real statement:

```
Cash Flows from Operating Activities
Cash Flows from Investing Activities
Cash Flows from Financing Activities
Net Increase/Decrease in Cash
```

Students tap where each event belongs.

---

## 16.3 Module F3 — Why Operating Is Different

### Purpose

Students must understand why the indirect method needs adjustments before they see the adjustment rules.

### First derivation should be extremely simple

Do **not** begin with multiple expenses.

Use:

Beacon earns **$1,000** of repair revenue this month.

Customers pay **$700** this month.

The remaining **$300** is still owed.

Tiny visual:

**Income Statement**

Revenue ............ $1,000  
Net Income ........ $1,000

**Cash from customers**

Collected .......... $700

Ask:

> Are Net Income and operating cash the same here?

No.

Ask:

> What made them different?

Desired concept:

> We recognized $1,000 of revenue, but only collected $700 cash.

Then show:

**Accounts Receivable increased $300.**

Only now connect:

> That $300 is the part Net Income counted but cash has not collected yet.

Therefore:

**$1,000 Net Income − $300 = $700 operating cash**

### Critical wording

Say:

> The indirect method starts with Net Income and **adjusts it until it represents operating cash**.

Also say:

> We are not changing the Income Statement. This is a separate reconciliation.

### Direct-method clarification

It is acceptable to show the $700 cash collection directly as a teaching lens.

Explicitly label:

> **Teaching lens:** If we had every cash receipt and payment, we could count them directly. The required indirect method instead starts with Net Income and uses financial-statement changes to reconcile toward cash.

Do not turn this into a direct-method unit.

### Desired student takeaway

> “Net Income can include revenue or expenses before or after cash moves. The adjustments fix that.”

---

# 17. Operating Family 1 — Timing Differences

Timing differences deserve the largest share of guided instruction.

The most important conceptual structure is not a list of six signs.

It is a **recognition-versus-cash timing map**.

Eventually students should see this symmetry:

| | Recognition first, cash later | Cash first, recognition later |
|---|---|---|
| **Revenue side** | Accounts Receivable | Unearned / Deferred Revenue |
| **Expense/cost side** | Accounts Payable / Accrued Liabilities | Prepaids / Inventory-type cash commitment |

This matrix should be **earned gradually** rather than dumped on students at the beginning.

Teach individual stories first, then reveal the pattern.

---

# 18. Accounts Receivable module

## 18.1 What / Why / Know

**What you’re learning:** What a change in Accounts Receivable tells us about cash collected versus revenue recognized.

**Why it matters:** Net Income can count revenue before customers pay.

**You’ll know you’ve got it when:** You can look at beginning and ending A/R and derive the cash-flow adjustment without memorizing “asset up = subtract.”

---

## 18.2 Story phase

Start with the exact economic story:

Beacon performs $1,000 of repair work.

It collects $700.

It is still owed $300.

Timeline:

**Work performed / revenue recognized** → **A/R exists** → **cash collected later**

Show:

Revenue recognized: $1,000  
Cash collected: $700  
Uncollected: $300

Then reveal:

A/R increased $300.

Ask students to connect the pieces.

Do **not** tell them the sign rule first.

---

## 18.3 Comparative-statement phase

Now transition to how real indirect-method problems usually look.

Show:

| Accounts Receivable | Beginning | Ending |
|---|---:|---:|
| A/R | $200 | $500 |

Question sequence:

### WHERE
Highlight **Current Assets → Accounts Receivable**.

### SEE
> Did A/R increase or decrease, and by how much?

Correct:

> Increased $300.

### INTERPRET
> What does that mean in plain English?

Correct family of answer:

> Customers owe Beacon $300 more than before.

### CONNECT
> If customers owe more, did current cash collections keep up with the revenue Net Income recognized?

Correct:

> No. Cash collections were lower than recognized revenue, all else equal.

### ACT
> Net Income therefore contains revenue that has not yet become cash. What should we do with the $300?

Correct:

> Subtract $300.

### PLACE
Student places:

> **Increase in Accounts Receivable ........ $(300)**

inside Operating under the indirect reconciliation.

---

## 18.4 Reverse-direction A/R

Show:

Beginning A/R: $500  
Ending A/R: $300

A/R decreased $200.

Reasoning:

- Customers owe $200 less.
- The company collected some cash related to revenue recognized in an earlier period.
- Under the simplified ordinary-operating assumption, cash collected exceeded current-period revenue by $200.
- Net Income does not include that prior-period revenue again.
- Add the $200 decrease when reconciling to current operating cash.

Place:

> **Decrease in Accounts Receivable ........ $200**

### Important instructional note

A/R decrease can feel counterintuitive because students may ask:

> “How can cash collected be greater than this period’s revenue?”

Use one tiny previous-period receivable example if needed.

Do not introduce write-offs, factoring, acquisitions, or other advanced A/R causes during the core module.

Label the assumption:

> **For these introductory cash-flow problems, assume A/R changes come from ordinary customer billing and collection unless supplemental information says otherwise.**

---

## 18.5 What not to train

Do not teach students to numerically “compare A/R to Revenue” as a formula.

Revenue may be used in the **story phase** to make the concept concrete.

For the actual indirect adjustment, students should learn:

> **Use the period-over-period change in A/R.**

---

## 18.6 A/R mastery evidence

A/R is not “mastered” merely because a student selected “subtract” once.

Require evidence across:

- locate A/R
- calculate change
- explain “customers owe more/less”
- connect to cash collections vs recognized revenue
- determine add/subtract
- calculate amount
- place on Operating section
- solve both increase and decrease directions
- solve at least one mixed problem where A/R is not visually isolated

---

# 19. Accounts Payable and Accrued Liabilities module

## 19.1 What / Why / Know

**What you’re learning:** How expenses/costs can affect Net Income before the related cash is paid.

**Why it matters:** Net Income can fall even though the company has not paid all of the cash yet.

**You’ll know you’ve got it when:** You can use a payable/liability change to determine whether cash payments were greater or less than the operating cost recognized.

---

## 19.2 A/P story phase

Use one simple operating expense:

Beacon incurs **$500** of utility expense.

It pays **$300**.

It still owes **$200**.

Tiny visual:

Expense recognized: $500  
Cash paid: $300  
Still owed: $200

A/P increases $200.

Ask:

> Net Income was reduced by $500. How much cash actually left?

$300.

Therefore Net Income is **$200 lower** than the corresponding cash-flow effect.

To reconcile Net Income toward cash:

> **Add $200.**

Timeline:

**Expense incurred / recognized** → **A/P exists** → **cash paid later**

---

## 19.3 Comparative-statement phase

| Accounts Payable | Beginning | Ending |
|---|---:|---:|
| A/P | $600 | $900 |

A/P increased $300.

Reasoning:

- Beacon owes suppliers more.
- More operating cost was recognized/acquired than was paid in cash.
- Net Income has already felt costs for which cash has not yet left.
- Add the increase.

Place:

> **Increase in Accounts Payable ........ $300**

---

## 19.4 Reverse A/P

A/P decreases.

Interpretation:

- Company owes less.
- It paid down amounts that had been recognized as costs/expenses earlier.
- Current cash paid can exceed current expense/cost recognition.
- Subtract the decrease.

---

## 19.5 Accrued liabilities

Introduce accrued liabilities as a **close cousin**, not an unrelated sign rule.

Example:

Employees earn $400 of wages.

Only $300 is paid by year-end.

Accrued Wages Payable increases $100.

Same logic:

- Expense recognized now
- Cash paid later
- Liability increase means some expense reduced Net Income without current cash payment
- Add increase

Explicitly distinguish terminology:

> Accounts Payable usually comes from supplier/vendor bills.  
> Accrued liabilities often arise because an expense has been incurred even before a formal bill/payment occurs.

For cash-flow adjustment logic, both belong to the “expense first, cash later” family.

---

## 19.6 A/P + accrued mastery evidence

Require:

- both directions of A/P
- at least one accrued-wage or accrued-expense example
- student can explain why liability increase is added
- student can distinguish “we owe more” from “cash increased”
- one mixed current-liability scan

---

# 20. First timing connection reveal

After A/R and A/P, pause.

Show a side-by-side mirror:

### Revenue first, cash later
A/R

### Expense first, cash later
A/P / Accrued Liabilities

Ask:

> What is the common idea?

Desired answer:

> Accrual accounting recognized something before the corresponding cash event finished.

Then show the different effect:

- A/R increase: Net Income is ahead of cash → subtract
- A/P increase: expense reduction to Net Income is ahead of cash payment → add

This is the first deliberate compression.

Do not yet show the full asset/liability sign table as a shortcut.

---

# 21. Unearned / Deferred Revenue module

## 21.1 What / Why / Know

**What you’re learning:** What happens when customer cash arrives before revenue is earned.

**Why it matters:** Operating cash can arrive before Net Income recognizes the revenue.

**You’ll know you’ve got it when:** You can derive the adjustment from a change in Unearned/Deferred Revenue.

---

## 21.2 Story phase

Beacon receives **$600** in customer deposits for repair work.

By year-end it has earned only **$400** of that amount.

$200 remains unearned.

Visual timeline:

**Cash received first** → **Unearned Revenue liability** → **work performed / revenue recognized later**

Current-period facts:

Cash received: $600  
Revenue recognized: $400  
Cash is ahead by: $200

Unearned Revenue increases $200.

Therefore:

> Cash exceeds the revenue effect in Net Income by $200.

Indirect adjustment:

> **Add $200.**

---

## 21.3 Reverse direction

If Unearned Revenue decreases $200:

- The company earned revenue this period that had been paid for in an earlier period.
- Net Income contains revenue without equivalent current cash collection.
- Subtract the decrease.

---

## 21.4 Naming

Config setting must allow teacher preference:

- “Unearned Revenue”
- “Deferred Revenue”

First introduction should say:

> **Unearned Revenue (also called Deferred Revenue)**

Thereafter use the configured preferred term.

---

# 22. Prepaid Expenses module

## 22.1 What / Why / Know

**What you’re learning:** What happens when the company pays cash before an expense is recognized.

**Why it matters:** Cash can leave before Net Income records the expense.

**You’ll know you’ve got it when:** You can reason from a prepaid change to the operating adjustment.

---

## 22.2 Story phase

Beacon pays **$600** for future insurance.

Only **$400** has been used by year-end.

$200 remains prepaid.

Visual timeline:

**Cash paid first** → **Prepaid asset** → **expense recognized later as benefit is used**

Current-period:

Cash paid: $600  
Expense recognized: $400  
Cash outflow is greater by: $200

Prepaid increases $200.

Therefore:

> Net Income has not yet reflected $200 of cash that already left.

Subtract $200.

---

## 22.3 Reverse direction

Prepaid decreases $200:

- Some current expense came from an asset paid for earlier.
- Net Income is reduced by expense without equivalent current cash outflow.
- Add the decrease.

---

# 23. Second timing connection reveal

After Unearned Revenue and Prepaids, reveal the “cash first” mirror:

### Customer cash first, revenue later
Unearned / Deferred Revenue

### Company cash first, expense later
Prepaid Expenses

Then reveal the full four-cell conceptual map:

| | Recognition first | Cash first |
|---|---|---|
| **Revenue** | Accounts Receivable | Unearned / Deferred Revenue |
| **Expense/cost** | A/P / Accrued Liabilities | Prepaid Expenses |

Ask students to classify small stories into one of the four cells.

This is a conceptual sorting activity, not merely add/subtract practice.

---

# 24. Inventory module

Inventory deserves more care than “current asset increase = subtract.”

## 24.1 What / Why / Know

**What you’re learning:** Why inventory can use cash before its cost reaches Net Income.

**Why it matters:** Buying goods and recognizing Cost of Goods Sold can occur in different periods.

**You’ll know you’ve got it when:** You can explain why an inventory increase is an operating use-of-cash adjustment and understand how A/P can offset a purchase made on credit.

---

## 24.2 Simplest story first

Explicitly assume a cash purchase.

Beacon buys **$100 of inventory for cash** and sells none of it by period-end.

What happened?

Cash: −$100  
Inventory: +$100  
Expense/COGS: $0

Net Income has not been reduced by that $100 yet because the inventory is still unsold.

To reconcile Net Income toward operating cash:

> **Subtract the $100 increase in Inventory.**

Preferred phrase:

> “Cash has been tied up in inventory that has not yet reached expense.”

---

## 24.3 Reverse inventory story

Use an intentionally simplified story:

Beacon begins the period with inventory purchased earlier.

During the period, $60 of that old inventory is sold and becomes Cost of Goods Sold.

Assume no replacement purchase for the isolated example.

Inventory decreases $60.

Net Income is reduced by $60 of COGS, but the cash to acquire that inventory left in an earlier period.

Therefore:

> Add the $60 inventory decrease when reconciling current Net Income toward current operating cash.

This is only an isolated teaching story. Later mixed problems show purchases and sales interacting.

---

## 24.4 Comparative-statement phase

Show beginning/end Inventory.

Teach the standard introductory working-capital adjustment:

- Inventory increase → subtract
- Inventory decrease → add

But make clear this is a compressed result of the timing logic.

---

## 24.5 Crucial interaction: Inventory + A/P

This should be a planned “aha” moment **after** Inventory and A/P each make sense independently.

Scenario:

Beacon buys $100 of inventory **on account**.

Inventory +$100  
A/P +$100  
Cash $0  
Expense $0

Indirect adjustments:

Inventory increase: −$100  
A/P increase: +$100

Net effect: $0

Ask:

> Is that what should happen if no cash moved?

Yes.

Then explain:

> Inventory and A/P are not double counting. They describe two different pieces of the same timing story. The adjustments combine to reconstruct the actual cash effect.

This interaction is highly valuable and should be preserved.

---

## 24.6 Important nuance

Do not state:

> “Inventory increased, therefore the company literally paid that exact amount of cash.”

That can be false if inventory was acquired on credit.

Instead say:

> “Viewed as an operating working-capital adjustment, an inventory increase is a use-of-cash adjustment. If the inventory was acquired without paying cash yet, the related liability adjustment offsets the unpaid portion.”

The beginner module may use cash-purchase assumptions first, but the integrated module must reveal the interaction.

---

# 25. Timing family compression

Only after students have derived the major accounts should the application reveal the familiar shortcut.

## Operating current assets, excluding Cash

- Increase → subtract
- Decrease → add

Common examples:
- A/R
- Inventory
- Prepaids

## Operating current liabilities

- Increase → add
- Decrease → subtract

Common examples:
- A/P
- Accrued Liabilities
- Unearned / Deferred Revenue

Label this explicitly:

> **This is a compression of reasoning you already learned. It is not the underlying reason.**

Before applying the shortcut, ask:

> Is this actually an **operating timing account**?

Do not blindly apply the rule to:
- Cash
- short-term debt principal
- current portion of long-term debt
- non-operating receivables/payables
- other special items unless the problem context establishes them as operating

At this stage, reveal a compact “Working Capital Compass” in the Reference panel.

---

# 26. Operating Family 2 — Noncash items

## 26.1 Depreciation

### What / Why / Know

**What you’re learning:** Why depreciation is added back under the indirect method.

**Why it matters:** Depreciation reduces Net Income without a current-period cash payment for depreciation itself.

**You’ll know you’ve got it when:** You can explain the add-back rather than recite it.

### Story

Income Statement contains:

Depreciation Expense ........ $400

Ask:

> Did $400 of cash leave when this depreciation expense was recorded?

No.

Ask:

> Did the $400 reduce Net Income?

Yes.

Therefore:

> Net Income was pushed down by $400 without current cash being pushed down by $400.

Adjustment:

> **Add back $400.**

Visual:

```
Net Income
   ↓ $400 because of depreciation

Cash
   no current $400 outflow

Reconciliation: +$400
```

### Important clarification

The company may have paid cash when it originally purchased the asset.

That cash belongs in Investing in the period of purchase.

Depreciation is the later allocation of cost to expense and is noncash in the period it is recorded.

### Amortization

Introduce as the same pattern:

> Expense reduces Net Income; no equivalent current cash outflow; add back.

---

# 27. Operating Family 3 — Gains and losses

This module must clearly separate:

1. the **gain/loss inside Net Income**
2. the **actual cash proceeds in Investing**

Students commonly confuse these.

## 27.1 Gain example

Equipment:

Cost ................. $100  
Accumulated Depreciation .... $40  
Book Value ............ $60

Sold for .............. $80 cash

Gain:

$80 proceeds − $60 book value = **$20 gain**

What appears in Net Income?

> +$20 gain

What actual cash came in?

> +$80

Where does the $80 cash belong?

> Investing

What should happen to the $20 gain in Operating?

> **Subtract it from Net Income.**

Preferred explanation:

> “The gain is part of Net Income, but the equipment sale is not an operating cash flow. Remove the gain’s effect from Operating. Then report the actual $80 cash proceeds in Investing.”

Do **not** say “move the $20 gain to Investing.”

The gain itself is not the Investing cash flow.

---

## 27.2 Loss example

Same equipment book value $60.

Sold for $50.

Loss = $10.

The loss reduced Net Income by $10.

To prevent that Investing-related loss from reducing Operating cash:

> **Add back the $10 loss.**

Then:

> **$50 proceeds from sale of equipment** goes in Investing.

---

## 27.3 Required misconceptions to target

- adding a gain instead of subtracting it
- subtracting a loss instead of adding it
- placing the gain/loss amount in Investing
- using book value as Investing cash proceeds
- double counting sale proceeds
- forgetting the Operating removal after recording Investing proceeds

---

# 28. Investing module in depth

## 28.1 Core question

> **What actual cash was paid or received for long-term assets or investments?**

### Where to look

Highlight:
- noncurrent asset section of Balance Sheet
- supplemental transaction information

### Required early examples

- Buy equipment for $2,000 cash → Investing −$2,000
- Sell equipment for $800 cash → Investing +$800
- Buy land for cash → Investing outflow
- optional simple long-term investment purchase/sale if teacher enables

---

## 28.2 Balance-change trap

Show:

Equipment beginning: $20,000  
Equipment ending: $24,000

Ask:

> Can we conclude Beacon paid $4,000 cash for equipment?

Correct:

> **No.**

Why?

Because Equipment/PPE balances can change because of:
- purchases
- sales/disposals
- other noncash activity depending on the account structure

If net PPE is shown, depreciation also affects it.

Therefore:

> Use the Balance Sheet to know **where to investigate**, then use supplemental information to determine **actual cash**.

This distinction must be explicit.

---

## 28.3 Investing mastery

A student should be able to:

- identify long-term asset territory
- distinguish balance change from actual cash
- use supplemental information
- identify cash in/out direction
- place actual proceeds/purchases
- coordinate sale proceeds with gain/loss Operating adjustment

---

# 29. Financing module in depth

## 29.1 Core question

> **What actual cash moved between the company and lenders or owners?**

### Where to look

Highlight:
- notes/bonds/long-term debt
- common stock / contributed capital
- dividend information
- supplemental data

### Required examples

- Borrow $5,000 cash → Financing +$5,000
- Repay $1,500 of principal → Financing −$1,500
- Issue stock for $3,000 cash → Financing +$3,000
- Pay $700 dividends → Financing −$700

### Required conceptual clarifications

Borrowed money is not revenue.

Repaying principal is not an expense.

Stock issuance is not revenue.

Dividends are not an operating expense on the Income Statement.

If interest is included in the configured course scope:

> Interest paid is Operating under the U.S. GAAP convention used in this app; principal repayment is Financing.

---

# 30. Noncash investing/financing boundary

Scenario:

Beacon acquires $8,000 of equipment by signing an $8,000 note.

Ask:

> Did Cash move?

No.

Therefore:

> It is **not** an $8,000 Investing outflow and an $8,000 Financing inflow.

It is a significant noncash investing/financing transaction and may be disclosed separately.

This is a powerful reinforcement:

> **Follow the cash.**

The app should include at least one such item before an independent capstone.

---

# 31. The full-statement construction algorithm

After concepts are introduced individually, teach one explicit construction checklist.

Display this in Reference and on the first guided capstone.

## Step 0 — Set the cash target

From the comparative Balance Sheet:

Ending Cash − Beginning Cash = **Net change we must explain**

Keep this target visible in a small “checksum” card.

## Step 1 — Start Operating with Net Income

Source: Income Statement.

Place Net Income as the first line.

## Step 2 — Scan the Income Statement / supplemental information

Look for:
- depreciation/amortization
- gains/losses

Apply the noncash / gains-loss logic.

## Step 3 — Scan operating current assets

Work top-to-bottom through the relevant current-asset section.

Typical:
- A/R
- Inventory
- Prepaids

Explicitly skip Cash as an adjustment.

## Step 4 — Scan operating current liabilities

Typical:
- A/P
- Accrued Liabilities
- Unearned/Deferred Revenue

Do not automatically include financing liabilities such as current debt principal.

## Step 5 — Total Operating

Calculate Net Cash Provided by Operating Activities.

## Step 6 — Build Investing

Scan long-term assets/investments and supplemental information.

Use actual cash paid/received.

## Step 7 — Build Financing

Scan debt/equity and supplemental information.

Use actual cash received/paid.

## Step 8 — Reconcile

Operating  
+ Investing  
+ Financing  
= Net increase/decrease in Cash

Compare to the target from Step 0.

## Step 9 — Confirm ending Cash

Beginning Cash  
+ Net Change  
= Ending Cash

If it does not tie:

> Something is missing, misclassified, signed incorrectly, or calculated incorrectly.

Treat the tie-out as a **debugging tool**, not merely arithmetic.

---

# 32. Complete-statement workbench

The capstone should not be a long list of multiple-choice questions.

It should feel like constructing a real statement.

## Source area

Tabs or panels:

1. Income Statement
2. Comparative Balance Sheet
3. Supplemental Information

## Destination area

A real Statement of Cash Flows layout with:

### Cash Flows from Operating Activities
- Net Income
- Adjustments to reconcile Net Income to net cash from operating activities
- lines the student places
- Net Cash Provided by Operating Activities

### Cash Flows from Investing Activities
- student-added lines
- Net Cash Used/Provided by Investing Activities

### Cash Flows from Financing Activities
- student-added lines
- Net Cash Used/Provided by Financing Activities

### Reconciliation
- Net Increase/Decrease in Cash
- Beginning Cash
- Ending Cash

The student should be able to select a source account/transaction and then choose:

- add/subtract or cash in/out
- amount
- destination

For guided capstone, the app can prompt the next source area to scan.

For independent capstone, the student chooses the order within the recommended checklist.

---

# 33. Capstone 1 — Guided complete statement

Use a fixed, carefully validated scenario before randomized comprehensive problems.

Suggested fixture:

## Company
**Beacon Bike & Repair**

## Given

**Net Income:** $2,500

**Comparative operating accounts**

| Account | Beginning | Ending |
|---|---:|---:|
| Cash | $5,000 | $8,900 |
| Accounts Receivable | $1,000 | $1,500 |
| Prepaid Expenses | $200 | $100 |
| Accounts Payable | $600 | $900 |
| Unearned Revenue | $400 | $300 |

**Supplemental information**

- Depreciation Expense was $500.
- Equipment was sold for $800 cash. The sale produced a $200 gain.
- Equipment was purchased for $2,000 cash.
- The company borrowed $3,000 cash by issuing a note.
- Dividends of $500 were paid in cash.

## Correct Operating

Net Income ................................ $2,500  
Depreciation .............................. +500  
Gain on Sale .............................. −200  
Increase in A/R ........................... −500  
Decrease in Prepaids ...................... +100  
Increase in A/P ........................... +300  
Decrease in Unearned Revenue .............. −100  

**Net Cash Provided by Operating Activities = $2,600**

## Correct Investing

Purchase of Equipment ..................... −$2,000  
Proceeds from Sale of Equipment ........... +800  

**Net Cash Used by Investing = −$1,200**

## Correct Financing

Borrowing / Note Proceeds ................. +$3,000  
Dividends Paid ............................ −500  

**Net Cash Provided by Financing = $2,500**

## Net change

$2,600 − $1,200 + $2,500 = **+$3,900**

Beginning Cash $5,000 + $3,900 = Ending Cash $8,900.

### Guided-capstone behavior

- Show the cash target first.
- Prompt the construction checklist one territory at a time.
- If a student makes a wrong choice, step backward to the relevant reasoning question.
- Let the statement visibly fill in.
- Celebrate the final tie-out with a subtle completion animation.

---

# 34. Capstone 2 — Integrated, less-guided statement

Use a second validated scenario containing all major timing families.

Suggested core figures:

**Net Income:** $4,800

**Operating adjustments**
- Depreciation: +$1,200
- Loss on sale of equipment: +$300
- A/R increases $600 → −$600
- Inventory increases $600 → −$600
- Prepaids decrease $300 → +$300
- A/P increases $600 → +$600
- Accrued Liabilities decrease $200 → −$200
- Unearned Revenue increases $300 → +$300

**Operating cash = $6,100**

**Investing**
- Equipment purchased for cash: −$4,000
- Equipment sold for cash: +$1,500
- Net Investing = −$2,500

For the sale, use:
- book value $1,800
- cash proceeds $1,500
- loss $300

**Financing**
- Stock issued for cash: +$2,000
- Note principal repaid: −$1,500
- Dividends paid: −$700
- Net Financing = −$200

**Net Cash Change**
$6,100 − $2,500 − $200 = **+$3,400**

Beginning Cash: $6,000  
Ending Cash: $9,400

### Less-guided behavior

The student gets:
- Income Statement
- comparative Balance Sheet
- supplemental information
- cash-change target

The app gives only the construction checklist.

No automatic row highlights unless the student requests a hint.

The student must:
- locate relevant items
- calculate changes
- classify
- enter/choose adjustment signs
- place lines
- total sections
- reconcile

If they fail to tie, provide a debugging mode that identifies the **section** that is inconsistent before revealing a specific line.

---

# 35. Optional Capstone 3 — Independent variant

If time permits in the build, include a third scenario with:
- different company
- different directions of working-capital changes
- gain rather than loss
- one noncash equipment acquisition that must be excluded from cash flows
- a mix of debt and stock financing

This capstone should have the least scaffolding.

It is acceptable for Version 1 to ship with two excellent capstones rather than three mediocre ones.



---

# 36. Problem interaction architecture

Cash Flow Lab should use several interaction types. It should not force every concept into the same multiple-choice mold.

## 36.1 Type A — “Where do I look?”

Student sees a simplified statement map or a full statement.

Prompt:

> Where would you look first to handle Accounts Receivable?

Student taps:
- Income Statement
- Current Assets
- Current Liabilities
- Long-term Assets
- Debt/Equity
- Supplemental Information

Correct selection visually zooms to the relevant region.

Purpose:
- build document-navigation habits
- diagnose students who know a sign rule but cannot find the source information

Do not overuse after the skill is secure.

---

## 36.2 Type B — Calculate the change

Example:

Beginning A/R $1,200  
Ending A/R $1,700

Prompt:

> What happened to Accounts Receivable?

Preferred input:

- Increase / Decrease toggle
- numeric amount

Correct:
- Increase
- $500

If the direction is wrong, feedback should explicitly reinforce:

> Ending − Beginning = change. $1,700 is $500 higher than $1,200.

For students who repeatedly reverse the period, target this skill separately.

---

## 36.3 Type C — Plain-English interpretation

Example:

A/R increased $500.

Prompt:

> What does that mean economically?

Possible choices:
- Customers owe us more.
- Customers owe us less.
- We owe suppliers more.
- We prepaid more expenses.

Correct feedback:

> Customers owe us more at the end of the period.

This tests account meaning before cash-flow signs.

---

## 36.4 Type D — Cash-versus-recognition connection

Example:

A/R increased $500.

Prompt:

> Compared with the revenue Net Income recognized, cash collected from customers was…

- $500 lower
- $500 higher
- the same
- impossible to relate under the simplified operating assumption

Correct: $500 lower.

This is the conceptual bridge.

Equivalent versions should exist for each timing family.

---

## 36.5 Type E — Adjustment direction

Prompt:

> To convert Net Income toward operating cash, what do we do with the $500 A/R increase?

- Add $500
- Subtract $500
- No adjustment

Then ask why if needed.

---

## 36.6 Type F — Place the line

Show a small Statement of Cash Flows.

Student chooses the destination:

- Operating
- Investing
- Financing
- Noncash disclosure / no cash-flow line

Then chooses/selects the line.

Example:

> Increase in Accounts Receivable ........ $(500)

Placement is important. Every major concept should end with actual statement placement.

---

## 36.7 Type G — Build the reasoning chain

For early concepts, use a compact chain:

> A/R **increased** → customers owe us **more** → cash collected was **less** than revenue recognized → **subtract** the increase.

Let students fill one missing piece at a time.

Later, present several chain pieces and ask them to arrange or select the correct sequence.

Do not make sentence arrangement fussy on mobile.

---

## 36.8 Type H — Scenario classification

Short story:

> Beacon received cash from a customer before doing the repair work.

Ask:

1. Recognition first or cash first?
2. Revenue side or expense side?
3. Which timing account?

Correct:
- Cash first
- Revenue side
- Unearned/Deferred Revenue

This strengthens the timing matrix.

---

## 36.9 Type I — Statement scan

Show a realistic comparative Balance Sheet section with distractor accounts.

Prompt:

> Which account(s) here create operating timing adjustments?

Student selects rows.

Early:
- highlight current section

Later:
- full Balance Sheet

This prevents reliance on isolated flash-card questions.

---

## 36.10 Type J — Transaction-to-section classification

Used primarily for Investing/Financing and boundaries.

Examples:
- bought equipment for cash
- sold equipment for cash
- issued stock
- repaid principal
- acquired equipment by signing a note

Student classifies:
- Operating
- Investing
- Financing
- Noncash disclosure / no cash flow

---

## 36.11 Type K — Actual cash derivation

Example:

Equipment sale facts:
- cost
- accumulated depreciation
- book value
- gain/loss
- proceeds

Ask:

> What amount goes in Investing?

The correct answer must be **cash proceeds**, not gain/loss or book value.

Similarly, a long-term asset account change plus supplemental information can require deriving purchases.

Use this only after the basic section is understood.

---

## 36.12 Type L — Mini Operating section

Give:
- Net Income
- 2–4 adjustments

Student builds only Operating.

This bridges isolated accounts and full statements.

---

## 36.13 Type M — Full statement

Capstone workbench.

No multiple-choice answer list for the entire statement.

Students enter/place lines and totals.

---

# 37. Scaffold ladder

Each concept should move through a deliberate scaffold ladder.

## Level 0 — Observe

App demonstrates one tiny example.

Student may answer one obvious prediction question.

## Level 1 — Guided reasoning

The full WHERE → SEE → INTERPRET → CONNECT → ACT → PLACE sequence is visible.

## Level 2 — Reduced scaffold

App might show:

> What changed?  
> What does that mean for cash?  
> What adjustment follows?

## Level 3 — Independent concept

Prompt:

> Handle the Accounts Receivable adjustment.

Student must:
- locate
- calculate
- adjust
- place

Hints remain available.

## Level 4 — Mixed context

A/R appears among other accounts without a label saying “this is an A/R problem.”

## Level 5 — Integrated statement

Student encounters A/R as one step in a complete Operating or complete SCF problem.

Difficulty progression should primarily mean **less prompting and more integration**, not more arithmetic.

---

# 38. Hint system

Hints should move backward through the reasoning chain.

Every independent problem should support layered hints.

Example for A/R:

### Hint 1 — WHERE
> Look in Current Assets on the comparative Balance Sheet.

### Hint 2 — SEE
> Compare ending A/R with beginning A/R.

### Hint 3 — INTERPRET
> An increase means customers owe the company more.

### Hint 4 — CONNECT
> If customers owe more, some revenue recognized in Net Income has not been collected in cash.

### Hint 5 — ACT
> Net Income is ahead of cash here, so subtract the increase.

### Reveal
Show the complete reasoning and correct placement.

Rules:

- Hints should never erase the student's work.
- Hints should not count as wrong answers.
- Hint use should reduce the weight of that attempt for mastery.
- “Reveal” should mark the opportunity as learned-from, not independently mastered.
- The student should receive a nearby new problem after a reveal.

The exact number of hints can vary by concept, but the hierarchy should reflect the reasoning chain.

---

# 39. Feedback architecture

The application should diagnose **where reasoning broke**, not merely whether the final sign was wrong.

## 39.1 Correct answer

Feedback should be brief by default.

Example:

> **Correct.** A/R rose $300, so revenue recognized exceeded cash collected by $300. Subtract $300 from Net Income.

Show the resulting SCF line.

Provide an expandable “Show the full reasoning” option.

Do not force students to read a paragraph after every correct answer.

---

## 39.2 Incorrect answer

Do not immediately dump the final answer.

Move backward **one conceptual step**.

Example:

Student adds an A/R increase.

Feedback:

> A/R increased. Before choosing the sign, answer this: are customers owing Beacon **more** or **less** at the end?

After that:

> If customers owe more, has all the revenue in Net Income been collected in cash?

Then return to the adjustment.

This preserves productive struggle without leaving a confused student stranded.

---

## 39.3 Arithmetic error versus conceptual error

Distinguish:

- correct logic, wrong subtraction
- wrong direction of account change
- wrong account meaning
- wrong cash relationship
- wrong adjustment
- wrong section placement

Teacher analytics should preserve this distinction.

---

## 39.4 Misconception-specific feedback

Never use generic:

> “Incorrect. Try again.”

Every distractor should map to a misconception code and have targeted feedback.

Examples:

### A/R increase chosen as add
> You treated the asset increase as if it were cash coming in. A/R is **money still owed**, not cash collected.

### A/P increase chosen as subtract
> A/P increased because more operating cost was recognized than paid. Net Income went down before all the cash went out, so the reconciliation adds the unpaid portion back.

### Gain entered in Investing
> The gain is an accounting difference between proceeds and book value. Investing reports the **cash proceeds**, not the gain.

### Depreciation entered as Investing outflow
> The asset purchase may have been an Investing outflow earlier. Depreciation itself does not move cash when recorded.

---

# 40. Misconception taxonomy

Use stable codes in content and attempt logs.

Recommended minimum set:

| Code | Misconception |
|---|---|
| M01 | Treats Net Income as operating cash |
| M02 | Uses ending account balance instead of the change |
| M03 | Reverses beginning/end change calculation |
| M04 | Thinks A/R increase means cash increased |
| M05 | Thinks A/R decrease should subtract |
| M06 | Thinks A/P increase means cash was paid |
| M07 | Thinks A/P decrease should add |
| M08 | Confuses A/R with Unearned Revenue |
| M09 | Confuses A/P/accrual with Prepaid Expense |
| M10 | Thinks Unearned Revenue is already earned revenue |
| M11 | Treats Prepaid increase as current expense only |
| M12 | Treats Inventory increase as an expense rather than working-capital cash use |
| M13 | Fails to recognize Inventory/A/P offset on credit purchase |
| M14 | Applies asset/liability shortcut to non-operating account |
| M15 | Adjusts the Cash account itself |
| M16 | Treats depreciation as current cash outflow |
| M17 | Adds a gain instead of subtracting it |
| M18 | Subtracts a loss instead of adding it |
| M19 | Uses gain/loss amount as Investing cash proceeds |
| M20 | Uses book value as sale proceeds |
| M21 | Uses PPE balance change as cash purchase/sale amount without support |
| M22 | Treats borrowing as revenue |
| M23 | Treats debt principal repayment as expense/Operating |
| M24 | Treats stock issuance as revenue |
| M25 | Treats dividends as operating expense |
| M26 | Includes noncash investing/financing transaction as cash flow |
| M27 | Places correct amount in wrong SCF section |
| M28 | Confuses cash change with ending Cash balance |
| M29 | Double-counts an item in Operating and Investing/Financing |
| M30 | Omits an item because it is not directly visible on the Balance Sheet |

Add codes as needed, but keep them semantically stable for teacher analytics.

---

# 41. Short written explanations

The old Journal Entry Arena collected optional explanations. Preserve the useful idea, but use it selectively.

Students should not type a sentence after every question.

Require or invite a short explanation at **milestones**, such as:

- first independent A/R problem
- first Inventory/A/P interaction
- first depreciation problem
- first gain/loss problem
- guided capstone completion

Prompt examples:

> In one sentence, why is an increase in A/R subtracted?

> Why do the Inventory and A/P adjustments cancel when inventory was purchased entirely on account?

> Why is the gain removed from Operating while the sale proceeds appear in Investing?

These responses are not automatically graded by an AI.

Store them for teacher review.

Optional simple completion checks:
- minimum character count
- no empty submission if teacher config requires explanation

Do not pretend keyword matching is a reliable understanding score.

---

# 42. Adaptive learning engine

The legacy application's adaptive practice is valuable, but the new app needs a more sophisticated taxonomy.

The engine must adapt on two dimensions:

1. **Concept**
2. **Skill within the concept**

Example:

A student may understand A/R perfectly until the “cash-versus-revenue” connection.

The app should diagnose:

> A/R locating: strong  
> A/R change calculation: strong  
> A/R interpretation: strong  
> A/R cash connection: weak  
> A/R adjustment: weak

Then practice should target the weak bridge, not restart the entire A/R lesson repeatedly.

---

# 43. Content taxonomy

Every problem/opportunity should carry metadata.

Recommended structure:

- `section`
  - foundation
  - operating
  - investing
  - financing
  - capstone

- `family`
  - purpose
  - classification
  - timing
  - noncash
  - gain_loss
  - actual_cash
  - reconciliation

- `concept`
  - cash_change
  - three_sections
  - indirect_bridge
  - accounts_receivable
  - accounts_payable
  - accrued_liabilities
  - unearned_revenue
  - prepaid_expenses
  - inventory
  - depreciation
  - amortization
  - gain_on_sale
  - loss_on_sale
  - ppe_purchase
  - ppe_sale
  - borrowing
  - debt_repayment
  - stock_issuance
  - dividends
  - noncash_investing_financing
  - full_statement

- `skill`
  - locate
  - compute_change
  - interpret
  - recognition_cash_connect
  - adjustment_direction
  - adjustment_amount
  - classify_section
  - derive_actual_cash
  - place_line
  - total_section
  - reconcile
  - explain
  - integrated

- `scaffoldLevel`
  - 0 through 5

- `tier`
  - 1 foundational
  - 2 independent
  - 3 mixed
  - 4 integrated

- `direction`
  - increase
  - decrease
  - gain
  - loss
  - inflow
  - outflow
  - none

- `misconceptionTargets`
  - array of stable misconception codes

- `sourceComplexity`
  - isolated
  - statement_fragment
  - highlighted_full_statement
  - full_statement

---

# 44. Mastery model

Do not equate “mastery” with a simple all-time percentage.

Internally, track performance by concept and skill.

A practical Version 1 model:

## Evidence weights

- Guided correct with hints: 0.35
- Guided correct without hints: 0.55
- Independent correct after one hint: 0.70
- Independent correct with no hints: 1.00
- Mixed/contextual correct: 1.15
- Integrated/capstone correct: 1.25

Incorrect attempts count as 0 for the targeted skill.

Do not show these weights to students.

## Student-facing states

### Not started
No meaningful exposure.

### Learning
Tutorial/guided examples underway.

### Practicing
Concept introduced; insufficient independent evidence.

### Secure
At least:
- both relevant directions encountered where applicable
- 3 recent independent opportunities
- at least 75% weighted recent evidence
- no persistent single misconception dominating

### Mastered
At least:
- 5 recent meaningful independent/mixed opportunities
- at least 85% weighted recent evidence
- at least one mixed/contextual correct
- both directions correct where applicable
- no reveal on the last 3 meaningful opportunities

These thresholds may be adjusted in `config.js`.

The exact algorithm can be simplified if necessary, but preserve the distinction between **guided success and independent mastery**.

---

# 45. Soft gating

Do not trap a student in one concept for twenty minutes because they have not hit 85%.

First-run Learn mode should use **minimum competency + revisit**.

Recommended:

- complete one observed/guided example
- complete one guided attempt
- attempt at least two independent variants, preferably opposite directions
- if still weak, flag for remediation and continue after one additional supported attempt
- insert retrieval opportunities later

This allows the student to see the entire conceptual map during the class period.

The app can say:

> “You’re still building this skill. We’ll bring it back again.”

This is better than blocking all future content.

Capstone 1 may adaptively add hints for weak concepts.

---

# 46. Spaced retrieval

After a concept is introduced, do not leave it behind forever.

During later learning modules, insert occasional one-step retrieval questions.

Example:

While learning Prepaids, a small A/R retrieval item may appear:

> A/R fell $200. Add or subtract?

This should be sparse enough not to break conceptual flow.

After a focused practice set, the next mixed set should increase exposure to that concept, borrowing the useful behavior from the legacy app.

---

# 47. Retry queue

If a student misses a problem:

- do not repeat the exact same screen immediately
- remediate the reasoning now
- then return a structurally similar problem with new numbers after several intervening opportunities

Recommended retry spacing:
- 3–7 meaningful questions later
- then again in mixed context if still weak

Store the misconception that caused the miss and preferentially target it.

---

# 48. Practice mode

After a concept is introduced, the student can choose:

- Mixed Practice
- Focus on a concept
- Practice my weakest skill
- Build Operating only
- Build a full statement

### Mixed Practice selection

Weight toward:
- lower mastery
- repeated misconception
- concepts not seen recently
- skills required for upcoming capstones

Avoid:
- same concept more than twice consecutively unless focus mode
- exact repeated scenario text
- long runs of only sign questions

### Focus mode

A focused set should be 4–7 questions on one concept, but use varied skills.

Example A/R focus set:
1. locate
2. calculate change
3. plain-English meaning
4. cash relationship
5. full adjustment
6. mixed statement fragment

After focus:
- return to mixed practice
- deliberately include one A/R retrieval item later

---

# 49. Progress display

Student-facing progress should emphasize learning status rather than ranking.

Recommended concept tile:

**Accounts Receivable**  
`Secure`  
✓ Find it  
✓ Calculate change  
✓ Explain meaning  
△ Cash connection  
✓ Adjustment  
✓ Placement

Or a simpler compact version if space is limited.

Avoid showing a 43% score before enough evidence exists.

When percentages are shown in detailed stats, label them clearly as recent independent accuracy.

---

# 50. Gamification

Gamification should support persistence, not distract from accounting.

Recommended:
- progress map
- mastery levels
- subtle completion animation
- “concept cleared” moments
- practice streaks
- optional points/XP
- optional class leaderboard

Do not:
- rank by speed
- use lives that lock students out
- punish asking for hints
- use noisy arcade effects
- make students feel failure is permanent

A student who starts poorly should be able to see recent improvement quickly.

If percentages are used, recent performance should matter more than an early rough start.

---

# 51. Leaderboard policy

The old Journal Entry Arena has a projector leaderboard. This may be reused technically, but for Cash Flow Lab it should be **teacher-configurable and OFF by default**.

Reasons:
- this unit is conceptually difficult
- public low scores may increase anxiety
- learning depth matters more than speed

If enabled, consider ranking on:
- concepts mastered
- recent mixed accuracy
- completed capstones
- improvement

Do not display:
- time-to-completion
- number of hints as a negative public metric
- students who have not yet generated enough evidence

Use first name + last initial only.

---

# 52. Teacher dashboard — primary goals

The teacher should be able to answer:

1. **Who is stuck?**
2. **What exactly are they stuck on?**
3. **Is the issue account meaning, cash connection, sign, placement, or document navigation?**
4. **What is the class-wide bottleneck?**
5. **Who is ready for the full statement?**

This is more important than a single score.

---

# 53. Teacher dashboard — required views

## 53.1 Live class overview

Rows by student.

Columns:
- student name
- current module
- concepts introduced
- concepts secure/mastered
- recent independent accuracy
- hints/reveals recently
- capstone status
- last active
- needs-help indicator

Teacher should be able to sort by:
- progress
- weakest mastery
- current module
- last active
- name

---

## 53.2 Concept heat map

Rows:
- students

Columns:
- A/R
- A/P
- Accrued
- Unearned
- Prepaids
- Inventory
- Noncash
- Gains/Losses
- Investing
- Financing
- Reconciliation

Cell:
- Not started
- Learning
- Practicing
- Secure
- Mastered

Use text/icon + color so color is not the only signal.

---

## 53.3 Skill heat map

Teacher can select a concept, e.g. A/R, and see:

- locate
- calculate change
- interpret
- cash connection
- adjustment
- placement

This is one of the most valuable improvements over the old app.

---

## 53.4 Misconception summary

Class-level counts:

> 8 students: M04 — A/R increase interpreted as cash increase  
> 6 students: M16 — depreciation treated as cash outflow  
> 4 students: M19 — gain/loss used as sale proceeds

Clicking a misconception shows affected students.

---

## 53.5 Student detail

Click a student to see:
- progress map
- recent attempts
- problem/concept/skill
- response
- correct answer
- hints used
- misconception code
- response time if recorded
- milestone written explanations
- capstone line-by-line result

Do not require the teacher to read raw JSON.

---

## 53.6 Capstone view

Show:
- started / completed
- Operating total
- Investing total
- Financing total
- whether tie-out succeeded
- which lines were initially wrong
- hints/reveals

This lets the teacher identify students who know isolated rules but cannot integrate.

---

## 53.7 CSV export

Export one row per student with:
- name
- block
- progress state
- concept mastery
- selected skill mastery
- recent accuracy
- capstone scores/status
- misconception counts
- last active

Optionally export attempts separately.

---

# 54. Teacher configuration

`config.js` should expose teacher-friendly settings.

Suggested structure:

```js
window.CFL_CONFIG = {
  appName: "Cash Flow Lab",

  blocks: [
    { id: "1", name: "Block 1", code: "FLOW1" }
  ],
  requireCode: true,

  terminology: {
    unearnedRevenue: "Unearned Revenue"
  },

  curriculum: {
    includeAccruedLiabilities: true,
    includeInventory: true,
    includeAmortization: true,
    includeLongTermInvestments: false,
    includeInterestPaid: false,
    includeTreasuryStock: false,
    includeNoncashDisclosure: true
  },

  mastery: {
    secureThreshold: 0.75,
    masteryThreshold: 0.85
  },

  practice: {
    focusSize: 6,
    mixedSize: 10,
    retryMinGap: 3,
    retryMaxGap: 7
  },

  leaderboard: {
    enabled: false
  },

  assessment: {
    enabled: false,
    disableHints: false,
    swapOnLeave: false,
    noCopy: false
  },

  firebase: null
};
```

Names can vary, but keep configuration centralized and documented.

---

# 55. Reference experience

The Reference view should be concise and visual.

Required reference cards:

## Card 1 — What the SCF is doing
Operating + Investing + Financing = Change in Cash

## Card 2 — Where to look
Statement Territory Map

## Card 3 — Operating's three adjustment families
Timing / Noncash / Gains-Losses

## Card 4 — Timing matrix
Recognition first vs cash first; revenue vs expense

## Card 5 — Working-capital compression
Operating current asset ↑ subtract / ↓ add  
Operating current liability ↑ add / ↓ subtract

Add visible caveat:

> Apply this only after identifying an account as an operating timing account.

## Card 6 — Gains/losses
Gain: subtract from Operating  
Loss: add to Operating  
Actual sale proceeds: Investing

## Card 7 — Construction checklist
Cash target → Operating → Investing → Financing → tie out

The reference drawer must not navigate the student away from the current unfinished problem.

---

# 56. Visual treatment of statements

Render statements as HTML/CSS, not screenshots.

Advantages:
- accessible
- responsive
- selectable/highlightable
- easy to generate
- no image-resolution problems
- no copyright dependency
- can fade irrelevant rows

Style should resemble actual accounting statements:

- company name
- statement title
- period/date
- account labels
- right-aligned values
- indentation
- section subtotals
- single/double rules where appropriate
- parentheses for negative amounts

Example:

```
BEACON BIKE & REPAIR
Comparative Balance Sheet
December 31

                              20X1      20X2
Current Assets
  Cash                      $5,000    $8,900
  Accounts Receivable        1,000     1,500
  Prepaid Expenses             200       100
```

Use highlighting to indicate a row or region.

Do not make the statements look like generic cards with no accounting hierarchy.

---

# 57. Focus / zoom behavior

When teaching WHERE:

1. briefly show the whole statement
2. visually highlight the relevant section
3. animate or smoothly expand the section
4. leave a small breadcrumb:
   `Balance Sheet → Current Assets → Accounts Receivable`

On reduced-motion systems, skip animation and jump to highlighted state.

As scaffolding fades:
- remove the animated zoom
- retain only a subtle highlight
- finally remove the highlight entirely

---

# 58. “Ignore this for now” treatment

Students need explicit permission to ignore irrelevant information.

Early statement fragments should gray irrelevant rows and sometimes display:

> **For this question, everything outside Current Assets can be ignored.**

Later, remove this support.

Never make a student infer the intended scope from clutter during first exposure.

---

# 59. Stable tutorial company and controlled context changes

During Learn mode, use **Beacon Bike & Repair** or another single company consistently.

Do not casually change:
- company
- period
- account set
- underlying scenario facts

within a multi-step example.

If a new fact is introduced, visually label:

> **New information**

If the company changes for practice, that is fine because the student is now applying the concept.

This requirement exists because silently shifting facts can make a difficult topic feel incoherent.

---

# 60. Content generation strategy

Do not rely only on a finite bank of identical questions.

Use:
- curated scenario patterns
- parameterized numbers
- multiple wording variants
- deterministic seeded generation
- fixed validated capstones

For each major concept, provide at least:

- 2 guided story patterns
- 3 independent increase/inflow patterns
- 3 independent decrease/outflow patterns where applicable
- 2 mixed-context patterns
- misconception-specific distractors

Quality is more important than raw count.

A smaller set of highly coherent generators is preferable to hundreds of poorly validated questions.

---

# 61. Numeric design rules

Use friendly values in early learning:

- multiples of $50 or $100
- changes usually $100–$1,000
- no awkward decimals
- no negative account balances

Later:
- larger realistic figures
- still avoid arithmetic noise that obscures concepts

Capstone numbers may be larger but should remain hand-calculable.

Always format:
- commas
- dollar signs where appropriate
- parentheses for cash outflows/negative adjustments on rendered statements

---

# 62. Content object model

A recommended problem schema:

```js
{
  id: "AR-INCREASE-01",
  section: "operating",
  family: "timing",
  concept: "accounts_receivable",
  tier: 1,
  scaffoldLevel: 2,
  skills: [
    "compute_change",
    "interpret",
    "recognition_cash_connect",
    "adjustment_direction",
    "place_line"
  ],
  sourceComplexity: "statement_fragment",
  direction: "increase",

  generator: "workingCapitalChange",
  parameters: { /* constraints */ },

  source: {
    incomeStatement: [],
    balanceSheet: [],
    supplemental: []
  },

  prompts: [
    { skill: "compute_change", type: "direction_amount" },
    { skill: "interpret", type: "choice" },
    { skill: "recognition_cash_connect", type: "choice" },
    { skill: "adjustment_direction", type: "choice" },
    { skill: "place_line", type: "statement_place" }
  ],

  expected: {
    change: 300,
    direction: "increase",
    adjustment: -300,
    section: "operating"
  },

  misconceptions: {
    /* response mappings */
  },

  feedback: {
    /* concise targeted strings */
  }
}
```

The exact implementation can differ, but content must be data-driven enough that adding a concept does not require rewriting the core engine.

---

# 63. Attempt/event data model

Each meaningful response should be loggable.

Recommended shape:

```js
{
  attemptId,
  uid,
  appVersion,
  contentVersion,

  sessionId,
  problemId,
  seed,

  section,
  family,
  concept,
  skill,
  tier,
  scaffoldLevel,

  promptType,
  response,
  correctResponse,
  correct,

  hintsUsed,
  revealed,
  misconceptionCode,

  elapsedMs,
  timestamp,

  mode,          // learn | practice | capstone | assessment
  capstoneId,
  focusedPractice
}
```

Not every field must be written to Firestore if cost/performance argues otherwise, but local state should preserve enough detail for diagnosis.

---

# 64. Curriculum state

Persist:

```js
{
  schemaVersion,
  appVersion,
  contentVersion,

  identity: {
    name,
    block
  },

  lesson: {
    currentModule,
    completedModules,
    introducedConcepts,
    capstones
  },

  mastery: {
    /* concept + skill evidence */
  },

  misconceptionCounts: {},

  attempts: [],

  settings: {
    terminology,
    theme
  }
}
```

Provide state migration when schema changes.

Do not wipe student progress merely because the app was updated.

---

# 65. Technical architecture — guiding principles

The desired deployment is as simple as the legacy Journal Entry Arena:

- static files
- GitHub Pages
- optional Firebase
- works without a dedicated backend
- progress stored locally immediately
- cloud sync is best-effort
- responsive
- no paid API required

However, do not repeat the old app's monolithic `index.html` architecture if modular files make this richer app easier to maintain.

Recommended: **vanilla JavaScript ES modules with no production build step**.

This provides:
- GitHub Pages simplicity
- modularity
- fast loading
- easy debugging
- no React/Vite build dependency
- easy handoff to future AI coding sessions

If the coding agent has a compelling reason to use a minimal framework, it must still produce a checked-in deployable static build and clear source. Default preference remains no framework.

---

# 66. Recommended file structure

```text
/
├── index.html
├── teacher.html
├── board.html                  # optional / disabled if leaderboard off
├── config.js
├── firestore.rules
├── manifest.webmanifest        # optional but recommended
├── service-worker.js           # optional but recommended after core works
│
├── css/
│   ├── app.css
│   └── teacher.css
│
├── js/
│   ├── main.js
│   ├── router.js
│   ├── state.js
│   ├── storage.js
│   ├── utils.js
│   │
│   ├── curriculum/
│   │   ├── map.js
│   │   ├── concepts.js
│   │   ├── problems.js
│   │   ├── generators.js
│   │   └── capstones.js
│   │
│   ├── engine/
│   │   ├── mastery.js
│   │   ├── selector.js
│   │   ├── remediation.js
│   │   └── scoring.js
│   │
│   ├── ui/
│   │   ├── statements.js
│   │   ├── workbench.js
│   │   ├── reasoning.js
│   │   ├── builder.js
│   │   ├── progress.js
│   │   └── reference.js
│   │
│   └── cloud/
│       └── firebase.js
│
├── tests/
│   ├── accounting.test.mjs
│   ├── generators.test.mjs
│   ├── mastery.test.mjs
│   └── capstones.test.mjs
│
├── README.md
├── DEPLOY.md
├── TEACHER_GUIDE.md
├── CONTENT_GUIDE.md
└── BUILD_SPEC.md
```

This is a recommendation, not a rigid requirement. Keep production deployment static.

---

# 67. No-build production requirement

The deployed app should work from GitHub Pages by serving committed static files.

A package manager may be used for **development tests**.

Production must not require:
- npm install on the server
- server-side rendering
- a Node server
- a database other than optional Firebase
- a hidden paid service

If tests use Node, prefer built-in `node:test` where practical.

---

# 68. Local-first persistence

Every response should be saved locally before cloud sync.

Requirements:

- state saved after every meaningful student action
- reload returns student to same module/problem state where practical
- temporary cloud failure does not destroy progress
- cloud sync retries later
- if Firebase is not configured, the app remains fully usable in local-only mode

Use a new localStorage key, e.g.:

`cash_flow_lab_v1`

Do not collide with `jea_v2`.

---

# 69. Firebase / Firestore reuse

The legacy app demonstrates a good general pattern:

- anonymous student auth
- localStorage as immediate persistence
- Firestore summary docs
- append-only attempts
- live teacher dashboard

Reuse this pattern where helpful.

Do not reuse legacy collection names unless intentionally namespaced.

Recommended collections:

- `cfl_players/{uid}`
- `cfl_stats/{uid}`
- `cfl_attempts/{attemptId}`
- `cfl_public_stats/{uid}` only if leaderboard enabled
- `cfl_teachers/{uid}`

If using a shared Firebase project with Journal Entry Arena, the `cfl_` prefix prevents collisions.

---

# 70. Firestore privacy/security design

The old app's infrastructure is a reference, not a security specification.

For Cash Flow Lab:

## Student identity
Store only:
- first name + last initial
- block/class
- anonymous UID

Do not ask for:
- student ID
- email
- birthdate
- full last name

## Private stats
`cfl_stats` should be readable by:
- the owning student if needed
- authorized teacher

It should not need to be readable by every anonymous student.

## Attempts
Students may create their own attempt records.
Only authorized teachers should read class-wide attempts.

## Public leaderboard
If enabled, write a sanitized `cfl_public_stats` document containing only:
- display name
- block
- public mastery metric

Do not expose:
- written explanations
- misconceptions
- hint usage
- full attempt history

## Firebase web config
Document that Firebase web config values are not authentication secrets. Security must come from Firestore rules.

## Class codes
Document that class codes in a static web app are a **light gate**, not cryptographic security, because client code is inspectable.

---

# 71. Teacher authentication

For Version 1, it is acceptable to reuse the legacy “authorized teacher UID document” pattern if it is reliable and clearly documented.

The teacher dashboard should:

- authenticate
- show current UID/setup instructions if not authorized
- only query protected teacher data after authorization

If the builder can add a simple Google/email teacher sign-in without increasing deployment fragility, that is acceptable, but it is not required.

Do not make teacher setup so sophisticated that the app is no longer quickly deployable.

---

# 72. Optional public board

If `leaderboard.enabled === false`:
- `board.html` may show a disabled message
- no public stats writes are required

If enabled:
- live Firestore updates
- block selector
- sanitized names
- category/mastery ranking
- no sensitive diagnostics

The old projector board can be reused structurally.

---

# 73. Assessment mode

Learning mode and assessment mode have different needs.

Default:
- hints allowed
- reference allowed
- switching tabs does not erase a learning problem
- explanations available

Assessment config may enable:
- hints disabled
- reference limited
- copy/context menu limited
- question replacement after leaving the page
- randomized variants
- no immediate detailed feedback until submission

The old anti-cheat behavior can be adapted here.

Do not apply punitive tab-switch behavior in normal learning mode.

---

# 74. Accessibility requirements

Minimum:

- semantic headings
- proper button elements
- visible keyboard focus
- keyboard-completable interactions
- no color-only meaning
- ARIA labels for statement rows when interactive
- sufficient contrast
- large enough touch targets
- `prefers-reduced-motion` support
- responsive text sizing
- screen-reader labels for increase/decrease signs and parentheses

Avoid:
- tiny spreadsheet text
- hover-only explanations
- drag-only actions
- animations that block interaction

The old app's use of Atkinson Hyperlegible is reasonable, but the new app should also work cleanly with system fonts if external fonts fail.

---

# 75. Network resilience

School Wi-Fi can be unreliable.

The core student experience should not depend on network round trips after load.

Recommended:
- all curriculum/problem content bundled locally
- local state immediate
- Firebase async
- no remote AI calls
- optional service worker after the core build is stable
- external font failure should not break layout

If a service worker is implemented:
- version cache names
- avoid caching stale `config.js` indefinitely
- provide a clean update strategy

---

# 76. Performance

Target:

- first meaningful render under ~2 seconds on a typical school Chromebook under normal network conditions after static assets are available
- student interactions immediate
- no large image downloads
- no framework bundle hundreds of KB larger than necessary
- no unnecessary animation libraries

The app's complexity should be in the learning logic, not heavy dependencies.

---

# 77. Accounting logic should be pure and testable

Separate accounting calculation functions from rendering.

Examples:

```js
computeChange(begin, end)
workingCapitalAdjustment(accountType, change)
gainLossAdjustment(kind, amount)
cashChange(operating, investing, financing)
reconcileCash(beginCash, netChange)
```

For concept-specific logic, use explicit functions rather than clever generic rules when clarity/testing benefits.

Do not use `eval()`.

Generated problems should return a full solution object used both by:
- UI validation
- automated tests

This reduces content bugs.

---

# 78. Generator invariants

Every generated problem must satisfy automated invariants.

Examples:

### Working-capital problems
- beginning and ending balances nonnegative
- intended increase/decrease direction is true
- change amount matches ending − beginning
- correct adjustment sign matches concept/direction
- distractors are distinct from correct answer

### Gain/loss problems
- book value = cost − accumulated depreciation
- gain/loss = proceeds − book value
- Operating adjustment exactly removes gain/loss
- Investing amount equals cash proceeds

### Complete statements
- section totals correct
- O + I + F = net cash change
- Beginning Cash + net change = Ending Cash
- no required transaction omitted
- noncash transaction not included in cash totals

Tests should generate hundreds of random variants where feasible.

---

# 79. Seeded randomness

Use deterministic seeded randomness for generated problems.

Store the seed in attempt records.

Benefits:
- teacher can reproduce a student's exact problem
- bugs can be reproduced
- retry can generate a related but not identical variant
- automated tests can replay failures

A simple well-tested PRNG is sufficient.

---

# 80. Problem-bank quality checks

Before final delivery, the coding agent should programmatically scan content for:

- duplicate IDs
- missing correct responses
- duplicate choices
- empty feedback
- unknown concept/skill IDs
- impossible numeric constraints
- unsupported misconception codes
- malformed statement rows
- unresolved placeholders

Fail tests if problems violate schema.

---

# 81. Legacy Journal Entry Arena audit — what to preserve

The legacy application already demonstrates several useful patterns.

Preserve or adapt:

1. **GitHub Pages / static deployment**
2. **Config-driven class blocks and codes**
3. **localStorage after every answer**
4. **Firebase anonymous auth + Firestore**
5. **teacher live roster**
6. **CSV export**
7. **optional projector board**
8. **adaptive weighting toward weak categories**
9. **retrying missed concepts after a delay**
10. **tier gating**
11. **focused practice sets**
12. **mistake-specific distractor feedback**
13. **randomized answer positions**
14. **responsive/mobile-first CSS**
15. **light/dark support if easy**
16. **clear “theory/reference” access**
17. **optional written explanations**
18. **content/config separation**

These are proven implementation patterns and can save significant build time.

---

# 82. Legacy Journal Entry Arena audit — what must change

Do not carry these structures over merely because they exist.

## 82.1 Random opening round

Journal Entry Arena can begin with random categories because it is primarily practice.

Cash Flow Lab is teaching a new, highly confusing topic.

**Replace with a sequenced Learn mode.**

## 82.2 Category-only scoring

Cash-flow confusion often occurs within a concept.

**Add concept × skill diagnostics.**

## 82.3 Same question architecture for every topic

Journal Entry Arena uses timing calls + entry selection.

Cash Flow Lab requires different interaction types:
- statement scan
- change calculation
- reasoning chain
- line placement
- statement construction

## 82.4 Multiple-choice recognition as the endpoint

Full statement mastery requires construction.

**Capstones must require active building, not choosing among four completed statements.**

## 82.5 Always-visible score pressure

Keep learning status visible, but reduce score clutter during guided instruction.

## 82.6 Public competition by default

Make leaderboard optional/off by default.

## 82.7 Anti-cheat during ordinary practice

Do not replace a learning problem simply because the student switched apps/tabs.

Reserve that for assessment mode.

## 82.8 Monolithic source

The old one-file student app is fast to deploy but difficult to extend safely at this sophistication.

Use static modular files while preserving no-build deployment.

---

# 83. Do not over-engineer Version 1

High sophistication does not mean unnecessary platform complexity.

Do not block deployment on:
- user accounts with passwords
- a custom backend
- serverless functions
- AI grading
- elaborate animations
- LMS integration
- district SSO
- real-time multiplayer
- custom analytics infrastructure

The product can be excellent with:
- static HTML/CSS/JS
- localStorage
- Firebase
- strong curriculum
- strong adaptive logic
- strong teacher dashboard

---

# 84. Development phases

The coding agent should work in this order.

## Phase A — Functional skeleton

Deliver:
- new app shell
- join flow
- home/progress map
- module routing
- local state
- statement-rendering components
- SCF builder
- no cloud dependency

Test manually.

## Phase B — Foundation + A/R

Implement the full instructional quality for:
- Cash Mystery
- Three Sections
- Why Operating differs
- A/R

This is the reference-quality vertical slice.

Before mass-producing modules, confirm:
- workbench feels clear
- WHERE/SEE/... flow works
- statement placement works
- remediation works
- mobile is usable

## Phase C — Remaining timing concepts

A/P, accrued, unearned, prepaid, inventory, timing connections.

## Phase D — Noncash + gains/losses + Investing/Financing

## Phase E — Capstones

Implement and validate complete statements.

## Phase F — Adaptive practice/mastery

## Phase G — Firebase + teacher dashboard

Reuse proven legacy infrastructure where useful.

## Phase H — polish / assessment / optional board

Do not spend early time polishing a leaderboard while the learning flow is incomplete.

---

# 85. Coding-agent operating instructions

When building:

1. Read this specification fully.
2. Inspect the legacy source.
3. Create a new app; do not overwrite the old Journal Entry Arena unless explicitly told.
4. Preserve a static deployable architecture.
5. Build the vertical slice first.
6. Run automated tests frequently.
7. Use browser/screenshot inspection if available.
8. Audit each screen from the perspective of a student who is genuinely confused.
9. Fix confusing UX, not merely functional bugs.
10. Continue until the complete deployment package and documentation exist.

If a detail is not specified:
- prefer conceptual clarity
- prefer fewer simultaneous demands
- prefer accounting-native visuals
- prefer deterministic behavior
- prefer transparent logic
- prefer reliable deployment

---

# 86. Required “confused student” audit

Before declaring the build complete, simulate these personas.

## Persona A — “Net Income is cash”
Student repeatedly assumes Net Income already equals Operating cash.

The app should:
- detect the pattern
- route back to the recognition-vs-cash bridge
- avoid merely repeating signs

## Persona B — “I know signs but not meaning”
Student gets A/R adjustment correct but cannot answer “customers owe more or less?”

The app should not mark conceptual mastery.

## Persona C — “I reverse beginning and ending”
Student understands A/R but calculates change backward.

The app should target change calculation.

## Persona D — “Assets always subtract”
Student correctly subtracts Inventory increase but incorrectly tries to subtract a decrease or applies the rule to Cash.

The app should force classification as operating timing account + direction.

## Persona E — “Inventory and A/P double count”
Student thinks both adjustments should not appear.

The interaction lesson must demonstrate the cancellation on credit purchase.

## Persona F — “Gain equals cash proceeds”
Student puts the gain amount in Investing.

The app must separate book-value math from actual proceeds.

## Persona G — “I can do individual lines but not a whole statement”
Student performs well in isolated practice but gets lost among full statements.

The guided capstone should teach the scan order and WHERE map again.

Document any changes made after this audit.

---

# 87. Required acceptance criteria — educational

The build is not complete unless all are true.

### E1
A new student sees **why the SCF exists** before adjustment rules.

### E2
The three-section model is established before detailed Operating adjustments.

### E3
The indirect-method purpose is explained before sign rules.

### E4
Every major timing account has a plain-English economic story.

### E5
A/R is taught as:
change → meaning → cash/revenue relation → adjustment.

### E6
A/P/accrued are taught as expense/cost recognized before cash payment.

### E7
Unearned and Prepaid are taught as cash-first timing stories.

### E8
Inventory receives its own explanation and the Inventory/A/P interaction.

### E9
The asset/liability shortcut appears only after conceptual derivation.

### E10
Depreciation add-back is explained as noncash.

### E11
Gain/loss treatment clearly separates Operating removal from Investing proceeds.

### E12
Investing and Financing teach where to look and the need for actual cash amounts.

### E13
Students place each learned item onto an actual SCF layout.

### E14
At least one guided and one less-guided complete statement exist.

### E15
A full statement reconciles beginning to ending Cash.

### E16
Hints/remediation step backward in reasoning rather than immediately reveal answers.

### E17
The app differentiates at least locate/change/interpret/connect/adjust/place skills.

### E18
A student can intentionally focus practice on a weak concept.

### E19
Reference includes territory map and construction checklist.

### E20
No core learning task depends on memorizing a sign without meaning.

---

# 88. Required acceptance criteria — UX

### U1
A student can always tell:
- what they are learning
- why
- where they are in the overall map

### U2
The primary action on each screen is visually obvious.

### U3
Early screens do not show irrelevant statement clutter.

### U4
Source data and SCF destination are visibly connected.

### U5
The app works on Chromebook-sized screens and phones.

### U6
No required drag-and-drop.

### U7
Reference/hints do not erase current work.

### U8
Reload/resume does not lose meaningful progress.

### U9
Wrong answers produce targeted feedback.

### U10
Correct answers do not force long repetitive reading.

### U11
No default countdown or speed ranking.

### U12
Animations respect reduced-motion settings.

### U13
No color-only indicators.

### U14
Student can revisit completed modules and practice them.

### U15
The capstone does not feel like a disconnected quiz; it visibly builds a statement.

---

# 89. Required acceptance criteria — functional

### F1
Static GitHub Pages deployment works.

### F2
App works in local-only mode with Firebase null.

### F3
Progress saves locally after each meaningful action.

### F4
Firebase sync, when configured, does not block local interaction.

### F5
Teacher dashboard receives live progress.

### F6
CSV export works.

### F7
All generated problem IDs and seeds are reproducible.

### F8
No generated problem can have an incorrect or ambiguous official solution under its stated assumptions.

### F9
All capstones reconcile exactly.

### F10
No console errors in normal flow.

### F11
No uncaught error when Firebase is unavailable.

### F12
Config can switch Unearned vs Deferred label.

### F13
Leaderboard can be disabled completely.

### F14
Assessment anti-cheat settings do not affect normal Learn mode unless enabled.

### F15
State schema is versioned.

---

# 90. Required acceptance criteria — testing

Implement automated tests for at least:

1. account change calculations
2. working-capital adjustment directions
3. depreciation add-back
4. gain/loss math
5. sale proceeds distinction
6. investing/financing classification
7. noncash transaction exclusion
8. capstone totals
9. beginning/ending cash reconciliation
10. generator invariants
11. mastery state transitions
12. retry scheduling
13. content schema validation

Run the tests before final delivery.

If browser automation is available, also test:

- join
- finish A/R module
- use hint
- wrong-answer remediation
- resume after reload
- guided capstone
- responsive mobile width
- Firebase-null mode

---

# 91. Manual QA checklist

The coding agent should manually inspect at least:

- 390×844 phone-sized viewport
- 768×1024 tablet
- 1366×768 Chromebook/laptop

For each:
- no hidden primary buttons
- statement numbers legible
- no accidental horizontal page overflow
- bottom drawers accessible
- keyboard focus visible
- source/destination relationship clear

Test both:
- light theme
- dark theme if supported

---

# 92. Teacher documentation deliverables

Create `TEACHER_GUIDE.md` containing:

- what students are learning
- recommended 90-minute use
- how to interpret mastery states
- how to read the dashboard
- how to assign focus practice
- what the capstones measure
- how to enable/disable leaderboard
- how to change Unearned/Deferred terminology
- what is intentionally out of scope
- how to reset a student's local progress
- privacy note: first name + last initial only

---

# 93. Content-authoring documentation

Create `CONTENT_GUIDE.md` containing:

- taxonomy
- problem schema
- generator pattern
- misconception coding
- how to add a problem
- how to add a new concept
- how to write feedback
- numeric rules
- required tests
- assumptions language

Include at least one complete A/R content example.

This allows future AI sessions or teachers to extend the app without reverse-engineering the code.

---

# 94. Deployment documentation

Create `DEPLOY.md` with two paths.

## Path A — Instant local-only GitHub Pages

1. Create/upload repo
2. Ensure `config.js` has `firebase: null`
3. Enable GitHub Pages from main/root
4. Open site
5. App works with browser-local progress

## Path B — Classroom cloud sync

1. Create or choose Firebase project
2. Enable Anonymous Authentication
3. Create Firestore
4. copy Firebase web config into `config.js`
5. deploy `firestore.rules`
6. authorize teacher UID/document according to implemented teacher-auth pattern
7. set block names/codes
8. test student + teacher + optional board
9. enable GitHub Pages

If reusing the Journal Entry Arena Firebase project:
- use `cfl_` collection prefixes
- do not overwrite JEA collections/rules without merging safely
- document the merged rules carefully

---

# 95. README

`README.md` should begin with:

- what the app is
- live/deployment status
- file map
- quick local preview command, e.g. `python -m http.server`
- tests command
- links to BUILD_SPEC, DEPLOY, TEACHER_GUIDE, CONTENT_GUIDE

Keep it concise.

---

# 96. Build completion report

When the coding agent finishes, it should report:

1. What was built
2. Which legacy components/patterns were reused
3. What was redesigned
4. Test results
5. How to deploy
6. Firebase status / any missing credentials
7. Known limitations
8. Recommended next refinement after students use it

Do not call the build complete merely because files were generated.

---

# 97. Quality bar

The app should be judged by this question:

> **If a capable but confused student has never truly understood the Statement of Cash Flows, does the product make the logic progressively inevitable?**

The strongest moments should feel like:

> “Oh — that’s why.”

not:

> “Okay, I guess that’s another rule I have to remember.”

The product should help students perceive a small number of deep patterns:

1. **Cash and recognition can happen at different times.**
2. **Some Income Statement items are noncash.**
3. **Some Net Income effects belong to transactions whose cash is elsewhere.**
4. **Investing and Financing focus on actual cash.**
5. **The final statement must explain the actual change in Cash.**

Everything should reinforce those patterns.

---

# 98. Short design doctrine for future changes

When adding any new feature or problem, ask:

### Does it help the student know where to look?
If not, do not add unnecessary document clutter.

### Does it help the student understand what the number means?
If not, avoid sign-only practice.

### Does it connect accrual information to cash?
If not, question whether it belongs in this unit.

### Does it end in the real Statement of Cash Flows?
If not, ensure the concept eventually gets placed.

### Does it make the student's misconception diagnosable?
If not, improve response logging/feedback.

### Does it reduce or increase cognitive load?
Add complexity only when it develops a required skill.

### Is the accounting claim universally true?
If not, state the assumption or scope.

---

# 99. Final student success definition

A successful student should eventually be able to say, in substance:

> “The Statement of Cash Flows explains why Cash changed. I start by finding the change in Cash. For Operating under the indirect method, I begin with Net Income because that’s the accrual result, then fix timing differences, noncash items, and gains or losses that do not belong in Operating cash. I know where to look for those adjustments on the Income Statement and the current operating section of the Balance Sheet. Then I use long-term asset information and supplemental facts for actual Investing cash, and debt/equity information for Financing cash. Finally, Operating plus Investing plus Financing must equal the actual change in Cash.”

And the student should be able to execute that procedure on financial statements.

That is the learning target.

---

# 100. Handoff prompt for the coding agent

Use this exact prompt, or something very close to it:

> **Build the complete deployable application described in `CASH_FLOW_LAB_BUILD_SPEC.md`. Read that specification fully before modifying or creating code. Treat it as authoritative for pedagogy, learning progression, UX, accounting logic, diagnostics, and acceptance criteria.**
>
> **Also inspect the supplied Journal Entry Arena source. It is a reference for reusable infrastructure and proven patterns—GitHub Pages deployment, localStorage, Firebase/Firestore, class joining, adaptive practice, teacher dashboard, focus sets, retry logic, and optional leaderboard. It is NOT the UX or instructional template for the new app. Do not constrain Cash Flow Lab to the Journal Entry Arena interface. If the legacy design conflicts with the spec, the spec wins.**
>
> **Create a new project/app rather than overwriting Journal Entry Arena. Keep the result static, GitHub-Pages-ready, and usable with `firebase: null`. Use modular vanilla JavaScript unless there is a compelling reason not to; production should not require a server or build step.**
>
> **Work autonomously. Build a reference-quality vertical slice first, then complete every required module, adaptive logic, capstones, teacher dashboard, tests, and deployment documentation. Run the tests. Inspect the UX at desktop/Chromebook, tablet, and mobile sizes. Perform the “confused student” audit from the spec and fix issues you find.**
>
> **Do not stop at scaffolding, pseudo-code, or partial files. Deliver a complete working application. If Firebase credentials are not available, leave them uninvented, make local-only mode fully functional, and document exactly how to add Firebase later.**
>
> **At completion, report what was built, what was reused from the legacy app, test results, deployment steps, known limitations, and the most valuable next refinement.**

---

# 101. Final implementation principle

**Do not simplify away the sophistication of the learning design in order to reproduce the old app quickly.**

Reuse the old app where reuse accelerates:
- deployment
- persistence
- cloud sync
- dashboards
- adaptive infrastructure

But spend the new product's sophistication on:
- sequencing
- conceptual framing
- document navigation
- statement-native visuals
- misconception diagnosis
- scaffold fading
- integrated statement construction

The old application proves that a lightweight classroom web app can be reliable and deployable.

Cash Flow Lab should prove that the same practical delivery model can support a much deeper learning experience.
