import React, { Fragment } from "react";
import MobileStepper from "@mui/material/MobileStepper";
import { mobileStepperHeight } from "@/utils/constants";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LinearProgress from "@mui/material/LinearProgress";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors";

const StyledMobileStepperWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: `calc(100vh - ${mobileStepperHeight}px)`,
  overflow: "auto",
  paddingTop: mobileStepperHeight,
  [theme.breakpoints.up("sm")]: {
    paddingTop: mobileStepperHeight+mobileStepperHeight+20
  }
}));

const StyledMobileHeader = styled(Box)(({ theme }) => ({
  height: mobileStepperHeight,
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 2,
}));

const StyledLoadingIndicator = styled(Box)(({ theme }) => ({
  position: "absolute",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.common.white,
}));

const StyledMobileStepper = styled(MobileStepper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
}));

interface MobileStepperComponentProps {
  onClose: () => void;
  children: React.ReactNode;
  onClickPrev: () => void;
  onClickNext: () => void;
  activeStep: number | undefined;
  maxSteps: number;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isError?: boolean;
  data?: any;
  disabledNextButton?: boolean;
}

const MobileStepperComponent = ({
  children,
  onClose,
  onClickNext,
  onClickPrev,
  activeStep,
  maxSteps,
  isLoading,
  isError,
  disabledNextButton,
  isSubmitting,
}: MobileStepperComponentProps) => {
  return (
    <Fragment>
      <StyledMobileHeader>
        <IconButton onClick={onClose} sx={{ padding: 0 }} size="medium">
          <AiOutlineClose />
        </IconButton>
      </StyledMobileHeader>
      {/* <Grid item xs>
            <LinearProgress  valueBuffer={5} variant="determinate" value={3} />
          </Grid> */}

      <StyledMobileStepperWrapper p={2}>
        {!isLoading && <>{children}</>}
      </StyledMobileStepperWrapper>

      <StyledMobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Fragment>
            {isSubmitting ? (
              <>
                <ThreeDots
                  height="30"
                  width="30"
                  radius="9"
                  color={APP_COLORS.PRIMARY_COLOR}
                  ariaLabel="loading"
                  wrapperStyle={{}}
                  visible={true}
                />
              </>
            ) : (
              <Button
                fullWidth={false}
                variant="text"
                size="small"
                onClick={onClickNext}
                disabled={disabledNextButton}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            )}
          </Fragment>
        }
        backButton={
          <Button
            fullWidth={false}
            variant="text"
            size="small"
            onClick={onClickPrev}
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
      {isLoading && !isError && (
        <StyledLoadingIndicator>
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color={APP_COLORS.PRIMARY_COLOR}
            ariaLabel="loading"
            wrapperStyle={{}}
            visible={true}
          />
        </StyledLoadingIndicator>
      )}
    </Fragment>
  );
};

export default MobileStepperComponent;
