import { api } from '../../app/api';

export interface Program {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  ageRange?: string;
  isForChildren?: boolean;
  programType?: 'STANDARD' | 'ACADEMIC_TUTORIAL' | string;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramPayload {
  title: string;
  description?: string;
  image?: string;
  ageRange?: string;
  isForChildren?: boolean;
  programType?: 'STANDARD' | 'ACADEMIC_TUTORIAL' | string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateProgramPayload extends Partial<CreateProgramPayload> {
  id: string;
}

export interface GetProgramsResponse {
  success: boolean;
  message: string;
  data: Program[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const programApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query<GetProgramsResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        return `/admin/programs?${queryParams.toString()}`;
      },
      providesTags: ['Programs'],
    }),
    createProgram: builder.mutation<any, CreateProgramPayload>({
      query: (programData) => ({
        url: '/admin/programs',
        method: 'POST',
        body: programData,
      }),
      invalidatesTags: ['Programs'],
    }),
    updateProgram: builder.mutation<any, UpdateProgramPayload>({
      query: ({ id, ...body }) => ({
        url: `/admin/programs/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Programs'],
    }),
    getPublicPrograms: builder.query<GetProgramsResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        return `/programs?${queryParams.toString()}`;
      },
      providesTags: ['Programs'],
    }),
    getPublicProgramById: builder.query<{ success: boolean; data: Program }, string>({
      query: (id) => `/programs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Programs' as const, id }],
    }),
    deleteProgram: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/programs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Programs'],
    }),
  }),
});

export const {
  useGetProgramsQuery,
  useGetPublicProgramsQuery,
  useGetPublicProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programApi;
