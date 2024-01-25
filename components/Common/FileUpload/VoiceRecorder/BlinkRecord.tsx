import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const StyledDotBox = styled(Box)(({ theme }) => ({
  width: 10,
  height: 10,
  backgroundColor: theme.palette.error.main,
  borderRadius: 100,
}));

interface BlinkRecordComponentProps {
  title: string;
}

const BlinkRecordComponent = ({ title }: BlinkRecordComponentProps) => {
  return (
    <Box>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <StyledDotBox
            sx={(theme) => ({
              backgroundColor:
                title === "Recording"
                  ? theme.palette.error.main
                  : theme.palette.info.main,
            })}
          />
        </Grid>
        <Grid item>
          <Typography variant="caption" className="blink">
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlinkRecordComponent;
