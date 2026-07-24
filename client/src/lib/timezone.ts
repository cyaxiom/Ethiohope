/**
 * Timezone helpers — parents enter local wall-clock times;
 * mentors in Ethiopia see converted times.
 */

export const ETHIOPIA_TZ = 'Africa/Addis_Ababa';

export type TimeZoneOption = {
  value: string;
  label: string;
  group: string;
};

/** Curated list — easy for parents (US states regions, Ethiopia, UK, UAE, etc.) */
export const PARENT_TIMEZONE_OPTIONS: TimeZoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET) — New York, Florida, etc.', group: 'United States' },
  { value: 'America/Chicago', label: 'Central Time (CT) — Chicago, Texas, etc.', group: 'United States' },
  { value: 'America/Denver', label: 'Mountain Time (MT) — Denver, etc.', group: 'United States' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)', group: 'United States' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) — California, Washington', group: 'United States' },
  { value: 'America/Anchorage', label: 'Alaska Time', group: 'United States' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', group: 'United States' },
  { value: 'America/Toronto', label: 'Eastern — Toronto', group: 'Canada' },
  { value: 'America/Vancouver', label: 'Pacific — Vancouver', group: 'Canada' },
  { value: 'America/Edmonton', label: 'Mountain — Edmonton / Calgary', group: 'Canada' },
  { value: 'Africa/Addis_Ababa', label: 'Ethiopia (East Africa Time)', group: 'Africa' },
  { value: 'Africa/Nairobi', label: 'Kenya / East Africa', group: 'Africa' },
  { value: 'Africa/Lagos', label: 'West Africa — Lagos', group: 'Africa' },
  { value: 'Africa/Cairo', label: 'Egypt — Cairo', group: 'Africa' },
  { value: 'Europe/London', label: 'United Kingdom (London)', group: 'Europe' },
  { value: 'Europe/Paris', label: 'Central Europe — Paris / Berlin', group: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Netherlands — Amsterdam', group: 'Europe' },
  { value: 'Asia/Dubai', label: 'UAE — Dubai / Abu Dhabi', group: 'Middle East' },
  { value: 'Asia/Riyadh', label: 'Saudi Arabia — Riyadh', group: 'Middle East' },
  { value: 'Asia/Kolkata', label: 'India — IST', group: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore', group: 'Asia' },
  { value: 'Australia/Sydney', label: 'Australia — Sydney', group: 'Australia' },
];

export const detectBrowserTimeZone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && PARENT_TIMEZONE_OPTIONS.some((o) => o.value === tz)) return tz;
    // Map common browser zones not in list to closest curated option
    if (tz?.startsWith('America/')) {
      if (/New_York|Detroit|Indiana|Kentucky|Indiana/.test(tz)) return 'America/New_York';
      if (/Chicago|Menominee|Indiana\/Knox/.test(tz)) return 'America/Chicago';
      if (/Denver|Boise|Shiprock/.test(tz)) return 'America/Denver';
      if (/Los_Angeles|Vancouver/.test(tz)) return 'America/Los_Angeles';
    }
    if (tz === 'Africa/Asmara' || tz === 'Africa/Nairobi') return tz === 'Africa/Nairobi' ? tz : 'Africa/Addis_Ababa';
    return tz || ETHIOPIA_TZ;
  } catch {
    return ETHIOPIA_TZ;
  }
};

export const timeZoneLabel = (tz: string): string =>
  PARENT_TIMEZONE_OPTIONS.find((o) => o.value === tz)?.label || tz;

/** Short offset label e.g. "GMT+3" for a timezone right now */
export const timeZoneOffsetLabel = (timeZone: string, at: Date = new Date()): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(at);
    return parts.find((p) => p.type === 'timeZoneName')?.value || '';
  } catch {
    return '';
  }
};

const DAY_INDEX: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/** Next calendar date (YYYY-MM-DD) for a weekday in a given timezone */
export const nextDateForWeekdayInZone = (dayOfWeek: string, timeZone: string): string => {
  const target = DAY_INDEX[dayOfWeek.toUpperCase()];
  const now = new Date();
  for (let add = 0; add < 8; add++) {
    const probe = new Date(now.getTime() + add * 86400000);
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(probe);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    if (map[weekday] === target) {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(probe); // en-CA → YYYY-MM-DD
      return parts;
    }
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
};

/**
 * Convert a wall-clock date+time in `timeZone` to a real UTC Date.
 * Uses iterative correction via Intl (no extra deps).
 */
export const wallTimeInZoneToUtc = (
  ymd: string,
  hm: string,
  timeZone: string
): Date => {
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
};

export const formatTimeInZone = (
  date: Date,
  timeZone: string,
  opts?: { includeDay?: boolean }
): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      ...(opts?.includeDay ? { weekday: 'short' } : {}),
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toISOString();
  }
};

/**
 * Given day + HH:mm in parentZone, return readable Ethiopia (mentor) time.
 */
export const convertLocalSlotToEthiopia = (
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  parentZone: string
): { startLabel: string; endLabel: string; dayNote?: string } | null => {
  if (!dayOfWeek || !startTime || !endTime || !parentZone) return null;
  try {
    const ymd = nextDateForWeekdayInZone(dayOfWeek, parentZone);
    const startUtc = wallTimeInZoneToUtc(ymd, startTime, parentZone);
    const endUtc = wallTimeInZoneToUtc(ymd, endTime, parentZone);
    const startLabel = formatTimeInZone(startUtc, ETHIOPIA_TZ, { includeDay: true });
    const endLabel = formatTimeInZone(endUtc, ETHIOPIA_TZ, { includeDay: false });
    return {
      startLabel,
      endLabel,
      dayNote: 'Ethiopia (EAT)',
    };
  } catch {
    return null;
  }
};

export const formatHHmm12 = (hm: string): string => {
  if (!hm || !hm.includes(':')) return hm;
  const [hStr, m] = hm.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return hm;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};
