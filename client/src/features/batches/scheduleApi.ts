import { api } from '../../app/api';

export interface Schedule {
  _id: string;
  program?: { _id: string; title: string; ageRange?: string } | string;
  batch: { 
    _id: string; 
    batchName: string;
    program: { _id?: string; title: string };
  };
  sessionLabel: string;
  type: 'LECTURE' | 'DISCUSSION';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulePayload {
  program?: string;
  batch: string;
  sessionLabel: string;
  type: 'LECTURE' | 'DISCUSSION';
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface GetSchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

export const scheduleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<GetSchedulesResponse, { batchId?: string; programId?: string }>({
      query: (params) => ({
        url: '/admin/schedules',
        params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Schedules' as const, id: _id })), { type: 'Schedules', id: 'LIST' }]
          : [{ type: 'Schedules', id: 'LIST' }],
    }),
    createSchedule: builder.mutation<any, CreateSchedulePayload>({
      query: (scheduleData) => ({
        url: '/admin/schedules',
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }],
    }),
    updateSchedule: builder.mutation<any, { id: string, data: Partial<CreateSchedulePayload> }>({
      query: ({ id, data }) => ({
        url: `/admin/schedules/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Schedules', id: 'LIST' }, { type: 'Schedules', id }],
    }),
    deleteSchedule: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;
