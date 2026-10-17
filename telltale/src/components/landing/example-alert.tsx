import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";

/**
 * A real alert from the demo, written out the way an analyst would read it.
 * Every fact here is the #4912 case: same times, same numbers.
 */
const EVENTS = [
  ["01:14", "Logged in from a VPN in Zurich it had never used before"],
  ["01:22", "Copied the payments-core code for the first time"],
  ["01:35", "Packed 410 files into a single archive"],
  ["01:42", "Uploaded the archive to storage outside the company"],
];

export function ExampleAlert() {
  return (
    <div className="panel rounded-lg border border-line bg-white shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="label text-slate-500">Example alert from the demo</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
          <ShieldAlert className="size-3.5" />
          Score 93 · Urgent
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-ink">
          Account <span className="machine">#4912</span>, Backend Engineering
        </p>
        <ol className="mt-3 space-y-2.5">
          {EVENTS.map(([time, what]) => (
            <li key={time} className="flex gap-3 text-sm">
              <span className="machine w-11 shrink-0 text-slate-500">{time}</span>
              <span className="text-slate-700">{what}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          <span className="font-semibold">Company records: </span>
          no ticket or on-call shift covers this. The person handed in their resignation four
          days ago.
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Each step is allowed on its own. Together, at 1 a.m., they look like someone taking the
          code before they leave.
        </p>
      </div>

      <Link
        href="/demo/subject/4912"
        className="flex items-center justify-between border-t border-line px-5 py-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        Open the full case
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
