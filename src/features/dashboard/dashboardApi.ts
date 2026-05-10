import { api } from '../../app/api';

export interface DashboardStats {
  totalRoles: number;
  totalUsers: number;
  activeUsers: number;
  totalParents: number;
  totalTeachers: number;
}

export interface ChildDetail {
  _id: string;
  firstname: string;
  lastname: string;
  grade: string;
  birthdate: string;
  gender: string;
  status: string;
}

export interface ParentWithChildren {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  parentType: string;
  status: string;
  children: ChildDetail[];
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface ParentsWithChildrenResponse {
  success: boolean;
  message: string;
  data: ParentWithChildren[];
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
    getParentsWithChildren: builder.query<ParentWithChildren[], void>({
      query: () => '/admin/dashboard/parents-children',
      transformResponse: (response: ParentsWithChildrenResponse) => response.data,
      providesTags: ['DashboardParents'],
    }),
    getTeachers: builder.query<any[], void>({
      query: () => '/admin/dashboard/teachers',
      transformResponse: (response: any) => response.data,
      providesTags: ['DashboardTeachers'],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetDashboardStatsQuery, 
  useGetInstructorStatsQuery,
  useGetParentsWithChildrenQuery,
  useGetTeachersQuery
} = dashboardApi;
