import type { CheckResult, ContextVerdict } from "./types";

/**
 * "Try to fool it" — an illustrative lookup table, not a model.
 *
 * The visitor edits one ticket and sees what the four context tests make of
 * it. Every outcome is a literal row below: the page finds the row that
 * matches the four toggles and prints it. Nothing is computed in the browser
 * beyond that lookup.
 *
 * The behaviour terms are held at #2071's values (intercept and anomaly terms
 * other than the manufactured-context indicator: −1.90 + 0.26 + 0.15 + 0.08 +
 * 0.07 = −1.34), so only the context changes between rows. The rules the
 * table encodes, which verify-fixtures.mjs re-derives for every row:
 *
 *   precedence      fails only if the ticket was created after the access
 *   provenance      fails if the subject created it
 *   scope           fails if it names a different repository
 *   proportionality fails if the access covers 40 repositories
 *
 *   verdict    provenance fail → suspicious (+2.20)
 *              else scope fail → absent (0.00): the record is about something else
 *              else all pass   → authorised (−2.60)
 *              else            → partial (−1.10)
 *   indicator  +0.41 when the subject wrote the ticket less than a day ahead
 *              (self-created, then access soon after: the manufactured-context
 *              pattern)
 *   logit = −1.34 + indicator + γ;   risk = round(σ(logit) × 100)
 *
 * The row "subject · 40 minutes · this repository · 1 repository" is #2071:
 * logit +1.27, risk 78.
 */

export type FoolAuthor = "lead" | "self";
export type FoolLead = "1d" | "40m" | "after";
export type FoolTarget = "this" | "other";
export type FoolBreadth = "1" | "40";

export interface FoolRow {
  author: FoolAuthor;
  lead: FoolLead;
  target: FoolTarget;
  breadth: FoolBreadth;
  tests: Record<"precedence" | "provenance" | "scope" | "proportionality", CheckResult>;
  verdict: ContextVerdict;
  indicator: number;
  gamma: number;
  logit: number;
  risk: number;
}

export const FOOL_BEHAVIOUR_LOGIT = -1.34;
export const FOOL_INDICATOR = 0.41;

export const FOOL_OPTIONS = {
  author: [
    { value: "lead", label: "Their team lead" },
    { value: "self", label: "The person themselves" },
  ],
  lead: [
    { value: "1d", label: "1 day before" },
    { value: "40m", label: "40 min before" },
    { value: "after", label: "10 min after (backdated)" },
  ],
  target: [
    { value: "this", label: "payments-core (the copied code)" },
    { value: "other", label: "billing-web (a different project)" },
  ],
  breadth: [
    { value: "1", label: "1 repository" },
    { value: "40", label: "40 repositories" },
  ],
} as const;

export const FOOL_TABLE: FoolRow[] = [
  { author: "lead", lead: "1d", target: "this", breadth: "1", tests: { precedence: "pass", provenance: "pass", scope: "pass", proportionality: "pass" }, verdict: "authorised", indicator: 0, gamma: -2.6, logit: -3.94, risk: 2 },
  { author: "lead", lead: "1d", target: "this", breadth: "40", tests: { precedence: "pass", provenance: "pass", scope: "pass", proportionality: "fail" }, verdict: "partial", indicator: 0, gamma: -1.1, logit: -2.44, risk: 8 },
  { author: "lead", lead: "1d", target: "other", breadth: "1", tests: { precedence: "pass", provenance: "pass", scope: "fail", proportionality: "pass" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "lead", lead: "1d", target: "other", breadth: "40", tests: { precedence: "pass", provenance: "pass", scope: "fail", proportionality: "fail" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "lead", lead: "40m", target: "this", breadth: "1", tests: { precedence: "pass", provenance: "pass", scope: "pass", proportionality: "pass" }, verdict: "authorised", indicator: 0, gamma: -2.6, logit: -3.94, risk: 2 },
  { author: "lead", lead: "40m", target: "this", breadth: "40", tests: { precedence: "pass", provenance: "pass", scope: "pass", proportionality: "fail" }, verdict: "partial", indicator: 0, gamma: -1.1, logit: -2.44, risk: 8 },
  { author: "lead", lead: "40m", target: "other", breadth: "1", tests: { precedence: "pass", provenance: "pass", scope: "fail", proportionality: "pass" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "lead", lead: "40m", target: "other", breadth: "40", tests: { precedence: "pass", provenance: "pass", scope: "fail", proportionality: "fail" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "lead", lead: "after", target: "this", breadth: "1", tests: { precedence: "fail", provenance: "pass", scope: "pass", proportionality: "pass" }, verdict: "partial", indicator: 0, gamma: -1.1, logit: -2.44, risk: 8 },
  { author: "lead", lead: "after", target: "this", breadth: "40", tests: { precedence: "fail", provenance: "pass", scope: "pass", proportionality: "fail" }, verdict: "partial", indicator: 0, gamma: -1.1, logit: -2.44, risk: 8 },
  { author: "lead", lead: "after", target: "other", breadth: "1", tests: { precedence: "fail", provenance: "pass", scope: "fail", proportionality: "pass" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "lead", lead: "after", target: "other", breadth: "40", tests: { precedence: "fail", provenance: "pass", scope: "fail", proportionality: "fail" }, verdict: "absent", indicator: 0, gamma: 0, logit: -1.34, risk: 21 },
  { author: "self", lead: "1d", target: "this", breadth: "1", tests: { precedence: "pass", provenance: "fail", scope: "pass", proportionality: "pass" }, verdict: "suspicious", indicator: 0, gamma: 2.2, logit: 0.86, risk: 70 },
  { author: "self", lead: "1d", target: "this", breadth: "40", tests: { precedence: "pass", provenance: "fail", scope: "pass", proportionality: "fail" }, verdict: "suspicious", indicator: 0, gamma: 2.2, logit: 0.86, risk: 70 },
  { author: "self", lead: "1d", target: "other", breadth: "1", tests: { precedence: "pass", provenance: "fail", scope: "fail", proportionality: "pass" }, verdict: "suspicious", indicator: 0, gamma: 2.2, logit: 0.86, risk: 70 },
  { author: "self", lead: "1d", target: "other", breadth: "40", tests: { precedence: "pass", provenance: "fail", scope: "fail", proportionality: "fail" }, verdict: "suspicious", indicator: 0, gamma: 2.2, logit: 0.86, risk: 70 },
  { author: "self", lead: "40m", target: "this", breadth: "1", tests: { precedence: "pass", provenance: "fail", scope: "pass", proportionality: "pass" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "40m", target: "this", breadth: "40", tests: { precedence: "pass", provenance: "fail", scope: "pass", proportionality: "fail" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "40m", target: "other", breadth: "1", tests: { precedence: "pass", provenance: "fail", scope: "fail", proportionality: "pass" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "40m", target: "other", breadth: "40", tests: { precedence: "pass", provenance: "fail", scope: "fail", proportionality: "fail" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "after", target: "this", breadth: "1", tests: { precedence: "fail", provenance: "fail", scope: "pass", proportionality: "pass" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "after", target: "this", breadth: "40", tests: { precedence: "fail", provenance: "fail", scope: "pass", proportionality: "fail" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "after", target: "other", breadth: "1", tests: { precedence: "fail", provenance: "fail", scope: "fail", proportionality: "pass" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
  { author: "self", lead: "after", target: "other", breadth: "40", tests: { precedence: "fail", provenance: "fail", scope: "fail", proportionality: "fail" }, verdict: "suspicious", indicator: 0.41, gamma: 2.2, logit: 1.27, risk: 78 },
];
