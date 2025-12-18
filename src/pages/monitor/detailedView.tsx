import { useEffect, useState, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import PulseLoader from "@/components/loader";
import {
  Bell,
  Pause,
  Edit,
  ExternalLink,
  ChevronUp,
  Clock,
  Shield,
  Play,
} from "lucide-react";
import { StatCard } from "@/components/monitorStatsCard";
import {
  formatDateTime,
  formatDuration,
  formatTimeSince,
  getPastDateISO,
} from "@/lib/utils";
import {
  MonitorHealthStatus,
  type RawMonitorChecksType,
  type RawMonitorsType,
} from "@/types/monitor";
import type {
  MonitorIncidentSummaryType,
  RawIncidentType,
} from "@/types/incident";
import {
  getMonitorStats,
  prepareChecksGraphData,
  prepareMonitorSummary,
} from "@/lib/monitor";
import { Routes } from "@/constants";
import { ResponseTimeGraph } from "@/components/responseTimeGraph";
import { toast } from "sonner";
import { ChecksGraph } from "@/components/checksGraph";
import BackButton from "@/components/backButton";
import type { AxiosError } from "axios";
import ButtonWithLoader from "@/components/buttonWithLoader";

const fetchMonitorById = async (
  id: string
): Promise<
  Omit<RawMonitorsType, "checks"> & {
    checks: RawMonitorChecksType[];
  }
> => {
  const { data } = await axiosInstance.get(`monitors/${id}`);
  return data.data;
};

const fetchIncidents = async (
  monitorId: string,
  days: number
): Promise<RawIncidentType[]> => {
  const start = getPastDateISO(days);
  const end = new Date().toISOString();

  const { data } = await axiosInstance.get(
    `/monitors/${monitorId}/incidents/`,
    { params: { start, end } }
  );

  return data.data;
};

const useIncidents = (monitorId: string) => {
  return useQuery<RawIncidentType[], Error>({
    queryKey: ["incidents", monitorId],
    queryFn: () => fetchIncidents(monitorId, 90),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!monitorId,
  });
};

const filterIncidents = (incidents: RawIncidentType[] = [], days: number) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return incidents.filter((item) => {
    const created = new Date(item.created_at).getTime();
    return created >= cutoff;
  });
};

const MonitoringDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    data: monitor,
    isLoading: monitorLoading,
    refetch,
    error: monitorError,
  } = useQuery({
    queryKey: ["monitor", id],
    queryFn: () => fetchMonitorById(id!),
    enabled: !!id,
  });

  const [time, setTime] = useState<string | undefined>("N/A");
  const [showMonitorStatusChangeLoader, setShowMonitorStatusChangeLoader] =
    useState(false);

  useEffect(() => {
    if (!monitor?.last_checked_at) return;

    const intervalId = setInterval(() => {
      setTime(formatTimeSince(monitor.last_checked_at));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [monitor?.last_checked_at]);

  const handleMonitorStatus = async () => {
    setShowMonitorStatusChangeLoader(true);

    try {
      const { data } = await axiosInstance.patch(`monitors/${id}`, {
        is_active: !monitor?.is_active,
        status: monitor?.is_active
          ? MonitorHealthStatus.PAUSED
          : MonitorHealthStatus.PREPARING,
      });

      if (data.success) {
        refetch();
        toast.success(
          data.data.status === MonitorHealthStatus.PAUSED
            ? "Monitoring Paused"
            : "Monitoring Resumed"
        );
      }
    } catch (err) {
      const error = err as unknown as AxiosError;
      toast.error(error?.response?.statusText || "Failed to create monitor.");
    } finally {
      setShowMonitorStatusChangeLoader(false);
    }
  };

  const handleEditMonitor = () => {
    navigate(`${Routes.CREATE_MONITOR}?id=${id}&action=edit`);
  };

  const buttons: {
    label: string;
    icon: ReactNode;
    showLoader?: boolean;
    onClick?: () => void;
  }[] = [
    {
      label: "Test Notification",
      icon: <Bell size={8} className="opacity-60" />,
    },
    {
      label: monitor?.is_active ? "Pause" : "Resume",
      icon: monitor?.is_active ? (
        <Pause size={8} className="opacity-60" />
      ) : (
        <Play size={8} className="opacity-60" />
      ),
      showLoader: showMonitorStatusChangeLoader,
      onClick: handleMonitorStatus,
    },
    {
      label: "Edit",
      icon: <Edit size={8} className="opacity-60" />,
      onClick: handleEditMonitor,
    },
  ];

  const {
    data: incidents90 = [],
    error,
    isLoading,
  } = useIncidents(id as string);

  const last7DaysIncident = filterIncidents(incidents90, 7);
  const last30DaysIncident = filterIncidents(incidents90, 30);

  if (monitorLoading || isLoading) return <PulseLoader />;

  if (monitorError || error || !monitor)
    return <div className="text-red-500">Error loading monitor.</div>;

  const stats = getMonitorStats(monitor.checks, monitor.interval_seconds);

  const summaries: {
    label: string;
    summary: MonitorIncidentSummaryType | null;
  }[] = [
    {
      label: "Last 7 Days",
      summary: prepareMonitorSummary(
        last7DaysIncident,
        "Last 7 Days",
        7 * 24 * 60 * 60
      ),
    },
    {
      label: "Last 30 Days",
      summary: prepareMonitorSummary(
        last30DaysIncident,
        "Last 30 Days",
        30 * 24 * 60 * 60
      ),
    },
    {
      label: "Last 365 Days",
      summary: null,
    },
  ];

  const checksGraphData = prepareChecksGraphData(monitor.checks);

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <BackButton />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 animate-pulse rounded-full flex items-center justify-center">
            <ChevronUp className="text-primary" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white truncate max-w-2xl">
                {monitor.name}
              </h1>
              <Link to={monitor.url}>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              HTTP/S monitor for{" "}
              <a
                target="_blank"
                href={monitor.url}
                className="text-green-400 max-w-xs underline truncate"
              >
                {monitor.url}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {buttons.map((button, index) => (
            <ButtonWithLoader
              key={index}
              label={button.label}
              icon={button.icon}
              onClick={button.onClick}
              showLoader={button.showLoader}
              className="bg-primary border-primary text-xs text-white hover:bg-transparent hover:text-white"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Current status">
              <div
                className={`text-2xl capitalize font-semibold my-2 ${
                  monitor.status === MonitorHealthStatus.HEALTHY
                    ? "text-green-500"
                    : monitor.status === MonitorHealthStatus.UNHEALTHY
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {monitor.status}
              </div>
              <div className="text-[13px]">
                Currently <span className="capitalize">{monitor.status}</span>{" "}
                for {stats.uptime}
              </div>
            </StatCard>

            <StatCard title="Last check">
              <div className="text-2xl font-semibold text-white my-2">
                {time}
              </div>
              <div className="text-[13px]">
                Checked every {formatDuration(monitor.interval_seconds)}
              </div>
            </StatCard>

            <StatCard title="Last 24 hours">
              <ChecksGraph
                checks={checksGraphData}
                barClassName="h-8 w-2 my-2"
              />
              <div className="text-[13px]">
                {stats.uptimeStats.last24Hours.incidents} incidents,{" "}
                {stats.uptimeStats.last24Hours.downtime} down
              </div>
            </StatCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaries.map(({ label, summary }) => (
              <StatCard key={label} title={label}>
                {summary ? (
                  <>
                    <div className="text-2xl font-semibold text-green-500 mb-1">
                      {summary.uptimePercentage}%
                    </div>
                    <div className="text-[13px]">
                      {summary.incidentCount} incidents, {summary.downtime} down
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-semibold mb-1">--.---%</div>
                    <div className="text-[13px]">Unlocks with paid plans</div>
                  </>
                )}
              </StatCard>
            ))}
          </div>

          <ResponseTimeGraph responseStats={stats.responseTime} />

          <StatCard title="Latest incidents">
            {(() => {
              const ongoingIncidents = (last30DaysIncident || []).filter(
                (incident) => !incident.resolved_at
              );

              return ongoingIncidents.length > 0 ? (
                <div className="bg-gray-800/30 mt-4 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow>
                        {["Status", "Root Cause", "Started", "Duration"].map(
                          (header) => (
                            <TableHead
                              key={header}
                              className="text-[#72839E] text-xs"
                            >
                              {header}
                            </TableHead>
                          )
                        )}
                      </TableRow>
                    </TableHeader>

                    <TableBody className="cursor-pointer">
                      {ongoingIncidents.map((incident) => {
                        const cells = [
                          {
                            content: (
                              <span className="text-red-400 font-medium">
                                Ongoing
                              </span>
                            ),
                          },
                          { content: incident.reason || "-" },
                          { content: formatDateTime(incident.started_at) },
                          {
                            content: formatTimeSince(
                              incident.started_at || incident.created_at
                            ),
                          },
                        ];

                        return (
                          <TableRow
                            key={incident.id}
                            onClick={() => navigate(`/incident/${incident.id}`)}
                            className="border-gray-700 hover:bg-gray-800/50 transition"
                          >
                            {cells.map((cell, index) => (
                              <TableCell
                                key={index}
                                className="truncate max-w-md"
                              >
                                {cell.content}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="text-sm italic text-center mt-4 text-white/60">
                    That's all, folks!
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-background my-2 rounded-xl">
                  <div className="text-xl font-bold my-2">
                    👍 Good job, no incidents.
                  </div>
                  <div className="text-sm">
                    No ongoing incidents so far. Keep it up!
                  </div>
                </div>
              );
            })()}
          </StatCard>
        </div>

        <div className="w-full lg:w-80">
          <div className="border-l border-gray-700 pl-4 h-full">
            <StatCard title="Domain & SSL">
              <div className="space-y-3">
                <div>
                  <div className="text-[13px] mb-1">Domain valid until</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium text-white">
                      Unlock
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[13px] mb-1">
                    SSL certificate valid until
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium text-white">
                      Unlock
                    </span>
                  </div>
                </div>
              </div>
            </StatCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
