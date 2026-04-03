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
      invalidatesTags: ['Users'],
    }),
    completeProfile: builder.mutation<any, CompleteProfilePayload>({
      query: (data) => ({
        url: '/users/complete-profile',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRolesMutation,
  useUpdateUserStatusMutation,
  useCompleteProfileMutation,
} = userApi;

