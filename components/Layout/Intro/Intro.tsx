import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import LoadingButtonComponent from "@/components/Common/Buttons/LoadingButton/LoadingButton";
import Container from "@mui/material/Container";
import { APP_BAR_SIZE } from "@/utils/constants";

const StyledIntroLayoutComponent = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  paddingLeft:20,
  paddingRight:20,
  flexDirection: "column",
  "& .__info_view": {
    flexGrow: 1,
    overflow: "auto",
    paddingTop: 40,
    [theme.breakpoints.up("sm")]: {
      paddingTop: 150,
    },
  },
  "& .__footer": {
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    "& .MuiButtonBase-root": {
      borderRadius: 5,
    },
  },
}));

interface IntroLayoutComponentProps {
  children: React.ReactNode;
  footerNode?: React.ReactNode;
  onClickContinue: () => void;
  onClickExist: () => void;
}

const IntroLayoutComponent = ({
  children,
  footerNode,
  onClickContinue,
  onClickExist,
}: IntroLayoutComponentProps) => {
  return (
    <StyledIntroLayoutComponent maxWidth="xs">
      <Box component="div" className="__info_view">
        {children}
      </Box>
      <Box component="div" className="__footer">
        {footerNode && <>{footerNode}</>}
        {!footerNode && (
          <Grid container spacing={2} direction="column">
            <Grid item>
              <LoadingButtonComponent onClick={onClickContinue} size="large">
                Continue
              </LoadingButtonComponent>
            </Grid>
            <Grid item>
              <LoadingButtonComponent
                onClick={onClickExist}
                size="large"
                variant="outlined"
                color="inherit"
              >
                Exit
              </LoadingButtonComponent>
            </Grid>
          </Grid>
        )}
      </Box>
    </StyledIntroLayoutComponent>
  );
};

export default IntroLayoutComponent;
