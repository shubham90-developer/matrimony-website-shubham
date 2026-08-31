// annualIncomeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface AnnualIncome {
  _id: string;
  annualIncome: string;
  isDeleted: boolean;
}

export interface AnnualIncomeListResponse {
  success: boolean;
  count: number;
  data: AnnualIncome[];
}

export const annualIncomeApi = createApi({
  reducerPath: "annualIncomeApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAnnualIncomes: builder.query<AnnualIncomeListResponse, void>({
      query: () => "/admin/annual-income",
    }),
  }),
});

export const { useGetAnnualIncomesQuery } = annualIncomeApi;
