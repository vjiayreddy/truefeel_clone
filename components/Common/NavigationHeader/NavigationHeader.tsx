import React from "react";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Button, Typography, Grid } from "@mui/material";
import { useSession, signOut, signIn } from "next-auth/react";
import { APP_ROUTES } from "@/utils/routes";
import {
  StyledActivityBox,
  StyledAppBar,
  StyledStyledMenuBox,
  StyledUserInfoLabel,
} from "./styled";

interface NavigationHeaderComponent {
  open?: boolean;
  onClickMenuIcon?: () => void;
}
const NavigationHeaderComponent = ({
  open,
  onClickMenuIcon,
}: NavigationHeaderComponent) => {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({
      callbackUrl: APP_ROUTES.LOGIN,
      redirect: true,
    });
  };

  return (
    <StyledAppBar position="fixed" isOpen={open as boolean}>
      <Toolbar disableGutters>
        <StyledStyledMenuBox>
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
        </StyledStyledMenuBox>
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
    </StyledAppBar>
  );
};

export default NavigationHeaderComponent;
