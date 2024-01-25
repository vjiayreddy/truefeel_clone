"use client";
import React, { useState } from "react";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { isValidPassword, isValidateEmail } from "@/utils/validations";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import LoadingButtonComponent from "../Common/Buttons/LoadingButton/LoadingButton";
const SignInForm = () => {
  const { control, handleSubmit } = useForm();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: any) => {
    setIsSubmit(true);
    const response: any = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (response?.error) {
      setIsSubmit(false);
      toast.error(response?.error);
    } else {
      setIsSubmit(false);
      router.push(APP_ROUTES.HOME);
    }
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
            validate: isValidateEmail,
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
            //validate: isValidPassword,
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
          disabled={isSubmit}
          showloading={isSubmit}
        >
          Login
        </LoadingButtonComponent>
      </Grid>
    </Grid>
  );
};

export default SignInForm;
