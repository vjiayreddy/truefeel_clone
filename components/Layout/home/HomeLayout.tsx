"use client";
import React, { Fragment } from "react";
import BottomNavigationComponent, {
  BottomNavigationComponentProps,
} from "./BottomNavigation";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { APP_BAR_SIZE, BOTTOM_NAVIGATION_SIZE } from "@/utils/constants";
import AppBarComponent from "./AppBar";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors";
import { shouldForwardProp } from "@/utils/actions";

interface HomeLayoutProps {
  children: React.ReactNode;
  bottomNavigationProps?: BottomNavigationComponentProps;
  loading?: boolean;
  showAppBar?: boolean;
  showBottomNavigation?: boolean;
}

const StyledDefaultLayout = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ showAppBar: boolean; showBottomNavigation: boolean }>(
      ["showAppBar", "showBottomNavigation"],
      prop
    ),
})<{ showAppBar: boolean; showBottomNavigation: boolean }>(
  ({ theme, showAppBar, showBottomNavigation }) => ({
    height: "100vh",
    ...(showAppBar &&
      showBottomNavigation && {
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE + APP_BAR_SIZE}px)`,
      }),
    ...(showAppBar &&
      !showBottomNavigation && {
        height: `calc(100vh - ${APP_BAR_SIZE}px)`,
      }),
    ...(!showAppBar &&
      showBottomNavigation && {
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE}px)`,
      }),
    overflow: "auto",
    position: "relative",
    "& .__loading_indicator": {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const HomeLayout = ({
  children,
  bottomNavigationProps,
  loading,
  showAppBar = true,
  showBottomNavigation = true,
}: HomeLayoutProps) => {
  return (
    <Fragment>
      {showAppBar && <AppBarComponent />}
      <StyledDefaultLayout
        showAppBar={showAppBar}
        showBottomNavigation={showBottomNavigation}
      >
        {loading && (
          <Box component="div" className="__loading_indicator">
            <ThreeDots
              height="40"
              width="40"
              radius="9"
              color={APP_COLORS.PRIMARY_COLOR}
              ariaLabel="loading"
              wrapperStyle={{}}
              visible={true}
            />
          </Box>
        )}
        {!loading && <>{children}</>}
      </StyledDefaultLayout>
      {showBottomNavigation && (
        <BottomNavigationComponent {...bottomNavigationProps} />
      )}
    </Fragment>
  );
};

export default HomeLayout;
