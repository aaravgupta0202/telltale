import Link from "next/link";
import {
  ArrowRight,
  Layers,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { ConnectorStrip } from "@/components/connectors/strip";
import { NoiseBar } from "@/components/dashboard/noise-bar";
import { RiskTrend } from "@/components/dashboard/risk-trend";
import {
  DASHBOARD_LEDE,
  NOISE_FOOTNOTE,
  SENSOR_COVERAGE,
  STAT_TILES,
  SUBJECTS,
  AGENT_SUBJECTS,
} from "@/lib/fixtures";

const ICONS = [Layers, ShieldCheck, UserCheck, AlertTriangle];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security part"
        title="Overview"
        description={DASHBOARD_LEDE.replace(/ — /g, ": ")}
        right={
          <Link
            href="/demo/queue"
            className="flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <span>Review alerts</span>
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      {/* Row 1: the descent from a million events to three findings. */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_TILES.map((t, i) => {
          const Icon = ICONS[i] ?? Layers;
          return (
            <div key={t.label} className="panel p-4">
              <div className="flex items-center justify-between">
                <p className="label text-grey">{t.label}</p>
                <Icon className="size-4 text-emerald-600" />
              </div>
              <p className="machine mt-2 text-3xl leading-none font-semibold text-ink">{t.value}</p>
              <p className="mt-2.5 text-xs leading-relaxed text-grey">{t.sub.replace(/ — /g, ": ")}</p>
            </div>
          );
        })}
      </div>

      {/* Row 2: where the noise went, and what the month looked like. */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel
          title="What happened to every unusual event"
          sub="Each unusual event in the last 30 days, grouped by what explained it. Most were normal work backed by a ticket, an on-call shift, approved travel or a role change. Closed events are kept, not deleted."
          bodyClassName="p-0"
          footnote={NOISE_FOOTNOTE.replace(/ — /g, ": ")}
        >
          <NoiseBar />
        </Panel>

        <Panel
          title="Highest score each day, last 30 days"
          sub="The highest score of any account on each day. Most days stay low; a tool that spikes every day would soon be ignored."
          bodyClassName="p-0"
          footnote="The three labelled peaks are this month's real problems. Click one to open its case."
        >
          <RiskTrend />
        </Panel>
      </div>

      {/* Row 3: connected tools */}
      <Panel
        title="App connections"
        sub="The six tools tellTale reads activity from. One of them has stopped sending data, which is itself treated as a warning."
        right={
          <Link
            href="/demo/connectors"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            <span>Connection details</span>
            <ArrowRight className="size-3" />
          </Link>
        }
        bodyClassName="p-0"
        footnote={`${SENSOR_COVERAGE.equipped} of ${SENSOR_COVERAGE.total} accounts also have the optional desktop app. The other ${
          SENSOR_COVERAGE.total - SENSOR_COVERAGE.equipped
        } are checked using cloud activity only, so two signals that need the app are missing for them; their case pages say so.`}
      >
        <ConnectorStrip />
      </Panel>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        This demo covers {SUBJECTS.length} made-up accounts and {AGENT_SUBJECTS.length} AI agent
        on a single example day, 14 September 2026. All figures were prepared in advance and
        checked automatically so they agree with each other.
      </p>
    </>
  );
}
