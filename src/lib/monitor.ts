import { DAY_MS } from "@/constants";
import type {
  MonitorIncidentSummaryType,
  RawIncidentType,
} from "@/types/incident";
import type {
  RawMonitorChecksType,
  RawMonitorsType,
  ResponseTimeStatsType,
} from "@/types/monitor";
import { MonitorCheckStatus, MonitorHealthStatus } from "@/types/monitor";

/**
 * Calculates response time statistics for monitor checks.
 *
 * @param checks - Array of monitor check results
 * @returns Object containing min, max, avg response times and chart data
 */
export function calculateResponseTime(
  checks: RawMonitorChecksType[]
): ResponseTimeStatsType {
  const hasValidData =
    Array.isArray(checks) &&
    checks.length > 0 &&
    checks.some((c) => typeof c.response_time_ms === "number");

  if (!hasValidData) {
    return {
      min: "N/A",
      max: "N/A",
      avg: "N/A",
      chartData: [
        {
          date: new Date().toISOString(),
          response_time: 0,
        },
      ],
    };
  }

  const validTimes = checks.map((c) => Number(c.response_time_ms || 0));
  const min = Math.min(...validTimes);
  const max = Math.max(...validTimes);
  const avg = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

  return {
    min: `${min.toFixed(2)} ms`,
    max: `${max.toFixed(2)} ms`,
    avg: `${avg.toFixed(2)} ms`,
    chartData: checks.map((check) => ({
      date: check.checked_at,
      response_time: check.response_time_ms ?? 0,
    })),
  };
}

/**
 * Calculates total uptime for a monitor.
 *
 * @param checks - Array of monitor check results
 * @param intervalSeconds - Interval between checks in seconds
 * @returns String representing total uptime in "Xm Ys" format
 */
export function calculateUptime(
  checks: Pick<RawMonitorChecksType, "checked_at" | "success">[],
  intervalSeconds: number
) {
  const totalUptimeMs = checks.reduce((acc) => {
    return acc + intervalSeconds * 1000;
  }, 0);

  const minutes = Math.floor(totalUptimeMs / 60000);
  const seconds = Math.floor((totalUptimeMs % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}

/**
 * Calculates last 24 hours uptime statistics.
 *
 * @param checks - Array of monitor check results
 * @param intervalSeconds - Interval between checks in seconds
 * @returns Object with last 24 hours bars, incidents count, and downtime
 */
export function calculateLast24HoursStats(
  checks: RawMonitorChecksType[],
  intervalSeconds: number
) {
  const now = new Date();
  const last24Hours = checks.filter(
    (check) =>
      new Date(check.checked_at).getTime() >=
      now.getTime() - 24 * 60 * 60 * 1000
  );

  const bars: ("UP" | "DOWN")[] = last24Hours.map((check) =>
    check.status === MonitorCheckStatus.UP ? "UP" : "DOWN"
  );

  const downtimeMs = last24Hours.reduce((acc, check) => {
    return check.status === MonitorCheckStatus.DOWN
      ? acc + intervalSeconds * 1000
      : acc;
  }, 0);

  const downtimeMinutes = Math.floor(downtimeMs / 60000);
  const downtimeSeconds = Math.floor((downtimeMs % 60000) / 1000);

  return {
    last24Hours: {
      bars,
      incidents: last24Hours.filter((c) => c.status === MonitorCheckStatus.DOWN)
        .length,
      downtime: `${downtimeMinutes}m ${downtimeSeconds}s`,
    },
  };
}

/**
 * Prepares full statistics for a monitor.
 *
 * This includes:
 * - Response time stats
 * - Latest incidents summary
 * - Total uptime
 * - Last 24 hours stats
 *
 * @param checks - Array of monitor check results
 * @param intervalSeconds - Interval between monitor checks in seconds
 * @returns Object containing all relevant statistics for the monitor
 */
export function getMonitorStats(
  checks: RawMonitorChecksType[],
  intervalSeconds: number
) {
  const responseTime = calculateResponseTime(checks);
  const uptime = calculateUptime(checks, intervalSeconds);
  const uptimeStats = calculateLast24HoursStats(checks, intervalSeconds);

  return {
    responseTime,
    uptime,
    uptimeStats,
  };
}

/**
 * @description Prepare incidents summary for UI
 * @param incidents Array of incidents
 * @param periodLabel Label for UI e.g. 'Last 7 days'
 * @param totalPeriodSeconds Total seconds in the period (e.g. 7*24*60*60)
 * @returns MonitorSummary
 */
export const prepareMonitorSummary = (
  incidents: RawIncidentType[],
  periodLabel: string,
  totalPeriodSeconds: number
): MonitorIncidentSummaryType & { downtime: string } => {
  let downtimeSeconds = 0;

  incidents.forEach((incident) => {
    if (incident.duration_seconds) {
      downtimeSeconds += incident.duration_seconds;
    } else if (incident.started_at) {
      const started = new Date(incident.started_at).getTime();
      const resolved = incident.resolved_at
        ? new Date(incident.resolved_at).getTime()
        : Date.now();
      downtimeSeconds += Math.max((resolved - started) / 1000, 0);
    }
  });

  const uptimePercentage = Math.max(
    0,
    100 - (downtimeSeconds / totalPeriodSeconds) * 100
  );

  const hours = Math.floor(downtimeSeconds / 3600);
  const minutes = Math.floor((downtimeSeconds % 3600) / 60);
  const seconds = Math.floor(downtimeSeconds % 60);

  const downtime =
    hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;

  return {
    periodLabel,
    uptimePercentage: parseFloat(uptimePercentage.toFixed(2)),
    incidentCount: incidents.length,
    downtime,
  };
};

export const buildMonitorStats = (monitors: RawMonitorsType[]) => {
  let up = 0,
    down = 0,
    paused = 0,
    totalChecks = 0,
    successfulChecks = 0,
    totalIncidents = 0,
    affectedMonitors = 0;

  for (const monitor of monitors) {
    switch (monitor.status) {
      case MonitorHealthStatus.HEALTHY:
        up++;
        break;
      case MonitorHealthStatus.PAUSED:
        paused++;
        break;
      default:
        down++;
        break;
    }

    if (monitor.checks && monitor.checks.length) {
      totalChecks += monitor.checks.length;
      const failures = monitor.checks.filter((check) => !check.success).length;
      const successes = monitor.checks.filter((check) => check.success).length;

      successfulChecks += successes;

      if (failures > 0) {
        totalIncidents += 1;
        affectedMonitors += 1;
      }
    }
  }

  const overallUptime = totalChecks
    ? ((successfulChecks / totalChecks) * 100).toFixed(2) + "%"
    : "N/A";

  const incidentTimeMs = calculateIncidentTime(monitors);
  const withoutIncidentMs = Math.max(DAY_MS - incidentTimeMs, 0);

  const hours = Math.floor(withoutIncidentMs / (60 * 60 * 1000));
  const minutes = Math.floor(
    (withoutIncidentMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  const withoutIncident = `${hours}h ${minutes}m`;

  return {
    up,
    down,
    paused,
    overallUptime,
    incidents: totalIncidents,
    withoutIncident,
    affectedMonitors,
  };
};

export const prepareChecksGraphData = (
  checks: Pick<RawMonitorChecksType, "checked_at" | "success">[]
) => {
  if (!Array.isArray(checks) || checks.length === 0) {
    return [
      {
        date: new Date().toISOString(),
        success: false,
      },
    ];
  }

  return checks
    .sort(
      (a, b) =>
        new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    )
    .map((check) => ({
      date: check.checked_at,
      success: check.success,
    }));
};

const calculateIncidentTime = (monitors: RawMonitorsType[]) => {
  const now = Date.now();
  const windowStart = now - DAY_MS;
  let totalIncidentTime = 0;

  for (const monitor of monitors) {
    if (!monitor.checks || monitor.checks.length === 0) continue;

    const checks = monitor.checks
      .map((c) => ({ ...c, time: new Date(c.checked_at).getTime() }))
      .sort((a, b) => a.time - b.time);

    let incidentStart: number | null = null;

    for (const check of checks) {
      if (check.time < windowStart) continue;

      if (!check.success && incidentStart === null) {
        incidentStart = Math.max(check.time, windowStart);
      }

      if (check.success && incidentStart !== null) {
        totalIncidentTime += check.time - incidentStart;
        incidentStart = null;
      }
    }

    if (incidentStart !== null) {
      totalIncidentTime += now - incidentStart;
    }
  }

  return totalIncidentTime;
};
