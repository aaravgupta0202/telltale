import type { Dossier } from "./types";
import { BACKEND_PEERS } from "./population";

/**
 * The three authored scenarios. Every number here is a literal, chosen so the
 * chain closes exactly (scripts/verify-fixtures.mjs asserts all of it):
 *
 *   Σ contributions = logitTotal   →   σ(logitTotal) = probability
 *   round(probability × 100) = risk
 *   zScore = (subjectValue − cohort median) / (1.4826 × cohort MAD)
 *
 * One intercept is shared by all three subjects, and by the twelve generated
 * queue dossiers, because a logistic model has one intercept. β₀ = −1.90 gives
 * σ(−1.90) = 13.0%, a prior over SCORED IDENTITIES read straight off the
 * dashboard: 3 confirmed findings from 23 investigations in 30 days is 13.0%.
 * A much more negative intercept would force every benign-but-authorised
 * subject to carry implausible anomaly mass simply to reach its own displayed
 * score, which is how a contribution table ends up contradicting itself.
 *
 * NOTE ON THE MASTER DOCUMENT: §1.9 prints Marcus's contributions summing to
 * +9.70 alongside a calibrated 0.93. Those two cannot both be true under
 * σ(Σ) — σ(9.70) = 0.9999. The master document resolves it with an isotonic
 * calibration step (§2.7) between the raw sum and the displayed probability.
 * The PRD instead requires the displayed chain to close directly (§6), and the
 * PRD governs this build. So the features and evidence strings below are the
 * master document's; the coefficients have been refitted so a judge with a
 * calculator finds σ(Σ) = the printed probability. Master doc §2.6 already
 * describes these as "initial values fitted on the simulator, not universal
 * constants", so refitting them is in character.
 *
 * Context terms γ are the master doc §2.6 values, unchanged:
 *   authorised −2.60 · partial −1.10 · absent 0.00 · suspicious +2.20
 */

const INTERCEPT_EVIDENCE =
  "Every account starts here. In the last 30 days, 3 of 23 cases turned out to be real";

/** 17 of the 33 Backend Engineering peers cloned a new repository in 90 days. */
const COHORT_CAPTION_SHARED =
  "Of the 33 teammates, 17 copied a code repository they had never used before in the last 90 days. All 17 had a ticket approving it, and none of them uploaded anything outside the company.";

/* ------------------------------------------------------------ #8830 Priya */

const priya: Dossier = {
  subjectId: "subject_8830",
  verdictLabel: "SUPPRESSED",
  logitTotal: -1.82,
  probability: 0.14,
  risk: 14,
  headline:
    "Copied the payments-core code for the first time. A ticket for exactly this work, assigned by a teammate the day before, explains it, so no alert was raised.",
  contributions: [
    {
      feature: "Base rate (intercept)",
      evidence: INTERCEPT_EVIDENCE,
      logit: -1.9,
    },
    {
      feature: "Resource novelty",
      evidence: "First time using payments-core in 180 days, with no earlier changes to it",
      logit: 1.35,
    },
    {
      feature: "Trajectory surprisal",
      evidence:
        "Copying code and then opening a code review is the most common path for developers here (P = 0.38)",
      logit: 0.62,
    },
    {
      feature: "Composition drift",
      evidence:
        "Time spent coding is up 9 points compared with 2–3 months ago, after allowing for the team (JSD 0.11)",
      logit: 0.43,
    },
    {
      feature: "Employment signal",
      evidence: "Active employee; moved teams 12 days ago (Workday)",
      logit: 0.28,
    },
    {
      feature: "Volumetric deviation",
      evidence: "9 files and systems, against a typical 12 for the team (spread 4) — robust Z = -0.51",
      logit: 0,
    },
    {
      feature: "Cohort divergence",
      evidence: "No drift away from teammates over recent weeks (D = -0.08)",
      logit: 0,
    },
    {
      feature: "Geo / ASN novelty",
      evidence: "Usual office network, used for 214 logins in 180 days",
      logit: 0,
    },
    {
      feature: "Presence divergence",
      evidence: "The laptop was in use for all 5 actions",
      logit: 0,
    },
    {
      feature: "Context verification",
      evidence:
        "APPROVED — ticket TICKET-4471 passed all four checks",
      logit: -2.6,
    },
  ],
  checks: [
    {
      test: "precedence",
      result: "pass",
      recordId: "TICKET-4471",
      createdAt: "2026-09-13T09:12:00Z",
      finding:
        "The ticket was created 25 hours before the code was copied. The minimum is 30 minutes.",
    },
    {
      test: "provenance",
      result: "pass",
      recordId: "TICKET-4471",
      createdBy: "subject_5530",
      finding:
        "Assigned by subject_5530, a different person, so it counts in full.",
    },
    {
      test: "scope",
      result: "pass",
      recordId: "TICKET-4471",
      finding:
        "The ticket names payments-core, the exact code that was copied.",
    },
    {
      test: "proportionality",
      result: "pass",
      finding:
        "9 files and systems for a one-project task. Normal for this kind of work.",
    },
  ],
  comparison: {
    metric: "Distinct resources touched",
    caption: COHORT_CAPTION_SHARED,
    subjectValue: 9,
    stats: BACKEND_PEERS,
    zScore: -0.51,
  },
  attackPath: {
    nodes: [
      {
        id: "okta",
        label: "okta.session.start",
        sublabel: "Office network · Bengaluru",
        sensitivity: "low",
        x: 0,
        y: 60,
      },
      {
        id: "clone",
        label: "github.repo.clone",
        sublabel: "payments-core · first ever",
        sensitivity: "critical",
        x: 210,
        y: 60,
      },
      {
        id: "branch",
        label: "github.branch.create",
        sublabel: "fix/ledger-rounding",
        sensitivity: "medium",
        x: 420,
        y: 60,
      },
      {
        id: "pr",
        label: "github.pr.open",
        sublabel: "#2244 · asked teammates to review",
        sensitivity: "low",
        x: 630,
        y: 60,
      },
    ],
    edges: [
      { from: "okta", to: "clone", probability: 0.34 },
      { from: "clone", to: "branch", probability: 0.52 },
      { from: "branch", to: "pr", probability: 0.38 },
    ],
  },
  evidence: [
    {
      id: "ev-p1",
      ts: "2026-09-14T09:06:12Z",
      kind: "Identity",
      detail: "Logged in from the office network on a registered laptop (okta.session.start)",
      source: "Okta",
    },
    {
      id: "ev-p2",
      ts: "2026-09-13T09:12:00Z",
      kind: "Context record",
      detail: "TICKET-4471: work on payments-core, assigned by subject_5530",
      source: "Jira",
    },
    {
      id: "ev-p3",
      ts: "2026-09-14T10:15:41Z",
      kind: "Action",
      detail: "Copied payments-core (github.repo.clone)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-p4",
      ts: "2026-09-14T11:04:55Z",
      kind: "Action",
      detail: "Opened code review #2244 (github.pr.open)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-p5",
      ts: "2026-09-14T10:15:41Z",
      kind: "Presence",
      detail: "Laptop in use, with Visual Studio Code open",
      source: "Sensor",
    },
    {
      id: "ev-p6",
      ts: "2026-09-14T10:15:41Z",
      kind: "Suppression record",
      detail: "Alert closed as sup-000 because a ticket matches the work; kept on record",
      source: "tellTale",
    },
  ],
};

/* ----------------------------------------------------------- #4912 Marcus */

const marcus: Dossier = {
  subjectId: "subject_4912",
  verdictLabel: "CRITICAL",
  logitTotal: 2.59,
  probability: 0.93,
  risk: 93,
  headline:
    "At 1 a.m. this account copied the payments code, packed it into an archive and uploaded it outside the company, all within 28 minutes. No company record approves any of it.",
  contributions: [
    {
      feature: "Base rate (intercept)",
      evidence: INTERCEPT_EVIDENCE,
      logit: -1.9,
    },
    {
      feature: "Trajectory surprisal",
      evidence:
        "An upload straight after making an archive happens about 4 times in 10,000 here (P = 0.0004)",
      logit: 1.42,
    },
    {
      feature: "Employment signal",
      evidence:
        "Handed in their resignation 4 days ago (Workday); last day is in 10 days",
      logit: 1.05,
    },
    {
      feature: "Novel egress path",
      evidence:
        "Uploaded to cloud storage outside the company's accounts, never done before in 180 days",
      logit: 0.83,
    },
    {
      feature: "Volumetric deviation",
      evidence: "410 files and systems, against a typical 12 for the team (spread 4) — robust Z = +67.11",
      logit: 0.62,
    },
    {
      feature: "Geo / ASN novelty",
      evidence:
        "Logged in through a commercial VPN in Zurich never used before (ASN 51167); 4.1 hours of travel from the previous login",
      logit: 0.38,
    },
    {
      feature: "Presence divergence",
      evidence: "3 actions while the person's laptop was locked",
      logit: 0.19,
    },
    {
      feature: "Context verification",
      evidence: "NO APPROVAL — no ticket, on-call shift or HR record covers this",
      logit: 0,
    },
  ],
  checks: [
    {
      test: "precedence",
      result: "fail",
      finding:
        "No ticket, on-call shift, HR record or calendar entry exists for this time.",
    },
    { test: "provenance", result: "fail", finding: "There is no record, so there is no author to check." },
    {
      test: "scope",
      result: "fail",
      finding: "No record mentions payments-core.",
    },
    {
      test: "proportionality",
      result: "fail",
      finding:
        "410 files and systems is far more than any normal task in this team.",
    },
  ],
  comparison: {
    metric: "Distinct resources touched",
    caption: COHORT_CAPTION_SHARED,
    subjectValue: 410,
    stats: BACKEND_PEERS,
    zScore: 67.11,
  },
  attackPath: {
    nodes: [
      {
        id: "okta",
        label: "okta.session.start",
        sublabel: "VPN in Zurich · first time in 180 days",
        sensitivity: "medium",
        x: 0,
        y: 60,
      },
      {
        id: "clone",
        label: "github.repo.clone",
        sublabel: "payments-core · first ever",
        sensitivity: "critical",
        x: 210,
        y: 60,
      },
      {
        id: "archive",
        label: "github.archive.create",
        sublabel: "410 files into bundle.tar.gz",
        sensitivity: "critical",
        x: 420,
        y: 60,
      },
      {
        id: "s3",
        label: "aws.s3.put_object",
        sublabel: "Storage outside the company",
        sensitivity: "critical",
        x: 630,
        y: 60,
      },
    ],
    edges: [
      { from: "okta", to: "clone", probability: 0.31 },
      { from: "clone", to: "archive", probability: 0.07 },
      { from: "archive", to: "s3", probability: 0.0004, anomalous: true },
    ],
  },
  evidence: [
    {
      id: "ev-m1",
      ts: "2026-09-14T01:14:03Z",
      kind: "Identity",
      detail: "Logged in through a commercial VPN in Zurich (okta.session.start)",
      source: "Okta",
    },
    {
      id: "ev-m2",
      ts: "2026-09-14T01:18:20Z",
      kind: "Identity",
      detail:
        "Login prompt approved from a device never seen before (okta.mfa.challenge)",
      source: "Okta",
    },
    {
      id: "ev-m3",
      ts: "2026-09-14T01:22:47Z",
      kind: "Action",
      detail: "Copied payments-core (github.repo.clone)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-m4",
      ts: "2026-09-14T01:35:11Z",
      kind: "Action",
      detail: "Packed 410 files into bundle.tar.gz (github.archive.create)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-m5",
      ts: "2026-09-14T01:42:02Z",
      kind: "Action",
      detail: "Uploaded the archive to storage outside the company (aws.s3.put_object)",
      source: "AWS CloudTrail",
    },
    {
      id: "ev-m6",
      ts: "2026-09-10T16:04:00Z",
      kind: "Employment",
      detail:
        "Resignation filed; last day 2026-09-24",
      source: "Workday",
    },
    {
      id: "ev-m7",
      ts: "2026-09-14T01:12:00Z",
      kind: "Presence",
      detail: "Laptop locked from 01:12 to 01:58",
      source: "Sensor",
    },
    {
      id: "ev-m8",
      ts: "2026-09-14T01:22:47Z",
      kind: "Capture",
      detail:
        "A screenshot was taken automatically and sealed; viewing it needs two approvals",
      source: "Sensor",
    },
  ],
};

/* ------------------------------------------------------------- #2071 Dana */

const dana: Dossier = {
  subjectId: "subject_2071",
  verdictLabel: "HIGH",
  logitTotal: 1.27,
  probability: 0.78,
  risk: 78,
  headline:
    "A ticket approves this work, but this person wrote it and assigned it to themselves 40 minutes before copying the code. On its own the behaviour is only mildly unusual; the fake approval is what makes it serious.",
  contributions: [
    {
      feature: "Base rate (intercept)",
      evidence: INTERCEPT_EVIDENCE,
      logit: -1.9,
    },
    {
      feature: "Manufactured-context indicator",
      evidence:
        "Created a ticket, assigned it to themselves, then used a system for the first time soon after",
      logit: 0.41,
    },
    {
      feature: "Cohort divergence",
      evidence:
        "Drifting away from teammates for 6 weeks: +260% compared with the team (D = +2.41)",
      logit: 0.26,
    },
    {
      feature: "Resource novelty",
      evidence: "Has never made changes to payments-core before",
      logit: 0.15,
    },
    {
      feature: "Volumetric deviation",
      evidence: "38 files and systems, against a typical 12 for the team (spread 4) — robust Z = +4.38",
      logit: 0.08,
    },
    {
      feature: "Composition drift",
      evidence:
        "Time spent moving files is up 22 points compared with 2–3 months ago (JSD 0.19)",
      logit: 0.07,
    },
    {
      feature: "Geo / ASN novelty",
      evidence: "Usual office network, used for 186 logins in 180 days",
      logit: 0,
    },
    {
      feature: "Presence divergence",
      evidence: "The laptop was in use for all actions",
      logit: 0,
    },
    {
      feature: "Employment signal",
      evidence: "Active employee; no HR changes in 180 days",
      logit: 0,
    },
    {
      feature: "Context verification",
      evidence:
        "FAKE APPROVAL — the ticket was made by this account, so it counts against it",
      logit: 2.2,
    },
  ],
  checks: [
    {
      test: "precedence",
      result: "pass",
      recordId: "TICKET-9920",
      createdAt: "2026-09-14T14:07:00Z",
      finding:
        "The ticket was created 40 minutes before the code was copied, just over the 30-minute minimum.",
    },
    {
      test: "provenance",
      result: "fail",
      recordId: "TICKET-9920",
      createdBy: "subject_2071",
      finding: "Created by subject_2071 — the subject of this investigation, who then assigned it to themselves.",
    },
    {
      test: "scope",
      result: "pass",
      recordId: "TICKET-9920",
      finding: "The ticket names payments-core, the exact code that was copied.",
    },
    {
      test: "proportionality",
      result: "warn",
      finding:
        "38 files and systems for a one-project task, by someone who has never worked on it. That is more than 95% of similar tasks.",
    },
  ],
  comparison: {
    metric: "Distinct resources touched",
    caption:
      "Of the 33 teammates, 17 copied a code repository they had never used before in the last 90 days. All 17 had a ticket assigned by someone else; none of them wrote their own.",
    subjectValue: 38,
    stats: BACKEND_PEERS,
    zScore: 4.38,
  },
  attackPath: {
    nodes: [
      {
        id: "create",
        label: "jira.ticket.create",
        sublabel: "TICKET-9920 · written by themselves",
        sensitivity: "medium",
        x: 0,
        y: 60,
      },
      {
        id: "assign",
        label: "jira.ticket.assign",
        sublabel: "assigned to themselves",
        sensitivity: "high",
        x: 190,
        y: 60,
      },
      {
        id: "clone",
        label: "github.repo.clone",
        sublabel: "payments-core · first ever",
        sensitivity: "critical",
        x: 380,
        y: 60,
      },
      {
        id: "archive",
        label: "github.archive.create",
        sublabel: "38 files into export.tar.gz",
        sensitivity: "critical",
        x: 570,
        y: 60,
      },
      {
        id: "sync",
        label: "dropbox.file.upload",
        sublabel: "Personal Dropbox account",
        sensitivity: "critical",
        x: 760,
        y: 60,
      },
    ],
    edges: [
      { from: "create", to: "assign", probability: 0.02 },
      { from: "assign", to: "clone", probability: 0.0007, anomalous: true },
      { from: "clone", to: "archive", probability: 0.07 },
      { from: "archive", to: "sync", probability: 0.003, anomalous: true },
    ],
  },
  evidence: [
    {
      id: "ev-d1",
      ts: "2026-09-14T14:05:38Z",
      kind: "Context record",
      detail: "Created TICKET-9920 for work on payments-core (jira.ticket.create)",
      source: "Jira",
    },
    {
      id: "ev-d2",
      ts: "2026-09-14T14:07:02Z",
      kind: "Context record",
      detail: "Assigned TICKET-9920 to themselves, subject_2071 (jira.ticket.assign)",
      source: "Jira",
    },
    {
      id: "ev-d3",
      ts: "2026-09-14T14:47:09Z",
      kind: "Action",
      detail: "Copied payments-core (github.repo.clone)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-d4",
      ts: "2026-09-14T15:02:44Z",
      kind: "Action",
      detail: "Packed 38 files into export.tar.gz (github.archive.create)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-d5",
      ts: "2026-09-14T15:19:27Z",
      kind: "Action",
      detail: "Uploaded the archive to a personal Dropbox account (dropbox.file.upload)",
      source: "Google Workspace",
    },
    {
      id: "ev-d6",
      ts: "2026-08-03T00:00:00Z",
      kind: "Baseline",
      detail: "2–3 months ago, 11% of time went on moving files; now it is 33%",
      source: "tellTale",
    },
    {
      id: "ev-d7",
      ts: "2026-09-14T14:47:09Z",
      kind: "Suppression record",
      detail: "This was first closed automatically because a ticket matched; that close is now under review",
      source: "tellTale",
    },
  ],
};

export const DOSSIERS: Dossier[] = [priya, marcus, dana];

/** The three scenarios, in the order the demo launcher presents them. */
export const SCENARIO_IDS = [
  "subject_8830",
  "subject_4912",
  "subject_2071",
] as const;

export const CONTEXT_GAMMA = {
  authorised: -2.6,
  partial: -1.1,
  absent: 0,
  suspicious: 2.2,
} as const;

export const MODEL_INTERCEPT = -1.9;
