"use client";

import { useState } from "react";
import { Bot, Info, MessageSquare } from "lucide-react";
import { cn } from "cn";
import { ASSISTANT_NOTE, type AssistantAnswer } from "@/lib/fixtures/assistant";
import type { EvidenceItem } from "@/lib/fixtures/types";

/**
 * The case-file assistant, as a chat. Questions are fixed buttons and answers
 * are fixture text: there is no input box because there is no model behind
 * it, and a box that accepted free text would imply one.
 *
 * Each citation is resolved against the evidence list on the same page, so
 * the timestamp printed here is the one in the evidence panel below.
 */
export function AssistantPanel({
  qa,
  evidence,
}: {
  qa: AssistantAnswer[];
  evidence: EvidenceItem[];
}) {
  const [asked, setAsked] = useState<number[]>([]);
  const byId = new Map(evidence.map((e) => [e.id, e]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <div className="border-b border-line p-3 lg:border-r lg:border-b-0">
        <p className="label mb-2 text-grey">Ask about this case</p>
        <ul className="flex flex-wrap gap-1.5 lg:flex-col">
          {qa.map((q, i) => {
            const done = asked.includes(i);
            return (
              <li key={q.question}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => setAsked((a) => [...a, i])}
                  className={cn(
                    "flex w-full items-start gap-1.5 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors",
                    done
                      ? "cursor-default border-line bg-slate-50 text-slate-400"
                      : "border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100",
                  )}
                >
                  <MessageSquare className="mt-0.5 size-3 shrink-0" />
                  <span>{q.question}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {asked.length > 0 && (
          <button
            type="button"
            onClick={() => setAsked([])}
            className="mt-2 text-[11px] text-slate-500 underline-offset-2 hover:text-emerald-700 hover:underline"
          >
            Clear conversation
          </button>
        )}
      </div>

      <div className="min-w-0 p-3" aria-live="polite">
        {asked.length === 0 ? (
          <div className="flex h-full min-h-24 items-center justify-center rounded-md border border-dashed border-line px-4 py-6 text-center text-xs text-slate-500">
            Pick a question. Every answer is built only from the events on this page and lists
            the ones it used.
          </div>
        ) : (
          <ol className="space-y-3">
            {asked.map((i) => {
              const q = qa[i];
              return (
                <li key={q.question} className="space-y-1.5">
                  <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-emerald-600 px-3 py-1.5 text-xs text-white">
                    {q.question}
                  </p>
                  <div className="flex max-w-[95%] gap-2">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-slate-50 text-emerald-700">
                      <Bot className="size-3.5" />
                    </span>
                    <div className="min-w-0 rounded-lg rounded-tl-sm border border-line bg-white px-3 py-2">
                      <p className="text-sm leading-relaxed text-ink">{q.answer}</p>
                      <p className="label mt-2 text-[10px] text-grey">Events used</p>
                      <ul className="mt-1 space-y-0.5">
                        {q.cites.map((id) => {
                          const e = byId.get(id);
                          return (
                            <li key={id} className="machine flex flex-wrap gap-x-2 text-[11px] text-slate-600">
                              <span className="font-semibold text-emerald-800">{id}</span>
                              <span>{e ? e.ts.replace("T", " ").replace("Z", "") : "missing"}</span>
                              {e && (
                                <span className="font-sans text-slate-500">
                                  {e.detail.replace(/subject_(\d+)/g, "Subject #$1")}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-2 flex items-start gap-1 border-t border-line pt-1.5 text-[11px] leading-relaxed text-slate-500">
                        <Info className="mt-0.5 size-3 shrink-0" />
                        {ASSISTANT_NOTE}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
