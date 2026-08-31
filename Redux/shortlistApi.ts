// shortlistApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Profile } from "./profileApi";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface AddShortlistRequest {
  shortlistedUserId: string;
}

export interface ShortlistEntry {
  _id: string;
  shortlistedUserId: string;
  profile?: Profile;
  createdAt: string;
}

export interface ShortlistListResponse {
  success: boolean;
  data: ShortlistEntry[];
}

export interface ShortlistEntryResponse {
  success: boolean;
  message?: string;
  data: ShortlistEntry;
}

export interface ShortlistActionResponse {
  success: boolean;
  message?: string;
}

export const shortlistApi = createApi({
  reducerPath: "shortlistApi",
  tagTypes: ["Shortlist"],

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    addToShortlist: builder.mutation<
      ShortlistEntryResponse,
      AddShortlistRequest
    >({
      query: (body) => ({
        url: "/shortlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shortlist"],
    }),

    getMyShortlist: builder.query<ShortlistListResponse, void>({
      query: () => "/shortlist",
      providesTags: ["Shortlist"],
    }),

    getWhoShortlistedMe: builder.query<ShortlistListResponse, void>({
      query: () => "/shortlist/who-shortlisted-me",
      providesTags: ["Shortlist"],
    }),

    getShortlistedProfileById: builder.query<ShortlistEntryResponse, string>({
      query: (id) => `/shortlist/${id}`,
      providesTags: (result, error, id) => [{ type: "Shortlist", id }],
    }),

    removeFromShortlist: builder.mutation<ShortlistActionResponse, string>({
      query: (id) => ({
        url: `/shortlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shortlist"],
    }),
  }),
});

export const {
  useAddToShortlistMutation,
  useGetMyShortlistQuery,
  useGetWhoShortlistedMeQuery,
  useGetShortlistedProfileByIdQuery,
  useRemoveFromShortlistMutation,
} = shortlistApi;
