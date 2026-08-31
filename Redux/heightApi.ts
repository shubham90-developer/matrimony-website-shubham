// heightApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
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

export const heightApi = createApi({
  reducerPath: "heightApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getHeights: builder.query<HeightListResponse, void>({
      query: () => "/admin/height",
    }),
  }),
});

export const { useGetHeightsQuery } = heightApi;
