import { api } from '../../app/api';

export interface EnrollmentPayload {
  enrolleeType?: 'SELF' | 'CHILD';
  /** Required when enrolleeType is SELF */
  phone?: string;
  childIds?: string[];
  firstName?: string;
  lastName?: string;
  dob?: string;
  grade?: string;
  isUSA?: boolean;
  country?: string;
  region?: string;
  notes?: string;
  programId: string;
  /** Standard programs */
  phaseId?: string;
  batchId?: string;
  selectedSchedules?: string[];
  /** Academic tutorial */
  packageId?: string;
  subjects?: Array<{ name: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  timeBlocks?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subject: string;
  }>;
  /** IANA timezone for tutoring time preferences */
  scheduleTimeZone?: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollmentIds: string[];
    count: number;
    totalAmount: number;
    paymentStatus: string;
  };
}

export const enrollmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    prepareEnrollment: builder.mutation<EnrollmentResponse, EnrollmentPayload>({
      query: (data) => ({
        url: '/enrollments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Enrollments'],
    }),
    getMyPendingEnrollments: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: '/enrollments/pending',
        method: 'GET',
      }),
      providesTags: ['Enrollments'],
    }),
    getMyEnrollmentsForProgram: builder.query<{ success: boolean; data: any[] }, string>({
      query: (programId) => ({
        url: '/enrollments/mine',
        params: { programId },
      }),
      providesTags: ['Enrollments'],
    }),
    updateEnrollmentSchedule: builder.mutation<any, { enrollmentId: string; selectedSchedules: string[] }>({
      query: ({ enrollmentId, selectedSchedules }) => ({
        url: `/parent/enrollments/${enrollmentId}/schedule`,
        method: 'PATCH',
        body: { selectedSchedules },
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
  }),
});

export const {
  usePrepareEnrollmentMutation,
  useGetMyPendingEnrollmentsQuery,
  useGetMyEnrollmentsForProgramQuery,
  useUpdateEnrollmentScheduleMutation,
} = enrollmentApi;
