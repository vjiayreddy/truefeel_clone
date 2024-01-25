import React from "react";
import {
  BorderLinearProgress,
  BorderLinearProgressProps,
  StyledProgressBarWrapper,
} from "./styled";
import { LinearProgressProps } from "@mui/material";
interface ProgressBarComponent
  extends LinearProgressProps,
    BorderLinearProgressProps {}

const ProgressBarComponent = ({ ...props }: ProgressBarComponent) => {
  return (
    <StyledProgressBarWrapper>
      <BorderLinearProgress
        {...props}
        color="success"
        activeColor={props.activeColor}
        width={props.width}
        inActiveColor={props.inActiveColor}
        height={props.height}
        sx={{ color: "#1bd900" }}
        variant="determinate"
      />
      <div className="__count">{props.value}</div>
    </StyledProgressBarWrapper>
  );
};

export default ProgressBarComponent;
