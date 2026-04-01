import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

// Central base API to be extended by feature-specific injected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:2707/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      // Access the Redux state to dynamically inject the token globally
      const state = getState() as RootState;
      const token = state?.auth?.token;
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Roles', 'Permissions'],
  endpoints: () => ({}), // Initialize with an empty endpoints object; features will inject theirs later
});
