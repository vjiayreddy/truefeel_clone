"use client";
import TitleAndSubtitle from "@/components/Common/Headings/title-and-subtitle/TitleAndSubtitle";
import DiaryCheckinLayout from "@/components/layouts/assessments/diary-checkin/DiaryCheckin";
import { Box } from "@mui/material";
import React from "react";

const HomePage = () => {
  return (
    <DiaryCheckinLayout
      totalSteps={10}
      currentStep={5}
      onClickBackButton={() => {}}
      onClickCloseIcon={() => {}}
      onClickNextButton={() => {}}
      disabledNextButton={true}
      showInfoView={false}
      showAudioButton={false}
    >
      <Box pl={1} pr={1} mb={2}>
       
      </Box>
    </DiaryCheckinLayout>
  );
};

export default HomePage;
