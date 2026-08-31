// casteApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface ReligionRef {
  _id: string;
  religion: string;
}

export interface Caste {
  _id: string;
  religionId: ReligionRef;
  caste: string;
  isDeleted: boolean;
}

export interface CasteListResponse {
  success: boolean;
  count: number;
  data: Caste[];
}

export const casteApi = createApi({
  reducerPath: "casteApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCastes: builder.query<CasteListResponse, void>({
      query: () => "/admin/caste",
    }),

    // Cascading: only castes belonging to the selected religion
    getCastesByReligion: builder.query<CasteListResponse, string>({
      query: (religionId) => `/admin/caste/religion/${religionId}`,
    }),
  }),
});

export const { useGetCastesQuery, useGetCastesByReligionQuery } = casteApi;
