import { api } from '../../app/api';

export interface CheckoutPayload {
  enrollmentIds: string[];
}

export interface CheckoutResponse {
  url: string;
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
  }),
});

export const {
  useCreateCheckoutSessionMutation,
} = paymentApi;
