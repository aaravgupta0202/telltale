import { AlertTriangle, Check, X, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import type { CheckResult, ContextCheck, ContextVerdict } from "@/lib/fixtures";
import { CHECK_PLAIN } from "@/lib/plain";

/**
 * PRD §5.3D: the four tests, in the order the engine applies them. Each row
 * shows the record that was examined, not just a verdict — a check that cannot
 * name its evidence is an assertion, and this screen exists to avoid making
 * assertions.
 */
const TESTS: { key: ContextCheck["test"]; label: string; question: string; technical: string }[] =
  (["precedence", "provenance", "scope", "proportionality"] as const).map((key) => ({
    key,
    label: CHECK_PLAIN[key].name,
    question: CHECK_PLAIN[key].question,
    technical: CHECK_PLAIN[key].technical,
  }));

const RESULT: Record<
  CheckResult,
  { label: string; Icon: typeof Check; className: string; dot: string }
> = {
  pass: {
    label: "PASSED",
    Icon: Check,
    className: "text-emerald-700",
    dot: "bg-emerald-600",
  },
  warn: {
    label: "DOUBTFUL",
    Icon: AlertTriangle,
    className: "text-amber-700",
    dot: "bg-amber-600",
  },
  fail: {
    label: "FAILED",
    Icon: X,
    className: "text-red-700",
    dot: "bg-red-600",
  },
};

const VERDICT_LINE: Record<ContextVerdict, string> = {
  authorised:
    "All four checks passed. This was approved work, so the alert was closed and the record that explains it was saved.",
  partial:
    "The record is genuine but only explains part of the activity, so it lowers the score a little rather than fully.",
  absent:
    "No ticket, on-call shift or HR record covers this activity. That doesn't prove bad intent, so it adds nothing to the score, but nothing lowers it either.",
  suspicious:
    "A record exists, but this account made it for itself. Faking approval is a warning sign in itself, so it raises the score instead of lowering it.",
};

export function ContextChecks({
  checks,
  verdict,
}: {
  checks: ContextCheck[];
  verdict: ContextVerdict;
}) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {TESTS.map((t) => {
          const check = checks.find((c) => c.test === t.key);
          if (!check) return null;
          const r = RESULT[check.result];
          const punchline =
            check.test === "provenance" &&
            check.result === "fail" &&
            check.createdBy;
          return (
            <li
              key={t.key}
              className={cn(
                "flex gap-4 border-l-3 px-4 py-3.5 transition-colors",
                check.result === "fail"
                  ? "border-l-red-500 bg-red-50/50"
                  : check.result === "warn"
                    ? "border-l-amber-500 bg-amber-50/50"
                    : "border-l-emerald-600 bg-emerald-50/30",
              )}
            >
              <div className="flex w-38 shrink-0 items-start gap-2.5">
                <div
                  className={cn(
                    "mt-0.5 flex size-5 items-center justify-center rounded-full border",
                    check.result === "fail"
                      ? "border-red-200 bg-red-100"
                      : check.result === "warn"
                        ? "border-amber-200 bg-amber-100"
                        : "border-emerald-200 bg-emerald-100",
                  )}
                >
                  <r.Icon className={cn("size-3", r.className)} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">{t.label}</p>
                  <p className="text-[10px] text-slate-400">{t.technical}</p>
                  <p className={cn("label text-[10px] font-bold", r.className)}>
                    {r.label}
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">{t.question}</p>
                <p
                  className={cn(
                    "mt-1 text-sm leading-relaxed",
                    punchline ? "font-bold text-red-700" : "text-slate-800",
                  )}
                >
                  {check.finding.replace(/subject_(\d+)/g, "Subject #$1")}
                </p>
                {(check.recordId || check.createdBy || check.createdAt) && (
                  <dl className="machine mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                    {check.recordId && <Pair k="record" v={check.recordId} />}
                    {check.createdBy && (
                      <Pair
                        k="created by"
                        v={check.createdBy.replace(/subject_(\d+)/g, "Subject #$1")}
                        highlight={!!punchline}
                      />
                    )}
                    {check.createdAt && (
                      <Pair
                        k="created at"
                        v={check.createdAt.replace("T", " ").replace("Z", "")}
                      />
                    )}
                  </dl>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-line bg-slate-50/70 px-4 py-3 text-xs leading-relaxed text-slate-700 flex items-center gap-2">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
        <span>{VERDICT_LINE[verdict]}</span>
      </div>
    </div>
  );
}

function Pair({
  k,
  v,
  highlight,
}: {
  k: string;
  v: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-1.5 items-center">
      <dt className="text-slate-400 text-[11px] capitalize">{k}:</dt>
      <dd
        className={cn(
          "text-[11px]",
          highlight
            ? "font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200"
            : "text-emerald-800 font-semibold",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
