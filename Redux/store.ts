// store.ts
import { configureStore } from "@reduxjs/toolkit";

import { heightApi } from "./heightApi";
import { qualificationApi } from "./qualificationApi";
import { occupationApi } from "./occupationApi";
import { annualIncomeApi } from "./annualIncomeApi";

export const store = configureStore({
  reducer: {
    [heightApi.reducerPath]: heightApi.reducer,
    [qualificationApi.reducerPath]: qualificationApi.reducer,
    [occupationApi.reducerPath]: occupationApi.reducer,
    [annualIncomeApi.reducerPath]: annualIncomeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      heightApi.middleware,
      qualificationApi.middleware,
      occupationApi.middleware,
      annualIncomeApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
