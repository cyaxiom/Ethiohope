import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { setCredentials, logout } from '../features/auth/authSlice';

// Create a basic base query
const baseQuery = fetchBaseQuery({
  baseUrl: (import.meta as any).env.VITE_API_BASE_URL || '',
  prepareHeaders: (headers, { getState }) => {
    // Access the Redux state to dynamically inject the token globally
    const state = getState() as RootState;
    const token = state?.auth?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query that intercepts 401 errors
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if the original request resulted in a 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Attempt to get a new token
    const refreshResult = await baseQuery('auth/refresh', api, extraOptions) as any;

    if (refreshResult.data && refreshResult.data.success !== false) {
      // Assuming your backend returns { data: { token, user, roles, permissions } }
      const newAuthData = refreshResult.data.data;

      // Store the new token in the Redux store
      api.dispatch(
        setCredentials({
          user: newAuthData.user,
          token: newAuthData.token,
          roles: newAuthData.roles,
          permissions: newAuthData.permissions,
        })
      );

      // Retry the initial query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, log out the user
      api.dispatch(logout());
    }
  }

  return result;
};

// Central base API to be extended by feature-specific injected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Roles', 'Permissions', 'Users', 'DashboardStats', 'DashboardParents', 'DashboardTeachers', 'Programs', 'Phases', 'Batches', 'Schedules', 'Courses', 'Progress', 'Sessions'],
  endpoints: () => ({}), // Initialize with an empty endpoints object; features will inject theirs later
});
