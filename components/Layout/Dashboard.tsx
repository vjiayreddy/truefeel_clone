"use client";
import React, { Fragment } from "react";
import NavigationHeaderComponent from "../Common/NavigationHeader/NavigationHeader";
import { StyledRenderedContentWrapper } from "./styled";

interface DashboardLayoutComponentProps {
  children: React.ReactNode;
}

const DashboardLayoutComponent = ({
  children,
}: DashboardLayoutComponentProps) => {
  return (
    <Fragment>
      <NavigationHeaderComponent />
      <StyledRenderedContentWrapper>{children}</StyledRenderedContentWrapper>
    </Fragment>
  );
};

export default DashboardLayoutComponent;
