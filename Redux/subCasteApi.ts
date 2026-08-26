// subCasteApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ReligionRef {
  _id: string;
  religion: string;
}

export interface CasteRef {
  _id: string;
  caste: string;
}

export interface SubCaste {
  _id: string;
  religionId: ReligionRef;
  casteId: CasteRef;
  subCaste: string;
  isDeleted: boolean;
}

export interface SubCasteListResponse {
  success: boolean;
  count: number;
  data: SubCaste[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const subCasteApi = createApi({
  reducerPath: "subCasteApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getSubCastes: builder.query<SubCasteListResponse, void>({
      query: () => "/admin/sub-caste",
    }),

    // Cascading: only sub-castes belonging to the selected caste
    getSubCastesByCaste: builder.query<SubCasteListResponse, string>({
      query: (casteId) => `/admin/sub-caste/caste/${casteId}`,
    }),
  }),
});

export const { useGetSubCastesQuery, useGetSubCastesByCasteQuery } =
  subCasteApi;
