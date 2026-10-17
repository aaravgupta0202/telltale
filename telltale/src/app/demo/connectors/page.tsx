import { cn } from "cn";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { ConnectorRibbons } from "@/components/connectors/ribbon";
import { ConnectorStrip, STATE_TEXT } from "@/components/connectors/strip";
import { CONNECTORS, CONNECTOR_INSTANCES, NOW } from "@/lib/fixtures";

export const metadata = { title: "App connections - tellTale" };

export default function ConnectorsPage() {
  const degraded = CONNECTORS.filter((c) => c.state !== "healthy");

  return (
    <>
      <PageHeader
        eyebrow="Security part"
        title="App connections"
        description="The tools tellTale reads activity from, and whether each one is still sending data. An attacker might switch off a log to hide, so a tool that goes quiet raises an alert of its own."
        right={
          <div className="text-right">
            <p className="label text-slate-500 text-[10px]">Evaluated at</p>
            <p className="machine text-xs font-semibold text-emerald-700">
              {NOW.replace("T", " ").replace("Z", " IST")}
            </p>
          </div>
        }
      />

      {degraded.length > 0 && (
        <div className="panel mb-4 flex items-center gap-4 border border-amber-200 bg-amber-50/70 px-4 py-3 rounded-sm ">
          <span className="label rounded-[4px] border border-amber-300 bg-amber-100 px-2 py-0.5 text-amber-800 font-bold">
            {degraded.length} tool not reporting
          </span>
          <p className="text-xs text-slate-700">
            <span className="font-semibold text-amber-900">
              {degraded.map((c) => c.name).join(", ")}
            </span>{" "}
            stopped sending data 47 minutes ago. Cases that rely on it are marked
            as incomplete, instead of being scored as if nothing happened.
          </p>
        </div>
      )}

      <Panel title="Connected tools" bodyClassName="p-0" className="mb-4">
        <ConnectorStrip href="#instances" />
      </Panel>

      <Panel
        title="Status through the day"
        sub="Whether each tool was sending data at each point of the example day. A gap is shown as a red stretch, not left blank."
        bodyClassName="p-0"
        className="mb-4"
      >
        <ConnectorRibbons />
      </Panel>

      <Panel
        title="How much data arrived"
        sub="Records received in each check, next to the normal range learned from the previous four weeks."
        bodyClassName="p-0"
        className="mb-4"
        footnote="A normal amount of data only shows the volume is ordinary. A separate regular check-in signal is what shows the tool is actually alive."
      >
        <div id="instances" className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50">
                {[
                  "Tool",
                  "Type",
                  "Time",
                  "Records received",
                  "Normal range",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="label px-4 py-2.5 text-left text-slate-500 text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CONNECTOR_INSTANCES.map((r, i) => (
                <tr
                  key={i}
                  className={cn(
                    "hover:bg-slate-50 transition-colors",
                    !r.inBand && "bg-amber-50/40",
                  )}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-900">
                    {r.source}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "label rounded-[4px] border px-2 py-0.5 text-[10px] font-semibold tracking-wider",
                        r.type === "online"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-red-200 bg-red-50 text-red-800",
                      )}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="machine px-4 py-2.5 text-xs text-slate-500">
                    {r.ts.replace("T", " ").replace("Z", "")}
                  </td>
                  <td className="machine px-4 py-2.5 text-slate-900 font-semibold">
                    {r.events.toLocaleString("en-US")}
                  </td>
                  <td className="machine px-4 py-2.5 text-xs text-slate-500">
                    {r.expectedBand}
                  </td>
                  <td className="px-4 py-2.5">
                    {r.inBand ? (
                      <span className="label text-emerald-700 font-semibold">
                        normal
                      </span>
                    ) : (
                      <span className="label text-amber-700 font-bold">
                        {r.events === 0 ? "no data" : "too low"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="What the colours mean" className="border-line bg-white ">
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li className="flex items-center gap-2">
            <span
              className={cn(
                "machine font-bold px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50",
                STATE_TEXT.healthy,
              )}
            >
              healthy
            </span>
            <span>
              — checking in on time, with a normal amount of data.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                "machine font-bold px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50",
                STATE_TEXT.degraded,
              )}
            >
              degraded
            </span>
            <span>
              — still sending, but much less than usual. Checks continue and are
              marked as incomplete.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={cn(
                "machine font-bold px-1.5 py-0.5 rounded border border-red-200 bg-red-50",
                STATE_TEXT.silent,
              )}
            >
              silent
            </span>
            <span>
              — not sending anything. Checks that need this tool are paused
              rather than treating the silence as &ldquo;all clear&rdquo;.
            </span>
          </li>
        </ul>
      </Panel>
    </>
  );
}
