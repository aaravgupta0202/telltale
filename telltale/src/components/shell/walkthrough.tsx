"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Footprints, X } from "lucide-react";
import { cn } from "cn";
import { normalisePath } from "@/lib/nav";
import { TOUR_KEY, TOUR_STEPS } from "@/lib/tour";

/* ---- one sessionStorage flag, shared by the bar and the launcher ---- */

const listeners = new Set<() => void>();

function readTour(): boolean {
  try {
    return window.sessionStorage.getItem(TOUR_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTourActive(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(TOUR_KEY, "1");
    else window.sessionStorage.removeItem(TOUR_KEY);
  } catch {
    // Storage blocked: the tour still runs, it just won't survive a reload.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useTourActive(): boolean {
  return useSyncExternalStore(subscribe, readTour, () => false);
}

/**
 * The walkthrough caption bar. Rendered inside <main> so its spacer reserves
 * room at the end of every page; the bar itself is fixed to the bottom, in the
 * slot the demo launcher uses (the launcher hides while the tour runs).
 *
 * Nothing here is in the static HTML: it only appears once the client has read
 * the flag, so the export checks see the pages exactly as before.
 */
export function Walkthrough() {
  const active = useTourActive();
  const pathname = normalisePath(usePathname());
  const router = useRouter();

  // Entry from the landing page: /demo/queue/?tour=1 switches the tour on and
  // the query is stripped so a reload or a copied link stays clean.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "1") {
      setTourActive(true);
      params.delete("tour");
      const rest = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (rest ? `?${rest}` : "") + window.location.hash,
      );
    }
  }, []);

  if (!active) return null;

  const index = TOUR_STEPS.findIndex((s) => s.href === pathname);
  const step = index >= 0 ? TOUR_STEPS[index] : null;
  const prev = index > 0 ? TOUR_STEPS[index - 1] : null;
  const next = index >= 0 && index < TOUR_STEPS.length - 1 ? TOUR_STEPS[index + 1] : null;
  const last = index === TOUR_STEPS.length - 1;

  return (
    <>
      <div aria-hidden className={step ? "h-56 sm:h-44" : "h-16"} />
      <section
        aria-label="Guided walkthrough"
        className="fixed right-4 bottom-4 left-4 z-40 rounded-md border border-emerald-300 bg-white shadow-xl sm:left-auto sm:w-[min(44rem,calc(100vw-2rem))]"
      >
        {step ? (
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="label flex items-center gap-1.5 text-emerald-700">
                  <Footprints className="size-3.5" />
                  Walkthrough · step {index + 1} of {TOUR_STEPS.length}
                </p>
                <h2 className="mt-1 text-sm font-semibold text-ink">{step.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setTourActive(false)}
                aria-label="End walkthrough"
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{step.caption}</p>
            <ul className="mt-2 hidden space-y-1 text-xs leading-relaxed text-slate-600 sm:block">
              {step.lookFor.map((l) => (
                <li key={l} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-600" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex gap-1" aria-hidden>
                {TOUR_STEPS.map((s, i) => (
                  <span
                    key={s.href}
                    className={cn(
                      "h-1.5 w-5 rounded-full",
                      i <= index ? "bg-emerald-600" : "bg-slate-200",
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {/* The last stop is in the workforce module: its Back button
                    would be a link onto a subject page, so it offers a
                    restart from the queue instead. */}
                {prev && !last && (
                  <Link
                    href={prev.href}
                    className="flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Link>
                )}
                {next ? (
                  <Link
                    href={next.href}
                    className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Next
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => router.push(TOUR_STEPS[0].href)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Restart
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourActive(false)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Finish
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
            <p className="text-xs text-slate-600">You left the walkthrough route.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push(TOUR_STEPS[0].href)}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Resume from the start
              </button>
              <button
                type="button"
                onClick={() => setTourActive(false)}
                className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                End
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
