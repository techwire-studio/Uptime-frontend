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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Check, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/debounce";

const sortOptions = [
  "Started - Newest first",
  "Started - Oldest first",
  "Resolved - Newest first",
  "Resolved - Oldest first",
  "Longest first",
  "Shortest first",
];

const getAllIncidents = async () => {
  const { data } = await axiosInstance.get("/incidents");
  return data;
};

const IncidentDashboard = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery<{
    data: RawIncidentType[];
    success: boolean;
  }>({
    queryKey: ["incidents"],
    queryFn: getAllIncidents,
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

  const handleRowClick = (id: string) => navigate(`/incident/${id}`);

  const clearFilters = () => {
    setSearchTerm("");
    setSelected(sortOptions[sortOptions.length - 1]);
  };

  return (
    <div className="min-h-screen text-gray-100">
      <header className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">
            Incidents<span className="text-green-500">.</span>
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search by monitor or reason"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  debouncedSetSearchTerm(e.target.value);
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-md h-9 px-2 text-sm hover:bg-gray-800">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} />
                    {selected}
                    <ChevronDown size={16} />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSelected(option)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{option}</span>
                      {selected === option && (
                        <Check className="text-green-400 text-lg" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="w-full text-center py-20 flex flex-col items-center justify-center text-gray-400">
          <span className="text-4xl mb-4">🤐</span>
          <h2 className="text-2xl font-semibold mb-2">
            No results match your criteria.
          </h2>
          <p className="mb-6 max-w-sm">
            We haven't found any incidents based on your search and/or filter
            criteria. Try expanding your search or clearing your filters to get
            some results.
          </p>
          <button
            onClick={clearFilters}
            className="bg-[#2a22c7] hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Clear all filters and search
          </button>
        </div>
      ) : (
        <div className="bg-[#0F1623] mx-6 border border-[#1f2837] rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#72839E] text-xs">Status</TableHead>
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
                <TableHead className="text-[#72839E] text-xs">
                  Duration
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-primary hover:bg-primary/70 rounded-lg">
              {sorted.map((incident) => {
                const status = incident.resolved_at ? "Resolved" : "Ongoing";

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
                    className="border-gray-700 hover:bg-gray-800/50"
                    onClick={() => handleRowClick(incident.id)}
                    key={incident.id}
                  >
                    <TableCell className="cursor-pointer">
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
                        <span className="font-medium">
                          {incident.monitor.name || incident.monitor?.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{incident.reason || "-"}</TableCell>
                    <TableCell>{formatDateTime(incident.started_at)}</TableCell>
                    <TableCell>
                      {incident.resolved_at ? (
                        formatDateTime(incident.resolved_at)
                      ) : (
                        <span className="text-red-400 font-medium">
                          Not yet resolved
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{calculateDuration()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default IncidentDashboard;
