import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { FiSettings } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { Typography } from "@mui/material";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  "& .MuiTypography-h6": {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      fontSize: 32,
    },
  },
}));

const AppBarComponent = () => {
  return (
    <AppBar position="static">
      <StyledToolbar>
        <Box sx={{ flexGrow: 1 }}>
          <SectionTitlesOneComponent
            titleProps={{ mb: 1 }}
            title={`Good evening randy!`}
            content={null}
          />
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

export default AppBarComponent;
