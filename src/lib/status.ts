export type Status = "offline" | "working" | "online";

// GMT-5 fijo, sin horario de verano (igual que Bogotá).
export const STATUS_TIMEZONE = "America/Lima";

/**
 * Estado según la hora local (0-23):
 * - offline: 22:00 - 06:59
 * - working: 07:00 - 11:59
 * - online:  12:00 - 21:59
 */
export function statusFromHour(hour: number): Status {
  if (hour >= 22 || hour < 7) return "offline";
  if (hour < 12) return "working";
  return "online";
}

/** Hora (0-23) en la zona indicada, independiente de la zona del visitante. */
export function getHourInTimezone(
  now: Date,
  timeZone: string = STATUS_TIMEZONE,
): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return Number(formatted);
}

export function getCurrentStatus(now: Date = new Date()): Status {
  return statusFromHour(getHourInTimezone(now));
}
