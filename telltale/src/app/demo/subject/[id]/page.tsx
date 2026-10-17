import { notFound } from "next/navigation";
import { Panel } from "@/components/panel";
import { AssistantPanel } from "@/components/risk/assistant-panel";
import { AttackPath } from "@/components/risk/attack-path";
import { CohortStrip } from "@/components/risk/cohort-strip";
import { CompositeTimelineChart } from "@/components/risk/composite-timeline";
import { ContextChecks } from "@/components/risk/context-checks";
import { ContributionTable } from "@/components/risk/contribution-table";
import { EvidenceList } from "@/components/risk/evidence-list";
import { InvestigationHeader } from "@/components/risk/investigation-header";
import {
  ALL_DOSSIERS,
  ASSISTANT_NOTE,
  ASSISTANT_QA,
  dossierFor,
  routeIdFor,
  subjectFor,
  timelineFor,
} from "@/lib/fixtures";

/** Every queue row plus the suppressed subject has a real page (PRD §6). */
export function generateStaticParams() {
  return ALL_DOSSIERS.map((d) => ({ id: routeIdFor(d.subjectId) }));
}

export async function generateMetadata(props: PageProps<"/demo/subject/[id]">) {
  const { id } = await props.params;
  return { title: `#${id} - Case Details - tellTale` };
}

export default async function SubjectPage(props: PageProps<"/demo/subject/[id]">) {
  const { id } = await props.params;
  const subjectId = `subject_${id}`;
  const dossier = dossierFor(subjectId);
  const subject = subjectFor(subjectId);
  const timeline = timelineFor(subjectId);
  if (!dossier || !subject || !timeline) notFound();
  const qa = ASSISTANT_QA[subjectId];

  return (
    <>
      <InvestigationHeader subject={subject} dossier={dossier} />

      <div className="flex flex-col gap-4">
        {qa && (
          <Panel
            title="Case assistant"
            sub="Pick a question to get a plain-English answer. Answers use only the events in this case and list which ones they used."
            bodyClassName="p-0"
            footnote={`${ASSISTANT_NOTE} Log text is treated as untrusted before any model reads it.`}
          >
            <AssistantPanel qa={qa} evidence={dossier.evidence} />
          </Panel>
        )}

        <Panel
          title="What happened, hour by hour"
          sub="Four rows on one clock for the whole day: logins, actions, the tickets or records that approved the work, and how the score changed."
          bodyClassName="p-0"
          footnote="Hover over any mark to see what it was. The colour of a mark shows how sensitive the action was; a ring means this account did it for the first time ever. All times are on 14 Sep 2026."
        >
          <CompositeTimelineChart timeline={timeline} />
        </Panel>

        <Panel
          title={`Why it scored ${dossier.risk}`}
          sub="Each row is one signal. Red points raise the score, green points lower it, and grey rows found nothing unusual. Together they add up to the final score."
          bodyClassName="p-0"
          footnote={
            dossier.sensorNote ??
            "Rows with zero points are shown anyway, so you can see what was checked and found normal."
          }
        >
          <ContributionTable
            contributions={dossier.contributions}
            logitTotal={dossier.logitTotal}
            probability={dossier.probability}
            risk={dossier.risk}
          />
        </Panel>

        <Panel
          title="Is the approval genuine?"
          sub="tellTale looked for a ticket, on-call shift or HR record that explains this activity, then ran four checks on it."
          bodyClassName="p-0"
        >
          <ContextChecks checks={dossier.checks} verdict={subject.verdict} />
        </Panel>

        <Panel
          title="The key steps, in order"
          sub="The main actions in this case. The number on each arrow is how often that step normally follows the one before it in this company. Red arrows are very rare."
          bodyClassName="p-0"
        >
          <AttackPath
            nodes={dossier.attackPath.nodes}
            edges={dossier.attackPath.edges}
          />
        </Panel>

        <Panel
          title="Compared with teammates"
          sub="How many different systems and files this account touched, next to others in the same role. Each dot is a teammate; the red diamond is this account."
          bodyClassName="p-0"
        >
          <CohortStrip comparison={dossier.comparison} />
        </Panel>

        <Panel
          title="Evidence"
          sub="The underlying records for this case. Only activity details are kept (who did what, where and when), never message text or file contents. You can tag or flag items as you review."
          bodyClassName="p-0"
        >
          <EvidenceList items={dossier.evidence} />
        </Panel>
      </div>
    </>
  );
}
