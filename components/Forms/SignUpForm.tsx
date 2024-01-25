"use client";
import React, { useEffect, useState } from "react";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { isValidPassword } from "@/utils/validations";
import { useSignUpUserMutation } from "@/redux/api/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { AUTH_API_STATUS, AUTH_STATUS } from "@/utils/constants";
import Link from "next/link";
import LoadingButtonComponent from "../Common/Buttons/LoadingButton/LoadingButton";
import { signIn } from "next-auth/react";

const SignUpFormComponent = () => {
  const { control, handleSubmit, getValues } = useForm();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [signUpUser, { isLoading, isSuccess, isError, error }] =
    useSignUpUserMutation();
  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  // Auto login
  const autoLogin = async () => {
    const { email, password } = getValues();
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (response?.error) {
      if (response?.error === AUTH_STATUS.FETCH_ERROR) {
        toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
        router.push(APP_ROUTES.LOGIN);
      } else {
        toast.error(response?.error);
        router.push(APP_ROUTES.LOGIN);
      }
    } else {
      router.push(APP_ROUTES.VERIFICATION);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(AUTH_API_STATUS.USER_REGISTRAION_SUCCESSFULL);
      autoLogin();
    }
    if (isError) {
      if ((error as any).status === AUTH_STATUS.FETCH_ERROR) {
        toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
      } else {
        toast.error(AUTH_API_STATUS.USER_EMAIL_EXIST);
      }
    }
  }, [isLoading]);

  const onSubmit = async (data: any) => {
    await signUpUser({
      ...data,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextInputFieldComponent
          id="email-input"
          label="Email"
          defaultValue=""
          name="email"
          control={control}
          rules={{
            required: "Email address is required",
          }}
          textFieldProps={{
            fullWidth: true,
            placeholder: "Email Address",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInputFieldComponent
          id="password-input"
          label="Password"
          defaultValue=""
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            validate: isValidPassword,
          }}
          textFieldProps={{
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggle}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
            fullWidth: true,
            type: showPassword ? "text" : "password",
            placeholder: "Password",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingButtonComponent
          size="large"
          onClick={handleSubmit(onSubmit)}
          fullWidth={true}
          disabled={isLoading}
          showloading={isLoading}
        >
          Next
        </LoadingButtonComponent>
      </Grid>
      <Grid item xs={12}>
        <Typography align="left" variant="body2">
          By continuing, you agree to TrueFeel’s <Link href="/"> Terms </Link>
          and
          <Link href="/"> Privacy Policy.</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SignUpFormComponent;
