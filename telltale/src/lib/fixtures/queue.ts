import { SUBJECTS } from "./population";
import { AGENT_SUBJECTS } from "./agent-scenario";
import type { Subject } from "./types";

/**
 * The investigation queue — PRD §5.2.
 *
 * Sorted by EXPECTED COST (risk × asset criticality), not by risk. Row 2 has a
 * higher raw risk than row 1 and sits below it: #7741 scores 96 on CI/CD
 * automation (criticality 0.88 → 84.5) while #4912 scores 93 on payments-core
 * (criticality 1.00 → 93.0). That inversion is the most interesting thing on
 * the page and it is deliberate — a 0.55 on production credentials outranks a
 * 0.80 on a marketing folder, and it should (master doc §1.10).
 *
 * #A-0317 is an AI agent, registered outside the seeded population (see
 * agent-scenario.ts). It ranks third: 86 × 0.95 = 81.7.
 *
 * Priya (#8830) is absent: she was suppressed. The link at the top of the page
 * goes to the log that proves it.
 */

const ORDER = [
  "subject_4912",
  "subject_7741",
  "subject_A-0317",
  "subject_2071",
  "subject_5530",
  "subject_1188",
  "subject_6302",
  "subject_3914",
  "subject_8125",
  "subject_4407",
  "subject_9663",
  "subject_2258",
  "subject_7015",
  "subject_5871",
  "subject_3340",
];

/** Age of the queue item at 19:59:12Z on the synthetic day. */
const AGES: Record<string, string> = {
  subject_4912: "18h 17m",
  subject_7741: "41m",
  "subject_A-0317": "12h 45m",
  subject_2071: "4h 40m",
  subject_5530: "3h 02m",
  subject_1188: "4h 37m",
  subject_6302: "5h 20m",
  subject_3914: "6h 48m",
  subject_8125: "8h 11m",
  subject_4407: "9h 25m",
  subject_9663: "11h 03m",
  subject_2258: "13h 40m",
  subject_7015: "16h 19m",
  subject_5871: "19h 52m",
  subject_3340: "22h 07m",
};

export interface QueueRow extends Subject {
  rank: number;
  age: string;
}

export const QUEUE_ROWS: QueueRow[] = ORDER.map((id, i) => {
  const subject = [...SUBJECTS, ...AGENT_SUBJECTS].find((s) => s.id === id);
  if (!subject) throw new Error(`queue references unknown subject ${id}`);
  return { ...subject, rank: i + 1, age: AGES[id] };
});

/** Rows after this index render at 60% opacity. Nothing is hidden. */
export const TRIAGE_CAPACITY_AFTER_RANK = 7;
export const TRIAGE_CAPACITY_LABEL =
  "Today's checking time: 6 analyst-hours";

export const QUEUE_SORT_FOOTNOTE =
  "The order is score × how important the system is, not the score alone. That is why #7741 (score 96) sits below #4912 (score 93): #4912 touched the payments code, which matters more.";

export const SUPPRESSED_TODAY = 1847;
