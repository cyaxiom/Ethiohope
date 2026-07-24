import { api } from '../../app/api';

export interface DashboardStats {
  totalRoles: number;
  totalUsers: number;
  activeUsers: number;
  totalParents: number;
  totalTeachers: number;
  totalChildren?: number;
  totalAdultStudents?: number;
  pendingEnrollments?: number;
  activeEnrollments?: number;
}

export interface ChildDetail {
  _id: string;
  firstname: string;
  lastname: string;
  username?: string;
  grade: string;
  birthdate: string;
  gender: string;
  status: string;
  isUSA?: boolean;
  country?: string;
  region?: string;
  enrollmentCount?: number;
  pendingEnrollmentCount?: number;
  activeEnrollmentCount?: number;
  parent?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    status?: string;
  };
}

export interface UpdateChildPayload {
  firstname?: string;
  lastname?: string;
  username?: string;
  pin?: string;
  gender?: 'male' | 'female';
  birthdate?: string;
  grade?: string;
  status?: 'active' | 'suspended';
  isUSA?: boolean;
  country?: string;
  region?: string;
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
  enrollmentCount?: number;
  pendingEnrollmentCount?: number;
}

export interface AdultStudent {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  status: string;
  lastLogin?: string;
  enrollmentCount?: number;
  pendingEnrollmentCount?: number;
  activeEnrollmentCount?: number;
}

export interface TeacherDetail {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  status: string;
  lastLogin?: string;
}

export interface PersonEnrollment {
  _id: string;
  status: string;
  paymentStatus: string;
  enrolleeType?: string;
  billingType?: string;
  createdAt: string;
  program?: { title?: string; isForChildren?: boolean; programType?: string };
  phase?: { title?: string; orderIndex?: number; price?: number };
  package?: { name?: string; price?: number; daysPerWeek?: number };
  child?: { firstname?: string; lastname?: string };
  user?: { firstname?: string; lastname?: string; email?: string };
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
      transformResponse: (response: DashboardStatsResponse) => response.data,
      providesTags: ['DashboardStats'],
    }),
    getInstructorStats: builder.query<DashboardStats, void>({
      query: () => '/instructor/dashboard/stats',
      transformResponse: (response: DashboardStatsResponse) => response.data,
      providesTags: ['DashboardStats'],
    }),
    getParentsWithChildren: builder.query<ParentWithChildren[], { search?: string } | void>({
      query: (params) => ({
        url: '/admin/dashboard/parents-children',
        params: params && 'search' in params && params.search ? { search: params.search } : undefined,
      }),
      transformResponse: (response: ParentsWithChildrenResponse) => response.data,
      providesTags: ['DashboardParents'],
    }),
    getTeachers: builder.query<TeacherDetail[], { search?: string } | void>({
      query: (params) => ({
        url: '/admin/dashboard/teachers',
        params: params && 'search' in params && params.search ? { search: params.search } : undefined,
      }),
      transformResponse: (response: { data: TeacherDetail[] }) => response.data,
      providesTags: ['DashboardTeachers'],
    }),
    getChildrenDirectory: builder.query<ChildDetail[], { search?: string } | void>({
      query: (params) => ({
        url: '/admin/dashboard/children',
        params: params && 'search' in params && params.search ? { search: params.search } : undefined,
      }),
      transformResponse: (response: { data: ChildDetail[] }) => response.data,
      providesTags: ['DashboardParents'],
    }),
    getAdultStudents: builder.query<AdultStudent[], { search?: string } | void>({
      query: (params) => ({
        url: '/admin/dashboard/adult-students',
        params: params && 'search' in params && params.search ? { search: params.search } : undefined,
      }),
      transformResponse: (response: { data: AdultStudent[] }) => response.data,
      providesTags: ['DashboardParents'],
    }),
    getPersonEnrollments: builder.query<
      PersonEnrollment[],
      { parentId?: string; childId?: string; userId?: string }
    >({
      query: (params) => ({
        url: '/admin/dashboard/person-enrollments',
        params,
      }),
      transformResponse: (response: { data: PersonEnrollment[] }) => response.data,
      providesTags: ['Enrollments'],
    }),
    resetDatabase: builder.mutation<{ success: boolean; message: string; deletedUsers: number }, void>({
      query: () => ({
        url: '/maintenance/reset-db',
        method: 'POST',
      }),
      invalidatesTags: [
        'DashboardStats',
        'DashboardParents',
        'DashboardTeachers',
        'Programs',
        'Phases',
        'Batches',
        'Schedules',
        'Courses',
        'Users',
      ],
    }),
    adminUpdateChild: builder.mutation<
      { success: boolean; message: string; data: ChildDetail },
      { id: string; data: UpdateChildPayload }
    >({
      query: ({ id, data }) => ({
        url: `/child/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['DashboardParents', 'DashboardStats'],
    }),
    adminDeleteChild: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/child/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DashboardParents', 'DashboardStats', 'Enrollments'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardStatsQuery,
  useGetInstructorStatsQuery,
  useGetParentsWithChildrenQuery,
  useGetTeachersQuery,
  useGetChildrenDirectoryQuery,
  useGetAdultStudentsQuery,
  useGetPersonEnrollmentsQuery,
  useResetDatabaseMutation,
  useAdminUpdateChildMutation,
  useAdminDeleteChildMutation,
} = dashboardApi;
