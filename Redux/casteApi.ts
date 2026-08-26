// casteApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const casteApi = createApi({
  reducerPath: "casteApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
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
