import type { RawMonitorChecksType, RawMonitorsType } from "@/types/monitor";

export type RawIncidentType = {
  id: string;
  monitor_id: string;
  check_id: string | null;
  resolved_check_id: string | null;
  started_at: Date;
  monitor: Pick<RawMonitorsType, "name" | "url" | "type">;
  check: Pick<
    RawMonitorChecksType,
    | "id"
    | "checked_at"
    | "response_headers"
    | "response_body"
    | "status"
    | "request_headers"
  >;
  resolved_check?: Pick<
    RawMonitorChecksType,
    | "id"
    | "checked_at"
    | "response_headers"
    | "response_body"
    | "status"
    | "request_headers"
  >;
  resolved_at: Date | null;
  duration_seconds: number | null;
  reason: string | null;
  created_at: Date;
};

export type MonitorIncidentSummaryType = {
  periodLabel: string;
  uptimePercentage: number;
  incidentCount: number;
  downtime: string;
};
