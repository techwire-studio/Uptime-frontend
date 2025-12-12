import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type RawMonitorsType } from "@/types/monitor";
import { buildMonitorStats } from "@/lib/monitor";

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
    <main className="flex gap-4 flex-col mt-5">
      <div className="w-60 rounded-xl bg-primary border-l border-gray-800 p-6 space-y-8">
        {/* Current Status */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-col justify-between">
            <h2 className="text-start font-semibold text-lg">
              Current status.
            </h2>
            <Button className="w-8 h-8 animate-pulse rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center">
              <ChevronUp size={18} />
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            {statusItems.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl font-bold">{item.value}</div>
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
        {/* Last 24 Hours */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Last 24 hours.</h2>

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
