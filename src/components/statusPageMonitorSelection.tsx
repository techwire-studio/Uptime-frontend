import { useState } from "react";
import { Check, Search, Plus, ArrowLeft, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type {
  RawStatusPagesType,
  StatusPageMonitorsList,
} from "@/types/status";
import { Routes } from "@/constants";
import { useNavigate } from "react-router-dom";

interface MonitorSelectionStepProps {
  selectedMonitors: StatusPageMonitorsList[];
  onMonitorsChange: (monitors: StatusPageMonitorsList[]) => void;
  onNext: () => void;
  statusPage:
    | (RawStatusPagesType & { monitors: StatusPageMonitorsList[] })
    | null;
  monitors: StatusPageMonitorsList[];
}

const MonitorSelectionStep = ({
  selectedMonitors,
  onMonitorsChange,
  onNext,
  statusPage,
  monitors,
}: MonitorSelectionStepProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const filteredMonitors = monitors.filter(
    (monitor) =>
      monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableMonitors = filteredMonitors.filter(
    (monitor) => !selectedMonitors.some((m) => m.id === monitor.id)
  );

  const handleAddMonitor = (monitor: StatusPageMonitorsList) => {
    onMonitorsChange([...selectedMonitors, monitor]);
  };

  const handleRemoveMonitor = (monitorId: string) => {
    onMonitorsChange(selectedMonitors.filter((m) => m.id !== monitorId));
  };

  const handleAddAll = () => {
    const all = [...selectedMonitors];
    availableMonitors.forEach((m) => {
      if (!all.some((s) => s.id === m.id)) all.push(m);
    });
    onMonitorsChange(all);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="">
        <Button
          onClick={() => navigate(Routes.STATUS)}
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Status pages</span>
        </Button>
        <h1 className={`text-xl font-semibold ${statusPage ? "mb-1" : "mb-8"}`}>
          {statusPage ? (
            <>
              Edit <span className="text-green-500">{statusPage.name}</span>{" "}
              status page
            </>
          ) : (
            "Create status page."
          )}
        </h1>
        {statusPage && (
          <p className="mb-4 text-sm text-gray-400">
            Public status page, hosted on{" "}
            <a
              className="text-green-500"
              href={`http://localhost:5173/status-page/${statusPage.id}`}
            >
              {`http://localhost:5173/status-page/${statusPage.id}`}
            </a>
          </p>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            <Card className="bg-[#1a2332] gap-3 border-[#2a3441] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Monitors on status page
                </h2>
              </div>

              <p className="text-gray-400 text-sm">
                You can add monitors one by one, or add groups based on tags or
                monitor groups.
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Add monitors by name, URL, tags or groups"
                  className="pl-10 bg-[#0f1419] border-[#2a3441] text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />

                {isDropdownOpen && searchTerm && (
                  <Card className="absolute top-full gap-0 left-0 right-0 mt-2 bg-[#1a2332] border-[#2a3441] z-50 max-h-96 overflow-auto p-2">
                    {availableMonitors.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 font-semibold">
                          Monitors
                        </div>
                        {availableMonitors.map((monitor) => (
                          <div
                            key={monitor.id}
                            className="flex items-center justify-between px-3 py-2 hover:bg-[#0f1419] rounded cursor-pointer group"
                            onClick={() => {
                              handleAddMonitor(monitor);
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="text-sm truncate">
                              {monitor.name}
                            </span>
                            <Plus className="w-4 h-4 text-gray-500 group-hover:text-white" />
                          </div>
                        ))}
                      </>
                    )}

                    <div className="border-t border-[#2a3441] mt-2 pt-2 px-3 py-2">
                      <button
                        onClick={handleAddAll}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>
                          Add all and auto-add new [{availableMonitors.length}{" "}
                          monitors]
                        </span>
                      </button>
                    </div>
                  </Card>
                )}
              </div>

              {/* SELECTED MONITORS */}
              {selectedMonitors.length === 0 ? (
                <div className="mt-4 text-center bg-background py-12">
                  <h3 className="text-2xl font-bold mb-2">
                    Add <span className="text-green-500">monitors</span> to this
                    status page.
                  </h3>
                  <p className="text-gray-400 px-6 text-sm mb-6">
                    Add monitors, tags or groups by using the 🔍 search above or
                    add all your monitors with a click. You can add or remove
                    them later on.
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  {selectedMonitors.map((monitor) => (
                    <div
                      key={monitor.id}
                      className="flex items-center justify-between p-4 border-y border-[#2a3441]"
                    >
                      <div>
                        <div className="font-medium text-sm truncate">
                          {monitor.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {monitor.url}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMonitor(monitor.id)}
                        className="p-1 hover:bg-[#2a3441] rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500 hover:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Menu */}
          <div className="w-64 shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full text-black bg-green-500 flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="font-semibold text-green-500">Monitors</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a3441] flex items-center justify-center font-semibold text-gray-500">
                  2
                </div>
                <span className="text-gray-500">Global settings</span>
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div className="mt-8">
          <Button
            onClick={onNext}
            disabled={selectedMonitors.length === 0}
            className="bg-[blueco] text-white px-6 py-2 rounded-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Next step: Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonitorSelectionStep;
