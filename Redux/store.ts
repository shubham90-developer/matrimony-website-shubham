// store.ts
import { configureStore } from "@reduxjs/toolkit";

import { heightApi } from "./heightApi";
import { qualificationApi } from "./qualificationApi";
import { occupationApi } from "./occupationApi";
import { annualIncomeApi } from "./annualIncomeApi";
import { religionApi } from "./religionApi";
import { casteApi } from "./casteApi";
import { subCasteApi } from "./subCasteApi";
import { motherTongueApi } from "./motherToungeApi";
import { profileApi } from "./profileApi";
import { shortlistApi } from "./shortlistApi";
import { interestApi } from "./interestApi";

export const store = configureStore({
  reducer: {
    [heightApi.reducerPath]: heightApi.reducer,
    [qualificationApi.reducerPath]: qualificationApi.reducer,
    [occupationApi.reducerPath]: occupationApi.reducer,
    [annualIncomeApi.reducerPath]: annualIncomeApi.reducer,
    [religionApi.reducerPath]: religionApi.reducer,
    [casteApi.reducerPath]: casteApi.reducer,
    [subCasteApi.reducerPath]: subCasteApi.reducer,
    [motherTongueApi.reducerPath]: motherTongueApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [shortlistApi.reducerPath]: shortlistApi.reducer,
    [interestApi.reducerPath]: interestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      heightApi.middleware,
      qualificationApi.middleware,
      occupationApi.middleware,
      annualIncomeApi.middleware,
      religionApi.middleware,
      casteApi.middleware,
      subCasteApi.middleware,
      motherTongueApi.middleware,
      profileApi.middleware,
      shortlistApi.middleware,
      interestApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
