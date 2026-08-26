// occupationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Occupation {
  _id: string;
  occupation: string;
  isDeleted: boolean;
}

export interface OccupationListResponse {
  success: boolean;
  count: number;
  data: Occupation[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const occupationApi = createApi({
  reducerPath: "occupationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getOccupations: builder.query<OccupationListResponse, void>({
      query: () => "/admin/occupation",
    }),
  }),
});

export const { useGetOccupationsQuery } = occupationApi;
