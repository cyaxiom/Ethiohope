import { api } from '../../app/api';

export interface CheckoutPayload {
  enrollmentIds: string[];
}

export interface CheckoutResponse {
  url: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: {
    payments: any[];
    totalSpent: number;
  };
}

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<CheckoutResponse, CheckoutPayload>({
      query: (data) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        body: data,
      }),
    }),
    getParentPayments: builder.query<PaymentHistoryResponse, { search?: string; status?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && 'search' in params && params.search) queryParams.append('search', params.search);
        if (params && 'status' in params && params.status) queryParams.append('status', params.status);
        const queryString = queryParams.toString();
        return `/payments/parent-history${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Users'],
    }),
    getAllPayments: builder.query<
      {
        success: boolean;
        data: any[];
        summary?: {
          total: number;
          pending: number;
          paid: number;
          unpaid: number;
          cancelled: number;
          zellePending?: number;
          self: number;
          child: number;
          revenue: number;
        };
      },
      { search?: string; status?: string; programId?: string; enrolleeType?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && 'search' in params && params.search) queryParams.append('search', params.search);
        if (params && 'status' in params && params.status) queryParams.append('status', params.status);
        if (params && 'programId' in params && params.programId) queryParams.append('programId', params.programId);
        if (params && 'enrolleeType' in params && params.enrolleeType) queryParams.append('enrolleeType', params.enrolleeType);
        const queryString = queryParams.toString();
        return `/payments/admin/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Users', 'Enrollments'],
    }),
    updatePaymentStatus: builder.mutation<any, { enrollmentId: string; status: string }>({
      query: (data) => ({
        url: '/payments/admin/update-status',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    confirmPaymentSession: builder.mutation<{ success: boolean; status: string }, string>({
      query: (sessionId) => ({
        url: `/payments/confirm/${sessionId}`,
        method: 'GET',
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    reportZellePayment: builder.mutation<
      { success: boolean; message: string; count: number },
      CheckoutPayload
    >({
      query: (data) => ({
        url: '/payments/zelle-submitted',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    cancelSubscription: builder.mutation<
      { success: boolean; message: string; enrollment: any },
      { enrollmentId: string }
    >({
      query: (data) => ({
        url: '/payments/cancel-subscription',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    adminCancelSubscription: builder.mutation<
      { success: boolean; message: string; enrollment: any },
      { enrollmentId: string }
    >({
      query: (data) => ({
        url: '/payments/admin/cancel-subscription',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    resumeSubscription: builder.mutation<
      { success: boolean; message: string; enrollment: any },
      { enrollmentId: string }
    >({
      query: (data) => ({
        url: '/payments/resume-subscription',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
    adminResumeSubscription: builder.mutation<
      { success: boolean; message: string; enrollment: any },
      { enrollmentId: string }
    >({
      query: (data) => ({
        url: '/payments/admin/resume-subscription',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetParentPaymentsQuery,
  useGetAllPaymentsQuery,
  useUpdatePaymentStatusMutation,
  useConfirmPaymentSessionMutation,
  useReportZellePaymentMutation,
  useCancelSubscriptionMutation,
  useAdminCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useAdminResumeSubscriptionMutation,
} = paymentApi;
