import { ChecksGraph } from "@/components/checksGraph";
import PulseLoader from "@/components/loader";
import { Routes } from "@/constants";
import axiosInstance from "@/lib/axios";
import { prepareChecksGraphData } from "@/lib/monitor";
import type {
  RawStatusPagesType,
  StatusPageMonitorsList,
} from "@/types/status";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const fetchStatusPageById = async (
  id: string
): Promise<RawStatusPagesType & { monitors: StatusPageMonitorsList[] }> => {
  const { data } = await axiosInstance.get(`status/${id}`);
  return data.data;
};

const PublicStatusPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    data: statusPage,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["status", id],
    queryFn: () => fetchStatusPageById(id!),
    enabled: !!id,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextUpdate, setNextUpdate] = useState(60);

  useEffect(() => {
    const currentTimerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const nextUpdateTimerId = setInterval(() => {
      if (nextUpdate === 0) {
        setNextUpdate(60);
      } else setNextUpdate((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(currentTimerId);
      clearInterval(nextUpdateTimerId);
    };
  }, [statusPage]);

  const services =
    statusPage?.monitors?.map((monitor) => {
      const lastCheck = monitor.checks?.[monitor.checks.length - 1];
      const isUp = lastCheck?.success === true;

      const uptime =
        monitor.checks.length > 0
          ? (monitor.checks.filter((c) => c.success).length /
              monitor.checks.length) *
            100
          : 100;

      return {
        id: monitor.id,
        name: monitor.name || monitor.url,
        status: isUp ? "operational" : "down",
        uptime: uptime,
        history: prepareChecksGraphData(monitor.checks),
      };
    }) || [];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getOverallStatus = () => {
    const hasDown = services.some((s) => s.status === "down");
    if (hasDown) return { text: "Some systems down", color: "bg-red-500" };

    return { text: "All systems operational", color: "bg-green-500" };
  };

  const overallStatus = getOverallStatus();

  const handleMonitorClick = (id: string) => {
    navigate(`${Routes.PUBLIC_STATUS}/${statusPage?.id}/${id}`);
  };

  if (isLoading) return <PulseLoader />;

  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-600 font-semibold">
        Failed to load status page.
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1a1f2e] to-[#f5f5f5]">
      <div className="bg-[#1a1f2e] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{statusPage?.name}</h1>

          <div className="text-right mb-4">
            <h2 className="text-2xl font-semibold mb-2">Service status</h2>
            <p className="text-gray-400 text-sm">
              Last updated {formatTime(currentTime)} | Next update in{" "}
              {nextUpdate} sec.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full ${overallStatus.color} shrink-0`}
              ></div>
              <h3 className="text-3xl font-bold">{overallStatus.text}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      onClick={() => handleMonitorClick(service.id)}
                      className="text-lg font-medium text-gray-900 truncate"
                    >
                      {service.name}
                    </h3>
                    <span className="text-green-500 font-semibold text-sm whitespace-nowrap">
                      ↗ {service.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "operational"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        service.status === "operational"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {service.status === "operational"
                        ? "Operational"
                        : "Down"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-0.5 items-end h-12">
                <ChecksGraph barClassName="w-2 h-10" checks={service.history} />
              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{service.history.length} checks ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              Fullscreen mode
            </button>
            <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              Alert sound <span className="text-gray-400">off</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
            <span>|</span>
            <span>
              Status page by <strong className="font-bold">UptimeRobot</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStatusPage;
