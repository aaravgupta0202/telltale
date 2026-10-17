import { ShieldCheck, ListFilter, AlertCircle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { SuppressionTable } from "@/components/risk/suppression-table";
import {
  RAISED_ANOMALIES,
  SUPPRESSED_BY_CONTEXT,
  SUPPRESSIONS,
} from "@/lib/fixtures";

export const metadata = { title: "Approved activity - tellTale" };

export default function SuppressionsPage() {
  const underReview = SUPPRESSIONS.filter((s) => s.underReview).length;
  const pct = Math.round((SUPPRESSED_BY_CONTEXT / RAISED_ANOMALIES) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Security part"
        title="Approved activity"
        description="Unusual events that tellTale closed automatically because a company record explained them. Each one is kept with the record, who created it and when, so anyone can check the decision later."
      />

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat
          icon={ShieldCheck}
          label="Closed automatically"
          value={SUPPRESSED_BY_CONTEXT.toLocaleString("en-US")}
          sub={`${pct}% of ${RAISED_ANOMALIES.toLocaleString("en-US")} unusual events`}
        />
        <Stat
          icon={ListFilter}
          label="Shown here"
          value={String(SUPPRESSIONS.length)}
          sub="the most recent ones, every reason"
        />
        <Stat
          icon={AlertCircle}
          label="Reopened"
          value={String(underReview)}
          sub="the approving ticket turned out to be self-made"
        />
        <Stat
          icon={Trash2}
          label="Deleted"
          value="0"
          sub="nothing is thrown away; every close can be undone"
        />
      </div>

      <Panel
        bodyClassName="p-0"
        footnote="Keeping these means every automatic decision can be checked. Anyone reviewing can open a row, read the record that approved it, and disagree."
      >
        <SuppressionTable />
      </Panel>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="panel px-4 py-3 bg-white border border-line rounded-sm ">
      <div className="flex items-center justify-between">
        <p className="label text-slate-500">{label}</p>
        <Icon className="size-4 text-emerald-600" />
      </div>
      <p className="machine mt-1.5 truncate text-2xl leading-none font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-slate-500">{sub}</p>
    </div>
  );
}
