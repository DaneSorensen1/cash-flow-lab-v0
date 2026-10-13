# Deploying Cash Flow Lab

## Path A — instant, local-only (GitHub Pages)
1. Create a new public repository (e.g. `cash-flow-lab`).
2. Upload every file and folder in this package to the repo root (keep `css/`, `js/`, `tests/` folders; include `.nojekyll`).
3. `config.js`: set your block names and codes; leave `firebase: null`.
4. Settings → Pages → Branch: `main`, folder `/ (root)` → Save.
5. After a minute: `https://YOURNAME.github.io/cash-flow-lab/`. Progress saves in each student's browser.

## Path B — classroom cloud sync (teacher dashboard)
1. Firebase console → create a project (or reuse the Journal Entry Arena project; collections here are prefixed `cfl_` so they never collide).
2. Authentication → Sign-in method → **Anonymous** → Enable.
3. Firestore Database → Create (production mode).
4. Firestore → Rules → paste `firestore.rules` → Publish. (It contains both the `cfl_` rules and the arena rules, so a shared project keeps working.)
5. Project settings → Your apps → Web app → copy the `firebaseConfig` object into `config.js` as `firebase: { ... }`. These web config values are not secrets; security comes from the rules.
6. Authentication → Settings → Authorized domains → add `YOURNAME.github.io`.
7. Open `teacher.html`. It shows your anonymous id. Firestore → Start collection `cfl_teachers` → document id = that id → field `ok` (boolean, true). Refresh: the roster is live.
8. Commit `config.js`. Students' next page load starts syncing.

Students who played before Firebase was on keep their local progress; their summary is pushed on the next load.

## Updating later
Upload a changed file with the same name; GitHub replaces it. Student progress lives in the browser and in Firestore, not in the files, so updates never erase work. The state schema is versioned (`schemaVersion`) and migrated on load.

## Class codes and privacy
Codes in `config.js` are a light gate, not security (client code is readable). Only first name + last initial, block, and an anonymous UID are stored. Written explanations and misconception data are visible only to the authorized teacher.
