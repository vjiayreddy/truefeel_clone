import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

export const StyledCreateAssessment = styled(Box)(({ theme }) => ({
  width: 1100,
  minHeight: 700,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  "& .__top_header_box": {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: theme.palette.common.white,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  "& .__content_box": {
    //flexGrow: 1,
    paddingTop: 90,
    paddingLeft: 15,
    paddingRight: 15,

    "& .templates_list_wrapper": {
      width: "100%",
      backgroundColor: "#F7F2FA",
      padding: 20,
      borderRadius: 10,
      "& .MuiListSubheader-root": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiListItemText-primary": {
      width: "90%",
    },
    "& .__create_new": {
      width: "60%",
      backgroundColor: "#F7F2FA",
      padding: 10,
      borderRadius: 10,
      marginTop: 20,
    },
  },
}));

export const StyledTemplateCard = styled(Card)(({ theme }) => ({
  minHeight: 200,
  height: "100%",
  width: "100%",
  padding: `15px 10px`,
  borderRadius: 10,
  display:"flex",
  flexDirection:'column',
  justifyContent:"space-between",
  '& .MuiTypography-h6':{
    fontSize:14
  },
  '& .MuiTypography-caption':{
    fontSize:10,
    color:theme.palette.grey[500]
  }
}));
