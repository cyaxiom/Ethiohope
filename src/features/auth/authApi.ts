import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Scaffolded RTK Query API for Authentication
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/auth' }),
  endpoints: () => ({
    // Endpoints will be added here later
  }),
});
