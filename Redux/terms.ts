// termsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface TermsConditions {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TermsConditionsResponse {
  success: boolean;
  message?: string;
  data: TermsConditions;
}

export interface UpsertTermsConditionsRequest {
  title: string;
  content: string;
}

export const termsApi = createApi({
  reducerPath: "termsApi",
  tagTypes: ["Terms"],
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    // GET /v1/api/admin/terms-conditions
    getTermsConditions: builder.query<TermsConditionsResponse, void>({
      query: () => "/admin/terms-conditions",
      providesTags: ["Terms"],
    }),

    // POST /v1/api/admin/terms-conditions (create or update)
    upsertTermsConditions: builder.mutation<
      TermsConditionsResponse,
      UpsertTermsConditionsRequest
    >({
      query: (body) => ({
        url: "/admin/terms-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const { useGetTermsConditionsQuery, useUpsertTermsConditionsMutation } =
  termsApi;
