import { describe, it, expect } from "vitest";
import { computeNextRun, type ScheduleConfig } from "@/app/lib/schedule";

const base = (over: Partial<ScheduleConfig>): ScheduleConfig => ({
  frequency: "zilnic",
  hour: 9,
  day_of_week: null,
  day_of_month: null,
  ...over,
});

describe("computeNextRun — zilnic", () => {
  it("schedules today if the hour is still ahead", () => {
    const from = new Date("2026-06-20T06:00:00");
    const next = computeNextRun(base({ frequency: "zilnic", hour: 9 }), from);
    expect(next.getFullYear()).toBe(2026);
    expect(next.getDate()).toBe(20);
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBe(0);
    expect(next.getSeconds()).toBe(0);
  });

  it("rolls to tomorrow once the hour has passed", () => {
    const from = new Date("2026-06-20T10:00:00");
    const next = computeNextRun(base({ frequency: "zilnic", hour: 9 }), from);
    expect(next.getDate()).toBe(21);
    expect(next.getHours()).toBe(9);
  });
});

describe("computeNextRun — saptamanal", () => {
  it("targets the requested day of week", () => {
    // 2026-06-20 is a Saturday (getDay() === 6).
    const from = new Date("2026-06-20T10:00:00");
    const next = computeNextRun(
      base({ frequency: "saptamanal", hour: 8, day_of_week: 1 }), // Monday
      from,
    );
    expect(next.getDay()).toBe(1);
    expect(next.getDate()).toBe(22); // next Monday
    expect(next.getHours()).toBe(8);
  });

  it("pushes a full week when the target day/hour already passed today", () => {
    // Saturday 10:00, target Saturday 08:00 -> next Saturday.
    const from = new Date("2026-06-20T10:00:00");
    const next = computeNextRun(
      base({ frequency: "saptamanal", hour: 8, day_of_week: 6 }),
      from,
    );
    expect(next.getDay()).toBe(6);
    expect(next.getDate()).toBe(27);
  });
});

describe("computeNextRun — lunar", () => {
  it("uses the requested day of month", () => {
    const from = new Date("2026-06-10T10:00:00");
    const next = computeNextRun(
      base({ frequency: "lunar", hour: 7, day_of_month: 15 }),
      from,
    );
    expect(next.getDate()).toBe(15);
    expect(next.getMonth()).toBe(5); // June (0-indexed)
    expect(next.getHours()).toBe(7);
  });

  it("rolls to next month when the day already passed", () => {
    const from = new Date("2026-06-20T10:00:00");
    const next = computeNextRun(
      base({ frequency: "lunar", hour: 7, day_of_month: 15 }),
      from,
    );
    expect(next.getMonth()).toBe(6); // July
    expect(next.getDate()).toBe(15);
  });

  it("clamps day_of_month to 28", () => {
    const from = new Date("2026-02-01T00:00:00");
    const next = computeNextRun(
      base({ frequency: "lunar", hour: 7, day_of_month: 31 }),
      from,
    );
    expect(next.getDate()).toBe(28);
  });
});
