import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Scaffolded RTK Query API for Roles and Permissions
export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/roles' }),
  endpoints: () => ({
    // Endpoints will be added here later
  }),
});
