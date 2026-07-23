export const ACADEMIC_SUBJECTS = [
  'Amharic',
  'Biology',
  'Business Management Administration',
  'Chemistry',
  'Coding',
  'Computer Science',
  'Health Education',
  'Information Technology',
  'Math',
  'Physics',
  'Science',
  'Social Studies',
  'English',
] as const;

export type AcademicSubject = (typeof ACADEMIC_SUBJECTS)[number];
export type SubjectPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export const PACKAGE_DAYS_LABELS: Record<number, string> = {
  1: 'Once a week',
  2: 'Twice a week',
  3: '3 times a week',
  4: '4 times a week',
  5: '5 times a week',
};

/** Keep weekly order, but place the popular package in the visual center. */
export function sortPackagesWithPopularCentered<
  T extends { daysPerWeek: number; isPopular?: boolean }
>(packages: T[]): T[] {
  const sorted = [...packages].sort((a, b) => a.daysPerWeek - b.daysPerWeek);
  if (sorted.length < 3) return sorted;
  const popularIdx = sorted.findIndex((p) => p.isPopular);
  if (popularIdx < 0) return sorted;
  const [popular] = sorted.splice(popularIdx, 1);
  const mid = Math.floor(sorted.length / 2);
  sorted.splice(mid, 0, popular);
  return sorted;
}
