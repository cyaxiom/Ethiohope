import { api } from '../../app/api';

export interface Batch {
  _id: string;
  program: string;
  phase: string;
  instructor?: any;
  capacity?: number;
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
    getPublicBatchesByPhase: builder.query<GetBatchesResponse, string>({
      query: (phaseId) => `/programs/phases/${phaseId}/batches`,
    }),
  }),
});

export const {
  useGetPublicBatchesByPhaseQuery,
} = batchApi;
