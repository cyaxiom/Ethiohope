import { api } from '../../app/api';

export interface CompletedLesson {
  courseId: string;
  weekIndex: number;
  lessonIndex: number;
  videoIndex: number;
  completedAt: string;
}

export interface Progress {
  _id: string;
  enrollment: string;
  child: string;
  program: string;
  phase: string;
  completedLessons: CompletedLesson[];
  percentage: number;
  lastUpdated: string;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  data: Progress;
}

export const progressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProgress: builder.query<ProgressResponse, string>({
      query: (enrollmentId) => `/progress/${enrollmentId}`,
      providesTags: (result, error, id) => [{ type: 'Progress', id }],
    }),
    completeLesson: builder.mutation<ProgressResponse, { enrollmentId: string; courseId: string; weekIndex: number; lessonIndex: number; videoIndex: number }>({
      query: (body) => ({
        url: '/progress/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { enrollmentId }) => [{ type: 'Progress', id: enrollmentId }],
    }),
  }),
});

export const {
  useGetProgressQuery,
  useCompleteLessonMutation,
} = progressApi;
