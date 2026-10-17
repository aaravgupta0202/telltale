"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Filter,
  User,
  Server,
  Bot,
} from "lucide-react";
import { cn } from "cn";
import {
  IdentityGlyph,
  StatusChip,
  ValueBar,
  VerdictChip,
} from "@/components/risk/chips";
import { ALL_COHORTS, ALL_SUBJECTS, useFilters } from "@/lib/filters";
import {
  QUEUE_ROWS,
  TRIAGE_CAPACITY_AFTER_RANK,
  TRIAGE_CAPACITY_LABEL,
  routeIdFor,
} from "@/lib/fixtures";

const HEAD = [
  { label: "Rank", className: "w-14 text-right" },
  { label: "Account", className: "w-32" },
  { label: "Team", className: "w-44" },
  { label: "Score", className: "w-28" },
  { label: "Priority", className: "w-32" },
  { label: "Main reason", className: "min-w-64" },
  { label: "Approval", className: "w-36" },
  { label: "Waiting", className: "w-24 text-right" },
  { label: "Status", className: "w-28" },
  { label: "", className: "w-8" },
];

export function QueueTable() {
  const router = useRouter();
  const { cohort, subject } = useFilters();
  const [query, setQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rank" | "risk" | "cost">("rank");

  const filtered = QUEUE_ROWS.filter((r) => {
    if (cohort !== ALL_COHORTS && r.cohort !== cohort) return false;
    if (subject !== ALL_SUBJECTS && r.pseudonym !== subject) return false;
    if (filterClass !== "all" && r.identityClass !== filterClass) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        r.pseudonym.toLowerCase().includes(q) ||
        r.topSignal.toLowerCase().includes(q) ||
        r.cohort.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const rows = [...filtered].sort((a, b) => {
    if (sortBy === "risk") return b.risk - a.risk;
    if (sortBy === "cost") return b.expectedCost - a.expectedCost;
    return a.rank - b.rank;
  });

  /* The capacity rule sits before the first row that ranks below capacity */
  const ruleBefore = rows.findIndex((r) => r.rank > TRIAGE_CAPACITY_AFTER_RANK);

  return (
    <div>
      {/* Table search & quick filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-slate-50/70 px-4 py-2.5">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex w-full items-center sm:w-auto">
            <Search className="absolute left-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by #ID, reason or team..."
              className="h-8 w-full sm:w-64 rounded-sm border border-line bg-white pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-500 hover:text-emerald-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="label text-[10px] text-slate-500 mr-1 flex items-center gap-1">
              Order:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-7 rounded border border-line bg-white px-2 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="rank">Recommended (most urgent first)</option>
              <option value="risk">Highest score first</option>
              <option value="cost">Highest priority first</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="label text-[10px] text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="size-3 text-emerald-600" />
              Type:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "human", label: "People", Icon: User },
              { id: "service", label: "Services", Icon: Server },
              { id: "agent", label: "AI agents", Icon: Bot },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilterClass(id)}
                className={cn(
                  "flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition-all",
                  filterClass === id
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                    : "border-line bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {Icon && <Icon className="size-3" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-slate-50/80">
              {HEAD.map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    "label px-3 py-2.5 text-left align-bottom text-slate-500 text-[10px]",
                    h.className,
                  )}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={HEAD.length}
                  className="px-3 py-10 text-center text-sm text-slate-500"
                >
                  Nothing matches. Clear the search or filters to see every case.
                </td>
              </tr>
            )}

            {rows.map((r, i) => {
              const below = r.rank > TRIAGE_CAPACITY_AFTER_RANK;
              const href = `/demo/subject/${routeIdFor(r.id)}`;
              return (
                <Fragment key={r.id}>
                  {i === ruleBefore && ruleBefore > 0 && (
                    <tr>
                      <td colSpan={HEAD.length} className="px-0 py-0">
                        <div className="flex items-center gap-3 border-y border-dashed border-amber-300 bg-amber-50/80 px-4 py-2">
                          <span className="label text-amber-800 font-bold tracking-wider">
                            {TRIAGE_CAPACITY_LABEL}
                          </span>
                          <span className="text-xs text-amber-900/80">
                            Cases below this line won&apos;t fit in today&apos;s checking
                            time. They stay on the list, in order.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr
                    onClick={() => router.push(href)}
                    className={cn(
                      "group cursor-pointer hover:bg-emerald-50/40 transition-colors",
                      below && "opacity-60",
                    )}
                  >
                    <td className="machine px-3 py-2.5 text-right text-slate-500 font-semibold">
                      {r.rank}
                    </td>
                    <td className="px-3 py-2.5">
                      <Link
                        href={href}
                        onClick={(e) => e.stopPropagation()}
                        className="machine inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-emerald-700 group-hover:text-emerald-900 group-hover:underline transition-colors"
                      >
                        <IdentityGlyph identityClass={r.identityClass} />
                        {r.pseudonym}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-slate-800">
                      {r.cohort}
                      <span className="machine ml-1.5 text-xs text-slate-400">
                        n={r.cohortSize}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <ValueBar value={r.risk} />
                    </td>
                    <td className="px-3 py-2.5">
                      <ValueBar
                        value={r.expectedCost}
                        display={`${r.expectedCost.toFixed(1)}`}
                        tone="purple"
                        className="min-w-28"
                      />
                      <p className="machine mt-0.5 text-[10px] text-slate-400">
                        {r.risk} × {r.assetCriticality.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 text-slate-800">
                      <span
                        className={
                          r.topSignal.includes("=")
                            ? "machine text-xs font-mono font-semibold text-emerald-700"
                            : undefined
                        }
                      >
                        {r.topSignal}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <VerdictChip verdict={r.verdict} />
                    </td>
                    <td className="machine px-3 py-2.5 text-right text-xs whitespace-nowrap text-slate-500">
                      {r.age}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusChip status={r.status} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="size-3.5" />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
