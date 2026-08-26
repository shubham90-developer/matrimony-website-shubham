// annualIncomeApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const annualIncomeApi = createApi({
  reducerPath: "annualIncomeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getAnnualIncomes: builder.query<AnnualIncomeListResponse, void>({
      query: () => "/admin/annual-income",
    }),
  }),
});

export const { useGetAnnualIncomesQuery } = annualIncomeApi;
