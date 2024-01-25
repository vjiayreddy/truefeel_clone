"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { protocolApi } from "../api/protocolApi";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { patientApi } from "../api/patientsApi";
import { assessmentApi } from "../api/assesmentsApi";
import { assessmentSlice } from "../reducers/assessmentSlice";
import { diaryCheckingsSlice } from "../reducers/diaryCheckingsSlice";
import { homeAssessmentsSlice } from "../reducers/homeAssessmentsSlice";
import { mediaUploadSlice } from "../reducers/mediaUploadSlice";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [protocolApi.reducerPath]: protocolApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
  assessmentSlice: assessmentSlice.reducer,
  diaryCheckingsSlice: diaryCheckingsSlice.reducer,
  homeAssessmentsSlice: homeAssessmentsSlice.reducer,
  mediaUploadSlice: mediaUploadSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      protocolApi.middleware,
      patientApi.middleware,
      assessmentApi.middleware,
    ]),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
