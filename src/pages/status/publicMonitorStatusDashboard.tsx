import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import PulseLoader from "@/components/loader";
import {
  calculateResponseTime,
  prepareChecksGraphData,
  prepareMonitorSummary,
} from "@/lib/monitor";
import { formatDuration, getPastDateISO } from "@/lib/utils";

import {
  type RawMonitorsType,
  type RawMonitorChecksType,
  MonitorHealthStatus,
} from "@/types/monitor";
import type { RawIncidentType } from "@/types/incident";
import { ResponseTimeGraph } from "@/components/responseTimeGraph";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChecksGraph } from "@/components/checksGraph";

const fetchMonitorById = async (
  id: string
): Promise<
  Omit<RawMonitorsType, "checks"> & { checks: RawMonitorChecksType[] }
> => {
  const { data } = await axiosInstance.get(`monitors/${id}`);
  return data.data;
};

const fetchIncidents90Days = async (
  monitorId: string
): Promise<RawIncidentType[]> => {
  const start = getPastDateISO(90);
  const end = new Date().toISOString();
  const { data } = await axiosInstance.get(`/monitors/${monitorId}/incidents`, {
    params: { start, end },
  });
  return data.data;
};

// filter by date range (days)
const filterIncidents = (incidents: RawIncidentType[], days: number) => {
  const start = new Date();
  start.setDate(start.getDate() - days);

  return incidents.filter((i) => new Date(i.started_at) >= start);
};

const filterChecks = (checks: RawMonitorChecksType[], days: number) => {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return checks.filter((c) => new Date(c.checked_at) >= start);
};

const PublicMonitorStatusPage = () => {
  const { monitorId } = useParams<{ monitorId: string }>();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [nextUpdate, setNextUpdate] = useState(60);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setNextUpdate((n) => (n > 0 ? n - 1 : 60));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const monitorQuery = useQuery({
    queryKey: ["monitor", monitorId],
    queryFn: () => fetchMonitorById(monitorId!),
    enabled: !!monitorId,
  });

  const incidentsQuery = useQuery({
    queryKey: ["incidents-90", monitorId],
    queryFn: () => fetchIncidents90Days(monitorId!),
    enabled: !!monitorId,
    staleTime: 5 * 60 * 1000,
  });

  if (monitorQuery.isLoading || incidentsQuery.isLoading)
    return <PulseLoader />;

  if (monitorQuery.error || !monitorQuery.data)
    return <div className="text-red-500">Error loading monitor.</div>;

  const monitor = monitorQuery.data;
  const incidents90 = incidentsQuery.data || [];

  const incidents24h = filterIncidents(incidents90, 1);
  const incidents7d = filterIncidents(incidents90, 7);
  const incidents30d = filterIncidents(incidents90, 30);

  const summaries = [
    {
      label: "Last 24 Hours",
      summary: prepareMonitorSummary(incidents24h, "24h", 86400),
    },
    {
      label: "Last 7 Days",
      summary: prepareMonitorSummary(incidents7d, "7d", 7 * 86400),
    },
    {
      label: "Last 30 Days",
      summary: prepareMonitorSummary(incidents30d, "30d", 30 * 86400),
    },
    {
      label: "Last 90 Days",
      summary: prepareMonitorSummary(incidents90, "90d", 90 * 86400),
    },
  ];

  const checksLast2Days = filterChecks(monitor.checks, 2);
  const responseStats = calculateResponseTime(checksLast2Days);

  const checksGraph = prepareChecksGraphData(monitor.checks);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black pb-20">
      <div className="text-black py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div>
            <Button
              onClick={() => navigate(-1)}
              className="my-4 border-primary text-xs text-white"
            >
              <ArrowLeft size={16} />
              <div className="text-sm">Back to list </div>
            </Button>
            <h1 className="text-xl font-semibold">{monitor.name}</h1>
          </div>

          <div className="text-right">
            <h2 className="font-semibold">Service status</h2>
            <p className="text-gray-400 text-xs">
              Last updated {now.toLocaleTimeString()} | Next in {nextUpdate}s
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-full ${
              monitor.status === MonitorHealthStatus.HEALTHY
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <div>
            <p className="text-xl font-semibold">
              {monitor.url} is {monitor.status}
            </p>
            <p>Checked every {formatDuration(monitor.interval_seconds)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Uptime</h3>
          Last 90 days
          <p>{summaries[3].summary?.uptimePercentage.toFixed(2)}%</p>
          <div className="grid grid-cols-4">
            <ChecksGraph barClassName="w-2 h-10" checks={checksGraph} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Overall Uptime</h3>

          <div className="grid grid-cols-4">
            {summaries.map((summary, index) => (
              <div
                key={index}
                className={`px-4 ${
                  index !== summaries.length - 1 && "border-r border-gray-200"
                }`}
              >
                <div className="text-xl font-semibold">
                  {summary.summary?.uptimePercentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">{summary.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ResponseTimeGraph responseStats={responseStats} />
      </div>
    </div>
  );
};

export default PublicMonitorStatusPage;
