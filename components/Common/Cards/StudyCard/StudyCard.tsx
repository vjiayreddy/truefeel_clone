import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LoadingButtonComponent from "../../Buttons/LoadingButton/LoadingButton";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

interface StudyCardComponentProps {
  title: string;
  content: string;
  onClick: () => void;
  btnName?: string;
  showbtnloading?: boolean;
  disabled?: boolean;
  timeStamp?: string | null;
  status?: string | null;
}

const StudyCardComponent = ({
  title,
  content,
  onClick,
  btnName = "Start",
  showbtnloading,
  disabled,
  timeStamp,
  status,
}: StudyCardComponentProps) => {
  return (
    <Card>
      <CardContent>
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          mb={2}
          variant="subtitle2"
        >
          {title}
        </Typography>
        <Typography mb={2} variant="body1">
          {content}
        </Typography>
        {timeStamp && status && (
          <Grid
            mb={2}
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item>
              <Typography color="GrayText" variant="caption">
                {timeStamp}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={status}
                variant={status === "COMPLETED" ? "filled" : "outlined"}
                color={status === "COMPLETED" ? "success" : "info"}
                size="small"
              />
            </Grid>
          </Grid>
        )}

        <LoadingButtonComponent
          size="large"
          onClick={onClick}
          fullWidth={true}
          disabled={disabled}
          variant={timeStamp ? "contained" : "outlined"}
        >
          {disabled ? (
            "Completed"
          ) : (
            <>
              {timeStamp && "Continue"}
              {!timeStamp && <>{btnName}</>}
            </>
          )}
        </LoadingButtonComponent>
      </CardContent>
    </Card>
  );
};

export default StudyCardComponent;
