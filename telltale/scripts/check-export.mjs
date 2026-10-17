/**
 * Post-build check on the RENDERED export, not on the fixtures.
 *
 * verify-fixtures.mjs asserts the data is coherent. This asserts the pages
 * built from it do not violate the hard content constraints — which is a
 * different risk, because the violations that matter most would come from
 * hand-written prose in a component, not from a fixture. A sentence like
 * "see this subject's workforce profile" would pass every fixture assertion
 * and break PRD §7.1 anyway.
 *
 * Runs as the last step of `npm run build`:
 *   node scripts/check-export.mjs out
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

const root = process.argv[2] ?? "out";

register("./ts-resolve-hook.mjs", import.meta.url);
const fx = await import(pathToFileURL("./src/lib/fixtures/index.ts").href);

let failures = 0;
let checks = 0;

function ok(condition, message, detail) {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`  FAIL  ${message}${detail ? `\n        ${detail}` : ""}`);
  }
}

/** Every index.html in the export, as a repo-relative route. */
async function pages(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      await pages(full, acc);
    } else if (entry.name === "index.html") {
      acc.push(full);
    }
  }
  return acc;
}

const files = await pages(root);
const docs = await Promise.all(
  files.map(async (f) => ({
    route: `/${path.relative(root, path.dirname(f)).split(path.sep).join("/")}`.replace(/^\/\.$/, "/"),
    html: await readFile(f, "utf8"),
  })),
);

/* The landing page at "/" is outside the demo console entirely — it isn't
 * part of either module, so it's excluded from the module-scoped checks
 * below rather than folded into "risk" by default. */
const demo = docs.filter((d) => d.route.startsWith("/demo"));
const risk = demo.filter((d) => !d.route.startsWith("/demo/workforce"));
const workforce = demo.filter((d) => d.route.startsWith("/demo/workforce"));

console.log(`\nExport content constraints — ${docs.length} rendered pages\n`);

ok(docs.length >= 40, "every route rendered", `${docs.length} pages`);
ok(risk.length > 0 && workforce.length > 0, "both modules rendered");

/* ---- PRD §7.1: no employee name anywhere in the risk module ------------ */
const names = [...new Set(fx.MEMBERS.map((m) => m.name))];
for (const doc of risk) {
  const leaked = names.filter((n) => doc.html.includes(n));
  ok(leaked.length === 0, `${doc.route}: no workforce name appears in the risk module`, leaked.join(", "));
}

/* ---- PRD §7.1: no subject pseudonym anywhere in the workforce module ---
   Matched with a boundary so a hex colour like #8472bb is not a false hit. */
const pseudonyms = fx.SCORED_SUBJECTS.map((s) => s.pseudonym);
for (const doc of workforce) {
  const leaked = pseudonyms.filter((p) => new RegExp(`${p}\\b(?![0-9a-f])`).test(doc.html));
  ok(leaked.length === 0, `${doc.route}: no subject pseudonym appears in the workforce module`, leaked.join(", "));
}

/* ---- PRD §7.1: no navigation from a subject to a workforce profile ----- */
for (const doc of risk) {
  ok(
    !/href="[^"]*\/workforce\/[^"]/.test(doc.html),
    `${doc.route}: no link from the risk module into a workforce profile`,
  );
}

/* ---- PRD §7.7: no claimed accuracy figure, anywhere ------------------- */
for (const doc of docs) {
  const claim = /AUROC|\b\d{2}(\.\d+)?% accurate|accuracy of \d/i.exec(doc.html);
  ok(!claim, `${doc.route}: no accuracy claim`, claim?.[0]);
}

/* ---- PRD §4: the honesty badge is on every page ----------------------- */
for (const doc of docs) {
  ok(
    /Demo build\s*&#x2014;\s*all data synthetic|Demo build — all data synthetic/i.test(doc.html),
    `${doc.route}: DEMO BUILD — ALL DATA SYNTHETIC badge present`,
  );
}

/* ---- PRD §2: nothing unfinished on the happy path -------------------- */
for (const doc of docs) {
  const junk = /lorem ipsum|\bTODO\b|\bFIXME\b|\bTBD\b|Placeholder avatar/i.exec(doc.html);
  ok(!junk, `${doc.route}: no placeholder or TODO text`, junk?.[0]);
}

/* ---- PRD §7.4: no raster imagery of a real screen shipped ------------
 * The one deliberate exception is /capture-screenshots/ — a handful of
 * generic vendor reference images (VS Code, Chrome, GitHub, Figma docs
 * screenshots, see public/capture-screenshots/NOTICE.md) used as gallery
 * illustration, not a capture of anyone's actual screen. Every other route
 * still carries the original zero-bitmap guarantee unchanged. */
for (const doc of docs) {
  const img = /<img[^>]+src="(?!data:image\/svg)(?!\/capture-screenshots\/)[^"]*\.(png|jpe?g|gif|webp)/i.exec(
    doc.html,
  );
  ok(!img, `${doc.route}: no bitmap screenshot imagery outside capture-screenshots/`, img?.[0]);
}

/* ---- Every queue row is reachable and rendered ----------------------- */
for (const row of fx.QUEUE_ROWS) {
  const id = fx.routeIdFor(row.id);
  const page = docs.find((d) => d.route === `/demo/subject/${id}`);
  ok(!!page, `${row.pseudonym}: investigation page exists in the export`);
  if (page) {
    ok(
      page.html.includes(row.pseudonym),
      `${row.pseudonym}: its own page names it`,
    );
    ok(
      page.html.includes("Σ contributions") || page.html.includes("&#x3A3; contributions"),
      `${row.pseudonym}: its page renders the contribution total row`,
    );
  }
}

/* ---- The pages added for the CyberForge deck ------------------------ */
const page = (route) => docs.find((d) => d.route === route);

const fool = page("/demo/fool-it");
ok(!!fool, "/demo/fool-it: rendered");
ok(!!fool && /Illustrative/.test(fool.html), "/demo/fool-it: labelled as illustrative");

const legal = page("/demo/legal");
ok(!!legal, "/demo/legal: rendered");
ok(!!legal && /not legal advice/.test(legal.html), "/demo/legal: says it is not legal advice");
for (const n of fx.NEVER_COLLECTED) {
  ok(!!legal && legal.html.includes(n), `/demo/legal: lists "${n}" as never collected`);
}

for (const id of Object.keys(fx.ASSISTANT_QA)) {
  const doc = page(`/demo/subject/${fx.routeIdFor(id)}`);
  ok(
    !!doc && doc.html.includes("Case assistant") && doc.html.includes("never changes a score"),
    `${id}: assistant panel and its note are on the page`,
  );
}

for (const a of fx.AGENT_SUBJECTS) {
  const doc = page(`/demo/subject/${fx.routeIdFor(a.id)}`);
  ok(!!doc && doc.html.includes(a.label), `${a.pseudonym}: its page names the agent (${a.label})`);
}

const landing = page("/");
ok(
  !!landing && landing.html.includes("Start the walkthrough"),
  "/: the landing page offers the guided walkthrough",
);

/* ---- Old event branding is gone from every page ---------------------- */
for (const doc of docs) {
  const old = /manipal|M# 2026|team 001|round 1\b|employeye|verve/i.exec(doc.html);
  ok(!old, `${doc.route}: no stale event or vendor branding`, old?.[0]);
}

console.log(`${failures === 0 ? "PASS" : "FAIL"} — ${checks - failures}/${checks} export checks passed`);
if (failures > 0) {
  console.error(`\n${failures} export check(s) failed. The rendered pages violate a content constraint.`);
  process.exit(1);
}
