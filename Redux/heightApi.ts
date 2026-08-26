// heightApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Height {
  _id: string;
  height: string;
  isDeleted: boolean;
}

export interface HeightListResponse {
  success: boolean;
  count: number;
  data: Height[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const heightApi = createApi({
  reducerPath: "heightApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getHeights: builder.query<HeightListResponse, void>({
      query: () => "/admin/height",
    }),
  }),
});

export const { useGetHeightsQuery } = heightApi;
