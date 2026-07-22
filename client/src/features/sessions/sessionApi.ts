import { api } from '../../app/api';

export interface Session {
  _id: string;
  programId: string | { _id: string; title: string };
  phaseId: string | { _id: string; title: string };
  batchId: string | { _id: string; batchName: string };
  scheduleId?: string | { _id: string; sessionLabel: string };
  sessionType: string;
  title: string;
  description?: string;
  zoomLink?: string;
  join_url?: string;
  zoomLinkJunior?: string;
  joinUrlJunior?: string;
  zoomLinkSenior?: string;
  joinUrlSenior?: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSessionsResponse {
  success: boolean;
  message: string;
  data: Session[];
}

export interface CreateSessionFromSchedulePayload {
  scheduleId: string;
  targetDate: string;
}

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<GetSessionsResponse, void>({
      query: () => '/sessions',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Sessions' as const, id: _id })),
              { type: 'Sessions' as const, id: 'LIST' },
            ]
          : [{ type: 'Sessions' as const, id: 'LIST' }],
    }),
    createSessionFromSchedule: builder.mutation<any, CreateSessionFromSchedulePayload>({
      query: ({ scheduleId, targetDate }) => ({
        url: `/sessions/schedule/${scheduleId}`,
        method: 'POST',
        body: { targetDate },
      }),
      invalidatesTags: [{ type: 'Sessions' as const, id: 'LIST' }],
    }),
    updateSession: builder.mutation<any, { id: string; targetDate: string; scheduleId: string }>({
      query: ({ id, targetDate, scheduleId }) => ({
        url: `/sessions/${id}`,
        method: 'PATCH',
        body: { targetDate, scheduleId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Sessions' as const, id },
        { type: 'Sessions' as const, id: 'LIST' },
      ],
    }),
    deleteSession: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Sessions' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useCreateSessionFromScheduleMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionApi;
