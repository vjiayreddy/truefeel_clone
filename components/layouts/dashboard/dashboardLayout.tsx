"use client";
import React, { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { APP_BAR_SIZE, drawerWidth } from "@/utils/constants";
import { shouldForwardProp } from "@/utils/actions";
import AppBarComponent from "./components/appBar";
import SideDrawerComponent from "./components/sideDrawer";

const StyledMainContent = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ isOpen: boolean }>(["isOpen"], prop),
})<{
  isOpen?: boolean;
}>(({ theme, isOpen }) => ({
  backgroundColor:theme.palette.common.white,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  paddingTop: APP_BAR_SIZE,
  height: `calc(100vh - ${APP_BAR_SIZE}px)`,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  ...(isOpen && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDrawer = () => {
    //setOpen(!open);
  };

  return (
    <Fragment>
      <AppBarComponent open={open} onClickMenuIcon={handleDrawer} />
      <SideDrawerComponent open={open} />
      <StyledMainContent isOpen={open}>{children}</StyledMainContent>
    </Fragment>
  );
};

export default DashboardLayout;
