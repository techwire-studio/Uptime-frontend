import {
  Plus,
  CircleChevronUp,
  CircleChevronDown,
  Pause,
  MoreHorizontal,
} from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import PulseLoader from "@/components/loader";
import MonitorStats from "@/components/monitorStats";
import {
  MonitorCreationEnum,
  MonitorHealthStatus,
  type RawMonitorsType,
} from "@/types/monitor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateUptime, prepareChecksGraphData } from "@/lib/monitor";
import { ChecksGraph } from "@/components/checksGraph";
import { toast } from "sonner";
import Alert from "@/components/alertConfirmation";
import { useState } from "react";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/debounce";
import EmptyState from "@/components/emptyState";
import DashboardHeader from "@/components/dashboardHeader";
import { SearchSort } from "@/components/searchSort";
import type { AxiosError } from "axios";
import { useAuth } from "@/hooks/use-auth";

const sortOptions = [
  "Down first",
  "Up first",
  "Paused first",
  "A → Z",
  "Newest first",
];

const getAllMonitors = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(
    `/workspaces/${workspaceId}/monitors`
  );
  return data;
};

const MonitoringDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery<{
    data: RawMonitorsType[];
    success: boolean;
  }>({
    queryKey: ["monitors"],
    queryFn: () => getAllMonitors(user?.workspaceId as string),
  });

  const [selectedMonitor, setSelectedMonitor] =
    useState<RawMonitorsType | null>(null);
  const [selectedMonitorAction, setSelectedMonitorAction] = useState<
    "delete" | "reset" | null
  >(null);
  const [selected, setSelected] = useState(sortOptions[sortOptions.length - 1]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetSearchTerm = useDebounce((val: string) => {
    setSearchTerm(val);
  });

  if (isLoading) return <PulseLoader />;

  if (isError || !response?.success) {
    return <div>Error loading monitors.</div>;
  }

  const monitors = response.data;

  const filtered = monitors.filter((m) => {
    const s = searchTerm.toLowerCase();
    return (
      m.url.toLowerCase().includes(s) ||
      (m.name || "").toLowerCase().includes(s)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (selected === "Down first")
      return a.status === MonitorHealthStatus.UNHEALTHY ? -1 : 1;
    if (selected === "Up first")
      return a.status === MonitorHealthStatus.HEALTHY ? -1 : 1;
    if (selected === "Paused first") return a.is_active === false ? -1 : 1;
    if (selected === "A → Z")
      return (a.name || a.url).localeCompare(b.name || b.url);
    if (selected === "Newest first")
      return b.created_at.localeCompare(a.created_at);
    return 0;
  });

  const hasMonitors = monitors.length > 0;
  const hasFilteredResults = sorted.length > 0;

  const handleEditMonitor = (monitor: RawMonitorsType) => {
    navigate(
      `${Routes.CREATE_MONITOR}?id=${monitor.id}&action=${MonitorCreationEnum.EDIT}`
    );
  };

  const handleCloneMonitor = (monitor: RawMonitorsType) => {
    navigate(
      `${Routes.CREATE_MONITOR}?id=${monitor.id}&action=${MonitorCreationEnum.CLONE}`
    );
  };

  const handleMonitorStatus = async (monitor: RawMonitorsType) => {
    const toastId = toast.loading("Updating...");

    try {
      const { data } = await axiosInstance.patch(`monitors/${monitor.id}`, {
        is_active: !monitor.is_active,
        status: monitor.is_active
          ? MonitorHealthStatus.PAUSED
          : MonitorHealthStatus.PREPARING,
      });

      if (data.success) {
        refetch();
        toast.success(
          data.data.status === MonitorHealthStatus.PAUSED
            ? "Monitoring Paused"
            : "Monitoring Resumed",
          { id: toastId }
        );
      } else {
        toast.error("Failed to update monitor status.", { id: toastId });
      }
    } catch (err) {
      const error = err as AxiosError;
      toast.error(
        error?.response?.statusText || "Failed to update monitor status.",
        { id: toastId }
      );
    }
  };

  const handleResetMonitorStats = async (monitor: RawMonitorsType) => {
    try {
      const t = toast.loading("Resetting stats...");
      const { data } = await axiosInstance.post("/monitors/reset-stats", {
        data: { ids: [monitor.id] },
      });

      if (data.success) {
        refetch();
        toast.success("Monitor stats reset successfully", { id: t });
      }
    } catch (err) {
      const error = err as unknown as AxiosError;
      toast.error(
        error?.response?.statusText || "Failed to reset monitor stats."
      );
    }
  };

  const handleDeleteMonitor = async (monitor: RawMonitorsType) => {
    try {
      const t = toast.loading("Deleting...");
      const { data } = await axiosInstance.delete("/monitors", {
        data: { ids: [monitor.id] },
      });

      if (data.success) {
        refetch();
        toast.success("Monitor deleted successfully", { id: t });
      }
    } catch (err) {
      const error = err as unknown as AxiosError;
      toast.error(error?.response?.statusText || "Failed to delete monitor.");
    }
  };

  const handleRowClick = (id: string) => navigate(`/monitor/${id}`);

  return (
    <div className="min-h-screen text-gray-100">
      <div className="flex">
        <div className="flex-1 p-10">
          <DashboardHeader
            buttonLabel="New"
            icon={Plus}
            label="Monitors"
            routeTo={Routes.CREATE_MONITOR}
          />

          {hasMonitors && (
            <SearchSort
              inputValue={inputValue}
              setInputValue={setInputValue}
              debouncedSetSearchTerm={debouncedSetSearchTerm}
              selected={selected}
              setSelected={setSelected}
              sortOptions={sortOptions}
              placeholder="Search by name or url"
              containerClass="justify-end mb-4"
            />
          )}

          {!hasMonitors ? (
            <EmptyState
              title="Monitor your website in a click."
              description="Keep an eye on your website, API, email service, or any port or device on the network. Ping our servers to track cron jobs and stay on top of critical incidents."
              primaryButton={{
                label: "Create your first monitor",
                onClick: () => navigate(Routes.CREATE_MONITOR),
              }}
            />
          ) : !hasFilteredResults ? (
            <div className="w-full text-center py-20 flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">😬</span>
              <h2 className="text-2xl font-semibold mb-2">
                No <span className="text-green-500">results</span> match your
                criteria.
              </h2>
              <p className="mb-6 max-w-2xl">
                We haven't found any monitors based on your search and/or filter
                criteria. Try expanding your search or clearing your filters to
                get some results.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelected(sortOptions[sortOptions.length - 1]);
                }}
                className="bg-[#2a22c7] hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                Clear all filters and search
              </Button>
            </div>
          ) : (
            <Table className="border border-gray-800">
              <TableBody className="bg-primary hover:bg-primary/70">
                {sorted.map((monitor) => {
                  const checksGraph = prepareChecksGraphData(monitor.checks);

                  return (
                    <TableRow
                      key={monitor.id}
                      className="border-gray-700 hover:bg-gray-800/50"
                    >
                      <TableCell onClick={() => handleRowClick(monitor.id)}>
                        <div className="cursor-pointer flex items-center gap-2">
                          <div className="mx-2">
                            {!monitor.is_active ? (
                              <Pause className="text-gray-500" size={16} />
                            ) : monitor.status ===
                              MonitorHealthStatus.HEALTHY ? (
                              <CircleChevronUp
                                className="animate-pulse text-green-500"
                                size={16}
                              />
                            ) : MonitorHealthStatus.UNHEALTHY ? (
                              <CircleChevronDown
                                className="text-red-500"
                                size={16}
                              />
                            ) : (
                              <Pause className="text-gray-500" size={16} />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className="font-medium max-w-xs mb-1">
                              {monitor.url}
                            </span>
                            <div className="flex gap-1 items-center">
                              <span className="whitespace-nowrap uppercase w-max px-1 rounded border inline-flex items-center text-gray-500 bg-gray-800 border-gray-700 text-xs">
                                {monitor.type}
                              </span>
                              <span className="capitalize text-xs text-gray-500">
                                {monitor.status}
                              </span>
                              <span className="capitalize text-xs text-gray-500">
                                {calculateUptime(
                                  monitor.checks,
                                  monitor.interval_seconds
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <span className="text-gray-500">⟳</span>{" "}
                            {`${formatDuration(monitor.interval_seconds)}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <ChecksGraph checks={checksGraph} />
                            <span className="text-sm font-medium w-12 text-right">
                              {monitor.status === MonitorHealthStatus.HEALTHY
                                ? 100
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-12">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <MoreHorizontal
                              className="text-gray-500 cursor-pointer"
                              size={18}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-56 bg-background cursor-pointer text-white border-none"
                            align="start"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEditMonitor(monitor)}
                            >
                              <span className="flex-1">Edit monitor</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <span className="flex-1">Add to status page</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCloneMonitor(monitor)}
                            >
                              <span className="flex-1">Clone monitor</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem disabled>
                              <span className="flex-1">Move to Group</span>
                              <span className="text-xs bg-amber-600 px-1 rounded">
                                PREMIUM
                              </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleMonitorStatus(monitor)}
                            >
                              <span className="flex-1">
                                {monitor.is_active
                                  ? "Pause monitor"
                                  : "Resume monitor"}
                              </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMonitor(monitor);
                                setSelectedMonitorAction("reset");
                              }}
                            >
                              <span className="flex-1">Reset stats</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMonitor(monitor);
                                setSelectedMonitorAction("delete");
                              }}
                              className="text-red-500 cursor-pointer focus:text-red-500"
                            >
                              <span className="flex-1">Delete monitor</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {hasMonitors && <MonitorStats monitors={monitors} />}

        {selectedMonitor && (
          <Alert
            open={!!selectedMonitor}
            title={
              selectedMonitorAction === "delete"
                ? "Are you sure you want to delete this monitor?"
                : "Are you sure you want to reset this monitor's stats?"
            }
            description={
              selectedMonitorAction === "delete"
                ? `This action will permanently delete "${
                    selectedMonitor.name || selectedMonitor.url
                  }". This can't be undone.`
                : `This action will reset all stats for "${
                    selectedMonitor.name || selectedMonitor.url
                  }". This can't be undone.`
            }
            onConfirm={() => {
              if (selectedMonitorAction === "delete") {
                handleDeleteMonitor(selectedMonitor);
              } else if (selectedMonitorAction === "reset") {
                handleResetMonitorStats(selectedMonitor);
              }
              setSelectedMonitor(null);
            }}
            onCancel={() => setSelectedMonitor(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
