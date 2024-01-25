"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import LoadingButtonComponent from "@/components/Common/Buttons/LoadingButton/LoadingButton";

const StyledMainBox = styled(Box)(() => ({
  height: "100vh",
  display: "flex",

  flexDirection: "column",
  "& .__main_content_wrapper": {
    flexGrow: 1,
    padding: `50px 20px`,
  },
  "& .__footer_wrapper": {
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
}));

const WelcomePage = () => {
  const router = useRouter();
  return (
    <StyledMainBox>
      <Box component="div" className="__main_content_wrapper">
        <SectionTitlesOneComponent
          title="Hi and welcome to TrueFeel!"
          content="Let’s take a few minutes to get you setup. Make sure you’re in a quiet space and ready for a few simple steps."
        />
      </Box>
      <Box component="div" className="__footer_wrapper">
        <Box width="100%">
          <Grid
            container
            alignItems="stretch"
            justifyContent="center"
            flexDirection="column"
          >
            <Grid item xs={12}>
              <LoadingButtonComponent
                onClick={() => router.push(APP_ROUTES.SIGN_UP)}
                size="large"
              >
                Get Started
              </LoadingButtonComponent>
            </Grid>
            <Grid item xs={12}>
              <Box mt={1}>
                <LoadingButtonComponent
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={() => router.push(APP_ROUTES.LOGIN)}
                >
                  I already have an account
                </LoadingButtonComponent>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </StyledMainBox>
  );
};

export default WelcomePage;
