import { api } from '../../app/api';

export interface Phase {
  _id: string;
  program: string;
  title: string;
  description?: string;
  price?: number;
  durationWeeks?: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhasePayload {
  program: string;
  title: string;
  description?: string;
  price?: number;
  durationWeeks?: number;
  orderIndex: number;
  isActive?: boolean;
}

export interface GetPhasesResponse {
  success: boolean;
  message: string;
  data: Phase[];
}

export const phaseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPhasesByProgram: builder.query<GetPhasesResponse, string>({
      query: (programId) => `/admin/programs/${programId}/phases`,
      providesTags: (result, error, programId) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Phases' as const, id: _id })), { type: 'Phases', id: `LIST_${programId}` }]
          : [{ type: 'Phases', id: `LIST_${programId}` }],
    }),
    getPublicPhasesByProgram: builder.query<GetPhasesResponse, string>({
      query: (programId) => `/programs/${programId}/phases`,
      providesTags: (result, error, programId) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Phases' as const, id: _id })), { type: 'Phases', id: `LIST_${programId}` }]
          : [{ type: 'Phases', id: `LIST_${programId}` }],
    }),
    createPhase: builder.mutation<any, CreatePhasePayload>({
      query: (phaseData) => ({
        url: '/admin/phases',
        method: 'POST',
        body: phaseData,
      }),
      invalidatesTags: (result, error, { program }) => [{ type: 'Phases', id: `LIST_${program}` }],
    }),
    updatePhase: builder.mutation<any, { id: string, data: Partial<CreatePhasePayload>, programId: string }>({
      query: ({ id, data }) => ({
        url: `/admin/phases/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { programId }) => [{ type: 'Phases', id: `LIST_${programId}` }],
    }),
    deletePhase: builder.mutation<any, { id: string, programId: string }>({
      query: ({ id }) => ({
        url: `/admin/phases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { programId }) => [{ type: 'Phases', id: `LIST_${programId}` }],
    }),
  }),
});

export const {
  useGetPhasesByProgramQuery,
  useGetPublicPhasesByProgramQuery,
  useCreatePhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation,
} = phaseApi;
