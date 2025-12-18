import PulseLoader from "@/components/loader";
import axiosInstance from "@/lib/axios";
import type { RawIncidentType } from "@/types/incident";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { formatDateTime, formatTimeSince } from "@/lib/utils";
import { useState } from "react";
import { useDebounce } from "@/lib/debounce";
import DashboardHeader from "@/components/dashboardHeader";
import EmptyState from "@/components/emptyState";
import { SearchSort } from "@/components/searchSort";
import { useAuth } from "@/hooks/use-auth";

const sortOptions = [
  "Started - Newest first",
  "Started - Oldest first",
  "Resolved - Newest first",
  "Resolved - Oldest first",
  "Longest first",
  "Shortest first",
];

const getAllIncidents = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(
    `/workspaces/${workspaceId}/incidents`
  );
  return data;
};

const IncidentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: response, isLoading } = useQuery<{
    data: RawIncidentType[];
    success: boolean;
  }>({
    queryKey: ["incidents"],
    queryFn: () => getAllIncidents(user.workspaceId),
  });

  const [selected, setSelected] = useState(sortOptions[sortOptions.length - 1]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [now] = useState(() => Date.now());

  const debouncedSetSearchTerm = useDebounce((val: string) => {
    setSearchTerm(val);
  });

  if (isLoading) return <PulseLoader />;

  if (!response?.success) return <div>Error loading incidents.</div>;

  const incidents = response.data;

  const filtered = incidents.filter((incident) => {
    const s = searchTerm.toLowerCase();
    const monitorName = incident.monitor.name || incident.monitor?.url || "";
    return (
      monitorName.toLowerCase().includes(s) ||
      (incident.reason || "").toLowerCase().includes(s)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (selected) {
      case "Started - Newest first":
        return (
          new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        );
      case "Started - Oldest first":
        return (
          new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
        );
      case "Resolved - Newest first":
        return (
          new Date(b.resolved_at || 0).getTime() -
          new Date(a.resolved_at || 0).getTime()
        );
      case "Resolved - Oldest first":
        return (
          new Date(a.resolved_at || 0).getTime() -
          new Date(b.resolved_at || 0).getTime()
        );
      case "Longest first": {
        const durA =
          (a.resolved_at ? new Date(a.resolved_at).getTime() : now) -
          new Date(a.started_at).getTime();
        const durB =
          (b.resolved_at ? new Date(b.resolved_at).getTime() : now) -
          new Date(b.started_at).getTime();
        return durB - durA;
      }
      case "Shortest first": {
        const dA =
          (a.resolved_at ? new Date(a.resolved_at).getTime() : now) -
          new Date(a.started_at).getTime();
        const dB =
          (b.resolved_at ? new Date(b.resolved_at).getTime() : now) -
          new Date(b.started_at).getTime();
        return dA - dB;
      }
      default:
        return 0;
    }
  });

  const hasIncidents = incidents.length > 0;
  const hasFilteredResults = sorted.length > 0;

  const handleRowClick = (id: string) => navigate(`/incident/${id}`);

  const clearFilters = () => {
    setSearchTerm("");
    setSelected(sortOptions[sortOptions.length - 1]);
  };

  return (
    <div className="min-h-screen text-gray-100">
      <div className="flex">
        <div className="flex-1 p-10">
          <DashboardHeader label="Incidents">
            {hasIncidents && (
              <SearchSort
                inputValue={inputValue}
                setInputValue={setInputValue}
                debouncedSetSearchTerm={debouncedSetSearchTerm}
                selected={selected}
                setSelected={setSelected}
                sortOptions={sortOptions}
              />
            )}
          </DashboardHeader>

          {!hasIncidents ? (
            <EmptyState
              title="Your incidents overview on the way!"
              description="Once we detect some incidents, they will be neatly displayed for quick and easy understanding."
            />
          ) : !hasFilteredResults ? (
            <div className="w-full text-center py-20 flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-4">🤐</span>
              <h2 className="text-2xl font-semibold mb-2">
                No results match your criteria.
              </h2>
              <p className="mb-6 max-w-sm">
                We haven't found any incidents based on your search and/or
                filter criteria. Try expanding your search or clearing your
                filters to get some results.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[#2a22c7] hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                Clear all filters and search
              </button>
            </div>
          ) : (
            <div className="bg-[#0F1623] border border-[#1f2837] rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#72839E] text-xs px-8">
                      Status
                    </TableHead>
                    <TableHead className="text-[#72839E] text-xs">
                      Monitor
                    </TableHead>
                    <TableHead className="text-[#72839E] text-xs">
                      Root Cause
                    </TableHead>
                    <TableHead className="text-[#72839E] text-xs">
                      Started
                    </TableHead>
                    <TableHead className="text-[#72839E] text-xs">
                      Resolved
                    </TableHead>
                    <TableHead className="text-[#72839E] text-xs px-8">
                      Duration
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="bg-primary hover:bg-primary/70 rounded-lg">
                  {sorted.map((incident) => {
                    const status = incident.resolved_at
                      ? "Resolved"
                      : "Ongoing";

                    const calculateDuration = () => {
                      const endTime = incident.resolved_at
                        ? incident.resolved_at
                        : null;
                      const diffMs =
                        (endTime ? new Date(endTime) : new Date()).getTime() -
                        new Date(incident.created_at).getTime();
                      return formatTimeSince(
                        new Date(Date.now() - diffMs).toISOString()
                      );
                    };

                    return (
                      <TableRow
                        className="border-gray-700 hover:bg-gray-800/50 h-14"
                        onClick={() => handleRowClick(incident.id)}
                        key={incident.id}
                      >
                        <TableCell className="cursor-pointer px-8">
                          <span
                            className={
                              status === "Resolved"
                                ? "text-green-400 font-medium"
                                : "text-red-400 font-medium"
                            }
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium max-w-md truncate">
                              {incident.monitor.name || incident.monitor?.url}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-md">
                          {incident.reason || "-"}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(incident.started_at)}
                        </TableCell>
                        <TableCell>
                          {incident.resolved_at ? (
                            formatDateTime(incident.resolved_at)
                          ) : (
                            <span className="text-red-400 font-medium">
                              Not yet resolved
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-8">
                          {calculateDuration()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDashboard;
