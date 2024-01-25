"use client";
import React, { Fragment, ReactNode } from "react";
interface AuthLayoutProps {
  children: ReactNode;
}
const AuthLayout = ({ children, ...props }: AuthLayoutProps) => {
  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;
