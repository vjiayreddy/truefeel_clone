import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LoadingButtonComponent from "../../Buttons/LoadingButton/LoadingButton";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { calculatePercentage } from "@/utils/actions";

interface TotalAssessmentsComponentProps {
  title?: string;
  active: number;
  total: number;
  isLoadingAssessments:boolean
}
const TotalAssessmentsComponent = ({
  active,
  total,
  isLoadingAssessments
}: TotalAssessmentsComponentProps) => {
  return (
    <Card>
      <CardContent>
        <Typography mb={3} fontWeight={400} variant="subtitle1">
          Complete {active} assessments this week
        </Typography>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant={isLoadingAssessments?"indeterminate":"determinate"}
                value={calculatePercentage(active,total)}
                size={100}
                thickness={5}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" component="div">
                  <span style={{ fontSize: 30 }}>
                    <b>{active}</b>
                  </span>
                  /{total}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalAssessmentsComponent;
