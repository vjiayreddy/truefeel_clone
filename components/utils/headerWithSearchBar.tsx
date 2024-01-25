"use client";
import React from "react";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchInputComponent from "@/components/searchInput/searchInput";
import AddIcon from "@mui/icons-material/Add";

const StyledCard = styled(Card)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

interface HeaderWithSearchBarComponentProps {
  title: string;
  btnName: string;
  onClickBtn: () => void;
}

const HeaderWithSearchBarComponent = ({
  title,
  btnName,
  onClickBtn,
}: HeaderWithSearchBarComponentProps) => {
  return (
    <StyledCard elevation={0}>
      <Box pt={1.5} pb={1.5}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h5">{title}</Typography>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              <SearchInputComponent />
            </Grid>
            <Grid item>
              <Button
                onClick={onClickBtn}
                startIcon={<AddIcon />}
                size="small"
                color="secondary"
              >
                {btnName}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </StyledCard>
  );
};

export default HeaderWithSearchBarComponent;
