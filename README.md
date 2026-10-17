# tellTale — demo console

**Context-aware behavioural transition detection.**
CyberForge by Mitigata · AI & Cybersecurity · Team Purple Crocs (Aarav Gupta, Aankhi Roy)

Full design: [tellTale_Master_Solution_Document.pdf](tellTale_Master_Solution_Document.pdf)

Most security tooling asks *"was this event malicious?"* and drowns an analyst in alerts that
are almost all ordinary work. tellTale asks two different questions:

1. **How has this identity's behaviour changed** against its own frozen baseline and its peer
   cohort — not against a global rule?
2. **Does the organisation's own operational record explain the change?** A ticket, an on-call
   rotation, an approved trip, a role change.

If the record explains it, the anomaly is suppressed — and the suppression is logged with the
record that caused it, so the claim is auditable rather than convenient. If no record explains
it, the anomaly is ranked by **expected cost of inaction**, not by raw score. And if a record
exists but the subject created it themselves, that attempt is a signal of its own.

---

## Running it

```bash
cd telltale
npm install
npm run dev          # http://localhost:3000
```

For the static export a judge can serve from anywhere:

```bash
npm run build        # verifies fixtures, exports to telltale/out/
npx serve out        # or: python -m http.server -d out 8080
```

### Deploying to Netlify

`netlify.toml` at the repo root is all the configuration needed: base directory `telltale`,
build command `npm run build`, publish directory `out`, Node 24. Connect the repository in
Netlify (Add new site → Import an existing project) and leave the build settings blank so the
file is used. Or deploy by hand from the folder: `cd telltale && npm run build && npx netlify
deploy --dir=out --prod`.

`npm run build` runs `scripts/verify-fixtures.mjs` first and **fails the build** if any
displayed number stops agreeing with the numbers shown beside it. There are no network calls
at runtime, so the export works offline and from a plain file server.

## What this repository is

A **static showcase console**. Every byte of data is a literal in a TypeScript fixture file
under `telltale/src/lib/fixtures/`. There is no backend, no database, no API and no model at
runtime. The detection engine this interface describes is designed in the master document, not
implemented here, and it is not faked with live computation.

| Real — designed and specified | Fixture — authored for the demo |
|---|---|
| The detection design: context verification, the manufactured-context detector, anchored cohort divergence, the order-2 Markov trajectory model, logistic fusion | All data: 100 subjects plus 1 AI agent, 41 suppression rows, 18 workforce members, one synthetic day |
| The mathematics: median/MAD robust statistics, Katz backoff, Jensen–Shannon divergence, CUSUM, additive log-odds | All scores: every risk score, logit contribution, transition probability and Z-score |
| The architecture: cloud connectors, the optional endpoint Sensor, the pseudonymisation boundary, jurisdiction profiles | All connector state: heartbeats, volumes, the CloudTrail outage |
| The constraints: dual-custody unmasking, metadata-only collection, suppression retention | All captures: every thumbnail is drawn from an integer seed — no image file exists in this repo |
| The case assistant's rule: a language model only rewords case-file facts and never changes a score | All assistant answers: 22 pre-written answers across 4 cases, each citing the evidence ids it uses. No model runs |
| The four context tests and the γ values they map to | "Try to fool it": a fixed 24-row lookup table, labelled illustrative. The page looks up a row; nothing is scored in the browser |
| The jurisdiction profiles and the never-collected list | The legality page is our reading of the main laws, not legal advice |

No accuracy figure appears anywhere in the build. Evaluation on a labelled corpus is pending,
and quoting a number before running it would be the least defensible thing on the screen.

## Guided walkthrough

"Start the walkthrough" on the landing page (or in the launcher at the bottom of every demo
page) steps through five stops with a plain-language caption at each: the alert queue,
`#4912`, `#2071`, `#8830`, then the workforce overview. The tour state is one sessionStorage
flag, so it works from a plain file server. The workforce caption names no subject.

## The scenarios

The same action — first-ever access to a critical repository — gets three different and
correct answers. All three, plus the AI agent, are one click from the launcher at the bottom
of every page.

| Subject | Score | What happened |
|---|---|---|
| `#8830` | **14** — suppressed | An authorising ticket, created a day earlier by a different identity, with a scope that resolves to the repository. All four context tests pass. The anomaly was real; the explanation held. |
| `#4912` | **93** — critical | Clone → archive → external S3 in a 28-minute window at 01:22, from an unseen commercial VPN, with a resignation filed four days earlier. Nothing in any context source authorises any of it. |
| `#2071` | **78** — high | A ticket exists and covers the repository. The subject created it and assigned it to themselves 40 minutes before the access. Provenance fails, and the context term inverts from a discount into a penalty. |
| `#A-0317` `release-bot` | **86** — high, rank 3 | An AI agent with valid access reads its task file, opens a file edited two days earlier by an outside account, queries the customer table for the first time and POSTs 1.8 MB outside the egress allow-list. The login never changes; the trajectory does. Prompt injection detected by sequence, not by login. File contents are never read. |

`#2071` is the interesting one: the behavioural terms are small. The score comes from the
context term. An analyst reading the contribution table sees immediately that this is a context
finding, not a behaviour finding.

The AI agent is registered outside the seeded 100-identity population (its peers are 9 other
agents), so the population's cohort statistics and Sensor coverage are unchanged. It ranks
third by expected cost (86 × 0.95 = 81.7), which keeps the row 1 / row 2 inversion intact.

## Case assistant, Try to fool it, Legality

- **Case assistant** — on the four scenario pages, 5–6 fixed questions ("Why is this urgent?",
  "What would a basic tool have done?", "Which context checks failed?"). Each answer lists the
  evidence ids and timestamps it uses and carries the note *pre-written for the demo; in
  production a language model rewords these facts and never changes a score*. No free-text
  box, because there is no model behind it.
- **Try to fool it** (`/demo/fool-it`) — toggle a ticket's author, lead time, named repository
  and breadth; see the four tests, the context term and the score. Behaviour terms are held at
  `#2071`'s values; the `#2071` configuration reproduces its 78.
- **Legality** (`/demo/legal`) — the four country profiles (India/US full; EU no scheduled
  screenshots; Germany works agreement; Forensic only), the main laws, and what is never
  collected: keystrokes, message text, file contents, source code. Our reading, not legal
  advice.

## Two modules that never mix

The app has a **risk module** (pseudonymous subjects, scores, dossiers) and a **workforce
module** (named employees, working time, application usage, captures). They never appear on the
same screen, there is no link from a subject to a workforce profile, and the sidebar shows which
role you are acting as.

Crossing between them is the dual-custody unmasking flow: two named approvals, recorded against
the case. In this build that is a modal explaining what would happen.

No category anywhere is labelled productive or unproductive, and no productivity score is
computed. Composition is a behavioural fact; productivity is a management judgement, and letting
the second into a risk model is how behavioural security becomes surveillance.

## Every number on screen is checkable

The product claims a score is not a black box. A demo whose contribution table does not add up
argues against its own pitch, so the relationships are asserted rather than hoped for.
**1,211 assertions on the fixtures** run before the build starts, and **363 checks on the
rendered pages** run after it finishes:

- `Σ contributions = logit` on all 15 investigation pages, `σ(logit) = P`, `round(P × 100) = risk`
- `Z = (x − median) / (1.4826 · MAD)`, recomputed from the peer array printed on the same page
- Cohort median and MAD recomputed from the committed peer values
- `expected cost = risk × asset criticality`, and the queue is sorted by it
- One intercept across every dossier, and no negative coefficient on an anomaly feature
- A feature whose evidence says "within baseline" contributes exactly `0.00`
- Printed session perplexity reproduces the printed trajectory logit
- The dashboard descent reconciles: the four context reason codes sum to the suppression total
- Working minutes, hour slots and category time agree across the two screens that show them
- No workforce name in the risk module; no risk score in the workforce module; the words
  "productive", "productivity" and "AUROC" appear in no fixture
- Every assistant answer cites evidence that exists on its page, and every score or signed
  contribution it quotes is one the page prints
- Every "Try to fool it" row follows the stated rules and its score recomputes from σ

The second set matters for a different reason: the violations most likely to slip through are
in hand-written prose, not in data. A sentence like *"see this subject's workforce profile"*
would pass every fixture assertion and break the module separation anyway, so the export itself
is scanned for workforce names on risk pages, subject pseudonyms on workforce pages, links
across the boundary, accuracy claims, placeholder text and bitmap imagery.

```bash
cd telltale
npm run verify     # 1,211 fixture assertions
npm run build      # verify -> export -> 363 checks on the rendered HTML
```

## Layout

```
tellTale_Master_Solution_Document.pdf
                            Product, technical, feasibility and business document
telltale/
  src/app/                  12 routes, two modules, all statically exported
  src/lib/fixtures/         Every number in the build
  src/components/risk/      Composite timeline, contribution table, context checks,
                            attack path, cohort strip, evidence list
  src/components/workforce/ Activity ribbons, time by category, capture placeholders
  scripts/
    generate-population.mjs Seeded generator; output committed, never run at runtime
    verify-fixtures.mjs     1,211 assertions on the fixtures, before the build
    check-export.mjs        363 checks on the rendered pages, after it
    inspect-fixtures.mjs    Ad-hoc: what each queue row's table actually says
    flatten-segments.mjs    Windows-only export fix, no-op elsewhere
```

## Notes on the build

- **Next.js 16** App Router, TypeScript strict, Tailwind v4, shadcn/ui, `output: 'export'`.
- The composite timeline is **hand-built SVG**, not a chart library. Four lanes sharing one hour
  axis is not a chart-library shape, and there is exactly one `x()` in the file so the lanes
  cannot drift out of alignment. Recharts draws the dashboard; React Flow draws the attack path.
- The generator is seeded and its **output is committed**. Nothing randomises at runtime, so the
  numbers in the demo video and the numbers on a judge's screen are the same numbers.
- Checked at 1280px laptop width and 390px phone width: no page scrolls sideways; wide
  tables scroll inside their own panel.
- `flatten-segments.mjs` works around a real Next.js bug where Windows exports write segment
  prefetch payloads into subdirectories instead of flat files, which 404s on every link hover.
