import { shouldForwardProp } from "@/utils/actions";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import {styled} from "@mui/material/styles";

export interface BorderLinearProgressProps {
  activeColor?: string;
  inActiveColor?: string;
  width?: string;
  height?: string;
}

export const StyledProgressBarWrapper = styled(Box)({
  position: "relative",
  minHeight: 20,
  width: "100%",
  "& .__count": {
    position: "absolute",
    top: "10%",
    left: "5%",
  },
});

export const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<BorderLinearProgressProps>(
      ["activeColor", "inActiveColor", "height", "width"],
      prop
    ),
})<BorderLinearProgressProps>(({ theme, ...props }) => ({
  height: props?.height || 20,
  width: props?.width || "100%",
  borderRadius: "0px",
  backgroundColor: props?.inActiveColor || "#ebf5fb",
  "& .MuiLinearProgress-bar": {
    backgroundColor: props?.activeColor || "#78E2DA",
    transition: "none",
    transformOrigin: "left",
  },
}));
