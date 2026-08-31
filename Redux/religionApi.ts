// religionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
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

export const religionApi = createApi({
  reducerPath: "religionApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getReligions: builder.query<ReligionListResponse, void>({
      query: () => "/admin/religion",
    }),
  }),
});

export const { useGetReligionsQuery } = religionApi;
