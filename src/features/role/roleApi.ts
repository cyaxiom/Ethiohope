import { api } from '../../app/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Permission {
  _id: string;
  key: string;
  resource: string;
  action: string;
  description?: string;
  isSystem?: boolean;
}

export interface Role {
  _id: string;
  name: string;
  code: string;
  permissions: Permission[];
  description?: string;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  permissionKeys: string[];
}

export interface UpdateRolePayload {
  id: string;
  permissionKeys: string[];
}

// ─── RTK Query API ──────────────────────────────────────────────────────────

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /access/roles
    getRoles: builder.query<Role[], void>({
      query: () => 'access/roles',
      transformResponse: (response: { success: boolean; data: Role[] }) => response.data,
      providesTags: ['Roles'],
    }),

    // GET /access/permissions
    getPermissions: builder.query<Permission[], void>({
      query: () => 'access/permissions',
      transformResponse: (response: { success: boolean; data: Permission[] }) => response.data,
      providesTags: ['Permissions'],
    }),

    // POST /access/roles
    createRole: builder.mutation<Role, CreateRolePayload>({
      query: (body) => ({
        url: 'access/roles',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: Role; message: string }) => response.data,
      invalidatesTags: ['Roles'],
    }),

    // PATCH /access/roles/:id
    updateRole: builder.mutation<Role, UpdateRolePayload>({
      query: ({ id, ...body }) => ({
        url: `access/roles/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { success: boolean; data: Role; message: string }) => response.data,
      invalidatesTags: ['Roles'],
    }),

    // DELETE /access/roles/:id
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `access/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),
  }),
  overrideExisting: false,
});

// Export auto-generated hooks
export const {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
