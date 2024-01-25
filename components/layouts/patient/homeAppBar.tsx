import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Hidden from "@mui/material/Hidden";
import { styled } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import { FiSettings } from "react-icons/fi";
import UserGreeting from "@/components/Common/Greeting/Greeting";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({}));

const HomeAppBar = () => {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Hidden only={["xs"]}>
            <UserGreeting />
          </Hidden>
        </Box>
        <IconButton
          size="medium"
          aria-label="settings-icon"
          edge="end"
          color="inherit"
          onClick={async () => signOut()}
        >
          <FiSettings />
        </IconButton>
      </StyledToolbar>
    </AppBar>
  );
};

export default HomeAppBar;
