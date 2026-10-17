"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/*
 * The inline script in app/layout.tsx applies the stored theme to <html>
 * before hydration, so the class on the document element is the source of
 * truth. The server snapshot is null, which renders the invisible placeholder
 * until the client has read the class.
 */
const listeners = new Set<() => void>();

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const readDark = () => document.documentElement.classList.contains("dark");

function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("telltale-theme", dark ? "dark" : "light");
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  listeners.forEach((l) => l());
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore<boolean | null>(subscribe, readDark, () => null);

  if (isDark === null) {
    return (
      <div className={`h-8 w-8 rounded-md border border-line bg-white opacity-0 ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setDark(!isDark)}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-line bg-white px-2.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-emerald-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400 ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="size-3.5 text-amber-400 fill-amber-400/20" />
          <span className="text-[11px] font-medium hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-slate-600" />
          <span className="text-[11px] font-medium hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
