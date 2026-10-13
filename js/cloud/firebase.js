// Optional class record. Pattern adapted from Journal Entry Arena: anonymous auth, local-first, best-effort sync, append-only attempts.
// Collections are prefixed cfl_ so a shared Firebase project never collides with the arena.
export const Cloud = {
  enabled:false, uid:null, db:null, fs:null, queue:[],
  async init(cfg, state, save){ if (!cfg.firebase) return; try {
    const [appM, authM, fsM] = await Promise.all([ import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'), import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js'), import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js') ]);
    const app = appM.initializeApp(cfg.firebase); const auth = authM.getAuth(app); const cred = await authM.signInAnonymously(auth);
    this.uid = cred.user.uid; state.uid = this.uid; save(); this.db = fsM.getFirestore(app); this.fs = fsM; this.enabled = true; this.state = state; this.cfg = cfg;
    if (state.identity.name) this.join(); this.flush();
  } catch(e){ console.warn('Class record unavailable:', e); } },
  async join(){ if (!this.enabled) return; try { await this.fs.setDoc(this.fs.doc(this.db,'cfl_players',this.uid), { name:this.state.identity.name, block:this.state.identity.block, updatedAt:this.fs.serverTimestamp() }, { merge:true }); this.sync(); } catch(e){ console.warn(e); } },
  async sync(summary){ if (!this.enabled) return; try { const s = summary || (this.summarize && this.summarize()); if (!s) return; await this.fs.setDoc(this.fs.doc(this.db,'cfl_stats',this.uid), Object.assign(s, { uid:this.uid, updatedAt:this.fs.serverTimestamp() }));
    if (this.cfg.leaderboard && this.cfg.leaderboard.enabled) await this.fs.setDoc(this.fs.doc(this.db,'cfl_public_stats',this.uid), { name:s.name, block:s.block, secure: Object.values(s.conceptStates||{}).filter(x=>x==='secure'||x==='mastered').length, updatedAt:this.fs.serverTimestamp() }); } catch(e){ console.warn(e); } },
  async record(rec){ if (!this.enabled){ this.queue.push(rec); return; } try { await this.fs.addDoc(this.fs.collection(this.db,'cfl_attempts'), Object.assign({ uid:this.uid, name:this.state.identity.name, block:this.state.identity.block }, rec, { ts:this.fs.serverTimestamp() })); } catch(e){ this.queue.push(rec); } },
  async flush(){ while (this.enabled && this.queue.length){ const r = this.queue.shift(); await this.record(r); } }
};
