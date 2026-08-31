// subCasteApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
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

export const subCasteApi = createApi({
  reducerPath: "subCasteApi",
  baseQuery: baseQueryWithReauth,
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
