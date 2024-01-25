"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showPopup: false,
  mediaUploadStatus: {
    progress: 0,
    status: null,
    message: null,
  },
};

export const mediaUploadSlice: any = createSlice({
  name: "mediaUploadSlice",
  initialState,
  reducers: {
    updateAssessmentMediaUploadStatus: (state, action) => {
      state.mediaUploadStatus = {
        ...state.mediaUploadStatus,
        ...action?.payload,
      };
    },
    showUploadPop: (state, action) => {
      state.showPopup = action?.payload;
    },
    resetStateCurrentState: (state, action) => {
      state.mediaUploadStatus.message = null;
      state.mediaUploadStatus.status = null;
      state.mediaUploadStatus.progress = 0;
      state.showPopup = false;
    },
  },
});

export const {
  updateAssessmentMediaUploadStatus,
  resetStateCurrentState,
  showUploadPop,
} = mediaUploadSlice.actions;

export default mediaUploadSlice.reducer;
