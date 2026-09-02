// privacyPolicyApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PrivacyPolicy {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPolicyResponse {
  success: boolean;
  message?: string;
  data: PrivacyPolicy;
}

export interface UpsertPrivacyPolicyRequest {
  title: string;
  content: string;
}

export const privacyPolicyApi = createApi({
  reducerPath: "privacyPolicyApi",
  tagTypes: ["PrivacyPolicy"],
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    // GET /v1/api/admin/privacy-policy
    getPrivacyPolicy: builder.query<PrivacyPolicyResponse, void>({
      query: () => "/admin/privacy-policy",
      providesTags: ["PrivacyPolicy"],
    }),

    // POST /v1/api/admin/privacy-policy (create or update)
    upsertPrivacyPolicy: builder.mutation<
      PrivacyPolicyResponse,
      UpsertPrivacyPolicyRequest
    >({
      query: (body) => ({
        url: "/admin/privacy-policy",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpsertPrivacyPolicyMutation } =
  privacyPolicyApi;
