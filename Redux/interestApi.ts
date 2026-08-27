// interestApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Profile } from "./profileApi";

export interface SendInterestRequest {
  receiverId: string;
}

export type InterestStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface InterestEntry {
  _id: string;
  senderId: string;
  receiverId: string;
  status: InterestStatus;
  sender?: Profile;
  receiver?: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface InterestListResponse {
  success: boolean;
  data: InterestEntry[];
}

export interface InterestEntryResponse {
  success: boolean;
  message?: string;
  data: InterestEntry;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const interestApi = createApi({
  reducerPath: "interestApi",
  tagTypes: ["Interest"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendInterest: builder.mutation<InterestEntryResponse, SendInterestRequest>({
      query: (body) => ({
        url: "/interest",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Interest"],
    }),

    getSentInterests: builder.query<InterestListResponse, void>({
      query: () => "/interest/sent",
      providesTags: ["Interest"],
    }),

    getReceivedInterests: builder.query<InterestListResponse, void>({
      query: () => "/interest/received",
      providesTags: ["Interest"],
    }),

    acceptInterest: builder.mutation<InterestEntryResponse, string>({
      query: (id) => ({
        url: `/interest/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["Interest"],
    }),

    rejectInterest: builder.mutation<InterestEntryResponse, string>({
      query: (id) => ({
        url: `/interest/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Interest"],
    }),

    withdrawInterest: builder.mutation<InterestEntryResponse, string>({
      query: (id) => ({
        url: `/interest/${id}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["Interest"],
    }),
  }),
});

export const {
  useSendInterestMutation,
  useGetSentInterestsQuery,
  useGetReceivedInterestsQuery,
  useAcceptInterestMutation,
  useRejectInterestMutation,
  useWithdrawInterestMutation,
} = interestApi;
