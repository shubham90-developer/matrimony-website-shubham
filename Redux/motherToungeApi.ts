// motherToungeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const motherTongueApi = createApi({
  reducerPath: "motherTongueApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getMotherTongues: builder.query<MotherTongueListResponse, void>({
      query: () => "/admin/mother-tongue",
    }),
  }),
});

export const { useGetMotherTonguesQuery } = motherTongueApi;
