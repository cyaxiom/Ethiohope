/**
 * Server-side timezone helpers (Intl-based, no extra deps).
 */

export const ETHIOPIA_TZ = 'Africa/Addis_Ababa';

const DAY_INDEX: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export function nextDateForWeekdayInZone(dayOfWeek: string, timeZone: string, from: Date = new Date()): string {
  const target = DAY_INDEX[dayOfWeek.toUpperCase()];
  for (let add = 0; add < 8; add++) {
    const probe = new Date(from.getTime() + add * 86400000);
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(probe);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    if (map[weekday] === target) {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(probe);
    }
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(from);
}

/** Wall-clock YYYY-MM-DD + HH:mm in `timeZone` → UTC Date */
export function wallTimeInZoneToUtc(ymd: string, hm: string, timeZone: string): Date {
  const [y, mo, d] = ymd.split('-').map(Number);
  const [h, mi] = hm.split(':').map(Number);
  let utcMs = Date.UTC(y, mo - 1, d, h, mi, 0);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(utcMs))
        .filter((p) => p.type !== 'literal')
        .map((p) => [p.type, p.value])
    ) as Record<string, string>;
    const gotHour = parts.hour === '24' ? 0 : Number(parts.hour);
    const asIfUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      gotHour,
      Number(parts.minute),
      Number(parts.second || 0)
    );
    const desired = Date.UTC(y, mo - 1, d, h, mi, 0);
    utcMs += desired - asIfUtc;
  }

  return new Date(utcMs);
}

/** Build absolute start/end for a schedule slot on a given calendar date in the schedule's timezone */
export function scheduleSlotToUtcRange(
  targetDateYmd: string,
  startTimeHHmm: string,
  endTimeHHmm: string,
  timeZone: string = ETHIOPIA_TZ
): { start: Date; end: Date } {
  const start = wallTimeInZoneToUtc(targetDateYmd, startTimeHHmm, timeZone);
  const end = wallTimeInZoneToUtc(targetDateYmd, endTimeHHmm, timeZone);
  return { start, end };
}

export function formatInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);
}
