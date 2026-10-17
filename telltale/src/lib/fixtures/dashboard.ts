import type { NoiseSegment, StatTile, TrendPoint } from "./types";

/**
 * Dashboard fixtures — PRD §5.1. The narrative is in the descent: 1.28M events
 * → 2,199 raised anomalies → 1,847 suppressed by context → 66 escalated →
 * 23 investigations after identity-level aggregation → 3 confirmed findings.
 *
 * Those numbers reconcile, and verify-fixtures.mjs checks that they do:
 *   1,847 / 2,199 = 84%  (the suppression claim on the tile)
 *   the four context reason codes sum to 1,847
 *   every segment percentage sums to 100, and every count sums to 2,199
 */

export const RAISED_ANOMALIES = 2199;
export const SUPPRESSED_BY_CONTEXT = 1847;
export const ESCALATED_ANOMALIES = 66;
export const INVESTIGATIONS = 23;

export const STAT_TILES: StatTile[] = [
  {
    label: "Activity records read",
    value: "1,284,402",
    sub: "in the last 30 days, from 6 connected tools",
  },
  {
    label: "Closed automatically",
    value: "1,847",
    sub: "84% of unusual events were explained by company records",
  },
  { label: "Cases for an analyst", value: "23", sub: "each with a timeline and an explanation" },
  {
    label: "Confirmed findings",
    value: "3",
    sub: "2 employees taking data, 1 stolen login",
  },
];

export const NOISE_SEGMENTS: NoiseSegment[] = [
  {
    label: "Matching ticket",
    reasonCode: "SCOPE_MATCHED_TICKET",
    pct: 52,
    count: 1143,
  },
  {
    label: "On call at the time",
    reasonCode: "ON_CALL_ROTATION",
    pct: 18,
    count: 396,
  },
  {
    label: "Approved travel",
    reasonCode: "APPROVED_TRAVEL",
    pct: 7,
    count: 154,
  },
  { label: "New role", reasonCode: "ROLE_CHANGE", pct: 7, count: 154 },
  {
    label: "Too small to matter",
    reasonCode: "BELOW_THRESHOLD",
    pct: 13,
    count: 286,
  },
  {
    label: "Sent to an analyst",
    reasonCode: "ESCALATED",
    pct: 3,
    count: 66,
    escalated: true,
  },
];

export const NOISE_FOOTNOTE =
  "The 66 events sent to an analyst were grouped by account, so they became 23 cases rather than 66 separate alerts. The 1,847 closed automatically are all kept, with the record that explained each one, in Approved activity.";

/**
 * Peak calibrated risk per day across the org, last 30 days. Mostly flat.
 *
 * PRD §5.1 asks for three labelled spikes corresponding to the three subjects.
 * Two of them are spikes. Priya's is not — her calibrated score is 14, because
 * context suppressed it — so her marker carries the raised score alongside it.
 * Plotting her raw 69 would misrepresent what the queue actually saw, and
 * plotting nothing would drop a third of the story.
 */
export const RISK_TREND: TrendPoint[] = [
  { date: "Aug 16", risk: 12 },
  { date: "Aug 17", risk: 9 },
  { date: "Aug 18", risk: 14 },
  { date: "Aug 19", risk: 11 },
  { date: "Aug 20", risk: 16 },
  { date: "Aug 21", risk: 13 },
  { date: "Aug 22", risk: 8 },
  { date: "Aug 23", risk: 7 },
  { date: "Aug 24", risk: 15 },
  { date: "Aug 25", risk: 12 },
  { date: "Aug 26", risk: 18 },
  { date: "Aug 27", risk: 14 },
  { date: "Aug 28", risk: 11 },
  { date: "Aug 29", risk: 9 },
  { date: "Aug 30", risk: 13 },
  { date: "Aug 31", risk: 17 },
  { date: "Sep 1", risk: 12 },
  { date: "Sep 2", risk: 15 },
  { date: "Sep 3", risk: 10 },
  { date: "Sep 4", risk: 14 },
  { date: "Sep 5", risk: 19 },
  { date: "Sep 6", risk: 8 },
  { date: "Sep 7", risk: 11 },
  { date: "Sep 8", risk: 16 },
  { date: "Sep 9", risk: 13 },
  { date: "Sep 10", risk: 21 },
  { date: "Sep 11", risk: 15 },
  { date: "Sep 12", risk: 12 },
  { date: "Sep 13", risk: 18 },
  {
    date: "Sep 14",
    risk: 93,
    spikeSubjectId: "subject_4912",
    spikeLabel: "#4912 · score 93 · nothing approved it",
  },
];

/** Markers drawn on the trend for the other two scenarios. */
export const TREND_MARKERS = [
  {
    date: "Sep 14",
    risk: 78,
    subjectId: "subject_2071",
    label: "#2071 · score 78 · wrote their own ticket",
  },
  {
    date: "Sep 14",
    risk: 14,
    raisedRisk: 69,
    subjectId: "subject_8830",
    label: "#8830 · 69, then 14 once the ticket was checked",
  },
] as const;

export const DASHBOARD_LEDE =
  "What happened across the company over the last 30 days: 1.28 million activity records, narrowed down to three real problems.";
