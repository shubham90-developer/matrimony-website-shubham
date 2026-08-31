// qualificationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface Qualification {
  _id: string;
  qualification: string;
  educationType?: string;
  isDeleted: boolean;
}

export interface QualificationListResponse {
  success: boolean;
  count: number;
  data: Qualification[];
}

export const qualificationApi = createApi({
  reducerPath: "qualificationApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getQualifications: builder.query<QualificationListResponse, void>({
      query: () => "/admin/qualification",
    }),
  }),
});

export const { useGetQualificationsQuery } = qualificationApi;
