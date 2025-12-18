import { useEffect, useState } from "react";
import { AlertCircle, CircleCheckBig, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes } from "@/constants";
import { Link, useParams } from "react-router-dom";
import type { RawIncidentType } from "@/types/incident";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PulseLoader from "@/components/loader";
import { formatDuration, formatTimeSince } from "@/lib/utils";
import BackButton from "@/components/backButton";

const fetchIncident = async (id: string): Promise<RawIncidentType> => {
  const { data } = await axiosInstance.get(`/incidents/${id}`);
  return data.data;
};

export default function IncidentDetailedView() {
  const { id } = useParams<{ id: string }>();

  const {
    data: incident,
    isLoading,
    error,
  } = useQuery<RawIncidentType, Error>({
    queryKey: ["incident", id],
    queryFn: () => fetchIncident(id as string),
  });

  const [time, setTime] = useState<string | undefined>("N/A");

  useEffect(() => {
    const updateTime = () => {
      if (incident?.duration_seconds != null) {
        setTime(formatDuration(incident.duration_seconds));
      } else if (incident?.check?.checked_at) {
        setTime(formatTimeSince(incident.check.checked_at));
      } else {
        setTime("N/A");
      }
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [incident?.duration_seconds, incident?.check?.checked_at]);

  if (isLoading) return <PulseLoader />;

  if (!incident || error)
    return <div className="text-red-500">Error loading incident.</div>;

  return (
    <div className="min-h-screen text-gray-100">
      <div className="mx-auto px-6 py-6">
        <BackButton routeTo={Routes.INCIDENTS} label="Incidents" />
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center mt-1 ${
                incident?.resolved_check ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              {incident?.resolved_check ? (
                <CircleCheckBig className="w-6 h-6 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              )}
            </div>

            <div>
              <h1 className="text-2xl truncate max-w-2xl font-semibold mb-2">
                {incident?.resolved_check ? "Resolved" : "Ongoing "} incident on{" "}
                {incident.monitor.name || incident.monitor.url}
              </h1>
              <p className="text-sm text-gray-400">
                <span className="uppercase">{incident.monitor.type}</span>{" "}
                monitor for {incident.monitor.url}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`${Routes.MONITOR}/${incident.monitor_id}`}>
              <Button variant="ghost" size="sm" className="text-gray-400">
                Go to monitor
              </Button>
            </Link>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download response
            </Button>
            {/* <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-primary border-none p-3">
              <CardContent className="p-4">
                <div className="mb-2 text-sm text-gray-400">Root cause</div>
                <div className="text-base font-semibold truncate">
                  {incident.reason}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-primary border-none p-3">
                <CardContent className="p-4">
                  <div className="mb-2 text-sm text-gray-400">Status</div>
                  <div
                    className={`text-xl font-semibold ${
                      incident?.resolved_check
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {incident?.resolved_check ? "Resolved" : "Ongoing"}
                  </div>
                  <div className="mt-2 text-xs">
                    Started at {new Date(incident.started_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary border-none p-3">
                <CardContent className="p-4">
                  <div className="mb-2 text-sm text-gray-400">Duration</div>
                  <div className="text-xl font-semibold">{time}</div>
                  {incident.resolved_at && (
                    <div className="mt-2 text-xs">
                      Resolved at{" "}
                      {new Date(incident.resolved_at as Date).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* <Card className="bg-[#1a1f2e] border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Activity log</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-300">
                            Status {incident.check.status}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              incident.check.checked_at
                            ).toLocaleString()}
                          </span>
                        </div>

                        <Badge
                          variant="secondary"
                          className="mt-1 bg-red-500/20 text-red-400 text-xs"
                        >
                          ERROR
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>

                <div className="text-center py-12">
                  <p className="text-gray-400 mb-2">
                    Collaborate with ease,{" "}
                    <span className="text-green-400">comment</span> incidents.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Add any important details.
                  </p>

                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Upgrade to Team
                  </Button>

                  <p className="text-xs text-gray-500 mt-2">
                    Team plan starts at $29 / month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="px-6 py-2">
                <Tabs defaultValue="url">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-4">Request.</h3>
                    <TabsList className="bg-[#0f1419] border border-gray-800 rounded-lg">
                      <TabsTrigger
                        value="url"
                        className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4"
                      >
                        URL
                      </TabsTrigger>

                      <TabsTrigger
                        value="headers"
                        className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4"
                      >
                        Headers
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="url">
                    <div className="bg-[#0f1419] p-4 rounded border border-gray-800 text-xs font-mono text-gray-300 overflow-x-auto">
                      HEAD {incident.monitor.url}
                    </div>
                  </TabsContent>

                  <TabsContent value="headers">
                    <div className="bg-[#0f1419] p-4 rounded border border-gray-800 text-xs font-mono text-gray-400 overflow-x-auto">
                      {incident.check.request_headers
                        ? JSON.stringify(
                            incident.check.request_headers,
                            null,
                            2
                          )
                        : "<empty>"}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="px-6 py-2">
                <Tabs defaultValue="body">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-4">Response.</h3>
                    <TabsList className="bg-[#0f1419] border border-gray-800 rounded-lg">
                      <TabsTrigger
                        value="body"
                        className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4"
                      >
                        Body
                      </TabsTrigger>

                      <TabsTrigger
                        value="headers"
                        className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4"
                      >
                        Headers
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="body">
                    <div className="bg-[#0f1419] p-4 rounded border border-gray-800 text-xs font-mono text-gray-300 overflow-x-auto">
                      {incident.check.response_body || "<empty>"}
                    </div>
                  </TabsContent>

                  <TabsContent value="headers">
                    <div className="bg-[#0f1419] p-4 rounded border border-gray-800 text-xs font-mono text-gray-400 overflow-x-auto">
                      {incident.check.response_headers
                        ? JSON.stringify(
                            incident.check.response_headers,
                            null,
                            2
                          )
                        : "<empty>"}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
