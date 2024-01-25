"use client";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import OnBoardingLayout from "@/components/Layout/OnBoarding/OnBoarding";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import {
  Box,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { APP_ROUTES } from "@/utils/routes";
import DatePickerInputFieldComponent from "@/components/formFields/datePickerInputField";
import SelectInputFieldComponent from "@/components/formFields/selectInputField";
import { AUTH_API_STATUS, AUTH_STATUS, GENDER } from "@/utils/constants";
import { feetAndInchesToCentimeters } from "@/utils/actions";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import LoadingButtonComponent from "@/components/Common/Buttons/LoadingButton/LoadingButton";

const CreateProfilePage = () => {
  const { control, handleSubmit, getValues } = useForm();
  const { data: session, update } = useSession();
  const [updateProfile, { isLoading, isError, isSuccess, error }] =
    useUpdateProfileMutation();

  // Submit handler function
  const onSubmit = async (data: any) => {
    const payload = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      dateOfBirth: moment(new Date(data?.dateOfBirth)).format("DD-MM-YYYY"),
      gender: data?.gender,
      weight: data?.weight ? Number(data?.weight) : null,
      height: feetAndInchesToCentimeters(
        Number(data?.feet),
        Number(data?.inches)
      ),
    };
    await updateProfile({
      userId: session?.user?.id as string,
      body: payload,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const formValues = getValues();
      update({
        ...session,
        user: {
          ...session?.user,
          isProfileCompleted: true,
          ...formValues,
        },
      });
      toast.success(AUTH_API_STATUS.PROFILE_UPDATED_SUCCESS_MESSAGE);
      redirect(APP_ROUTES.HOME);
    }
    if (isError) {
      if ((error as any).status === AUTH_STATUS.FETCH_ERROR) {
        toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
      } else {
        toast.error(AUTH_API_STATUS.PROFILE_NOT_UPDATED);
      }
    }
  }, [isLoading]);

  return (
    <OnBoardingLayout
      footerNode={
        <>
          <Divider />
          <Box p={2}>
            <LoadingButtonComponent
              size="large"
              onClick={handleSubmit(onSubmit)}
              fullWidth={true}
              disabled={isLoading}
              showloading={isLoading}
            >
              Continue
            </LoadingButtonComponent>
          </Box>
        </>
      }
    >
      <SectionTitlesOneComponent
        title="Complete your profile"
        content={null}
        node={
          <Box>
            <Typography variant="body1">
              Add details for your profile linked to{" "}
              <b>{session?.user?.email}</b>. Your health details are the basic
              information the app needs to provide you with relevant
              information.
            </Typography>
            <Typography mt={1} variant="body1" width="90%">
              Already have a TrueFeel account?{" "}
              <Link href={APP_ROUTES.LOGIN}>Sign in</Link>
            </Typography>
          </Box>
        }
      />
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="first-name"
              name="firstName"
              label="First Name"
              defaultValue={""}
              control={control}
              rules={{
                required: "First Name is required",
              }}
              textFieldProps={{ size: "small", fullWidth: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="last-name"
              name="lastName"
              label="Last Name"
              defaultValue={""}
              control={control}
              rules={{
                required: "Last Name is required",
              }}
              textFieldProps={{ size: "small", fullWidth: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePickerInputFieldComponent
              control={control}
              name="dateOfBirth"
              label="Birthday (MM/DD/YYYY)"
              defaultValue={null}
              rules={{
                required: "Birthday is required",
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectInputFieldComponent
              options={GENDER}
              control={control}
              id="gender"
              label="Sex at birth"
              name="gender"
              defaultValue=""
              rules={{
                required: "Sex at birth is required",
              }}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <FormHelperText>Height (optional)</FormHelperText>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextInputFieldComponent
              id="feet"
              name="feet"
              label=""
              defaultValue={""}
              control={control}
              rules={{
                required: false,
              }}
              textFieldProps={{
                size: "small",
                fullWidth: true,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">ft.</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInputFieldComponent
              id="inches"
              name="inches"
              label=""
              defaultValue={""}
              control={control}
              rules={{
                required: false,
              }}
              textFieldProps={{
                size: "small",
                fullWidth: true,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">in.</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="weight"
              name="weight"
              label="Weight (optional)"
              defaultValue={""}
              control={control}
              rules={{
                required: false,
              }}
              textFieldProps={{
                size: "small",
                fullWidth: true,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">lbs.</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </OnBoardingLayout>
  );
};

export default CreateProfilePage;
