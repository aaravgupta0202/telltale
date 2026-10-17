export * from "./types";
export * from "./population";
export * from "./queue";
export * from "./queue-dossiers";
export * from "./dossiers";
export * from "./queue-timelines";
export * from "./timelines";
export * from "./connectors";
export * from "./suppressions";
export * from "./dashboard";
export * from "./workforce";
export * from "./agent-scenario";
export * from "./assistant";
export * from "./fool-it";
export * from "./jurisdictions";

import { DOSSIERS } from "./dossiers";
import { QUEUE_DOSSIERS } from "./queue-dossiers";
import { AGENT_DOSSIERS, AGENT_SUBJECTS } from "./agent-scenario";
import { SUBJECTS } from "./population";
import type { Dossier, Subject } from "./types";

/** Every subject with an investigation page: the three scenarios, the queue and the agent. */
export const ALL_DOSSIERS: Dossier[] = [...DOSSIERS, ...QUEUE_DOSSIERS, ...AGENT_DOSSIERS];

/** The seeded population plus the separately registered AI agents. */
export const SCORED_SUBJECTS: Subject[] = [...SUBJECTS, ...AGENT_SUBJECTS];

export function subjectFor(subjectId: string): Subject | undefined {
  return SCORED_SUBJECTS.find((s) => s.id === subjectId);
}

export function dossierFor(subjectId: string): Dossier | undefined {
  return ALL_DOSSIERS.find((d) => d.subjectId === subjectId);
}

/** Pseudonym without the '#', for route params. */
export function routeIdFor(subjectId: string): string {
  return subjectId.replace("subject_", "");
}
