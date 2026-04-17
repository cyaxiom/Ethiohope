import { api } from '../../app/api';

export interface Batch {
  _id: string;
  program: string;

  instructor?: any;
  capacity?: number;
  activeEnrollments?: number;
  batchName: string;
  isActive: boolean;
  schedules?: any[];
}

export interface GetBatchesResponse {
  success: boolean;
  message: string;
  data: Batch[];
}

export const batchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicBatchesByProgram: builder.query<GetBatchesResponse, string>({
      query: (programId) => `/programs/${programId}/batches`,
    }),
  }),
});

export const {
  useGetPublicBatchesByProgramQuery,
} = batchApi;
