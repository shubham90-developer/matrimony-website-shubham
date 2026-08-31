// authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// ---------- Types ----------
export interface SendOtpRequest {
  countryCode: string;
  mobile: string;
}

// Matches Swagger: POST /v1/api/auth/verify-otp expects
// { mobile, countryCode, token }
// "mobile" is the raw 10-digit number, e.g. "9876543210"
// "countryCode" is e.g. "+91"
// "token" is the Firebase ID token from confirmationResult.confirm(otp)
export interface VerifyOtpRequest {
  mobile: string;
  countryCode: string;
  token: string;
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

// Matches Swagger 200 response shape exactly — no firebaseToken field
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
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

// ---------- API slice ----------
export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    sendOtp: builder.mutation<ApiResponse<null>, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    // Verifies the Firebase ID token on the backend (Swagger: verify-otp)
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
