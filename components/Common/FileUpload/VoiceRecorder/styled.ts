import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
export const StyledUppyFileRecorder = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderRadius: 5,
  "& .audio-recorder": {
    backgroundColor: "Transparent",
    boxShadow: "none",
    "& .audio-recorder-mic": {
      padding: 0,
      height: 40,
      display: "none",
    },
  },
}));
