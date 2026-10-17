import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock,
  GitBranch,
  KeyRound,
  Laptop,
  PieChart,
  Scale,
  Share2,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
} from "lucide-react";

/** What tellTale watches for. The tag names the method for readers who want it. */
const SIGNALS = [
  {
    icon: Activity,
    name: "A sudden jump in activity",
    tag: "Volume vs. own normal",
    desc: "Mass downloads, exports or permission changes, compared with this account's usual days. One unusually busy day doesn't throw off the comparison.",
  },
  {
    icon: GitBranch,
    name: "An unusual order of actions",
    tag: "Sequence model",
    desc: "Copy, then zip, then upload outside is rare even when each step is common. tellTale knows how often one action follows another in your company.",
  },
  {
    icon: TrendingUp,
    name: "Slowly drifting away from teammates",
    tag: "Drift over weeks",
    desc: "Small changes week after week. Compared with a snapshot taken months earlier, so a slow change can't quietly become the new normal.",
  },
  {
    icon: Share2,
    name: "New outside contacts",
    tag: "Who talks to whom",
    desc: "Suddenly emailing or sharing with outside companies. Based only on who contacted whom, never on what the messages say.",
  },
  {
    icon: Laptop,
    name: "Activity while the laptop is locked",
    tag: "Needs desktop app",
    desc: "Cloud actions happening while the person's own laptop is locked or switched off: a sign that someone else is using their login.",
  },
  {
    icon: PieChart,
    name: "A change in the type of work",
    tag: "Needs desktop app",
    desc: "Someone's day shifts, for example from writing code to downloading and uploading files, and stays that way.",
  },
  {
    icon: KeyRound,
    name: "Touching a decoy",
    tag: "Planted traps",
    desc: "Fake passwords and files placed where no honest person would look. Using one is a strong warning on its own.",
  },
];

const APPROVAL_CHECKS = [
  {
    icon: Clock,
    name: "Made before?",
    rule: "Created at least 30 minutes before the activity.",
    stops: "Filing a ticket afterwards to cover your tracks.",
  },
  {
    icon: UserCheck,
    name: "Made by someone else?",
    rule: "Created or assigned by someone other than the person doing the work.",
    stops: "Writing and assigning your own permission slip.",
  },
  {
    icon: Target,
    name: "Names this system?",
    rule: "Mentions the exact system that was touched.",
    stops: "Using an unrelated open ticket as cover.",
  },
  {
    icon: Scale,
    name: "Right amount?",
    rule: "The amount of activity fits the task.",
    stops: "Using a small task as cover for copying 40 projects.",
  },
];

export function DetectionPrimitives() {
  return (
    <section id="detection-core" className="border-t border-line bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="label text-emerald-700">What it looks for</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Seven kinds of change, checked separately
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Each check catches a different kind of attack, so someone who slips past one is still
            caught by another. Each one adds a visible number of points to the score, so an analyst
            can see exactly why an account was flagged.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNALS.map((p, idx) => (
            <div
              key={p.name}
              className={`panel flex flex-col rounded-lg border border-line bg-white p-5 shadow-xs ${
                idx === SIGNALS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <p.icon className="size-4" />
                </div>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-emerald-200/70 pb-5 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-700" />
                <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                  Is the approval genuine?
                </span>
              </div>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">
                A ticket only counts if it passes four checks
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A smart insider knows the system looks for tickets, so they might write one. A
                record that fails these checks doesn&apos;t just get ignored: it raises the score,
                because faking approval is a warning sign in itself.
              </p>
            </div>
            <Link
              href="/demo/fool-it"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 lg:self-auto"
            >
              Try to fool it yourself
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {APPROVAL_CHECKS.map((t) => (
              <div key={t.name} className="rounded-lg border border-emerald-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2">
                  <t.icon className="size-4 text-emerald-700" />
                  <span className="text-sm font-bold text-slate-900">{t.name}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{t.rule}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-700">Stops: </span>
                  {t.stops}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
