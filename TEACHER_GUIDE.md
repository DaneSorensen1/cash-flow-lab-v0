# Teacher Guide — Cash Flow Lab

## What students learn
Why the Statement of Cash Flows exists (explain the change in Cash), the three sections, why Net Income is not operating cash, and the indirect-method Operating reconciliation in three families: timing differences (A/R, A/P, accrued, unearned, prepaids, inventory), noncash items (depreciation/amortization), and gains/losses (remove from Operating; proceeds in Investing). Then Investing and Financing as *actual cash* from supplemental facts, the noncash boundary, and two complete-statement capstones.

Every concept runs the same grammar: **WHERE → SEE → INTERPRET → CONNECT → ACT → PLACE**. The scaffold fades (full chain → short chain → "handle the adjustment" → mixed statement → capstone). The asset/liability shortcut is only revealed after students derive each account.

## The 90-minute first run
- 0–12 min: Foundation (Cash Mystery, Three Sections, Why Net Income Is Not Cash)
- 12–55 min: Timing accounts (A/R, A/P & Accrued, Unearned, Prepaids, Inventory incl. the Inventory/A/P offset) with two "connection reveal" screens
- 55–75 min: Noncash items, Gains & Losses
- 75–85 min: Investing, Financing, noncash deal, construction checklist
- 85+: Guided capstone. Progress saves after every answer; students finish next time from the same screen.
Say once: "The app never ends a set; it just pauses. Keep going until I say stop."

## Mastery states (per concept)
- **Learning** — tutorial/guided only · **Practicing** — some independent work · **Secure** — 3+ recent independent tries, ≥75% weighted, both directions · **Mastered** — 5+, ≥85%, at least one mixed-context success, no reveal in the last 3.
Guided success never counts as mastery; hints lower the weight; "Show the answer" counts as learned-from, not mastered. Thresholds live in `config.js → mastery`.

## Reading the dashboard (`teacher.html`)
- **Overview**: current module, concepts introduced, Secure+, recent independent accuracy, hints, capstone status, last active, a "needs help" dot (accuracy < 60%, > 8 hints in last 20, or many weak concepts late in the unit).
- **Concept map**: L/P/S/M per concept. **Skill map**: pick a concept and see locate / calculate change / meaning / cash connection / adjustment / placement, so you can tell "knows the sign but not the meaning" from "cannot find the account."
- **Misconceptions**: class counts by code (M01–M30; see `CONTENT_GUIDE.md`), with names. Click a student for explanations and capstone line-by-line misses.
- **CSV** button: one row per student.

## Assigning practice
Students can pick any introduced concept under Practice → Focus (6 questions, varied skills, then back to the mix with extra of that concept). "Practice my weakest" picks for them. The arena-style retry queue brings missed items back 3–7 questions later.

## Settings (`config.js`)
- `terminology.unearnedRevenue`: "Unearned Revenue" or "Deferred Revenue" (first introduction always says both).
- `leaderboard.enabled`: off by default; if on, `board.html` ranks by concepts secure/mastered only.
- `assessment`: hints off, copy blocking, question swap on leaving the tab. Off by default; never affects normal Learn mode.
- `explanations.requireAtMilestones`: require a sentence at milestones (A/R, Inventory/A/P, depreciation, gains, capstone).

## Out of scope (by design)
Direct method, interest/taxes detail, deferred taxes, foreign currency, restricted cash, leases, acquisitions, investment classifications.

## Resetting a student
Student: Progress → "Reset my progress on this device" (keeps the name). Teacher: nothing to do in Firestore; the next sync overwrites the summary.

## Privacy
First name + last initial, block, anonymous id. No email, student id, or full last name is collected.
