"use client";
import React, { Fragment } from "react";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = styled(Box)(({ theme }) => ({
  position: "relative",
  marginLeft: 0,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  position: "relative",
  marginLeft: 0,
  "& .MuiInputBase-input": {
    height: 27,
    padding: theme.spacing(0.8, 1, 0.8, 0),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 5,
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchBoxWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
}));

const StyledClearIconWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  padding: theme.spacing(0, 2),
  top: 0,
  right: 0,
  height: "100%",
  //position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

interface SearchInputComponentProps extends InputBaseProps {}

const SearchInputComponent = ({ ...props }: SearchInputComponentProps) => {
  return (
    <Fragment>
      <SearchBoxWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase {...props} />
        <StyledClearIconWrapper>
          <ClearIcon />
        </StyledClearIconWrapper>
      </SearchBoxWrapper>
    </Fragment>
  );
};

export default SearchInputComponent;
