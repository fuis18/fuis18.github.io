import { describe, it, expect } from "vitest";
import {
  getCurrentStatus,
  getHourInTimezone,
  statusFromHour,
} from "./status";

describe("statusFromHour", () => {
  it("es offline de 22:00 a 06:59", () => {
    expect(statusFromHour(22)).toBe("offline");
    expect(statusFromHour(23)).toBe("offline");
    expect(statusFromHour(0)).toBe("offline");
    expect(statusFromHour(6)).toBe("offline");
  });

  it("es working de 07:00 a 11:59", () => {
    expect(statusFromHour(7)).toBe("working");
    expect(statusFromHour(9)).toBe("working");
    expect(statusFromHour(11)).toBe("working");
  });

  it("es online de 12:00 a 21:59", () => {
    expect(statusFromHour(12)).toBe("online");
    expect(statusFromHour(18)).toBe("online");
    expect(statusFromHour(21)).toBe("online");
  });
});

describe("getHourInTimezone", () => {
  it("usa la hora de la zona indicada, no la del navegador", () => {
    // 2026-01-01T02:00:00Z -> 21:00 del 2025-12-31 en Lima (GMT-5)
    const utc = new Date("2026-01-01T02:00:00Z");
    expect(getHourInTimezone(utc, "America/Lima")).toBe(21);
    expect(getHourInTimezone(utc, "UTC")).toBe(2);
  });

  it("devuelve 0 en medianoche (no 24)", () => {
    const midnight = new Date("2026-06-01T05:00:00Z"); // 00:00 en Lima
    expect(getHourInTimezone(midnight, "America/Lima")).toBe(0);
  });
});

describe("getCurrentStatus", () => {
  it("resuelve el estado según la hora en Lima", () => {
    expect(getCurrentStatus(new Date("2026-06-01T18:00:00Z"))).toBe("online"); // 13:00
    expect(getCurrentStatus(new Date("2026-06-01T13:00:00Z"))).toBe("working"); // 08:00
    expect(getCurrentStatus(new Date("2026-06-01T08:00:00Z"))).toBe("offline"); // 03:00
  });
});
