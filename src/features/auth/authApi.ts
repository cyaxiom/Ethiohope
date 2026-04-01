import { api } from '../../app/api';

// Types for Requests and Responses
export interface LoginRequest {
  email: string;
  password?: string;
  // Extend based on the specific UserLoginDTO fields if necessary
}

export interface UserResponse {
  id: string;
  roles: string[];
  permissions: string[];
  type: 'adult' | 'child';
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: UserResponse;
  roles: string[];
  permissions: string[];
  redirectTo?: string;
}

export interface GenericResponse {
  message: string;
  success: boolean;
}

// Inject authentication endpoints into the central base API
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, Partial<LoginRequest>>({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: credentials,
      }),
      // Automatically unwrap the standard backend format { success, message, data }
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    logout: builder.mutation<GenericResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      transformResponse: (response: any) => response.data,
    }),
    refresh: builder.query<AuthResponse, void>({
      query: () => ({
        url: 'auth/refresh',
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    forgotPassword: builder.mutation<GenericResponse, { email: string }>({
      query: (data) => ({
        url: 'auth/forget',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
    }),
    resetPassword: builder.mutation<GenericResponse, { password: string; token: string }>({
      query: (data) => ({
        url: 'auth/reset',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
    }),
    verifyEmail: builder.mutation<GenericResponse, { email: string }>({
      query: (data) => ({
        url: 'auth/verify',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
    }),
    confirmVerification: builder.mutation<GenericResponse, { token: string }>({
      query: (data) => ({
        url: 'auth/verify/confirm',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
    }),
    signup: builder.mutation<AuthResponse, any>({
      query: (data) => ({
        url: 'auth/signup',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
  }),
  overrideExisting: false,
});

// Export auto-generated hooks based on defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useConfirmVerificationMutation,
  useSignupMutation,
} = authApi;
