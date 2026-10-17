/**
 * The case-file assistant — pre-written question and answer pairs.
 *
 * Nothing here is generated. Each answer is fixture text written from the
 * dossier on the same page, and it cites the evidence items it relies on by
 * id; the panel looks each id up in the dossier to print its timestamp, so a
 * citation cannot point at an event the page does not show.
 *
 * verify-fixtures.mjs asserts, per answer:
 *   - every cited id exists in that subject's evidence list
 *   - "Score N" matches the dossier risk
 *   - every signed number (+1.42, −2.60) is a contribution printed in the
 *     table, or the sum of the anomaly terms
 *   - "would be about N" is σ(logit without the context term) × 100
 *
 * In production a language model would reword these facts. It would be given
 * the case file only, and it never changes a score.
 */

export interface AssistantAnswer {
  question: string;
  answer: string;
  /** Evidence ids from the subject's dossier. */
  cites: string[];
}

export const ASSISTANT_NOTE =
  "Pre-written for the demo. In production a language model rewords these facts and never changes a score.";

export const ASSISTANT_QA: Record<string, AssistantAnswer[]> = {
  subject_4912: [
    {
      question: "Why is this urgent?",
      answer:
        "Score 93, top of the queue. In 28 minutes from 01:14 this account logged in from a VPN in Zurich never seen in 180 days, copied payments-core for the first time, zipped 410 files and uploaded them to a bucket outside the company's accounts. A resignation was filed four days earlier. No ticket, on-call shift or HR record covers any of it.",
      cites: ["ev-m1", "ev-m3", "ev-m4", "ev-m5", "ev-m6"],
    },
    {
      question: "What would a basic tool have done?",
      answer:
        "Most likely raised three separate alerts in three different tools: an odd login in Okta, a large clone in GitHub and an upload in AWS. Each would be checked on its own, and none would mention the resignation. Here the same events sit on one timeline as one case.",
      cites: ["ev-m1", "ev-m3", "ev-m5"],
    },
    {
      question: "Which approval checks failed?",
      answer:
        "All four. There is no ticket, on-call shift, HR record or calendar entry for 01:00 to 02:00, so there is nothing to check for timing, author or system. And 410 files is far more than any normal task in this team.",
      cites: ["ev-m3", "ev-m4"],
    },
    {
      question: "Which signal added the most?",
      answer:
        "The order of actions. An upload straight after an archive happens about 4 times in 10,000 in this company, and that adds +1.42. Next is the resignation at +1.05, then the bucket outside the company at +0.83. With no ticket, nothing brings the score down.",
      cites: ["ev-m4", "ev-m5", "ev-m6"],
    },
    {
      question: "Was the login really this person?",
      answer:
        "Not certain. The push approval came from a device fingerprint never seen before, and the laptop reported locked from 01:12 to 01:58 while three actions ran. That fits a stolen session or a second device. A triggered screen capture was sealed and needs two approvals to view.",
      cites: ["ev-m2", "ev-m7", "ev-m8"],
    },
    {
      question: "What should I do next?",
      answer:
        "Suggestions, not automatic actions: end active sessions and revoke tokens, ask the cloud team to block the outside bucket, and request unmasking through the two-approval flow if HR needs to be involved. A person approves each step.",
      cites: ["ev-m5"],
    },
  ],

  subject_2071: [
    {
      question: "Why is it flagged if there is a ticket?",
      answer:
        "Because this account wrote the ticket. TICKET-9920 was created at 14:05 and assigned to the same account at 14:07, 40 minutes before its first-ever clone of payments-core. A ticket only lowers risk when someone else assigned it. Here it raises the score by +2.20.",
      cites: ["ev-d1", "ev-d2", "ev-d3"],
    },
    {
      question: "What would a basic tool have done?",
      answer:
        "Stayed silent. A ticket exists, it names the repository, and 38 files is under a typical fixed daily limit. The archive and the upload to a personal cloud account would look like ticketed work.",
      cites: ["ev-d4", "ev-d5"],
    },
    {
      question: "Which approval checks failed?",
      answer:
        "\u201cMade by someone else?\u201d failed: this account wrote the ticket. \u201cMade before?\u201d passed, because 40 minutes is over the 30-minute minimum, and \u201cNames this system?\u201d passed, because the ticket names payments-core. \u201cRight amount?\u201d is doubtful: 38 files and systems for a one-project task, by someone who has never worked on it.",
      cites: ["ev-d1", "ev-d2"],
    },
    {
      question: "How much of the score is behaviour?",
      answer:
        "Not much. The behaviour signals add +0.97 together, so without the fake ticket the score would be about 28. The fake ticket (+2.20) is what makes it 78. The ticket, not the behaviour, is the main finding.",
      cites: ["ev-d3", "ev-d6"],
    },
    {
      question: "Was this closed automatically at first?",
      answer:
        "Yes. The copy matched a ticket, so it was closed automatically. When tellTale found that this account wrote the ticket itself, the case was reopened. It still appears in Approved activity, marked as reopened.",
      cites: ["ev-d7"],
    },
  ],

  subject_8830: [
    {
      question: "Why is there no alert?",
      answer:
        "Score 14. All four approval checks pass: TICKET-4471 was created a day earlier, by someone else, and names payments-core. After copying the code, the person opened a normal code review.",
      cites: ["ev-p2", "ev-p3", "ev-p4"],
    },
    {
      question: "What would a basic tool have done?",
      answer:
        "Raised a false alarm. First-ever access to a critical repository is exactly what a fixed rule flags, and an analyst would then clear it by hand. Here it was closed automatically, with the reason saved.",
      cites: ["ev-p3", "ev-p6"],
    },
    {
      question: "Was the anomaly real?",
      answer:
        "Yes. First access to payments-core in 180 days is unusual and adds +1.35. It is explained, not ignored: the genuine ticket (−2.60) outweighs it.",
      cites: ["ev-p3"],
    },
    {
      question: "Could someone abuse this by writing a ticket?",
      answer:
        "Only with a ticket that passes all four checks. A ticket written by the same person, created after the fact, or naming another project would not close the alert. Account #2071 shows what that looks like.",
      cites: ["ev-p2"],
    },
    {
      question: "Where is this decision kept?",
      answer:
        "In the approved-activity log as sup-000, with reason code SCOPE_MATCHED_TICKET and the ticket that caused it. Suppressions are retained and can be reviewed later.",
      cites: ["ev-p6"],
    },
  ],

  "subject_A-0317": [
    {
      question: "Why is this urgent?",
      answer:
        "Score 86, third in the queue. In under four minutes the agent read its task file, opened docs/vendor-faq.md, queried the customer table for the first time and posted 1.8 MB to an address outside the allow-list. Its release task covers neither of the last two steps.",
      cites: ["ev-a2", "ev-a3", "ev-a4", "ev-a5"],
    },
    {
      question: "Was the agent's login compromised?",
      answer:
        "There is no sign of it. The token, scopes and runner network match every previous run. That is why login-focused tools miss this: the credentials are valid. What changed is what the agent did after reading one file.",
      cites: ["ev-a1"],
    },
    {
      question: "Why point at that file?",
      answer:
        "Timing and history. Every unusual step comes straight after the agent read docs/vendor-faq.md, and that file was edited two days earlier by an outside account making its first commit. tellTale does not read file contents, so a person should open the file and check it for a hidden instruction.",
      cites: ["ev-a3", "ev-a7"],
    },
    {
      question: "What would a basic tool have done?",
      answer:
        "Probably nothing. The agent used a valid token from a known network, and 17 resources is a small run. Each action is allowed for an agent with this access when looked at on its own.",
      cites: ["ev-a1"],
    },
    {
      question: "Which approval checks failed?",
      answer:
        "\u201cNames this system?\u201d and \u201cRight amount?\u201d. RELEASE-118 was created in advance by someone else, so the first two checks pass, but it only covers release notes, not customer data or sending data outside. So it only lowers the score a little (−1.10).",
      cites: ["ev-a6"],
    },
    {
      question: "What should I do next?",
      answer:
        "Suggestions, not automatic actions: pause the agent's token, block collector.example.net at the egress proxy, revert the edit to docs/vendor-faq.md, and check what the 2,400 rows contained. A person approves each step.",
      cites: ["ev-a4", "ev-a5", "ev-a7"],
    },
  ],
};
