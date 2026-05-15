import { api } from "../../app/api";

export const generalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<{ success: boolean; message: string }, { name: string; email: string; message: string }>({
      query: (body) => ({
        url: "/general/contact",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitContactFormMutation } = generalApi;
