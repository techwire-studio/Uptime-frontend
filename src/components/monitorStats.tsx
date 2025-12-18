import { ChevronDown, ChevronUp } from "lucide-react";
import { type RawMonitorsType } from "@/types/monitor";
import { buildMonitorStats } from "@/lib/monitor";
import PulseLoader from "@/components/loader";

const MonitorStats = ({ monitors }: { monitors: RawMonitorsType[] }) => {
  const stats = buildMonitorStats(monitors);

  const statusItems = [
    { label: "Down", value: stats.down },
    { label: "Up", value: stats.up },
    { label: "Paused", value: stats.paused },
  ];

  const last24Items = [
    {
      label: "Overall uptime",
      value: stats.overallUptime,
      color: "text-green-500",
    },
    { label: "Incidents", value: stats.incidents },
    { label: "Without incid.", value: stats.withoutIncident },
    { label: "Affected mon.", value: stats.affectedMonitors },
  ];

  return (
    <main className="flex gap-4 flex-col mt-5 pr-6">
      <div className="w-60 rounded-xl bg-primary border-l border-gray-800 p-6 space-y-8">
        <div className="space-y-6">
          <h2 className="text-start font-semibold text-base">
            Current status
            <span className="text-green-500">.</span>
          </h2>
          <div className="flex justify-center">
            <PulseLoader
              classes=""
              size={30}
              color={stats.down > 0 ? "bg-red-500" : "bg-green-500"}
              icon={
                stats.down > 0 ? (
                  <ChevronDown size={18} className="text-black" />
                ) : (
                  <ChevronUp size={18} className="text-black" />
                )
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {statusItems.map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className={`text-xl font-bold ${
                    item.label === "Down" ? "text-red-500" : "text-white"
                  }`}
                >
                  {item.value}
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 text-center">
            Using {monitors.length} of 50 monitors.
          </p>
        </div>
      </div>

      <div className="w-60 bg-primary rounded-xl border-l border-gray-800 p-6 space-y-8">
        <div>
          <h2 className="font-semibold text-lg mb-4">
            Last 24 hours
            <span className="text-green-500">.</span>
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {last24Items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className={`text-xl font-bold ${item.color || ""}`}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MonitorStats;
