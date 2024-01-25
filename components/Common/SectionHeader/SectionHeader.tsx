import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import SearchInputComponent from "@/components/searchInput/searchInput";
import { Paper } from "@mui/material";

interface SectionHeaderComponentProps {
  title: string;
  btnName: string;
  onClickBtn: () => void;
}

const SectionHeaderComponent = ({
  title,
  btnName,
  onClickBtn,
}: SectionHeaderComponentProps) => {
  return (
    <Paper elevation={0} sx={{borderRadius:0}}>
      <Box pl={3} pr={3} pt={1.5} pb={1.5}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography color="primary" variant="h5">
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <SearchInputComponent />
          </Grid>
          <Grid item>
            <Button
              onClick={onClickBtn}
              color="primary"
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
            >
              {btnName}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Paper>
  );
};

export default SectionHeaderComponent;
