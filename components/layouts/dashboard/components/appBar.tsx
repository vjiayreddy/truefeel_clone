import React from "react";
import { shouldForwardProp } from "@/utils/actions";
import { APP_BAR_SIZE, drawerWidth } from "@/utils/constants";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Button, Typography, Grid } from "@mui/material";
import { APP_COLORS } from "@/theme/colors";
import { useSession, signOut, signIn } from "next-auth/react";
import { APP_ROUTES } from "@/utils/routes";

const MuiAppBar = styled(AppBar, {
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

const StyledMenuBox = styled(Box)(({ theme }) => ({
  minWidth: 180,
  height: APP_BAR_SIZE,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledActivityBox = styled(Box)(({ theme }) => ({
  height: APP_BAR_SIZE,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledUserInfoLabel = styled(Typography)(({ theme }) => ({
  color: APP_COLORS.DISABLED_COLOR,
  fontWeight: 600,
}));

interface AppBarComponentProps {
  open: boolean;
  onClickMenuIcon: () => void;
}
const AppBarComponent = ({ open, onClickMenuIcon }: AppBarComponentProps) => {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({
      callbackUrl: APP_ROUTES.LOGIN,
      redirect: true,
    });
  };

  return (
    <MuiAppBar position="fixed" isOpen={open}>
      <Toolbar disableGutters>
        <StyledMenuBox>
          <IconButton
            color="primary"
            aria-label="open_drawer"
            onClick={onClickMenuIcon}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" color="primary">
            Menu
          </Typography>
        </StyledMenuBox>
        <Box ml={2}>
          <Typography sx={{ fontWeight: 600 }} variant="body1" color="primary">
            ELOCARE Therapy Management
          </Typography>
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img width={150} alt="hopebio" src="/assets/images/hopebiologo.svg" />
        </Box>
        <StyledActivityBox>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item xs>
              <StyledUserInfoLabel variant="body1">
                HOPE Biosciences {session?.user && `| ${session.user.name}`}
              </StyledUserInfoLabel>
            </Grid>
            <Grid item>
              <Button size="small" variant="text" color="primary">
                Settings
              </Button>
            </Grid>
            {session?.user ? (
              <Grid item>
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Grid>
            ) : (
              <Grid item>
                <Button
                  onClick={() => {
                    signIn();
                  }}
                  size="small"
                  variant="text"
                  color="primary"
                >
                  Login
                </Button>
              </Grid>
            )}
          </Grid>
        </StyledActivityBox>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBarComponent;
