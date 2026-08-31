// interestApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Profile } from "./profileApi";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface SendInterestRequest {
  receiverId: string;
}

export type InterestStatus = "Pending" | "Accepted" | "Rejected" | "Withdrawn";
export interface InterestEntry {
  _id: string;
  senderId: Profile;
  receiverId: Profile;
  status: InterestStatus;
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

export const interestApi = createApi({
  reducerPath: "interestApi",
  tagTypes: ["Interest"],
  baseQuery: baseQueryWithReauth,
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
