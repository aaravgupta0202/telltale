import { PageHeader } from "@/components/page-header";
import { FoolIt } from "@/components/risk/fool-it";
import { FOOL_BEHAVIOUR_LOGIT, FOOL_TABLE } from "@/lib/fixtures";

export const metadata = { title: "Try to fool it — tellTale" };

export default function FoolItPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security part · example"
        title="Try to fool it"
        description="tellTale lowers the score when a genuine ticket explains the activity. So a clever insider might write a ticket to cover themselves. Play the insider: change the ticket and see whether the four checks catch you."
      />

      <div className="mb-4 flex items-start gap-2 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        <span className="label shrink-0 font-bold">Illustrative</span>
        <span>
          The results come from a fixed table of {FOOL_TABLE.length} outcomes written in advance;
          nothing is scored live. Everything except the ticket is kept the same as in case #2071
          (behaviour points {FOOL_BEHAVIOUR_LOGIT.toFixed(2).replace("-", "−")}), so only the
          ticket changes the score.
        </span>
      </div>

      <FoolIt />

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
        Two more rules: a ticket can lower a score but never erase it, and using a decoy password
        or file is never excused by any ticket.
      </p>
    </>
  );
}
