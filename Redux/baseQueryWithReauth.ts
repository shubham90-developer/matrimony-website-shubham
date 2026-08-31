// baseQueryWithReauth.ts
import {
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi, BaseQueryFn } from "@reduxjs/toolkit/query";

// ---------- Base URL (same pattern as your other *Api.ts files) ----------

// Shape returned by POST /auth/refresh-token (matches RefreshTokenResponse in authApi.ts)
interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}
// ---------- Plain base query (same prepareHeaders logic used everywhere) ----------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Prevents multiple simultaneous refresh calls if several requests
// 401 at the same time (e.g. a page fires 3 queries in parallel).
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(api: BaseQueryApi, extraOptions: object) {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return false;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh-token",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (refreshResult.data) {
    const { accessToken, refreshToken: newRefreshToken } =
      refreshResult.data as RefreshTokenResponse;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return true;
  }

  // Refresh token itself is invalid/expired -> force logout
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return false;
}

// ---------- Wrapper: use this as `baseQuery` in every *Api.ts slice ----------
export const baseQueryWithReauth: BaseQueryFn<
  Parameters<typeof rawBaseQuery>[0],
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // De-dupe concurrent refresh attempts
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken(api, extraOptions).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      // retry the original request with the new access token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Optional: redirect to login on hard refresh failure
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};
