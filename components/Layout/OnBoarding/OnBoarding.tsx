"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import WestIcon from "@mui/icons-material/West";
import { useRouter } from "next/navigation";

interface OnBoardingLayoutProps {
  children: React.ReactNode;
  callBackUrl?: string;
  footerNode?: React.ReactNode;
  hideBackButton?: boolean;
}

const StyledMainBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  "& .__header": {
    minHeight: 50,
    padding: 20,
    maxHeight: 50,
    boxSizing: "border-box",
  },
  "& .__content": {
    flexGrow: 1,
    padding: 20,
    overflow: "auto",
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  "& .__footer": {
    minHeight: 50,
  },
}));

const OnBoardingLayout = ({
  children,
  callBackUrl,
  footerNode,
  hideBackButton = false,
}: OnBoardingLayoutProps) => {
  const router = useRouter();
  const handleNavigation = () => {
    if (callBackUrl) {
      router.push(callBackUrl);
    } else {
      router.back();
    }
  };

  return (
    <StyledMainBox>
      <Box component="div" className="__header">
        {!hideBackButton && (
          <IconButton sx={{ padding: 0 }} onClick={handleNavigation}>
            <WestIcon />
          </IconButton>
        )}
      </Box>
      <Box component="div" className="__content">
        {children}
      </Box>
      {footerNode && <>{footerNode}</>}
    </StyledMainBox>
  );
};

export default OnBoardingLayout;
