"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentQuestion: null,
  showPopup: false,
  audioUploadStatus: {
    progress: 0,
    status: null,
    message: null,
  },
};

export const diaryCheckingsSlice: any = createSlice({
  name: "diaryCheckingsSlice",
  initialState,
  reducers: {
    updateAudioUploadStatus: (state, action) => {
      state.audioUploadStatus = {
        ...state.audioUploadStatus,
        ...action?.payload,
      };
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action?.payload;
    },
    shopUploadPop: (state, action) => {
      state.showPopup = action?.payload;
    },
    resetState: (state, action) => {
      state.audioUploadStatus.message = null;
      state.audioUploadStatus.status = null;
      state.audioUploadStatus.progress = 0;
      state.showPopup = false;
    },
  },
});

export const {
  updateAudioUploadStatus,
  setCurrentQuestion,
  shopUploadPop,
  resetState,
} = diaryCheckingsSlice.actions;
export default diaryCheckingsSlice.reducer;
