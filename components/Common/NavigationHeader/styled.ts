import { APP_COLORS } from "@/theme/colors";
import { shouldForwardProp } from "@/utils/actions";
import { APP_BAR_SIZE, drawerWidth } from "@/utils/constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";


export const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) =>
      shouldForwardProp<{ isOpen: boolean }>(["isOpen"], prop),
  })<{ isOpen: boolean }>(({ theme, isOpen }) => ({
    paddingRight: 50,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isOpen && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  export const StyledStyledMenuBox = styled(Box)(({ theme }) => ({
    minWidth: 180,
    height: APP_BAR_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: `1px solid ${theme.palette.divider}`,
  }));
  
 export  const StyledActivityBox = styled(Box)(({ theme }) => ({
    height: APP_BAR_SIZE,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }));
  
 export  const StyledUserInfoLabel = styled(Typography)(({ theme }) => ({
    color: APP_COLORS.DISABLED_COLOR,
    fontWeight: 600,
  }));
  