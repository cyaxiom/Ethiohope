import { api } from '../../app/api';

export interface DashboardStats {
  totalRoles: number;
  totalUsers: number;
  activeUsers: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/stats',
      // Unwraps the standard backend envelope { success, message, data }
      transformResponse: (response: DashboardStatsResponse) => response.data,
      providesTags: ['DashboardStats'],
    }),
    getInstructorStats: builder.query<DashboardStats, void>({
      query: () => '/instructor/dashboard/stats',
      transformResponse: (response: DashboardStatsResponse) => response.data,
      providesTags: ['DashboardStats'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery, useGetInstructorStatsQuery } = dashboardApi;
