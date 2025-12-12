import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get ISO string for daysAgo from today
 * @param days Number of days ago
 */
export const getPastDateISO = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const roundToHundreds = (v: number) => Math.round(v / 100) * 100;

/**
 * Formats time since last check as "Xm Ys ago"
 */
export const formatTimeSince = (time: Date | string | null): string => {
  if (!time) return "N/A";

  const diffMs = Date.now() - new Date(time).getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // If duration is 1 hour or more → show "HHh MMm SSs"
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  }

  // If less than 1 hour → show "MMm SSs"
  return `${minutes.toString().padStart(2, "0")}m ${seconds
    .toString()
    .padStart(2, "0")}s`;
};

/**
 * Formats duration with flexible visibility:
 * - 01h 20m 30s
 * - 01h 20m
 * - 20m 30s
 * - 5m
 * - 30s
 */
export const formatDuration = (
  totalSeconds: number | null,
  options: {
    showHours?: boolean; // default: true
    showMinutes?: boolean; // default: true
    showSeconds?: boolean; // default: true
    pad?: boolean; // default: false → pad with 0 like "01h"
  } = {}
): string => {
  if (totalSeconds === null || totalSeconds < 0) return "N/A";

  const {
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    pad = false,
  } = options;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padNum = (n: number) => (pad ? n.toString().padStart(2, "0") : n);

  const parts: string[] = [];

  if (showHours && hours > 0) {
    parts.push(`${padNum(hours)}h`);
  }

  if (showMinutes && (minutes > 0 || parts.length > 0)) {
    parts.push(`${padNum(minutes)}m`);
  }

  if (showSeconds && (seconds > 0 || parts.length === 0)) {
    parts.push(`${padNum(seconds)}s`);
  }

  return parts.join(" ");
};

/**
 * Formats a given Date object or date string into a localized date and time string.
 * If the input is null or invalid, it returns a dash ("-").
 *
 * @param dateInput - The date to format, either as a Date object or null.
 * @returns A formatted date and time string, or "-" if input is null/invalid.
 */
export const formatDateTime = (dateInput: Date | null): string => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);

  // Check if the date is invalid
  if (isNaN(date.getTime())) return "-";

  // Format as localized string
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
