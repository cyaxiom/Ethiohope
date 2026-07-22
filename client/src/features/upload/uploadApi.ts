import { api } from '../../app/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, { file: File; category: string }>({
      query: ({ file, category }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/upload/${category}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
