import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  FileCheck2,
  Footprints,
  ListOrdered,
  Lock,
  MessageSquareText,
  Search,
  Shield,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { ExampleAlert } from "@/components/landing/example-alert";
import { ScenarioComparison } from "@/components/landing/scenario-comparison";
import { DetectionPrimitives } from "@/components/landing/detection-primitives";
import { LogoMark } from "@/components/brand/logo-mark";
import { BrandIcon } from "@/components/brand-icon";
import {
  ESCALATED_ANOMALIES,
  INVESTIGATIONS,
  RAISED_ANOMALIES,
  STAT_TILES,
  SUPPRESSED_BY_CONTEXT,
} from "@/lib/fixtures";
import { TOUR_START_HREF, TOUR_STEPS } from "@/lib/tour";

export const metadata: Metadata = {
  title: "tellTale — spot when a work account starts behaving differently",
};

const CONNECTOR_LOGOS = [
  "Okta",
  "Google Workspace",
  "GitHub",
  "AWS CloudTrail",
  "Jira",
  "Confluence",
  "Slack",
  "PagerDuty",
  "Dropbox",
  "Jenkins",
];

const FOUR_STEPS = [
  {
    step: "1",
    icon: Search,
    title: "Is this unusual for this account?",
    body: "tellTale learns each account's normal routine from its past activity: how much it usually does, in what order, and how it compares with teammates in the same role.",
  },
  {
    step: "2",
    icon: FileCheck2,
    title: "Did the company approve it?",
    body: "It looks for a ticket, on-call shift or HR record that explains the activity, and checks that the record is genuine. If it is, the alert is closed and the reason is saved.",
  },
  {
    step: "3",
    icon: ListOrdered,
    title: "How serious is it?",
    body: "Whatever is left gets a score from 0 to 100, weighted by how important the system is. A risk to customer data goes ahead of a risk to a marketing folder.",
  },
  {
    step: "4",
    icon: MessageSquareText,
    title: "Explain it, and let a person decide",
    body: "Each alert opens a case file: a timeline of what happened, how much each signal added to the score, and an assistant that answers questions about the case. Nothing is done automatically.",
  },
];

/** The deck's opening example: every step is allowed on its own. */
const PROBLEM_WEEK = [
  ["Monday", "Normal coding work"],
  ["Tuesday", "Reads a guide for a system outside their job"],
  ["Wednesday", "Copies another team's code"],
  ["Thursday", "Creates a personal access key"],
  ["Friday", "Uploads the code to an outside server"],
];

const THREE_REASONS = [
  {
    title: "They look at one action at a time",
    body: "Most tools alert when a single action crosses a fixed limit, such as “more than 500 downloads in a day”. They miss the order of actions (copy, then zip, then upload), and they miss someone taking five files a night for two months.",
  },
  {
    title: "They don't know what the business approved",
    body: "A large download is fine if a manager asked for it. Security tools usually can't see tickets, on-call rotas or HR records, so they raise alarms about normal work all day.",
  },
  {
    title: "Their alerts don't explain themselves",
    body: "A bare “Risk: 87” tells an analyst nothing. Working out what actually happened can take hours of digging through logs, so many alerts end up ignored.",
  },
];

const AGENT_STEPS: { what: string; note: string; bad: boolean }[] = [
  { what: "Reads its task list", note: "Normal: this is how every run starts.", bad: false },
  {
    what: "Opens a help file that an outside account edited two days ago",
    note: "Unusual, but not alarming yet.",
    bad: false,
  },
  { what: "Searches the customer database", note: "Never done before, and not part of its task.", bad: true },
  {
    what: "Sends 1.8 MB of data to an unknown outside address",
    note: "Never done before. Alert raised: score 86.",
    bad: true,
  },
];

export default function LandingPage() {
  const confirmed = STAT_TILES.find((t) => t.label === "Confirmed findings")?.value ?? "3";
  return (
    <>
      <LandingHeader />

      <main>
        {/* ---- Hero -------------------------------------------------------- */}
        <section className="mx-auto w-full max-w-[1600px] px-6 pt-12 pb-14 sm:px-10 sm:pt-16 sm:pb-20 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  Made by Team Purple Crocs for CyberForge by Mitigata
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Theme: AI &amp; Cybersecurity
                </span>
              </div>

              <h1 className="text-3xl leading-[1.15] font-semibold tracking-tight text-ink sm:text-5xl">
                tellTale notices when a work account{" "}
                <span className="text-emerald-700">starts behaving differently</span>, and tells
                you why.
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600">
                Many attacks use real accounts with real passwords: a stolen login, an employee
                leaving with company data, or an AI agent tricked by a hidden instruction. Each
                action looks allowed on its own. tellTale looks at the pattern across actions,
                checks it against your company&apos;s own records, and only raises an alert when
                nothing explains it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={TOUR_START_HREF}
                  className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
                >
                  <Footprints className="size-4" />
                  Start the walkthrough
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center gap-2 rounded-md border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  Explore on your own
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                The walkthrough has {TOUR_STEPS.length} short steps. This is a demo with made-up
                data: nothing you click affects anything real.
              </p>
            </div>

            <ExampleAlert />
          </div>
        </section>

        {/* ---- The problem ------------------------------------------------- */}
        <section className="border-y border-line bg-slate-50/60">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <p className="label text-emerald-700">The problem</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Every step is allowed. Together, they are a theft.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Here is one engineer&apos;s week. A typical security tool sees five separate actions,
                each of them permitted. Put in order, they are a plan to steal code. The warning
                signs start on Tuesday; the theft only happens on Friday.
              </p>
            </div>

            <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {PROBLEM_WEEK.map(([day, what], i) => (
                <li
                  key={day}
                  className={`panel rounded-lg border bg-white p-4 shadow-xs ${
                    i === PROBLEM_WEEK.length - 1 ? "border-red-200" : "border-line"
                  }`}
                >
                  <p className="label text-slate-500">{day}</p>
                  <p className="mt-1 text-sm text-ink">{what}</p>
                </li>
              ))}
            </ol>

            <h3 className="mt-10 text-base font-semibold text-ink">Why current tools miss this</h3>
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3">
              {THREE_REASONS.map((f, i) => (
                <div key={f.title} className="panel rounded-lg border border-line bg-white p-5 shadow-xs">
                  <span className="flex size-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-800">
                    {i + 1}
                  </span>
                  <h4 className="mt-3 text-sm font-bold text-ink">{f.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- How it works ------------------------------------------------ */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16"
        >
          <p className="label text-emerald-700">How it works</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Four questions before anyone is alerted
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Most unusual activity turns out to be ordinary work. tellTale closes those cases on its
            own and keeps a record of why. What remains becomes one case per account, ranked by how
            much it matters, instead of a pile of separate alerts.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FOUR_STEPS.map((q) => (
              <div key={q.step} className="panel flex flex-col rounded-lg border border-line bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <q.icon className="size-4" />
                  </span>
                  <span className="label text-emerald-700">Step {q.step}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink">{q.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{q.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-line bg-slate-50/60 p-5">
            <p className="text-sm font-semibold text-ink">In this demo&apos;s made-up month</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Descent value={RAISED_ANOMALIES.toLocaleString("en-US")} label="unusual events were noticed" />
              <Descent
                value={SUPPRESSED_BY_CONTEXT.toLocaleString("en-US")}
                label="were explained by company records and closed automatically"
              />
              <Descent
                value={String(ESCALATED_ANOMALIES)}
                label={`were left, grouped into ${INVESTIGATIONS} cases for an analyst`}
              />
              <Descent value={confirmed} label="turned out to be real problems" />
            </div>
          </div>
        </section>

        {/* ---- What it looks for + the four approval checks ---------------- */}
        <DetectionPrimitives />

        {/* ---- Same command, three outcomes -------------------------------- */}
        <ScenarioComparison />

        {/* ---- AI agents ---------------------------------------------------- */}
        <section id="agents" className="border-t border-line bg-slate-50/60">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:px-16">
            <div>
              <p className="label text-emerald-700">AI agents</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                The same checks work for AI agents
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Companies now give AI agents real access to code and customer data. An agent can be
                hijacked by an instruction hidden inside a file it reads; this is called prompt
                injection. Its login stays valid, so tools that only watch logins see nothing wrong.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                tellTale doesn&apos;t read the file. It notices that, right after opening it, the
                agent started doing things it has never done before.
              </p>
              <Link
                href="/demo/subject/A-0317"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Open the AI agent case
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <ol className="space-y-2.5">
              {AGENT_STEPS.map((s, i) => (
                <li
                  key={s.what}
                  className={`flex gap-3 rounded-lg border bg-white p-4 shadow-xs ${s.bad ? "border-red-200" : "border-line"}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      s.bad ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {i === AGENT_STEPS.length - 1 ? <Bot className="size-4" /> : i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{s.what}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{s.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- Two modules --------------------------------------------------- */}
        <section id="modules" className="border-t border-line">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="max-w-3xl">
              <p className="label text-emerald-700">Two parts, kept apart</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                One for the security team, one for HR
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                The same optional desktop app can also record working time for HR. That is useful,
                but mixing the two would be dangerous: a security tool that knows who is
                &ldquo;slow&rdquo; could start treating slow people as suspects. So the two parts
                never share a screen.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ModuleCard
                icon={Shield}
                title="Security part"
                tagline="For the security team"
                items={[
                  "A ranked list of accounts that need a look today, sized to the team's time.",
                  "Accounts appear as ID numbers such as #4912, never as names.",
                  "Each case shows a timeline, what added to the score, and the approval checks.",
                  "A log of every alert that was closed automatically, and the record that closed it.",
                ]}
                href="/demo"
                cta="Open the security part"
              />
              <ModuleCard
                icon={Briefcase}
                title="Workforce part"
                tagline="For HR and operations"
                items={[
                  "Working and idle time per person, with a 24-hour activity strip.",
                  "Time spent in each app and category, searchable.",
                  "Optional screenshots, switched off where the law doesn't allow them.",
                  "Shows names, but never a risk score.",
                ]}
                href="/demo/workforce"
                cta="Open the workforce part"
              />
            </div>

            <div className="mt-8 rounded-lg border border-line bg-white p-6 shadow-xs">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="size-4 text-emerald-700" />
                <h3 className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                  Three rules that keep it fair
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-600 md:grid-cols-3">
                <div className="border-t border-line pt-2">
                  <span className="font-semibold text-slate-900">Productivity never affects risk. </span>
                  How busy someone is says nothing about whether they are a threat, so that data is
                  never given to the security part.
                </div>
                <div className="border-t border-line pt-2">
                  <span className="font-semibold text-slate-900">Security sees IDs, HR sees names. </span>
                  Neither side can see the other&apos;s screens.
                </div>
                <div className="border-t border-line pt-2">
                  <span className="font-semibold text-slate-900">Revealing a name takes two people. </span>
                  To find out who is behind an ID, a security lead and an HR or legal lead must both
                  approve, and the request is logged.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Works with ------------------------------------------------------ */}
        <section className="border-t border-line bg-slate-50/60">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-14 sm:px-10 lg:px-16">
            <p className="text-center text-sm font-semibold text-ink">
              Reads activity from tools companies already use
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">
              Read-only access: tellTale never changes anything in these systems.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 md:grid-cols-5">
              {CONNECTOR_LOGOS.map((name) => (
                <div key={name} className="flex items-center justify-center gap-2 text-slate-600">
                  <BrandIcon name={name} className="size-4 shrink-0" />
                  <span className="text-xs font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- About the demo --------------------------------------------------- */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="panel flex flex-col gap-6 border border-line bg-white p-8 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="label text-amber-700">Demo build — all data synthetic</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  What you are looking at
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  A working demo of the screens, filled with made-up data for a company of 100
                  people. The cases, scores and answers were prepared in advance and checked
                  automatically so every number adds up. No AI model runs here and nothing is sent
                  over the internet. We haven&apos;t tested tellTale on real company data yet, so we
                  don&apos;t quote any accuracy figures.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 self-start sm:self-auto">
                <Link
                  href={TOUR_START_HREF}
                  className="flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
                >
                  <Footprints className="size-4" />
                  Start the walkthrough
                </Link>
                <Link
                  href="/demo/about"
                  className="flex items-center justify-center gap-2 rounded-md border border-line px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  More about this demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-black text-white shadow-xs">
              <LogoMark />
            </div>
            <span className="text-xs font-medium text-slate-600">
              tellTale · Team Purple Crocs (Aarav Gupta, Aankhi Roy) · CyberForge by Mitigata
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link href="/demo" className="transition-colors hover:text-emerald-700">
              Demo
            </Link>
            <Link href="/demo/about" className="transition-colors hover:text-emerald-700">
              About the demo
            </Link>
            <Link href="/demo/legal" className="transition-colors hover:text-emerald-700">
              Legality
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function Descent({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="machine text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{label}</p>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  tagline,
  items,
  href,
  cta,
}: {
  icon: typeof Shield;
  title: string;
  tagline: string;
  items: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="panel flex flex-col border border-line bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon className="size-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="text-xs text-slate-500">{tagline}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
      >
        {cta}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
