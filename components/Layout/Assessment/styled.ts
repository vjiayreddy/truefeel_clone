import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
export const StyledAssessmentViewOne = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  "& .__quesion_view": {
    flexGrow: 1,
    overflow: "auto",
  },
  "& .__voice_record_view": {
    minHeight: 100,
  },
  "& .__info_view": {
    minHeight: 75,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 100,
    width: "100%",
  },
  "& .__indroduction_view": {
    position: "absolute",
  },
}));
