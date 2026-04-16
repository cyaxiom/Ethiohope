import { api } from '../../app/api';

export interface Batch {
  _id: string;
  program: { _id: string; title: string };
  phase: { _id: string; title: string };
  instructor?: { _id: string; firstname: string; lastname: string };
  capacity?: number;
  activeEnrollments?: number;
  batchName: string;
  isActive: boolean;
  schedules?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchPayload {
  program: string;
  phase: string;
  instructor?: string;
  capacity?: number;
  batchName: string;
  isActive: boolean;
}

export interface GetBatchesResponse {
  success: boolean;
  message: string;
  data: Batch[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const batchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBatches: builder.query<GetBatchesResponse, { page: number; limit: number; search?: string }>({
      query: (params) => ({
        url: '/admin/batches',
        params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Batches' as const, id: _id })), { type: 'Batches', id: 'LIST' }]
          : [{ type: 'Batches', id: 'LIST' }],
    }),
    createBatch: builder.mutation<any, CreateBatchPayload>({
      query: (batchData) => ({
        url: '/admin/batches',
        method: 'POST',
        body: batchData,
      }),
      invalidatesTags: [{ type: 'Batches', id: 'LIST' }],
    }),
    updateBatch: builder.mutation<any, { id: string, data: Partial<CreateBatchPayload> }>({
      query: ({ id, data }) => ({
        url: `/admin/batches/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Batches', id: 'LIST' }, { type: 'Batches', id }],
    }),
    deleteBatch: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/batches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Batches', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBatchesQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchApi;
