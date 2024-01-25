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

export const homeAssessmentsSlice: any = createSlice({
  name: "homeAssessmentsSlice",
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
    showUploadPopup: (state, action) => {
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
  showUploadPopup,
  resetState,
} = homeAssessmentsSlice.actions;
export default homeAssessmentsSlice.reducer;
