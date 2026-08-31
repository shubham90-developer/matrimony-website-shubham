// occupationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
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

export const occupationApi = createApi({
  reducerPath: "occupationApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOccupations: builder.query<OccupationListResponse, void>({
      query: () => "/admin/occupation",
    }),
  }),
});

export const { useGetOccupationsQuery } = occupationApi;
