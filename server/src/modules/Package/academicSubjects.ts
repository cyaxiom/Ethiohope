/** Shared academic tutoring subject catalog */
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

export const SUBJECT_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const;
export type SubjectPriority = (typeof SUBJECT_PRIORITIES)[number];

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
