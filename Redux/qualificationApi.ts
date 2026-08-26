// qualificationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const qualificationApi = createApi({
  reducerPath: "qualificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getQualifications: builder.query<QualificationListResponse, void>({
      query: () => "/admin/qualification",
    }),
  }),
});

export const { useGetQualificationsQuery } = qualificationApi;
