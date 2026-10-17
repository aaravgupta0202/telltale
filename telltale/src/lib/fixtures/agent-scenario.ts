import type { CohortStats, CompositeTimeline, Dossier, Subject } from "./types";

/**
 * The AI-agent scenario — #A-0317 "release-bot".
 *
 * An agent with valid credentials is hijacked by an instruction hidden in a
 * file it was asked to read (indirect prompt injection). Nothing about its
 * login changes: same token, same runner network. What changes is the
 * TRAJECTORY — read task files → open one file → query the customer table →
 * POST outside the allow-list — and that chain is what scores.
 *
 * tellTale never reads file contents, so it does not "see" the instruction.
 * It sees that the agent changed direction immediately after opening a file
 * edited two days earlier by an account with no history in the repository.
 *
 * Agents are registered separately from the 100-identity seeded population:
 * that population's cohort statistics and Sensor coverage are load-bearing
 * elsewhere, and an agent belongs in its own peer group anyway.
 *
 * The chain closes exactly (verify-fixtures.mjs asserts it):
 *   −1.90 + 3.21 + 0.63 + 0.62 + 0.36 + 0.00 − 1.10 = +1.82
 *   σ(1.82) = 0.8606 → 0.86 → risk 86;  86 × 0.95 = 81.70
 *   perplexity 99.1 → ln(99.1 / 4) = 3.21
 *   Z = (17 − 10) / (1.4826 × 2) = +2.36 → 0.34 × (2.36 − 0.5) = 0.63
 *   4 first-ever resources → 0.09 × 4 = 0.36;  1 egress path → 0.62
 */

/** Nine other agents in the workspace, distinct resources per run. */
export const AGENT_PEERS: CohortStats = {
  cohort: "AI agents",
  n: 9,
  median: 10,
  mad: 2,
  values: [6, 7, 8, 9, 10, 11, 12, 13, 14],
};

export const AGENT_SUBJECTS: Subject[] = [
  {
    id: "subject_A-0317",
    pseudonym: "#A-0317",
    label: "release-bot",
    cohort: "AI agents",
    cohortSize: 10,
    identityClass: "agent",
    tenureDays: 41,
    sensorEquipped: false,
    risk: 86,
    assetCriticality: 0.95,
    expectedCost: 81.7,
    verdict: "partial",
    topSignal: "Unusual order of actions: odd file, customer search, data sent out",
    status: "new",
    resourcesTouched: 17,
  },
];

const agentDossier: Dossier = {
  subjectId: "subject_A-0317",
  verdictLabel: "HIGH",
  logitTotal: 1.82,
  probability: 0.86,
  risk: 86,
  headline:
    "This AI agent normally writes release notes. Right after opening one help file, it searched the customer database and sent data to an unknown outside address. Its login was normal; what changed was what it did. That pattern usually means an instruction was hidden in the file (prompt injection).",
  contributions: [
    {
      feature: "Base rate (intercept)",
      evidence:
        "Every account starts here. In the last 30 days, 3 of 23 cases turned out to be real",
      logit: -1.9,
    },
    {
      feature: "Trajectory surprisal",
      evidence:
        "Read a file, then searched customer data, then sent data out: session perplexity 99.1, extremely rare for this agent",
      logit: 3.21,
    },
    {
      feature: "Volumetric deviation",
      evidence: "17 files and systems, against a typical 10 for AI agents (spread 2) — robust Z = +2.36",
      logit: 0.63,
    },
    {
      feature: "Novel egress path",
      evidence:
        "Sent data to collector.example.net, which is not an allowed destination; never done before in 90 days",
      logit: 0.62,
    },
    {
      feature: "Resource novelty",
      evidence: "4 things it had never touched before, including the customer table",
      logit: 0.36,
    },
    {
      feature: "Geo / ASN novelty",
      evidence: "Same server network and the same access key as every previous run",
      logit: 0,
    },
    {
      feature: "Context verification",
      evidence:
        "PARTLY APPROVED — RELEASE-118 covers reading task files, not customer data or sending data out",
      logit: -1.1,
    },
  ],
  checks: [
    {
      test: "precedence",
      result: "pass",
      recordId: "RELEASE-118",
      createdAt: "2026-09-14T06:00:00Z",
      finding:
        "The task was created 1 hour 10 minutes before the run, well over the 30-minute minimum.",
    },
    {
      test: "provenance",
      result: "pass",
      recordId: "RELEASE-118",
      createdBy: "subject_6302",
      finding:
        "Assigned by subject_6302 from the release team, not by the agent itself.",
    },
    {
      test: "scope",
      result: "fail",
      recordId: "RELEASE-118",
      finding:
        "The task covers release notes and the changelog. It says nothing about the customer database or any outside address.",
    },
    {
      test: "proportionality",
      result: "fail",
      finding:
        "Writing release notes means reading a few files and opening one code review. It gives no reason to read customer records or send data out.",
    },
  ],
  comparison: {
    metric: "Distinct resources touched",
    caption:
      "9 other AI agents in this company, over their last 30 runs each. None of them searched a customer table, and none sent data to an address that isn't allowed.",
    subjectValue: 17,
    stats: AGENT_PEERS,
    zScore: 2.36,
  },
  attackPath: {
    nodes: [
      {
        id: "tasks",
        label: "repo.file.read",
        sublabel: "release/TASKS.md · how every run starts",
        sensitivity: "low",
        x: 0,
        y: 60,
      },
      {
        id: "faq",
        label: "repo.file.read",
        sublabel: "docs/vendor-faq.md · edited by an outsider",
        sensitivity: "medium",
        x: 210,
        y: 60,
      },
      {
        id: "db",
        label: "db.query",
        sublabel: "Customer table · first time ever",
        sensitivity: "critical",
        x: 420,
        y: 60,
      },
      {
        id: "post",
        label: "http.post",
        sublabel: "collector.example.net · not allowed",
        sensitivity: "critical",
        x: 630,
        y: 60,
      },
    ],
    edges: [
      { from: "tasks", to: "faq", probability: 0.41 },
      { from: "faq", to: "db", probability: 0.0009, anomalous: true },
      { from: "db", to: "post", probability: 0.0006, anomalous: true },
    ],
  },
  evidence: [
    {
      id: "ev-a1",
      ts: "2026-09-14T07:10:04Z",
      kind: "Identity",
      detail: "Agent started a run with its usual access key and network",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-a2",
      ts: "2026-09-14T07:10:31Z",
      kind: "Action",
      detail: "Read its task list, release/TASKS.md (repo.file.read)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-a3",
      ts: "2026-09-14T07:12:48Z",
      kind: "Action",
      detail: "Read the help file docs/vendor-faq.md (repo.file.read)",
      source: "GitHub Enterprise",
    },
    {
      id: "ev-a4",
      ts: "2026-09-14T07:13:20Z",
      kind: "Action",
      detail: "Searched the customer table; 2,400 rows came back (db.query)",
      source: "AWS CloudTrail",
    },
    {
      id: "ev-a5",
      ts: "2026-09-14T07:14:02Z",
      kind: "Action",
      detail: "Sent 1.8 MB to collector.example.net, which is not an allowed destination (http.post)",
      source: "AWS CloudTrail",
    },
    {
      id: "ev-a6",
      ts: "2026-09-14T06:00:00Z",
      kind: "Context record",
      detail: "RELEASE-118: write the release notes and changelog, assigned by subject_6302",
      source: "Jira",
    },
    {
      id: "ev-a7",
      ts: "2026-09-12T18:41:00Z",
      kind: "Change",
      detail: "docs/vendor-faq.md was edited by an outside contributor making their first ever change here",
      source: "GitHub Enterprise",
    },
  ],
  sensorNote:
    "AI agents run on servers, not laptops, so the two signals that need the desktop app don't apply. tellTale never reads file contents: the hidden instruction was inferred from what the agent did next.",
};

export const AGENT_DOSSIERS: Dossier[] = [agentDossier];

export const AGENT_TIMELINES: CompositeTimeline[] = [
  {
    subjectId: "subject_A-0317",
    session: [
      {
        t: 180,
        ts: "2026-09-14T03:00:02Z",
        action: "agent.token.issue",
        sensitivity: "low",
        note: "Nightly run",
      },
      {
        t: 430,
        ts: "2026-09-14T07:10:04Z",
        action: "agent.token.issue",
        sensitivity: "low",
        note: "Same network and access as every previous run",
      },
    ],
    trajectory: [
      {
        t: 180,
        ts: "2026-09-14T03:00:40Z",
        action: "repo.file.read",
        resource: "release/TASKS.md",
        sensitivity: "low",
      },
      {
        t: 184,
        ts: "2026-09-14T03:04:12Z",
        action: "repo.pr.open",
        resource: "release-notes#311",
        sensitivity: "low",
        note: "How a normal run ends",
      },
      {
        t: 430,
        ts: "2026-09-14T07:10:31Z",
        action: "repo.file.read",
        resource: "release/TASKS.md",
        sensitivity: "low",
      },
      {
        t: 432,
        ts: "2026-09-14T07:12:48Z",
        action: "repo.file.read",
        resource: "docs/vendor-faq.md",
        sensitivity: "medium",
        note: "Edited 2 days ago by an outsider",
      },
      {
        t: 433,
        ts: "2026-09-14T07:13:20Z",
        action: "db.query",
        resource: "prod-crm.customers",
        sensitivity: "critical",
        firstEver: true,
        note: "First time ever · 2,400 rows",
      },
      {
        t: 434,
        ts: "2026-09-14T07:14:02Z",
        action: "http.post",
        resource: "collector.example.net",
        sensitivity: "critical",
        firstEver: true,
        note: "Not an allowed destination",
      },
    ],
    context: [
      {
        from: 360,
        to: 600,
        recordId: "RELEASE-118",
        label: "Release-notes task · covers reading task files only",
        verdict: "partial",
      },
    ],
    risk: [
      { t: 0, risk: 9 },
      { t: 430, risk: 9 },
      { t: 432, risk: 14 },
      { t: 433, risk: 52 },
      { t: 434, risk: 86 },
      { t: 1439, risk: 86 },
    ],
  },
];
