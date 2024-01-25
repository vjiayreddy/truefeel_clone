"use client";
import React from "react";
import OnBoardingLayout from "@/components/Layout/OnBoarding/OnBoarding";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import SignInForm from "@/components/Forms/signInForm";
import { Typography } from "@mui/material";
import Link from "next/link";
import { APP_ROUTES } from "@/utils/routes";
const AuthLoginPage = () => {
  return (
    <OnBoardingLayout
      hideBackButton={true}
      footerNode={
        <Box p={3} pb={8}>
          <Divider>New to TrueFeel?</Divider>
          <Box mt={2}>
            <Button size="large"  LinkComponent={Link} href={APP_ROUTES.SIGN_UP} >Create new account</Button>
          </Box>
        </Box>
      }
    >
      <SectionTitlesOneComponent title="Sign-in" content={null} />
      <Box mt={8}>
        <SignInForm />
      </Box>
      <Box mt={2}>
        <Typography variant="body1">
          By continuing, you agree to TrueFeel’s <Link href="/">Terms</Link> and{" "}
          <Link href="/">Privacy Policy.</Link>
        </Typography>
      </Box>
    </OnBoardingLayout>
  );
};

export default AuthLoginPage;
