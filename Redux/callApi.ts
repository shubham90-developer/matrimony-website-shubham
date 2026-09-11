// callApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export type CallType = "voice" | "video";
export type CallStatus =
  | "ringing"
  | "answered"
  | "rejected"
  | "ended"
  | "missed";

export interface GetCallTokenRequest {
  receiverId: string;
  callType?: CallType;
}

export interface CallTokenData {
  token: string;
  appId: number;
  roomId: string;
  userId: string;
  callType: CallType;
  expiresIn: number;
}

export interface GetCallTokenResponse {
  success: boolean;
  message?: string;
  data: CallTokenData;
}

export interface UpdateCallRequest {
  callId: string;
  senderId: string;
  receiverId: string;
  callType: CallType;
  status: CallStatus;
  duration?: number;
  endedBy?: string;
}

export interface UpdateCallResponse {
  success: boolean;
  message?: string;
}

export const callApi = createApi({
  reducerPath: "callApi",
  tagTypes: ["Call"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Hits POST /v1/api/call/token — backend checks Package.callLimit /
    // dailyCallLimit before returning a Zego token. Errors (403 = limit
    // reached) come back with { success: false, message } so the caller
    // can show an "upgrade your package" prompt.
    getCallToken: builder.mutation<GetCallTokenResponse, GetCallTokenRequest>({
      query: (body) => ({
        url: "/call/token",
        method: "POST",
        body,
      }),
    }),

    // Hits the existing POST /v1/api/call/update — used to log every
    // stage of the call (ringing/answered/rejected/missed/ended) into
    // Firestore call history, same as before this change.
    updateCall: builder.mutation<UpdateCallResponse, UpdateCallRequest>({
      query: (body) => ({
        url: "/call/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Call"],
    }),
  }),
});

export const { useGetCallTokenMutation, useUpdateCallMutation } = callApi;
