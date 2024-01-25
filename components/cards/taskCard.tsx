import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import AvatarGroup from "@mui/material/AvatarGroup";
import { membersList } from "@/redux/mockData/mockData";
import Avatar from "@mui/material/Avatar";
import { Button, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";

const StyledCardImageWrapper = styled(Box)(({ theme }) => ({
  width: 170,
  minHeight: 170,
  height: "auto",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top center",
  backgroundSize: "cover",
}));

const TaskCardComponent = () => {
  return (
    <Card>
      <CardContent>
        <Grid mb={1} container spacing={3}>
          <Grid item>
            <StyledCardImageWrapper
              style={{
                backgroundImage: `url(https://www.designorb.in/wp-content/uploads/2018/09/BENADRYL-3-1.jpg)`,
              }}
            />
          </Grid>
          <Grid container alignItems="center" item xs>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography gutterBottom variant="body2">
                  Medical Treatment Consultants
                </Typography>
                <Typography variant="h5">
                  Expect Feed back Benadryl Cough Formula Syrup, 150 ml
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography gutterBottom variant="body2">
                  Benadryl Cough Formula Syrup, 50 ml belongs to a class of
                  medications called ‘expectorants’ used to treat cough.
                  Coughing (dry or productive) is the body’s...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid container mb={2}>
          <Grid item xs>
            <Typography gutterBottom variant="h6">
              200+ Participating members
            </Typography>
            <AvatarGroup sx={{ display: "inline-flex" }} max={8}>
              {membersList.map((member) => (
                <Avatar
                  key={member.id}
                  sx={{ width: 24, height: 24 }}
                  alt={member.name}
                  src={member.image}
                />
              ))}
            </AvatarGroup>
          </Grid>
          <Grid item>
            <Typography align="right" gutterBottom variant="h6">
              Due Date
            </Typography>
            <Chip label="Mon ,Sept 23 , 2023" />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Button
              size="small"
              startIcon={<NotificationsIcon />}
              color="success"
              fullWidth
            >
              Send Notifications
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              startIcon={<RemoveRedEyeIcon />}
              size="small"
              color="primary"
              fullWidth
            >
              View Details
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              startIcon={<EditIcon />}
              size="small"
              color="warning"
              fullWidth
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaskCardComponent;
