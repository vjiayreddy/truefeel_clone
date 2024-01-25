"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSession, signOut } from "next-auth/react";
import Button from "@mui/material/Button";
import { AUTH_STATUS } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const AppHeaderComponent = () => {
  const router = useRouter();
  const { status } = useSession();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h4" color="primary" component="div">
          Menu
        </Typography>
        <Box flexGrow={1} />
        <Box>
          {status === AUTH_STATUS.UNAUTHENTICATED && (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => {
                router.push(APP_ROUTES.LOGIN);
              }}
            >
              Login
            </Button>
          )}
          {status === AUTH_STATUS.AUTHENTICATED && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeaderComponent;
