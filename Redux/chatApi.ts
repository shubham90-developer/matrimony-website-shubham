// chatApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ChatParticipant {
  profileId: string;
  firebaseUid?: string | null;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profilePhoto?: string | null;
  mobile?: string | null;
  countryCode?: string | null;
  subscription?: {
    isActive: boolean;
    packageId?: string;
    expiryDate?: string;
  };
}

export interface ChatRoom {
  roomId: string;
  participant: ChatParticipant;
  lastMessage?: string;
  lastMessageType?: string;
  lastMessageSender?: string;
  lastMessageAt?: string | { _seconds: number; _nanoseconds: number } | null;
  isActive?: boolean;
  interestId?: string;
}

export interface GetChatsResponse {
  success: boolean;
  message?: string;
  data: ChatRoom[];
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Chat"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getChats: builder.query<GetChatsResponse, void>({
      query: () => "/chat/get-chats",
      providesTags: ["Chat"],
    }),
  }),
});

export const { useGetChatsQuery } = chatApi;
