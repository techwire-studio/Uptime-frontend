export enum MonitorType {
  HTTP = "http",
  TCP = "tcp",
  PING = "ping",
}

export enum MonitorHealthStatus {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  PAUSED = "paused",
  PREPARING = "preparing",
}

export enum MonitorCheckStatus {
  UP = "UP",
  DOWN = "DOWN",
}

export enum MonitorCreationEnum {
  CREATE = "create",
  EDIT = "edit",
  CLONE = "clone",
}

export type RawMonitorsType = {
  id: string;
  workspace_id: string;
  name: string;
  tags: string[];
  url: string;
  type: MonitorType;
  interval_seconds: number;
  timeout_ms: number;
  expected_status: number;
  check_regions: string;
  status: MonitorHealthStatus;
  last_response_time_ms: number;
  last_checked_at: string;
  next_run_at: string;
  is_active: boolean;
  consecutive_failures: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
  checks: Pick<RawMonitorChecksType, "checked_at" | "success">[];
};

export type RawMonitorChecksType = {
  id: string;
  status: string;
  checked_at: string;
  response_time_ms: number | null;
  http_status: number | null;
  success: boolean;
  error_message: string | null;
  dns_lookup_ms: number | null;
  ssl_handshake_ms: number | null;
  connect_ms: number | null;
  download_ms: number | null;
  response_size_bytes: number | null;
  response_headers: Record<string, string> | null;
  request_headers: Record<string, string> | null;
  response_body: string | null;
  monitor_id: string;
};

export type ResponseTimeStatsType = {
  min: string;
  avg: string;
  max: string;
  chartData: Array<{
    date: string | Date;
    response_time: number;
  }>;
};
