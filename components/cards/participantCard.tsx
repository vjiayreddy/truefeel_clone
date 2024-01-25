import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ParticipantCardComponentProps {
  name: string;
  designation: string;
  image: string;
}

const StyledCardActions = styled(CardActions)(({ theme }) => ({}));
const ParticipantCardComponent = ({
  name,
  designation,
  image,
}: ParticipantCardComponentProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid mt={1} item>
            <Avatar src={image} sx={{ width: 80, height: 80 }} />
          </Grid>
          <Grid item>
            <Box mt={2} mb={1}>
              <Typography align="center" variant="h6">
                {name}
              </Typography>
              <Typography gutterBottom align="center" variant="body2">
                {designation}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <StyledCardActions>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              size="small"
              fullWidth={true}
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
            >
              Remove
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              size="small"
              fullWidth={true}
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
            >
              View
            </Button>
          </Grid>
        </Grid>
      </StyledCardActions>
    </Card>
  );
};

export default ParticipantCardComponent;
