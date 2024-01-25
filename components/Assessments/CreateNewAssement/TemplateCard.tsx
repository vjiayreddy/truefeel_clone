import React from "react";
import { StyledTemplateCard } from "./styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TemplateCardComponentProps {
  icon: string;
  label: string;
  caption: string;
}

const TemplateCardComponent = ({
  icon,
  label,
  caption,
}: TemplateCardComponentProps) => {
  return (
    <StyledTemplateCard elevation={2}>
      <Box mb={4}>
        <img width={50} alt={label} src={icon} />
      </Box>
      <Box>
        <Box>
          <Typography variant="h6">{label}</Typography>
        </Box>
        <Box>
          <Typography variant="caption">{caption}</Typography>
        </Box>
      </Box>
    </StyledTemplateCard>
  );
};

export default TemplateCardComponent;
