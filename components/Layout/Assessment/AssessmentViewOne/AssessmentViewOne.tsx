import React from "react";
import { StyledAssessmentViewOne } from "../styled";

interface AssessmentViewLayoutOneProps {
  children: React.ReactNode;
}
const AssessmentViewLayoutOne = ({
  children,
}: AssessmentViewLayoutOneProps) => {
  return <StyledAssessmentViewOne disableGutters maxWidth="xs">{children}</StyledAssessmentViewOne>;
};

export default AssessmentViewLayoutOne;
