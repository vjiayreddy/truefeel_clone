import AudioRecordButton from "@/components/Common/Buttons/audio-record-button/AudioRecordButton";
import { APP_COLORS } from "@/theme/colors";
import { calculatePercentage, getFileNameWithTimeStamp } from "@/utils/actions";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
  S3_URL,
} from "@/utils/constants";
import { layoutModeEnum } from "@/utils/enums";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useSession } from "next-auth/react";
import React, { Fragment, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { useGetSignedUploadUrlMutation } from "@/redux/api/assesmentsApi";
import { useSavePatientResponseMutation } from "@/redux/api/patientsApi";
import { getAssessmentMediaUploadPayload } from "@/redux/services/utils";
import { Session } from "next-auth";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { ThreeDots } from "react-loader-spinner";

interface ConditionalAssessmentLayoutProps {
  children: React.ReactNode;
  dataLoadingIndicator?: boolean;
  onClickNextButton: () => void;
  onSavedSignature?: () => void;
  disabledNextButton?: boolean;
  onClickBackButton: () => void;
  currentStep: number;
  onClickCloseIcon: () => void;
  onClickAudioButton?: () => void;
  onClickBackToText: () => void;
  showAudioButton?: boolean;
  totalSteps: number;
  layoutMode: layoutModeEnum;
  currentQuestion: any;
  isFinalStep?: boolean;
  showLoadingOnNextButton?: boolean;
}

const StyledConditionalLayout = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 16,
  position: "relative",
  "& .__header": {
    [theme.breakpoints.up("sm")]: {
      width: 650,
      margin: "0 auto",
    },
  },
  "& .__audio_visulazation": {
    marginTop: 20,
    // minHeight: 50,
    //maxHeight: 50,
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 24,
    paddingBottom: 24,
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__footer": {
    paddingTop: 24,
    "& .MuiButton-root": {
      height: 40,
      borderRadius: 5,
    },
    "& .Mui-disabled": {
      backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
      color: theme.palette.common.white,
    },
    "& .__info_view": {
      minHeight: 55,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 100,
      width: "100%",
      marginBottom: 20,
      textAlign: "left",
    },
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
}));

const ConditionalAssessmentLayout = ({
  children,
  onClickBackButton,
  onClickNextButton,
  disabledNextButton,
  currentStep,
  onClickCloseIcon,
  onClickAudioButton,
  showAudioButton,
  totalSteps,
  currentQuestion,
  layoutMode = layoutModeEnum.TEXT_ANSWER,
  onSavedSignature,
  isFinalStep,
  showLoadingOnNextButton,
  dataLoadingIndicator,
}: ConditionalAssessmentLayoutProps) => {
  // session
  const { data: session } = useSession();
  // Uppy
  const uppy = new Uppy();
  // Ref
  const signatureRef = useRef<any>();
  // Use State
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Redux
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const [savePatientResponse] = useSavePatientResponseMutation();

  // Convert Base 64 to File
  const convertBase64ToFile = (url: string, fileName: string) => {
    let arr = url.split(",");
    let mime = arr[0].match(/:(.*?);/)![1];
    let data = arr[1];
    let dataStr = atob(data);
    let n = dataStr.length;
    let dataArr = new Uint8Array(n);
    while (n--) {
      dataArr[n] = dataStr.charCodeAt(n);
    }
    let file = new File([dataArr], fileName, { type: mime });
    return file;
  };

  // hande UploadSignature
  const handleUploadSignature = async () => {
    if (signatureRef?.current?.isEmpty()) {
      toast.warn("Signature is required");
    } else {
      const fileName = getFileNameWithTimeStamp("IMAGE");
      const fileInfo = convertBase64ToFile(
        signatureRef?.current?.toDataURL(),
        fileName + ".png"
      );

      try {
        const signedUrlResponse = (await getSignedUploadUrl({
          fileName: fileInfo?.name,
          contentType: fileInfo?.type,
          userId: session?.user?.id as string,
        })) as any;
        const { url } = signedUrlResponse?.data?.data;
        uppy.addFile({
          name: fileInfo?.name,
          type: fileInfo?.type,
          data: fileInfo,
        });
        uppy.use(XHRUpload, {
          endpoint: url,
          method: "PUT",
          headers: {
            "Content-Type": fileInfo?.type,
          },
        });
        uppy.upload();
      } catch (error) {
        toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
      }
    }
  };

  // Handle Submit Assessment
  const handleSubmitAssessment = async (fileName: string) => {
    try {
      const payload = getAssessmentMediaUploadPayload(
        QUESTION_ANSWER_TYPE.SIGNATURE,
        currentQuestion,
        session as Session
      );
      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${session?.user?.id}/${fileName}`,
        isLastQuestion: isFinalStep,
      })) as any;
      if (response?.data?.status === "success") {
        setIsUploading(false);
        onSavedSignature?.();
      }
    } catch (error) {
      setIsUploading(false);
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Uppy Events
  uppy.on("error", () => {
    setIsUploading(false);
    toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  });
  uppy.on("upload-success", (data) => {
    handleSubmitAssessment(data?.name as string);
  });

  return (
    <StyledConditionalLayout>
      <Box component="div" className="__header">
        <Grid container>
          <Grid item container xs={12}>
            <Grid item xs></Grid>
            <Grid item>
              <IconButton
                onClick={onClickCloseIcon}
                sx={{ padding: 0, marginBottom: "10px" }}
                size="medium"
              >
                <AiOutlineClose />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(currentStep, totalSteps)}
            />
          </Grid>
        </Grid>
      </Box>

      {dataLoadingIndicator && (
        <Box
          component="div"
          className="__main_content"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <ThreeDots
            height="30"
            width="30"
            radius="9"
            color={APP_COLORS.PRIMARY_COLOR}
            ariaLabel="loading"
            wrapperStyle={{}}
            visible={true}
          />
        </Box>
      )}
      {!dataLoadingIndicator && currentQuestion && (
        <Fragment>
          {currentQuestion?.questionType?.includes(
            QUESTION_ANSWER_TYPE.INTRODUCTION
          ) ? (
            <Fragment>
              <Box
                component="div"
                className="__main_content"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  container
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Box mb={8}>
                      <Typography
                        gutterBottom
                        textAlign="center"
                        variant="subtitle2"
                      >
                        {currentQuestion?.title}
                      </Typography>
                      <Typography variant="body2" textAlign="center">
                        {currentQuestion?.value}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Fragment>
          ) : (
            <Fragment>
              {layoutMode === layoutModeEnum.CONDITIONAL && (
                <Fragment>
                  <Box component="div" className="__main_content">
                    {children}
                    {currentQuestion?.responseType?.includes(
                      QUESTION_ANSWER_TYPE.SIGNATURE
                    ) && (
                      <Fragment>
                        <Box
                          sx={{
                            margin: "0 auto",
                            border: `1px solid gray`,
                            width: 328,
                            height: 208,
                          }}
                        >
                          <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            onEnd={() => {}}
                            canvasProps={{
                              width: 328,
                              height: 208,
                              className: "sigCanvas",
                            }}
                          />
                        </Box>

                        <Box mt={2}>
                          <Button
                            variant="text"
                            onClick={() => {
                              if (signatureRef?.current) {
                                signatureRef?.current?.clear();
                              }
                            }}
                          >
                            Clear
                          </Button>
                        </Box>
                      </Fragment>
                    )}
                  </Box>
                </Fragment>
              )}
            </Fragment>
          )}
          <Box component="div" className="__footer">
            {showAudioButton && (
              <AudioRecordButton onClick={onClickAudioButton} />
            )}

            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onClickBackButton}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                <Button
                  disabled={disabledNextButton}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (showLoadingOnNextButton) return;
                    if (
                      currentQuestion?.responseType?.includes(
                        QUESTION_ANSWER_TYPE.SIGNATURE
                      )
                    ) {
                      handleUploadSignature();
                    } else {
                      onClickNextButton();
                    }
                  }}
                >
                  {showLoadingOnNextButton ? (
                    <ThreeDots
                      height="20"
                      width="20"
                      radius="9"
                      color={APP_COLORS.WHITE}
                      ariaLabel="loading"
                      wrapperStyle={{}}
                      visible={true}
                    />
                  ) : (
                    <span> Next</span>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}

      {isUploading && (
        <Dialog open={isUploading}>
          <DialogContent>
            <Grid
              container
              justifyContent="center"
              flexDirection="column"
              spacing={2}
            >
              <Grid item>
                <CircularProgress />
              </Grid>
              <Grid item>
                <Typography textAlign="center">Saving</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </StyledConditionalLayout>
  );
};

export default ConditionalAssessmentLayout;
