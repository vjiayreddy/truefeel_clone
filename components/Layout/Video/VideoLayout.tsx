import { styled } from "@mui/material/styles";

import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import VideoUploadComponent from "@/components/UserAssessment/VideoUploader";
import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import { getFileNameWithTimeStamp } from "@/utils/actions";
import { getFileExtension } from "@/redux/services/utils";

const dummVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const StyledVideoLayoutComponent = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  backgroundColor: "#475467",
  "& .__main__content": {
    maxWidth: 300,
    width: 300,
    minHeight: 450,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    "& .__video_container": {
      height: 170,
      borderRadius: 10,
      width: "100%",
      overflow: "hidden",
      position: "relative",
      "& video": {
        width: "100%",
        position: "absolute",
      },
      "& .__action__button": {
        zIndex: 1,
        position: "absolute",
        textAlign: "center",
        right: 0,
        bottom: 10,
        padding: 10,
        "& .MuiSvgIcon-root": {
          color: theme.palette.common.white,
          height: 35,
          width: 35,
        },
      },
    },
  },
  "& .uppy-Dashboard-inner": {
    height: "100vh",
  },
}));

interface VideoLayoutComponentProps {
  videoSource: string | null;
  videoType?: string;
  title: string;
  description: string;
  onClickStartButton: () => void;
  onClickSkipButton: () => void;
  onCapuredVideoCompleted: (file: any) => void;
}

const VideoLayoutComponent = ({
  videoSource,
  videoType = "video/mp4",
  title,
  description,
  onClickSkipButton,
  onCapuredVideoCompleted,
}: VideoLayoutComponentProps) => {
  const video = useRef<HTMLVideoElement>(null!);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [startVideoRecording, setStartVideoRecording] = useState(false);
  const ref = useRef<any>();

  const pauseVideo = () => {
    if (video?.current) {
      video.current.pause();
      setIsVideoPaused(true);
    }
  };

  const playVideo = () => {
    if (video?.current) {
      video.current.play();
      setIsVideoPaused(false);
    }
  };

  const handleCapture = (target: any) => {
    if (target.files) {
      if (target.files.length !== 0) {
        let file = target.files[0];
        let blob = file.slice(0, file.size, file?.type);
        const fileName = getFileNameWithTimeStamp("VIDEO");
        const fileExtension = getFileExtension(blob, "video/");
        let newFile = new File([blob], fileName + `.${fileExtension}`, {
          type: file?.type,
        });
        onCapuredVideoCompleted(newFile);
      }
    }
  };

  return (
    <StyledVideoLayoutComponent>
      <Box component="div" className="__main__content">
        <Box component="div" className="__video_container">
          <video ref={video} autoPlay={true} muted loop>
            <source src={videoSource || dummVideo} type={videoType} />
          </video>
          <Box component="div" className="__action__button">
            {isVideoPaused && (
              <IconButton size="large" sx={{ padding: 0 }} onClick={playVideo}>
                <PlayCircleFilledIcon />
              </IconButton>
            )}
            {!isVideoPaused && (
              <IconButton sx={{ padding: 0 }} size="large" onClick={pauseVideo}>
                <PauseCircleIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box mt={1} mb={2}>
          <Typography fontWeight="700" textAlign="center" variant="body1">
            {title}
          </Typography>
          <Typography fontSize={12} variant="body2" textAlign="center">
            {description}
          </Typography>
        </Box>
        <Box>
          <Button
            color="error"
            sx={{
              borderRadius: 1,
            }}
            onClick={() => {
              ref.current?.click();
            }}
          >
            <input
              hidden
              ref={ref}
              accept="video/*"
              id="icon-button-file"
              type="file"
              capture="environment"
              onChange={(e) => handleCapture(e.target)}
            />
            Start Recording
          </Button>
          <Box mt={1.2}>
            <Button
              onClick={onClickSkipButton}
              color="inherit"
              sx={{
                borderRadius: 1,
              }}
            >
              Skip
            </Button>
          </Box>
        </Box>
      </Box>
      <DialogVersionOneComponent
        fullScreen
        open={startVideoRecording}
        showCloseButton={true}
        onClickCloseButton={() => {
          setStartVideoRecording(false);
        }}
        closeBtnSxProps={{
          zIndex: 2,
        }}
      >
        <VideoUploadComponent uploadPath="/" onCompleted={() => {}} />
      </DialogVersionOneComponent>
    </StyledVideoLayoutComponent>
  );
};

export default VideoLayoutComponent;
