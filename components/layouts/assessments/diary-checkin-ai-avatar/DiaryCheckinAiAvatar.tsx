import React, { Fragment, useEffect, useRef, useState } from "react";
import { APP_COLORS } from "@/theme/colors";
import { layoutModeEnum } from "@/utils/enums";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { AiOutlineClose } from "react-icons/ai";
import { Button, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";
import AvatarVideoComponent from "@/components/AvatarVideo/AvatarVideo";
import AudioRecordButton from "@/components/Common/Buttons/audio-record-button/AudioRecordButton";
import {
  audioMp3Converter,
  calculatePercentage,
  getFileNameWithTimeStamp,
} from "@/utils/actions";
import { useVoiceVisualizer } from "react-voice-visualizer";
import { LiveAudioVisualizer } from "react-audio-visualize";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  getAssessmentMediaUploadPayload,
  getFileExtension,
} from "@/redux/services/utils";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { AUTH_API_STATUS, S3_URL } from "@/utils/constants";
import { useGetSignedUploadUrlMutation } from "@/redux/api/assesmentsApi";
import { useSavePatientResponseMutation } from "@/redux/api/patientsApi";
import { Session } from "next-auth";

const StyledDiaryCheckinLayout = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 16,
  position: "relative",
  "& .__ai_avatar_player": {
    marginTop: 25,
    "& .__video_container": {
      height: 200,
      borderRadius: 100,
      width: 200,
      overflow: "hidden",
      position: "relative",
      "& video": {
        width: "100%",
        height: "100%",
        position: "absolute",
      },
      "& .__timer": {
        color: theme.palette.common.white,
        zIndex: 2,
        position: "absolute",
        left: "45%",
        bottom: "10px",
      },
      "& .__action__button": {
        zIndex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  "& .__audio_visulazation": {
    marginTop: 20,
    // minHeight: 50,
    //maxHeight: 50,
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 24,
    paddingBottom: 24,
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
  },
}));

interface DiaryCheckinLayoutProps {
  children: React.ReactNode;
  onTriggerAfterSavedAudioAssessment?: (state: number) => void;
  onClickBackButton: () => void;
  currentStep: number;
  onClickCloseIcon: () => void;
  onClickAudioButton?: () => void;
  onClickBackToText: () => void;
  showAudioButton?: boolean;
  showInfoView?: boolean;
  infoContent?: string;
  totalSteps: number;
  layoutMode: layoutModeEnum;
  currentQuestion: any;
  isFinalStep?: boolean;
}

const DiaryCheckinAiAvatarLayout = ({
  children,
  onClickBackButton,
  currentStep,
  onClickCloseIcon,
  onClickAudioButton,
  showAudioButton,
  showInfoView,
  infoContent,
  totalSteps,
  currentQuestion,
  onClickBackToText,
  layoutMode = layoutModeEnum.TEXT_ANSWER,
  onTriggerAfterSavedAudioAssessment,
  isFinalStep,
}: DiaryCheckinLayoutProps) => {
  const [loading, setIsLoading] = useState<boolean>(false);

  // next-auth session
  const { data: session } = useSession();
  // voice visualizer
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    error,
    startRecording,
    recordingTime,
    stopRecording,
    togglePauseResume,
    mediaRecorder,
    isRecordingInProgress,
    isPausedRecording,
  } = recorderControls;

  // Redux
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const [savePatientResponse] = useSavePatientResponseMutation();

  //SpeechRecognition
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  // uppy uoload
  const uppy = new Uppy();

  // convert recording file to mp3
  const addAudioElement = async (blob: any) => {
    setIsLoading(true);
    const fileExtension = getFileExtension(blob, "audio/");
    const fileName = getFileNameWithTimeStamp("AUDIO");
    const audioMp3ConverterResponse: any = await audioMp3Converter(
      blob,
      fileName,
      fileExtension,
      "mp3"
    );
    handleUploadAudioFile(audioMp3ConverterResponse);
  };

  // Trigger when press save button
  useEffect(() => {
    if (!recordedBlob) return;
    addAudioElement(recordedBlob);
  }, [recordedBlob, error]);

  // Trigger when error occur
  useEffect(() => {
    if (!error) return;
  }, [error]);

  // call back when page unmount
  useEffect(() => {
    return () => {
      stopRecording();
      SpeechRecognition.stopListening();
      resetTranscript();
    };
  }, []);

  // Upload Audio file
  const handleUploadAudioFile = async (fileInfo: any) => {
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
        data: fileInfo?.data || fileInfo,
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
  };

  // Submit Assessment
  const handleSubmitAssessment = async (fileName: string) => {
    try {
      const payload = getAssessmentMediaUploadPayload(
        "AUDIO",
        currentQuestion,
        session as Session
      );
      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${session?.user?.id}/${fileName}`,
        isLastQuestion: isFinalStep,
      })) as any;
      if (response?.data?.status === "success") {
        setIsLoading(false);
        resetTranscript();
        onTriggerAfterSavedAudioAssessment?.(currentQuestion?.stage);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Uppy Events
  uppy.on("error", () => {
    setIsLoading(false);
    toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  });
  uppy.on("upload-success", (data) => {
    handleSubmitAssessment(data?.name as string);
  });

  return (
    <StyledDiaryCheckinLayout>
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
      {layoutMode === layoutModeEnum.AVATAR && (
        <Fragment>
          <Box component="div" className="__main_content">
            <Box component="div" className="__ai_avatar_player">
              <Grid
                container
                alignItems="center"
                direction="column"
                justifyContent="center"
                spacing={2}
              >
                <Grid item>{children}</Grid>
                <Grid item>
                  <Typography textAlign="center" variant="subtitle2">
                    Watch the video question above.
                  </Typography>
                  <Typography textAlign="center">
                    After watching, tap below to record your response.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box component="div" className="__footer">
            {showAudioButton && (
              <AudioRecordButton onClick={onClickAudioButton} />
            )}
            {showInfoView && (
              <Box component="div" className="__info_view">
                {infoContent}
              </Box>
            )}
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onClickBackButton}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}
      {layoutMode === layoutModeEnum.AUDIO && (
        <Fragment>
          <Box component="div" className="__audio_visulazation">
            <Box component="div" className="__ai_avatar_player">
              <Grid
                container
                alignItems="center"
                direction="column"
                justifyContent="center"
                spacing={1}
              >
                <Grid item>{children}</Grid>
              </Grid>
            </Box>

            <Box>
              {isRecordingInProgress && (
                <Typography textAlign="center">{recordingTime}</Typography>
              )}
            </Box>
            <Box mt={2} mb={2} sx={{ margin: "o auto", width: "400px" }}>
              {mediaRecorder && (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorder}
                  width={400}
                  height={30}
                />
              )}
            </Box>
          </Box>
          <Box component="div" className="__main_content">
            {browserSupportsSpeechRecognition && (
              <Fragment>
                {!transcript && <Typography>Live transcriptions...</Typography>}
                {transcript && <Typography>{transcript}</Typography>}
              </Fragment>
            )}
          </Box>
          <Box component="div" className="__footer">
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button
                  onClick={() => {
                    stopRecording();
                    resetTranscript();
                  }}
                  variant="text"
                  color="inherit"
                >
                  Delete
                </Button>
              </Grid>
              <Grid item>
                {isRecordingInProgress && (
                  <Fragment>
                    {isPausedRecording && (
                      <IconButton
                        onClick={() => {
                          togglePauseResume();
                          startListening();
                        }}
                        size="small"
                      >
                        <img
                          width={50}
                          height={50}
                          alt="start-record"
                          src={"/assets/images/paused_record.svg"}
                        />
                      </IconButton>
                    )}
                    {!isPausedRecording && (
                      <IconButton
                        onClick={() => {
                          togglePauseResume();
                          SpeechRecognition.stopListening();
                        }}
                        size="small"
                      >
                        <img
                          width={50}
                          height={50}
                          alt="start-record"
                          src={"/assets/images/stop_audio.svg"}
                        />
                      </IconButton>
                    )}
                  </Fragment>
                )}
                {!isRecordingInProgress && (
                  <IconButton
                    onClick={() => {
                      startRecording();
                      startListening();
                    }}
                    size="small"
                  >
                    <img
                      width={50}
                      height={50}
                      alt="start-record"
                      src="/assets/images/audio_button.svg"
                    />
                  </IconButton>
                )}
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    if (isPausedRecording) {
                      stopRecording();
                    }
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <Grid
              mt={2}
              mb={2}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="body2" textAlign="center">
                  {isRecordingInProgress && !isPausedRecording && "Stop"}
                  {!isRecordingInProgress && "Start Recording"}
                  {isRecordingInProgress && isPausedRecording && "Paused"}
                </Typography>
              </Grid>
            </Grid>
            <Grid mt={2} container alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  onClick={() => {
                    stopRecording();
                    SpeechRecognition.stopListening();
                    resetTranscript();
                    onClickBackToText();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}
      {loading && (
        <Dialog open={loading}>
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
    </StyledDiaryCheckinLayout>
  );
};

export default DiaryCheckinAiAvatarLayout;
