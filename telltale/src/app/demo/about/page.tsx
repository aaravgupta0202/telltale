import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import {
  AGENT_SUBJECTS,
  ALL_DOSSIERS,
  ASSISTANT_QA,
  FOOL_TABLE,
  SENSOR_COVERAGE,
  SUBJECTS,
  SUPPRESSIONS,
} from "@/lib/fixtures";

export const metadata = { title: "About this demo — tellTale" };

const REAL = [
  [
    "How detection works",
    "The signals (unusual amount, unusual order of actions, slow drift from teammates and the rest), the four approval checks, and the way the points add up to a score are all fully designed in our master document.",
  ],
  [
    "How the product is built",
    "Read-only connections to tools like Okta, GitHub and AWS, the optional desktop app, the split between the security part and the HR part, and the country rules.",
  ],
  [
    "The safeguards",
    "Security sees ID numbers only, revealing a name needs two approvals, only activity details are collected (never message text or file contents), and productivity is never used in risk scores.",
  ],
];

const MADE_UP = [
  [
    "All the data",
    `${SUBJECTS.length} made-up accounts plus ${AGENT_SUBJECTS.length} AI agent, ${SUPPRESSIONS.length} closed events, and one example day. Every name, ID, ticket, system and address is invented.`,
  ],
  [
    "All the scores",
    "Every score, point value and percentage was prepared in advance. Nothing is calculated live and no model runs behind these screens.",
  ],
  [
    "The case assistant",
    `${Object.values(ASSISTANT_QA).reduce((a, q) => a + q.length, 0)} answers across ${Object.keys(ASSISTANT_QA).length} cases, written in advance from the facts on each page. In the real product a language model would reword the same facts, and it would never be allowed to change a score.`,
  ],
  [
    "Try to fool it",
    `A fixed table of ${FOOL_TABLE.length} possible results. The page looks up the row that matches your choices.`,
  ],
  [
    "Screenshots",
    "Every screenshot is a generated picture or a generic sample image. None shows anyone's real screen.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About this demo"
        description="tellTale was built by Team Purple Crocs (Aarav Gupta and Aankhi Roy) for CyberForge by Mitigata, under the theme AI & Cybersecurity. This page explains what is real and what is made up."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="What is real" sub="Designed and written up in our master document.">
          <dl className="space-y-3">
            {REAL.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm font-medium text-ink">{k}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-grey">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel
          title="What is made up"
          sub="Prepared for this demo, and checked so it is consistent."
          className="border-amber/40"
        >
          <dl className="space-y-3">
            {MADE_UP.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm font-medium text-ink">{k}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-grey">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel title="Every number adds up" className="mb-4">
        <p className="max-w-4xl text-sm leading-relaxed text-ink">
          A score you can&apos;t explain is no better than a guess, so this demo checks itself.
          Before the site is built, a script runs over a thousand checks on the data, for example:
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-x-10 gap-y-1.5 text-sm text-grey sm:grid-cols-2">
          <li>The points on each of the {ALL_DOSSIERS.length} case pages add up to the score shown</li>
          <li>Each &ldquo;distance from normal&rdquo; matches the teammates plotted next to it</li>
          <li>The alert list is in the order the page says it is</li>
          <li>The Overview numbers agree with each other</li>
          <li>Every assistant answer only uses events that appear on its case page</li>
          <li>No employee name appears anywhere in the security part</li>
        </ul>
        <p className="mt-3 text-xs text-grey">
          If any check fails, the site doesn&apos;t get built.
        </p>
      </Panel>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Security and HR never mix">
          <p className="text-sm leading-relaxed text-ink">
            The security part shows ID numbers such as <span className="machine">#4912</span>,
            never names. The HR part shows names but never a risk score. Nothing in the security
            part links to a person&apos;s HR page. Finding out who is behind an ID takes two people
            to approve it.
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-grey">
            &ldquo;Person 1&rdquo;, &ldquo;Person 2&rdquo; and &ldquo;Person 3&rdquo; in the demo
            shortcuts are just labels for the walkthrough. They are not linked to anyone in the HR
            part.
          </p>
        </Panel>

        <Panel title="No productivity ratings">
          <p className="text-sm leading-relaxed text-ink">
            The HR part reports how time was spent, by app and category. It never labels an app
            as productive or unproductive, never gives anyone a productivity score, and never ranks
            people against each other.
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-grey">
            How busy someone is says nothing about whether they are a threat. Letting that into a
            security tool is how security turns into surveillance, so we keep it out.
          </p>
        </Panel>
      </div>

      <Panel title="Legality" className="mb-4">
        <p className="max-w-4xl text-sm leading-relaxed text-ink">
          Each company picks the rules for its country when it sets tellTale up: India and the US
          with everything on, the EU without regular screenshots, Germany only after an agreement
          with employee representatives, or security only with no HR part. Keystrokes, message
          text, file contents and source code are never collected.{" "}
          <Link href="/demo/legal" className="font-semibold text-emerald-700 hover:underline">
            See the country rules and the laws behind them
          </Link>
          . This is our reading of the law, not legal advice.
        </p>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="How accurate is it?">
          <p className="max-w-3xl text-sm leading-relaxed text-ink">
            We don&apos;t know yet, so we don&apos;t quote a number. Accuracy can only be measured
            by testing on a large set of real or realistic activity where the attacks are known in
            advance. That testing hasn&apos;t been done, and any figure before it would be made up.
          </p>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-grey">
            Our test plan: build a simulated company with normal and unusual-but-genuine work, have
            one teammate write attacks the other hasn&apos;t seen, keep one attack type secret until
            the final run, compare with a basic tool, and publish the results.
          </p>
        </Panel>

        <Panel title="Demo facts" bodyClassName="p-0">
          <dl className="divide-y divide-line">
            {[
              ["Team", "Purple Crocs: Aarav Gupta, Aankhi Roy"],
              ["Event", "CyberForge by Mitigata"],
              ["Theme", "AI & Cybersecurity"],
              ["Accounts", `${SUBJECTS.length} + ${AGENT_SUBJECTS.length} AI agent`],
              [
                "With the desktop app",
                `${SENSOR_COVERAGE.equipped} of ${SENSOR_COVERAGE.total}`,
              ],
              ["Example day", "14 September 2026"],
              ["Internet needed", "No. Everything runs in your browser."],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-2">
                <dt className="label text-grey">{k}</dt>
                <dd className="text-right text-xs text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </>
  );
}
