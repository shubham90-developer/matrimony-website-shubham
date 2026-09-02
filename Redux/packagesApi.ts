// packageApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export type DurationType = "DAY" | "MONTH" | "YEAR";

export interface MembershipPackage {
  _id: string;
  title: string;
  description: string;
  duration: number;
  durationType: DurationType;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  badge?: string;
  features: string[];
  isDeleted: boolean;
  displayOrder: number;
  interestRequestLimit?: number;
  dailyInterestRequestLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageListResponse {
  success: boolean;
  data: MembershipPackage[];
}

export const packageApi = createApi({
  reducerPath: "packageApi",
  tagTypes: ["Package"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // GET /v1/api/admin/package -> all active membership packages
    getPackages: builder.query<PackageListResponse, void>({
      query: () => "/admin/package",
      providesTags: ["Package"],
    }),
  }),
});

export const { useGetPackagesQuery } = packageApi;
