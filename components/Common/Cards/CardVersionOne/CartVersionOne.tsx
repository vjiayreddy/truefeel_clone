import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LoadingButtonComponent from "../../Buttons/LoadingButton/LoadingButton";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";

interface CartVersionOneComponentProps {
  title: string;
  content: string;
  onClick: () => void;
  btnName?: string;
  showbtnloading?: boolean;
  disabled?: boolean;
  timeStamp?: string;
  status?: string;
}

const CartVersionOneComponent = ({
  title,
  content,
  onClick,
  btnName = "Start",
  showbtnloading,
  disabled,
  timeStamp,
  status,
}: CartVersionOneComponentProps) => {
  return (
    <Card>
      <CardContent>
        <Typography mb={2} variant="subtitle1">
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
              <Typography color="GrayText" variant="caption">{timeStamp}</Typography>
            </Grid>
            <Grid item>
              <Chip label={status} variant="filled" color="success" size="small" />
            </Grid>
          </Grid>
        )}

        <LoadingButtonComponent
          size="large"
          onClick={onClick}
          fullWidth={true}
          disabled={showbtnloading}
          showloading={disabled}
        >
          {btnName}
        </LoadingButtonComponent>
      </CardContent>
    </Card>
  );
};

export default CartVersionOneComponent;
