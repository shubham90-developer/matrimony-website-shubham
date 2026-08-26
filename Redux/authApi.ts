// authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ---------- Types ----------
export interface SendOtpRequest {
  countryCode: string;
  mobile: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface ResendOtpRequest {
  countryCode: string;
  mobile: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface FirebaseUidRequest {
  firebaseUid: string;
}

export interface AuthUser {
  _id: string;
  mobile: string;
  countryCode?: string;
  provider?: string;
  isVerified?: boolean;
  role?: string;
  [key: string]: unknown;
}

// Flat response shape — backend returns tokens directly, no "data" wrapper
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  firebaseToken: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

// ---------- API slice ----------
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<ApiResponse<null>, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    resendOtp: builder.mutation<ApiResponse<null>, ResendOtpRequest>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),

    saveFirebaseUid: builder.mutation<ApiResponse<null>, FirebaseUidRequest>({
      query: (body) => ({
        url: "/auth/firebase-uid",
        method: "POST",
        body,
      }),
    }),

    getCurrentUser: builder.query<ApiResponse<AuthUser>, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useRefreshTokenMutation,
  useSaveFirebaseUidMutation,
  useGetCurrentUserQuery,
} = authApi;
