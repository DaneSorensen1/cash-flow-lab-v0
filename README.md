# Cash Flow Lab

A classroom web app that teaches the Statement of Cash Flows (indirect method) by making students read the cash story underneath accrual accounting, then build complete statements. Static files only: runs on GitHub Pages, works offline-first with browser-local progress, and optionally syncs to a Firebase class record for a live teacher dashboard.

**Status:** Version 1.0.0, local-only mode working out of the box (`firebase: null`). Built from `BUILD_SPEC.md`.

## Quick start
```
python3 -m http.server 8000      # then open http://localhost:8000/
node --test 'tests/*.test.mjs'   # 24 tests: accounting logic, generators, capstones, mastery, content
```
No build step. No npm install needed for production.

## File map
```
index.html          student app shell          teacher.html   live dashboard (needs Firebase)
board.html          optional public board (off)  config.js      ALL teacher settings
css/app.css, css/teacher.css
js/main.js          views + router             js/state.js    local persistence (cash_flow_lab_v1)
js/accounting.js    pure accounting functions  js/utils.js    seeded PRNG, formatting
js/curriculum/      concepts.js (stories, misconceptions, hints) · modules.js (Learn sequence)
                    generators.js (seeded problems) · capstones.js (fixed validated statements)
js/engine/          mastery.js (evidence/states) · selector.js (practice weighting, retry, focus)
js/ui/              statements.js (IS/BS/SCF renderers) · problem.js (step runner) · builder.js (capstone workbench)
js/cloud/firebase.js  optional class record (cfl_ collections)
tests/              node:test suites            firestore.rules
```

## Docs
- `DEPLOY.md` — GitHub Pages in five clicks; Firebase class record path
- `TEACHER_GUIDE.md` — what students learn, 90-minute plan, reading the dashboard, mastery states
- `CONTENT_GUIDE.md` — taxonomy, problem schema, how to add concepts/problems, feedback rules
- `BUILD_SPEC.md` — the authoritative specification
