
import { api } from '../../app/api';

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/dashboard/analytics/summary',
        params,
      }),
    }),
    getAnalyticsTimeline: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/dashboard/analytics/timeline',
        params,
      }),
    }),
    getAnalyticsSources: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/dashboard/analytics/sources',
        params,
      }),
    }),
    getAnalyticsTopPages: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/dashboard/analytics/top-pages',
        params,
      }),
    }),
    getAnalyticsCountries: builder.query<any, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/dashboard/analytics/countries',
        params,
      }),
    }),
    getAnalyticsRealtime: builder.query<any, void>({
      query: () => '/admin/dashboard/analytics/realtime',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsTimelineQuery,
  useGetAnalyticsSourcesQuery,
  useGetAnalyticsTopPagesQuery,
  useGetAnalyticsCountriesQuery,
  useGetAnalyticsRealtimeQuery,
} = analyticsApi;
