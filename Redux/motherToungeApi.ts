// motherToungeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface MotherTongue {
  _id: string;
  motherTongue: string;
  isDeleted: boolean;
}

export interface MotherTongueListResponse {
  success: boolean;
  count: number;
  data: MotherTongue[];
}

export const motherTongueApi = createApi({
  reducerPath: "motherTongueApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMotherTongues: builder.query<MotherTongueListResponse, void>({
      query: () => "/admin/mother-tongue",
    }),
  }),
});

export const { useGetMotherTonguesQuery } = motherTongueApi;
