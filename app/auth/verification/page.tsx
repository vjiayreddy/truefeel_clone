"use client";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import OnBoardingLayout from "@/components/Layout/OnBoarding/OnBoarding";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { APP_ROUTES } from "@/utils/routes";
import LoadingButtonComponent from "@/components/Common/Buttons/LoadingButton/LoadingButton";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/api/authApi";
import { toast } from "react-toastify";
import { AUTH_API_STATUS } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { APP_COLORS } from "@/theme/colors";

const VerificationPage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isSendOtpLoading }] = useSendOtpMutation();

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({
        to: session?.user?.email as string,
        action: "otpVerifyEmail",
        otp,
      });
      if ((response as any)?.data.status === "success") {
        update({
          ...session,
          user: {
            ...session?.user,
            isEmailVerified: true,
          },
        });
        toast.success(AUTH_API_STATUS.OTP_VERIFICATION_SUCCESS);
        router.push(`${APP_ROUTES.CREATE_PROFILE}`);
      } else {
        toast.error(
          `The one-time password (OTP) you entered is invalid or has expired.`
        );
      }
    } catch (error) {
      if (
        (error as any)?.data?.message === "Either otp generated or expired!!"
      ) {
        toast.error("The one-time password (OTP) you received has expired");
      }
    }
  };

  const handleSentOtp = async () => {
    try {
      const response = await sendOtp({
        to: session?.user?.email as string,
        action: "otpVerifyEmail",
      }).unwrap();
      if ((response as any)?.status === "success") {
        toast.success(
          `We have sent a one-time password (OTP) to your ${session?.user?.email} registered email address.`
        );
      }
    } catch (error) {
      toast.error(
        "We encountered an issue and couldn't send the one-time password (OTP) to your registered email address"
      );
    }
  };

  return (
    <OnBoardingLayout>
      <SectionTitlesOneComponent
        title="Verify your email"
        content={null}
        node={
          <Box>
            <Typography variant="body1">
              Enter the 6-digit code sent to {session?.user?.email}.
            </Typography>
          </Box>
        }
      />
      <Box mt={4} mb={3}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={null}
          renderInput={(props) => <input {...props} className="otp-input" />}
        />
      </Box>
      <Box mb={2}>
        <LoadingButtonComponent
          size="large"
          onClick={handleVerifyOtp}
          fullWidth={true}
          disabled={isVerifyOtpLoading || otp.length < 6}
          showloading={isVerifyOtpLoading}
        >
          Verify
        </LoadingButtonComponent>
      </Box>
      <Box mb={2}>
        <LoadingButtonComponent
          size="large"
          onClick={handleSentOtp}
          fullWidth={true}
          variant="outlined"
          disabled={isSendOtpLoading}
          dotColor={APP_COLORS.PRIMARY_COLOR}
          showloading={isSendOtpLoading}
        >
          Send New Code
        </LoadingButtonComponent>
      </Box>
    </OnBoardingLayout>
  );
};

export default VerificationPage;
