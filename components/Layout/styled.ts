import { shouldForwardProp } from "@/utils/actions";
import { APP_BAR_SIZE, drawerWidth } from "@/utils/constants";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const StyledRenderedContentWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ isOpen: boolean }>(["isOpen"], prop),
})<{
  isOpen?: boolean;
}>(({ theme, isOpen }) => ({
  backgroundColor: theme.palette.common.white,
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  paddingTop: APP_BAR_SIZE,
  minHeight: `calc(100vh - ${APP_BAR_SIZE}px)`,
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
