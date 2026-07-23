import { api } from '../../app/api';

export interface TutoringPackage {
  _id: string;
  program: string;
  name: string;
  price: number;
  daysPerWeek: 1 | 2 | 3 | 4 | 5;
  description?: string;
  isPopular?: boolean;
  isActive: boolean;
  orderIndex?: number;
  stripePriceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackagePayload {
  program: string;
  name: string;
  price: number;
  daysPerWeek: number;
  description?: string;
  isPopular?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface GetPackagesResponse {
  success: boolean;
  message: string;
  data: TutoringPackage[];
}

export const packageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPackagesByProgram: builder.query<GetPackagesResponse, string>({
      query: (programId) => `/admin/programs/${programId}/packages`,
      providesTags: (result, error, programId) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Packages' as const, id: _id })),
              { type: 'Packages', id: `LIST_${programId}` },
            ]
          : [{ type: 'Packages', id: `LIST_${programId}` }],
    }),
    getPublicPackagesByProgram: builder.query<GetPackagesResponse, string>({
      query: (programId) => `/programs/${programId}/packages?active=true`,
      providesTags: (result, error, programId) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Packages' as const, id: _id })),
              { type: 'Packages', id: `LIST_${programId}` },
            ]
          : [{ type: 'Packages', id: `LIST_${programId}` }],
    }),
    createPackage: builder.mutation<any, CreatePackagePayload>({
      query: (body) => ({
        url: '/admin/packages',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { program }) => [{ type: 'Packages', id: `LIST_${program}` }],
    }),
    updatePackage: builder.mutation<
      any,
      { id: string; programId: string; data: Partial<CreatePackagePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/packages/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { programId }) => [{ type: 'Packages', id: `LIST_${programId}` }],
    }),
    deletePackage: builder.mutation<any, { id: string; programId: string }>({
      query: ({ id }) => ({
        url: `/admin/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { programId }) => [{ type: 'Packages', id: `LIST_${programId}` }],
    }),
  }),
});

export const {
  useGetPackagesByProgramQuery,
  useGetPublicPackagesByProgramQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
