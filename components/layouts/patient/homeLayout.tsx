import React from "react";
import Container from "@mui/material/Container";
import HomeAppBar from "./homeAppBar";
import HomeBottomNavigation, {
  BottomNavigationComponentProps,
} from "./homeBottomNavigation";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { APP_BAR_SIZE, BOTTOM_NAVIGATION_SIZE } from "@/utils/constants";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors";
import { shouldForwardProp } from "@/utils/actions";

interface UserHomeLayoutProps {
  children: React.ReactNode;
  bottomNavigationProps?: BottomNavigationComponentProps;
  loading?: boolean;
  showAppBar?: boolean;
  showBottomNavigation?: boolean;
}
const StyledUserHomeLayoutContent = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ showAppBar: boolean; showBottomNavigation: boolean }>(
      ["showAppBar", "showBottomNavigation"],
      prop
    ),
})<{ showAppBar: boolean; showBottomNavigation: boolean }>(
  ({ theme, showAppBar, showBottomNavigation }) => ({
    ...(!showAppBar &&
      !showBottomNavigation && {
        height: "100%",
      }),
    ...(showAppBar &&
      showBottomNavigation && {
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE}px)`,
        paddingTop: APP_BAR_SIZE,
      }),
    ...(showAppBar &&
      !showBottomNavigation && {
        height: `calc(100vh)`,
        paddingTop: APP_BAR_SIZE,
      }),
    ...(!showAppBar &&
      showBottomNavigation && {
        paddingTop: 20,
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE}px)`,
      }),
    overflowY: "auto",
    overflowX: "hidden",
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

const UserHomeLayout = ({
  children,
  loading,
  bottomNavigationProps,
  showAppBar = true,
  showBottomNavigation = true,
}: UserHomeLayoutProps) => {
  return (
    <Container disableGutters maxWidth="xl">
      {showAppBar && <HomeAppBar />}

      <StyledUserHomeLayoutContent
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
      </StyledUserHomeLayoutContent>
      {showBottomNavigation && (
        <HomeBottomNavigation {...bottomNavigationProps} />
      )}
    </Container>
  );
};

export default UserHomeLayout;
