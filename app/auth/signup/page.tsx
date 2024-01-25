"use client";
import React from "react";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import OnBoardingLayout from "@/components/Layout/OnBoarding/OnBoarding";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { APP_ROUTES } from "@/utils/routes";
import SignUpFormComponent from "@/components/Forms/SignUpForm";

const SignUpPage = () => {
  return (
    <OnBoardingLayout>
      <SectionTitlesOneComponent
        title="Sign up for TrueFeel"
        content={null}
        node={
          <Box>
            <Typography variant="body1">
              From enrollment through study completion we will be there along
              the way.
            </Typography>
            <Typography mt={2} variant="body1" width="90%">
              Already have a TrueFeel account?{" "}
              <Link href={APP_ROUTES.LOGIN}>Sign in</Link>
            </Typography>
          </Box>
        }
      />
      <Box mt={3}>
        <SignUpFormComponent/>
      </Box>
    </OnBoardingLayout>
  );
};

export default SignUpPage;
