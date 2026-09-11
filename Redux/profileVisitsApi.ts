// profileVisitApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BasicDetails,
  EducationDetails,
  LocationDetails,
} from "./profileApi";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface RecordProfileVisitRequest {
  visitedProfileId: string;
}

// The viewer/visited side of a visit record only ever comes back with this
// slim shape (not the full Profile), per the API's actual response.
export interface VisitProfileSummary {
  _id: string;
  basicDetails?: Pick<BasicDetails, "firstName" | "lastName">;
  educationDetails?: Pick<EducationDetails, "highestQualification">;
  locationDetails?: Pick<LocationDetails, "city" | "state">;
  photos?: string[];
  matrimonyId?: string;
}

export interface ProfileVisitEntry {
  _id: string;
  viewerProfileId: VisitProfileSummary | string;
  visitedProfileId: VisitProfileSummary | string;
  createdAt: string;
}

export interface ProfileVisitListResponse {
  success: boolean;
  data: ProfileVisitEntry[];
}

export interface RecordProfileVisitResponse {
  success: boolean;
  message?: string;
  data?: ProfileVisitEntry;
}

export const profileVisitApi = createApi({
  reducerPath: "profileVisitApi",
  tagTypes: ["ProfileVisit"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    recordProfileVisit: builder.mutation<
      RecordProfileVisitResponse,
      RecordProfileVisitRequest
    >({
      query: (body) => ({
        url: "/profile-visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProfileVisit"],
    }),

    // Profiles the logged-in user has visited
    getVisitedProfiles: builder.query<ProfileVisitListResponse, void>({
      query: () => "/profile-visits/visited",
      providesTags: ["ProfileVisit"],
    }),

    // Users who visited the logged-in user's profile ("Viewed You")
    getProfileVisitors: builder.query<ProfileVisitListResponse, void>({
      query: () => "/profile-visits/visitors",
      providesTags: ["ProfileVisit"],
    }),
  }),
});

export const {
  useRecordProfileVisitMutation,
  useGetVisitedProfilesQuery,
  useGetProfileVisitorsQuery,
} = profileVisitApi;
