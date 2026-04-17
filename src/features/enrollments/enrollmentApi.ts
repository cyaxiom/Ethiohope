import { api } from '../../app/api';

export interface EnrollmentPayload {
  childIds?: string[];
  firstName?: string;
  lastName?: string;
  dob?: string;
  grade?: string;
  isUSA?: boolean;
  country?: string;
  region?: string;
  programId: string;
  phaseId: string;
  batchId: string;
  selectedSchedules?: string[];
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
        url: '/parent/enrollments',
        method: 'POST',
        body: data,
      }),
    }),
    getMyPendingEnrollments: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: '/parent/enrollments/pending',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  usePrepareEnrollmentMutation,
  useGetMyPendingEnrollmentsQuery,
} = enrollmentApi;

