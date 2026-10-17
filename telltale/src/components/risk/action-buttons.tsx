"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldOff,
  UserSearch,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * PRD §5.3A: three actions, each opening a modal that explains what would
 * happen. Nothing is wired to anything.
 *
 * Unmasking is deliberately shaped differently from the other two: it is a
 * two-approval flow and is rendered as two named grants, never one button
 * (PRD §7.6). This is also the only place a workforce identity is referred to
 * from the risk module, and it refers to the *process*, not to a person — there
 * is no link and no name.
 */
interface Action {
  id: string;
  label: string;
  Icon: typeof ShieldOff;
  title: string;
  body: string;
  effect: string;
  twoPerson?: boolean;
}

const ACTIONS: Action[] = [
  {
    id: "revoke",
    label: "Log this account out",
    Icon: ShieldOff,
    title: "Log this account out everywhere",
    body: "Ends every open login for this account (through Okta) and makes it sign in again with an extra verification step. Access already granted to apps stays as it is; the next button handles that.",
    effect: "6 open logins · 2 devices · 1 through a commercial VPN",
  },
  {
    id: "tokens",
    label: "Limit its access keys",
    Icon: KeyRound,
    title: "Limit this account's access keys",
    body: "Switches the account's GitHub and AWS access keys to read-only, and cancels the personal access key used in the flagged activity. A second analyst can undo this.",
    effect: "3 access keys affected · 1 personal key created 11 days ago",
  },
  {
    id: "unmask",
    label: "Ask who this is",
    Icon: UserSearch,
    title: "Ask to reveal who is behind this ID",
    body: "Security only sees ID numbers. Finding out the person's name is the one action that links the security part to HR records, so one person can never do it alone: a security lead and an HR or legal lead must both approve and give a reason. Both approvals are saved in the case file.",
    effect: "Needs 2 of 2 approvals · security lead + HR or legal lead · saved to the case file",
    twoPerson: true,
  },
];

export function ActionButtons({ pseudonym }: { pseudonym: string }) {
  const [open, setOpen] = useState<Action | null>(null);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {ACTIONS.map((a) => (
          <Button
            key={a.id}
            variant="outline"
            size="sm"
            onClick={() => setOpen(a)}
            className="w-full justify-start gap-2 rounded-sm border-line bg-white text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
          >
            <a.Icon className="size-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{a.label}</span>
          </Button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-sm border border-line bg-white text-slate-900 shadow-2xl sm:max-w-lg z-50">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 text-emerald-600">
                {open && <open.Icon className="size-4" />}
              </div>
              <DialogTitle className="text-slate-900 text-base font-semibold">
                {open?.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 text-xs leading-relaxed pt-2">
              {open?.body}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-2">
            <div className="rounded-sm border border-line bg-slate-50 p-3">
              <p className="label text-emerald-800 text-[10px] font-bold">
                What it would affect
              </p>
              <p className="machine mt-1 text-xs text-slate-800">
                {open?.effect}
              </p>
              <p className="machine mt-2 text-xs text-slate-600">
                Target:{" "}
                <span className="text-emerald-700 font-semibold">
                  {pseudonym}
                </span>
              </p>
            </div>

            {open?.twoPerson && (
              <div className="grid grid-cols-2 gap-2.5">
                {["Security approval", "HR / legal approval"].map((g) => (
                  <div
                    key={g}
                    className="rounded-sm border border-dashed border-line bg-slate-50/50 p-2.5"
                  >
                    <p className="label text-slate-500 text-[10px]">{g}</p>
                    <p className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1">
                      <Lock className="size-3" />
                      Waiting for approval
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-amber-600" />
              <span>
                Switched off in this demo. In the real product this would act on the connected system.
              </span>
            </div>
          </div>

          <DialogFooter className="mt-1">
            <Button
              variant="outline"
              onClick={() => setOpen(null)}
              className="border-line bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Close
            </Button>
            <Button
              disabled
              className="border border-line bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed"
            >
              {open?.twoPerson ? "Send for approval" : "Do it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
