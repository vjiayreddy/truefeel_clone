import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { StyledCreateAssessment } from "./styled";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TemplateCardComponent from "./TemplateCard";
import { sampleAssessments } from "@/utils/constants";

interface CreateAssessmentComponentProps extends DialogProps {}

const CreateAssessmentComponent = ({
  ...props
}: CreateAssessmentComponentProps) => {
  return (
    <Dialog maxWidth="lg" {...props}>
      <StyledCreateAssessment>
        <Box component="div" className="__top_header_box">
          <Typography variant="body1">Create a new assessment</Typography>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box component="div" className="__content_box">
          <Grid spacing={3} container>
            <Grid item md={4}>
              <Box mb={2} component="div" className="templates_list_wrapper">
                <List
                  subheader={
                    <ListSubheader component="div" id="custom-templates">
                      Custom Templates
                    </ListSubheader>
                  }
                  component="nav"
                  sx={{ width: "100%" }}
                  aria-labelledby="custom-templates"
                >
                  <ListItemButton>
                    <ListItemText primary="All Templates" />
                    <Typography>40 +</Typography>
                  </ListItemButton>
                </List>
              </Box>
              <Box component="div" className="templates_list_wrapper">
                <List
                  subheader={
                    <ListSubheader component="div" id="custom-templates">
                      Templates
                    </ListSubheader>
                  }
                  component="nav"
                  sx={{ width: "100%" }}
                  aria-labelledby="custom-templates"
                >
                  <ListItemButton>
                    <ListItemText primary="All Templates" />
                    <Typography>40 +</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Traumatic Brain Injury" />
                    <Typography>4</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Parkinson's Disease" />
                    <Typography>6</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Multiple Sclerosis" />
                    <Typography>10</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Systemic Lupus Erythematosus" />
                    <Typography>17</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Stroke" />
                    <Typography>30</Typography>
                  </ListItemButton>
                </List>
              </Box>
            </Grid>
            <Grid item md={8}>
              <Box>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Create your own assessment
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box component="div" className="__create_new">
                      <Grid container spacing={2}>
                        <Grid item>
                          <img src="/assets/images/icons/create_assessment.svg" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="body1">
                            Start form scratch
                          </Typography>
                          <Typography variant="body2">
                            Begin with a blank slate and select your own
                            assessment blocks
                          </Typography>
                        </Grid>
                        <Grid item>
                          <img src="/assets/images/icons/next_arrow.svg" />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={4}>
                <Grid spacing={2} container>
                  {sampleAssessments.map((item, index) => (
                    <Grid key={index} item md={4} lg={4} xl={4} sm={4}>
                      <TemplateCardComponent {...item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </StyledCreateAssessment>
    </Dialog>
  );
};

export default CreateAssessmentComponent;
