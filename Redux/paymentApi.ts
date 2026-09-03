// paymentApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

// ---------- create-order ----------
export interface CreateOrderRequest {
  packageId: string;
}

export interface CreateOrderData {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data: CreateOrderData;
}

// ---------- verify ----------
export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// ---------- preview (upgrade proration) ----------
export interface PreviewPaymentRequest {
  profileId: string;
  packageId: string;
}

export interface PreviewPaymentData {
  packageId: string;
  packageName: string;
  packagePrice: number;
  unusedAmount: number;
  remainingDays: number;
  payableAmount: number;
  currency: string;
}

export interface PreviewPaymentResponse {
  success: boolean;
  message?: string;
  data: PreviewPaymentData;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  tagTypes: ["Payment"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // POST /v1/api/payment/create-order
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
    }),

    // POST /v1/api/payment/verify
    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      VerifyPaymentRequest
    >({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    previewPayment: builder.mutation<
      PreviewPaymentResponse,
      PreviewPaymentRequest
    >({
      query: (body) => ({
        url: "/payment/preview",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  usePreviewPaymentMutation,
} = paymentApi;
