"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info } from "lucide-react";
import { cn } from "cn";
import { useTourActive } from "./walkthrough";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSidebar } from "./shell";
import { normalisePath } from "@/lib/nav";

/**
 * A small "i" button, fixed bottom-left of the main content area on every
 * page (the Demo launcher already owns bottom-right), replacing what used to
 * be a scatter of static "What this is for" / "Why this screen exists" boxes
 * sitting permanently in the page body on connectors, workforce and captures.
 * Those boxes said the same handful of things on every visit whether a judge
 * wanted them or not; this puts the same words one click away instead, and —
 * because the content below is keyed to the current route — each page gets
 * its own explanation rather than one generic methodology essay repeated
 * everywhere.
 *
 * It sits just past the sidebar rather than at the literal viewport corner
 * — the sidebar's own footer already has content pinned to its bottom-left
 * (the honesty badge, "About this build"), and a page-fixed button there
 * sat on top of it. Tracking the sidebar's collapsed state keeps the two
 * from touching either way it's toggled.
 */
export function MethodologyInfo() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const content = contentFor(pathname);
  // The walkthrough bar takes the bottom of the screen while it runs.
  const touring = useTourActive();

  if (!content || touring) return null;

  return (
    <Dialog
      onOpenChange={(open) => {
        // Base UI moves focus into the popup on open, and on a long
        // scrollable dialog that drags scroll position down to whatever
        // picked up focus first — one rAF wasn't enough to win the race
        // against it, so this resets on a few frames to be sure the title
        // is what's visible on open, not a mid-page sentence.
        if (!open) return;
        for (const delay of [0, 50, 150]) {
          setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), delay);
        }
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            title="How to read this page"
            className={cn(
              // On mobile the demo launcher becomes a full-width bar along
              // the very bottom (see demo-launcher.tsx), so this sits one
              // row above it there; on lg+ the launcher is a compact
              // right-aligned pill and this can drop back to bottom-4.
              "fixed bottom-16 left-4 z-40 flex size-9 items-center justify-center rounded-full border border-line bg-white text-grey shadow-lg transition-[left] duration-200 hover:border-purple/40 hover:text-purple lg:bottom-4",
              collapsed ? "lg:left-20" : "lg:left-68",
            )}
          />
        }
      >
        <Info className="size-4.5" />
        <span className="sr-only">How to read this page</span>
      </DialogTrigger>

      <DialogContent
        ref={scrollRef}
        className="max-h-[85vh] max-w-full overflow-y-auto rounded-sm sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-2 text-sm leading-relaxed text-ink">
          {content.sections.map((s) => (
            <Section key={s.title} title={s.title}>
              {s.body}
            </Section>
          ))}
        </div>

        <div className="border-t border-line px-6 py-3 text-xs text-grey">
          <Link href="/demo/about" className="font-medium text-purple hover:underline">
            More about this demo →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="label mb-1.5 text-ink">{title}</h3>
      <div className="text-[13px] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

interface InfoContent {
  title: string;
  description: string;
  sections: { title: string; body: React.ReactNode }[];
}

function contentFor(pathname: string): InfoContent | null {
  const p = normalisePath(pathname);

  if (p === "/demo/about") return null;

  if (p.startsWith("/demo/workforce/captures")) return CAPTURES_INFO;
  if (p.startsWith("/demo/workforce")) return WORKFORCE_INFO;
  if (p.startsWith("/demo/connectors")) return CONNECTORS_INFO;
  if (p.startsWith("/demo/suppressions")) return SUPPRESSIONS_INFO;
  return RISK_SCORE_INFO;
}

const RISK_SCORE_INFO: InfoContent = {
  title: "How to read this page",
  description:
    "A short guide to the scores and checks in the security part. Every number on a case page can be traced back to the events listed on that page.",
  sections: [
    {
      title: "What the score means",
      body: (
        <>
          <p>
            Each account gets a score from 0 to 100: roughly, how likely it is that this activity
            needs a person to look at it. Under 40 is low, 40 to 70 is worth a look, and over 70 is
            serious.
          </p>
          <p className="mt-2">
            The score is not a black box. On a case page, &ldquo;Why it scored&rdquo; lists every
            signal and how many points it added or took away. Red points push the score up, green
            points pull it down, and the points add up to the final score.
          </p>
        </>
      ),
    },
    {
      title: "The approval check",
      body: (
        <>
          <p>
            Most unusual activity is normal work. Before raising an alert, tellTale looks for a
            ticket, on-call shift or HR record that explains it, and checks four things:
          </p>
          <ul className="mt-1.5 space-y-1">
            <li>
              <b>Made before?</b> It existed at least 30 minutes before the activity.
            </li>
            <li>
              <b>Made by someone else?</b> The person doing the work didn&apos;t create it for
              themselves.
            </li>
            <li>
              <b>Names this system?</b> It mentions the exact system that was touched.
            </li>
            <li>
              <b>Right amount?</b> The amount of activity fits the task.
            </li>
          </ul>
          <p className="mt-2">
            If all four pass, the score drops a lot. If the person wrote their own ticket, the score
            goes up instead, because faking approval is a warning sign in itself.
          </p>
        </>
      ),
    },
    {
      title: "Compared with whom?",
      body: (
        <p>
          Each account is compared with its own past and with teammates in the same role.
          &ldquo;Typical&rdquo; means the middle value for the team, so one very busy person
          doesn&apos;t distort it. The &ldquo;distance from normal&rdquo; number says how far
          outside the usual range this account is: around 1 is ordinary, above 3 is unusual.
        </p>
      ),
    },
    {
      title: "Why the order of actions matters",
      body: (
        <p>
          tellTale knows how often one action normally follows another in this company. Copying
          code is common. Copying code, packing it into an archive and uploading it outside the
          company within minutes is very rare. A label like &ldquo;about once in 2,500 times&rdquo;
          is that frequency, measured on this company&apos;s own history.
        </p>
      ),
    },
    {
      title: "Why the list isn't sorted by score alone",
      body: (
        <p>
          The list is ordered by score multiplied by how important the system is. A medium score on
          the payments system can matter more than a high score on a marketing folder, so it comes
          first.
        </p>
      ),
    },
    {
      title: "What is real in this demo",
      body: (
        <p>
          The screens and the way the scoring works are real designs. The data is made up, and the
          scores were prepared in advance and checked automatically so they all add up. No model
          runs in this demo, and no accuracy figure is shown, because tellTale hasn&apos;t yet been
          tested on real company data.
        </p>
      ),
    },
  ],
};

const SUPPRESSIONS_INFO: InfoContent = {
  title: "How automatic closing works",
  description:
    "Closed is not the same as deleted. Every event tellTale closed on its own is listed here with the record that explained it, and any of them can be reopened.",
  sections: [
    {
      title: "An event is only closed when the record is genuine",
      body: (
        <p>
          tellTale closes an unusual event only when a company record passes all four approval
          checks: made before, made by someone else, names the system, right amount. Click any row
          to see the record it relied on: who created it, when, and what it covers.
        </p>
      ),
    },
    {
      title: "The reopened row",
      body: (
        <p>
          One row is marked as reopened. It was closed because a ticket existed, but the person had
          written that ticket and assigned it to themselves. Once tellTale noticed, it reopened the
          case and counted the ticket against them. The row links straight to that case.
        </p>
      ),
    },
    {
      title: "The reason filters",
      body: (
        <p>
          The buttons above the table filter by reason: a matching ticket, being on call, approved
          travel, a new role, or a newly registered device. The counts are exact and match the
          numbers on the Overview page.
        </p>
      ),
    },
  ],
};

const CONNECTORS_INFO: InfoContent = {
  title: "How app connections are watched",
  description:
    "Each connected tool is checked in two ways: is it sending anything at all, and is it sending a normal amount.",
  sections: [
    {
      title: "Silence is a warning, not a gap",
      body: (
        <p>
          Someone trying to hide might switch off a log. So tellTale expects every tool to check in
          regularly and to send roughly its usual amount of data. A tool that goes quiet, or sends
          far less than usual, raises its own alert instead of quietly disappearing.
        </p>
      ),
    },
    {
      title: "The three states",
      body: (
        <ul className="space-y-1.5">
          <li>
            <b className="text-emerald-700">Healthy</b>: checking in on time, with a normal amount of
            data.
          </li>
          <li>
            <b className="text-amber-700">Degraded</b>: still sending, but much less than usual.
            Checks continue and are marked as incomplete.
          </li>
          <li>
            <b className="text-red-700">Silent</b>: nothing at all. Checks that need this tool are
            paused rather than treating the silence as &ldquo;all clear&rdquo;.
          </li>
        </ul>
      ),
    },
  ],
};

const WORKFORCE_INFO: InfoContent = {
  title: "How the HR part works",
  description:
    "Working time and app usage for named employees, for HR and operations. This part never shows a risk score.",
  sections: [
    {
      title: "What it shows",
      body: (
        <p>
          Who was working, for how long, and in which apps. Working and idle time come from whether
          the keyboard and mouse were in use, not from which app was open. No app is labelled
          &ldquo;productive&rdquo; or &ldquo;unproductive&rdquo;, and nobody is ranked against
          anyone else.
        </p>
      ),
    },
    {
      title: "Kept apart from security",
      body: (
        <p>
          The security part only sees ID numbers and never sees this screen. Finding out who is
          behind a security ID takes two approvals (a security lead and an HR or legal lead), and
          the request is logged.
        </p>
      ),
    },
  ],
};

const CAPTURES_INFO: InfoContent = {
  title: "How screenshots work",
  description:
    "Screenshots are optional and depend on the country rules. In this demo most pictures are generated, and a few use a generic sample image; none show anyone's real screen.",
  sections: [
    {
      title: "What is and isn't collected",
      body: (
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <p className="label mb-1 text-emerald-700">Collected</p>
            <ul className="space-y-1 text-xs">
              <li>A picture of the window in use at that moment</li>
              <li>The app name, window title and time</li>
              <li>Whether it was a regular or an alert-triggered screenshot</li>
            </ul>
          </div>
          <div>
            <p className="label mb-1 text-red-700">Never collected</p>
            <ul className="space-y-1 text-xs">
              <li>Keystrokes, clipboard or typed text</li>
              <li>Message text or file contents</li>
              <li>Anything from a personal device</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Security screenshots don't appear here",
      body: (
        <p>
          The alert-triggered screenshots in this gallery come from HR rules. A screenshot taken
          for a security case is sealed straight away, never appears in this gallery, and can only
          be opened with two approvals, inside the security case.
        </p>
      ),
    },
  ],
};
