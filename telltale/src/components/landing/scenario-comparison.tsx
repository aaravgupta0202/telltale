import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "cn";

const PEOPLE = [
  {
    who: "Person 1",
    href: "/demo/subject/8830",
    score: 14,
    verdict: "No alert",
    Icon: CheckCircle2,
    tone: "emerald",
    did: "Copied the code, then opened a normal code review for their teammates.",
    records: "A ticket for exactly this work, assigned by their team lead the day before.",
    result: "The activity was unusual but fully explained, so the alert was closed automatically and the reason was saved.",
    basic: "Raises a false alarm that someone has to check by hand.",
  },
  {
    who: "Person 2",
    href: "/demo/subject/4912",
    score: 93,
    verdict: "Urgent",
    Icon: ShieldAlert,
    tone: "red",
    did: "Logged in at 1 a.m. from an unknown VPN, copied the code, zipped it and uploaded it outside the company.",
    records: "No ticket. Handed in their resignation four days earlier.",
    result: "Top of the queue, with the whole story on one timeline.",
    basic: "Three separate alerts in three different tools that nobody connects.",
  },
  {
    who: "Person 3",
    href: "/demo/subject/2071",
    score: 78,
    verdict: "Flagged",
    Icon: AlertTriangle,
    tone: "amber",
    did: "Copied the code, zipped it and uploaded it to a personal cloud account.",
    records: "A ticket exists, but they wrote it and assigned it to themselves 40 minutes before.",
    result: "The self-made ticket is treated as a warning sign, so it raises the score instead of lowering it.",
    basic: "Stays silent: a ticket exists and the amount looks normal.",
  },
] as const;

const TONE = {
  emerald: { card: "border-emerald-200 bg-emerald-50/30", chip: "bg-emerald-100 text-emerald-800", link: "border-emerald-300 text-emerald-800 hover:bg-emerald-50", who: "text-emerald-700" },
  red: { card: "border-red-200 bg-red-50/30", chip: "bg-red-100 text-red-800", link: "border-red-300 text-red-800 hover:bg-red-50", who: "text-red-700" },
  amber: { card: "border-amber-200 bg-amber-50/30", chip: "bg-amber-100 text-amber-900", link: "border-amber-300 text-amber-900 hover:bg-amber-50", who: "text-amber-700" },
};

export function ScenarioComparison() {
  return (
    <section id="scenarios" className="border-t border-line bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="max-w-3xl">
          <p className="label text-emerald-700">One command, three outcomes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Three people do exactly the same thing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Each of them copies the company&apos;s payments code, which none of them has touched
            before (
            <code className="rounded border border-line bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-emerald-800">
              git clone payments-core
            </code>
            ). A basic tool sees three identical events. tellTale looks at what happened around it
            and gives three different answers.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PEOPLE.map((p) => {
            const t = TONE[p.tone];
            return (
              <div key={p.who} className={cn("panel flex flex-col justify-between rounded-lg border p-6 shadow-xs", t.card)}>
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-line/70 pb-4">
                    <span className={cn("text-sm font-bold", t.who)}>{p.who}</span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", t.chip)}>
                      <p.Icon className="size-3.5" />
                      Score {p.score} · {p.verdict}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 text-xs leading-relaxed">
                    <div>
                      <dt className="font-semibold text-slate-800">What they did</dt>
                      <dd className="mt-0.5 text-slate-600">{p.did}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-800">Company records</dt>
                      <dd className="mt-0.5 text-slate-600">{p.records}</dd>
                    </div>
                    <div className="rounded-md border border-line bg-white p-3">
                      <dt className="font-semibold text-slate-800">What tellTale does</dt>
                      <dd className="mt-0.5 text-slate-600">{p.result}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">What a basic tool would do</dt>
                      <dd className="mt-0.5 text-slate-500">{p.basic}</dd>
                    </div>
                  </dl>
                </div>
                <Link
                  href={p.href}
                  className={cn(
                    "mt-6 flex items-center justify-between rounded border bg-white px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors",
                    t.link,
                  )}
                >
                  Open this case
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
