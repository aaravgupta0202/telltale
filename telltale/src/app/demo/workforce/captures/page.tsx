import { Camera, Clock, Radio, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { CaptureGallery } from "@/components/workforce/capture-gallery";
import { CAPTURES } from "@/lib/fixtures";

export const metadata = { title: "Screen captures - tellTale" };

export default function CapturesPage() {
  const triggered = CAPTURES.filter((c) => c.mode === "triggered").length;

  return (
    <>
      <PageHeader
        eyebrow="HR part"
        title="Screenshots"
        description="Optional screenshots: regular ones every 5 minutes during work hours, plus ones triggered by an HR rule. In this demo the pictures are generated or generic samples, never anyone's real screen."
      />

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat
          icon={Camera}
          label="Screenshots today"
          value={String(CAPTURES.length)}
          sub="across laptops with the desktop app"
        />
        <Stat
          icon={Clock}
          label="Regular"
          value={String(CAPTURES.length - triggered)}
          sub="every 5 minutes"
        />
        <Stat
          icon={Radio}
          label="Triggered"
          value={String(triggered)}
          sub="taken because an HR rule fired"
        />
        <Stat
          icon={ShieldCheck}
          label="Real screens shown"
          value="0"
          sub="all pictures are generated or generic samples"
        />
      </div>

      <Panel
        bodyClassName="p-0"
        footnote="Under EU rules, regular screenshots are switched off and only alert-triggered ones remain. The country rules in use are shown at the bottom of the sidebar."
      >
        <CaptureGallery />
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
      <p className="machine mt-1.5 text-2xl leading-none font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-slate-500">{sub}</p>
    </div>
  );
}
