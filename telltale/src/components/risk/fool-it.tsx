"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "cn";
import {
  FOOL_BEHAVIOUR_LOGIT,
  FOOL_OPTIONS,
  FOOL_TABLE,
  type FoolAuthor,
  type FoolBreadth,
  type FoolLead,
  type FoolTarget,
} from "@/lib/fixtures/fool-it";
import type { CheckResult, ContextVerdict } from "@/lib/fixtures/types";
import { CHECK_PLAIN, VERDICT_PLAIN } from "@/lib/plain";

const TESTS = (["precedence", "provenance", "scope", "proportionality"] as const).map((key) => ({
  key,
  label: CHECK_PLAIN[key].name,
  question: CHECK_PLAIN[key].question,
}));

const RESULT: Record<CheckResult, { label: string; Icon: typeof Check; cls: string }> = {
  pass: { label: "PASSED", Icon: Check, cls: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  warn: { label: "DOUBTFUL", Icon: AlertTriangle, cls: "border-amber-200 bg-amber-50 text-amber-800" },
  fail: { label: "FAILED", Icon: X, cls: "border-red-200 bg-red-50 text-red-800" },
};

const VERDICT: Record<ContextVerdict, { label: string; line: string; cls: string }> = {
  authorised: {
    label: VERDICT_PLAIN.authorised,
    line: "All four checks pass. The ticket explains the copy, so the score drops and the reason is saved.",
    cls: "text-emerald-700",
  },
  partial: {
    label: VERDICT_PLAIN.partial,
    line: "The ticket is genuine but only explains part of what happened, so the score drops a little.",
    cls: "text-slate-700",
  },
  absent: {
    label: VERDICT_PLAIN.absent,
    line: "The ticket is about a different project, so it explains nothing here. The score neither drops nor rises.",
    cls: "text-slate-700",
  },
  suspicious: {
    label: VERDICT_PLAIN.suspicious,
    line: "The person wrote their own permission slip. Faking approval raises the score instead of lowering it.",
    cls: "text-red-700",
  },
};

const signed = (x: number) => `${x >= 0 ? "+" : "−"}${Math.abs(x).toFixed(2)}`;

export function FoolIt() {
  const [author, setAuthor] = useState<FoolAuthor>("self");
  const [lead, setLead] = useState<FoolLead>("40m");
  const [target, setTarget] = useState<FoolTarget>("this");
  const [breadth, setBreadth] = useState<FoolBreadth>("1");

  const row = FOOL_TABLE.find(
    (r) => r.author === author && r.lead === lead && r.target === target && r.breadth === breadth,
  );
  if (!row) return null;
  const v = VERDICT[row.verdict];
  const tone = row.risk >= 70 ? "text-red-700" : row.risk >= 40 ? "text-amber-700" : "text-emerald-700";

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className="panel p-4">
        <h2 className="label text-ink">The ticket</h2>
        <p className="mt-1 text-xs leading-relaxed text-grey">
          Someone copied the payments-core code for the first time. Below is the ticket that is
          supposed to explain it. Change it and see whether tellTale accepts it.
        </p>
        <div className="mt-4 space-y-4">
          <Toggle label="Who wrote the ticket" options={FOOL_OPTIONS.author} value={author} onChange={setAuthor} />
          <Toggle label="When it was written, compared with the copy" options={FOOL_OPTIONS.lead} value={lead} onChange={setLead} />
          <Toggle label="Which code the ticket mentions" options={FOOL_OPTIONS.target} value={target} onChange={setTarget} />
          <Toggle label="How much was copied" options={FOOL_OPTIONS.breadth} value={breadth} onChange={setBreadth} />
        </div>
        <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-slate-500">
          It starts on the real case of{" "}
          <Link href="/demo/subject/2071" className="font-semibold text-emerald-700 hover:underline">
            #2071
          </Link>
          : a ticket the person wrote for themselves 40 minutes before the copy.
        </p>
      </section>

      <section className="panel flex flex-col">
        <ul className="divide-y divide-line">
          {TESTS.map((t) => {
            const r = RESULT[row.tests[t.key]];
            return (
              <li key={t.key} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={cn(
                    "label inline-flex w-16 shrink-0 items-center justify-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold",
                    r.cls,
                  )}
                >
                  <r.Icon className="size-3" />
                  {r.label}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink">{t.label}</p>
                  <p className="text-xs text-slate-500">{t.question}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto grid grid-cols-1 gap-4 border-t border-line bg-slate-50/60 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div>
            <p className="label text-[10px] text-grey">Score</p>
            <p className={cn("machine text-5xl leading-none font-extrabold", tone)}>{row.risk}</p>
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className={cn("label text-xs font-bold", v.cls)}>Approval: {v.label}</p>
            <p className="text-sm leading-relaxed text-slate-700">{v.line}</p>
            <dl className="machine flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-slate-600">
              <div className="flex gap-1">
                <dt className="text-slate-400">behaviour points</dt>
                <dd>{signed(FOOL_BEHAVIOUR_LOGIT)}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-slate-400">own-ticket penalty</dt>
                <dd>{signed(row.indicator)}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-slate-400">approval points</dt>
                <dd className={v.cls}>{signed(row.gamma)}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-slate-400">total</dt>
                <dd className="font-semibold text-ink">{signed(row.logit)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function Toggle<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label mb-1.5 text-grey">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              value === o.value
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-line bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
