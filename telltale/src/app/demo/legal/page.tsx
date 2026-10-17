import { Ban, Check, FileSignature, Minus } from "lucide-react";
import { cn } from "cn";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import {
  JURISDICTION_PROFILES,
  LAW_ROWS,
  LEGAL_DISCLAIMER,
  NEVER_COLLECTED,
  PROFILE_CHANGE_NOTE,
  PROFILE_FEATURES,
  type FeatureState,
} from "@/lib/fixtures";

export const metadata = { title: "Legality — tellTale" };

const STATE: Record<FeatureState, { label: string; Icon: typeof Check; cls: string }> = {
  on: { label: "On", Icon: Check, cls: "text-emerald-700" },
  off: { label: "Off", Icon: Minus, cls: "text-slate-400" },
  agreement: { label: "Needs works agreement", Icon: FileSignature, cls: "text-amber-700" },
};

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Legality"
        description="What tellTale switches on in each country, the laws behind that, and what it never collects anywhere."
      />

      <div className="mb-4 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        {LEGAL_DISCLAIMER}
      </div>

      <Panel
        title="Country rules"
        sub="Each company picks one when it sets tellTale up. This demo uses the India / US rules."
        bodyClassName="p-0"
        className="mb-4"
        footnote={PROFILE_CHANGE_NOTE}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50/70 text-left">
                <th className="label px-4 py-2 text-grey">Feature</th>
                {JURISDICTION_PROFILES.map((p) => (
                  <th key={p.id} className="label px-3 py-2 text-ink">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {PROFILE_FEATURES.map((f) => (
                <tr key={f.key}>
                  <td className="px-4 py-2 text-slate-700">{f.label}</td>
                  {JURISDICTION_PROFILES.map((p) => {
                    const s = STATE[p.features[f.key]];
                    return (
                      <td key={p.id} className={cn("px-3 py-2 text-xs", s.cls)}>
                        <span className="inline-flex items-center gap-1">
                          <s.Icon className="size-3.5 shrink-0" />
                          {s.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-slate-50/50 align-top">
                <td className="px-4 py-2 text-xs text-grey">In short</td>
                {JURISDICTION_PROFILES.map((p) => (
                  <td key={p.id} className="px-3 py-2 text-xs leading-relaxed text-slate-600">
                    {p.summary}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Main laws" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-slate-50/70 text-left">
                  <th className="label px-4 py-2 text-grey">Law</th>
                  <th className="label px-3 py-2 text-grey">What it requires</th>
                  <th className="label px-3 py-2 text-grey">What tellTale does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top">
                {LAW_ROWS.map((r) => (
                  <tr key={r.law}>
                    <td className="px-4 py-2 text-xs font-semibold text-ink">{r.law}</td>
                    <td className="px-3 py-2 text-xs leading-relaxed text-slate-600">{r.requires}</td>
                    <td className="px-3 py-2 text-xs leading-relaxed text-slate-700">{r.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Never collected"
          sub="Under any country rules, by either part of tellTale."
          footnote="tellTale only needs activity details: who did what, to which system, when and in what order."
        >
          <ul className="space-y-2">
            {NEVER_COLLECTED.map((n) => (
              <li key={n} className="flex items-center gap-2 text-sm text-ink">
                <Ban className="size-4 shrink-0 text-red-600" />
                {n}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
