import { api } from '../../app/api';

export interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  videoUrls: CourseVideo[];
  pdfUrl?: string;
}

export interface CourseVideo {
  url: string;
  subtitle?: string;
  description?: string;
}

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Exercise {
  _id?: string;
  title: string;
  questions: Question[];
}

export interface Week {
  _id?: string;
  title: string;
  lessons: Lesson[];
  exercises: Exercise[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  program: { _id: string; title: string };
  phase: { _id: string; title: string };
  weeks: Week[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  thumbnail: string;
  program: string;
  phase: string;
  weeks: Week[];
  isActive?: boolean;
}

export interface GetCoursesResponse {
  success: boolean;
  message: string;
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<GetCoursesResponse, { page: number; limit: number; search?: string; programId?: string; phaseId?: string }>({
      query: (params) => ({
        url: '/admin/courses',
        params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Courses' as const, id: _id })), { type: 'Courses', id: 'LIST' }]
          : [{ type: 'Courses', id: 'LIST' }],
    }),
    getCourseById: builder.query<{ success: boolean; data: Course }, string>({
      query: (id) => `/admin/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),
    getStudentCourses: builder.query<GetCoursesResponse, void>({
      query: () => '/student/courses',
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: 'Courses' as const, id: _id })), { type: 'Courses', id: 'LIST' }]
          : [{ type: 'Courses', id: 'LIST' }],
    }),
    getStudentCourseById: builder.query<{ success: boolean; data: Course; enrollmentId: string }, string>({
      query: (id) => `/student/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),
    createCourse: builder.mutation<any, CreateCoursePayload>({
      query: (courseData) => ({
        url: '/admin/courses',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),
    updateCourse: builder.mutation<any, { id: string; data: Partial<CreateCoursePayload> }>({
      query: ({ id, data }) => ({
        url: `/admin/courses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Courses', id: 'LIST' }, { type: 'Courses', id }],
    }),
    deleteCourse: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetStudentCoursesQuery,
  useGetStudentCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
