// ignoreApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Profile } from "./profileApi";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
export interface AddIgnoreRequest {
  ignoredUserId: string;
}

export interface IgnoreEntry {
  _id: string;
  ignoredUserId: string;
  profile?: Profile;
  createdAt: string;
}

export interface IgnoreListResponse {
  success: boolean;
  data: IgnoreEntry[];
}

export interface IgnoreEntryResponse {
  success: boolean;
  message?: string;
  data: IgnoreEntry;
}

export interface IgnoreActionResponse {
  success: boolean;
  message?: string;
}

export const ignoreApi = createApi({
  reducerPath: "ignoreApi",
  tagTypes: ["Ignore"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addToIgnore: builder.mutation<IgnoreEntryResponse, AddIgnoreRequest>({
      query: (body) => ({
        url: "/ignore",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ignore"],
    }),

    getMyIgnoredProfiles: builder.query<IgnoreListResponse, void>({
      query: () => "/ignore",
      providesTags: ["Ignore"],
    }),

    getIgnoredProfileById: builder.query<IgnoreEntryResponse, string>({
      query: (id) => `/ignore/${id}`,
      providesTags: (result, error, id) => [{ type: "Ignore", id }],
    }),

    removeFromIgnore: builder.mutation<IgnoreActionResponse, string>({
      query: (id) => ({
        url: `/ignore/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ignore"],
    }),
  }),
});

export const {
  useAddToIgnoreMutation,
  useGetMyIgnoredProfilesQuery,
  useGetIgnoredProfileByIdQuery,
  useRemoveFromIgnoreMutation,
} = ignoreApi;
