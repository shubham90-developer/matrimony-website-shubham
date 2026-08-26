// religionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Religion {
  _id: string;
  religion: string;
  isDeleted: boolean;
}

export interface ReligionListResponse {
  success: boolean;
  count: number;
  data: Religion[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const religionApi = createApi({
  reducerPath: "religionApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getReligions: builder.query<ReligionListResponse, void>({
      query: () => "/admin/religion",
    }),
  }),
});

export const { useGetReligionsQuery } = religionApi;
