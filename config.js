// Cash Flow Lab — teacher settings. Edit this file; nothing else needs to change.
window.CFL_CONFIG = {
  appName: "Cash Flow Lab",
  company: "Beacon Bike & Repair",

  // Students pick a block and type its code on the first visit. Codes are a light gate only.
  blocks: [
    { id: "G3", name: "Gold 3 — Advanced Accounting", code: "FLOW3" }
  ],
  requireCode: true,

  terminology: { unearnedRevenue: "Unearned Revenue" },   // or "Deferred Revenue"

  curriculum: {
    includeAccruedLiabilities: true,
    includeInventory: true,
    includeAmortization: true,
    includeLongTermInvestments: false,
    includeInterestPaid: false,
    includeNoncashDisclosure: true
  },

  mastery: { secureThreshold: 0.75, masteryThreshold: 0.85, recentWindow: 6 },

  practice: { focusSize: 6, mixedSize: 10, retryMinGap: 3, retryMaxGap: 7 },

  explanations: { requireAtMilestones: false, minChars: 15 },

  leaderboard: { enabled: false },

  // Assessment mode only. Leave these off for normal learning.
  assessment: { enabled: false, disableHints: false, swapOnLeave: false, noCopy: false },

  // Paste the Firebase web config object here to turn on the class record (see DEPLOY.md). null = local-only.
  firebase: null
};
