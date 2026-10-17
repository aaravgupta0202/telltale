/**
 * The guided walkthrough. Five fixed stops that follow the submission deck:
 * the queue, the three people who ran the same git clone, then the workforce
 * module. State is one sessionStorage flag, so a static export served from a
 * plain file server keeps the tour across full page loads, and nothing is
 * persisted beyond the tab.
 *
 * The workforce stop is deliberately written without any subject pseudonym:
 * the two modules never share a screen, and that includes this caption.
 */
export interface TourStep {
  href: string;
  title: string;
  caption: string;
  lookFor: string[];
}

export const TOUR_STEPS: TourStep[] = [
  {
    href: "/demo/queue",
    title: "The list of alerts",
    caption:
      "This is the first screen a security analyst opens each morning. Each row is one account whose behaviour changed. The most urgent ones are at the top: those where something bad is most likely and the system involved matters most.",
    lookFor: [
      "Accounts are shown as ID numbers like #4912, never names.",
      "The line part-way down marks how many cases the team has time to check today. Rows below it are still listed.",
      "Three people copied the same payments code. The next three steps show each of them.",
    ],
  },
  {
    href: "/demo/subject/4912",
    title: "Person 2: score 93, urgent",
    caption:
      "At 1 a.m. this account logged in from a VPN it had never used, copied the payments code, zipped 410 files and uploaded them outside the company. No ticket covers any of it, and the person resigned four days ago.",
    lookFor: [
      "Ask the case assistant a question, such as “Why is this urgent?”",
      "In the timeline, the “approved by” row is empty exactly when the activity happens.",
      "“Why it scored” lists how many points each signal added.",
    ],
  },
  {
    href: "/demo/subject/2071",
    title: "Person 3: score 78, fake ticket",
    caption:
      "A ticket for this work exists. But this person wrote it and assigned it to themselves 40 minutes before copying the code. A basic tool would see the ticket and stay silent.",
    lookFor: [
      "Under “Is the approval genuine?”, the “made by someone else” check fails.",
      "On its own the behaviour is only mildly unusual. The fake ticket is what makes this serious.",
    ],
  },
  {
    href: "/demo/subject/8830",
    title: "Person 1: score 14, no alert",
    caption:
      "Same command, same code. Their team lead assigned a ticket for this work the day before, and afterwards they opened a normal code review. All four approval checks pass.",
    lookFor: [
      "In the timeline, the “approved by” row covers the whole day and the score stays low.",
      "The alert wasn't deleted: it was closed and saved with the ticket that explained it.",
    ],
  },
  {
    href: "/demo/workforce",
    title: "The workforce part",
    caption:
      "This is the separate part for HR and operations: working time, idle time and app usage, with names. It never shows risk scores, and the security part never shows names. Linking the two takes two people's approval.",
    lookFor: [
      "The role shown in the sidebar has changed from security analyst to workforce admin.",
      "No app or category is labelled “productive” or “unproductive”.",
    ],
  },
];

export const TOUR_KEY = "telltale-tour";
/** Landing-page entry: a full page load that switches the tour on. */
export const TOUR_START_HREF = `${TOUR_STEPS[0].href}/?tour=1`;
