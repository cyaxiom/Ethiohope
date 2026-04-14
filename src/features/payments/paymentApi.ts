import { api } from '../../app/api';

export interface CheckoutPayload {
  enrollmentIds: string[];
}

export interface CheckoutResponse {
  url: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: any[];
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
      providesTags: ['Users'], // Reusing Users tag for simplicity as it relates to parent data
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetParentPaymentsQuery,
} = paymentApi;
