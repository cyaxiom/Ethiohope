import { api } from '../../app/api';

export interface User {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  status: 'active' | 'suspended' | 'blocked';
  roles: { id: string; name: string; code: string }[];
}

export interface CreateUserPayload extends Partial<User> {
  password?: string;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    stats?: {
      total: number;
      active: number;
      suspended: number;
      blocked: number;
      rolesCount: Record<string, number>;
    }
  };
}

export interface CompleteProfilePayload {
  parentType: 'mother' | 'father' | 'guardian' | 'other';
  phone: string;
  country: string;
  state: string;
  city: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, { page?: number; limit?: number; search?: string; role?: string; status?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.status) queryParams.append('status', params.status);
        return `/users?${queryParams.toString()}`;
      },
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<any, CreateUserPayload>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUserRoles: builder.mutation<any, { userId: string; roles: string[] }>({
      query: ({ userId, roles }) => ({
        url: `/users/${userId}/roles`,
        method: 'PATCH',
        body: { roles },
      }),
      invalidatesTags: ['Users'],
    }),
    updateUserStatus: builder.mutation<any, { userId: string; status: 'active' | 'suspended' | 'blocked' }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users', 'DashboardParents', 'DashboardTeachers', 'DashboardStats'],
    }),
    completeProfile: builder.mutation<any, CompleteProfilePayload>({
      query: (data) => ({
        url: '/parent/complete-profile',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ['Users'],
    }),
    getRegisterChildInit: builder.query<{ profileCompleted: boolean }, void>({
      query: () => '/parent/register-child/init',
    }),
    getParentChildren: builder.query<{ success: boolean; data: any[] }, { search?: string; progressCategory?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && 'search' in params && params.search) queryParams.append('search', params.search);
        if (params && 'progressCategory' in params && params.progressCategory) queryParams.append('progressCategory', params.progressCategory);
        const queryString = queryParams.toString();
        return `/parent/children${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Users'],
    }),
    registerChild: builder.mutation<any, any>({
      query: (data) => ({
        url: '/parent/children',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    getChildDetails: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/parent/children/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    regenerateChildPin: builder.mutation<
      { success: boolean; message: string; data: { _id: string; username: string; plainPin: string } },
      string
    >({
      query: (childId) => ({
        url: `/parent/children/${childId}/regenerate-pin`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, childId) => ['Users', { type: 'Users', id: childId }],
    }),
    getChildMe: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/child/me',
      providesTags: ['Users'],
    }),
    getParentDashboardStats: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/parent/dashboard/stats',
      providesTags: ['Users'],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'DashboardParents', 'DashboardTeachers', 'DashboardStats'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRolesMutation,
  useUpdateUserStatusMutation,
  useCompleteProfileMutation,
  useLazyGetRegisterChildInitQuery,
  useGetParentChildrenQuery,
  useRegisterChildMutation,
  useGetChildDetailsQuery,
  useRegenerateChildPinMutation,
  useGetChildMeQuery,
  useGetParentDashboardStatsQuery,
  useDeleteUserMutation,
} = userApi;

