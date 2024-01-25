import React, { useState } from "react";
import Box from "@mui/material/Box";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import Grid from "@mui/material/Grid";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { audioMp3Converter, getFileNameWithTimeStamp } from "@/utils/actions";
import { StyledUppyFileRecorder } from "./styled";
import BlinkRecordComponent from "./BlinkRecord";
import LoadingButtonComponent from "../../Buttons/LoadingButton/LoadingButton";
import { APP_COLORS } from "@/theme/colors";
import { getFileExtension } from "@/redux/services/utils";

interface VoiceRecorderComponentProps {
  onRecordingCompleted: (data: any) => void;
  fileType: string;
}

const VoiceRecorderComponent = ({
  onRecordingCompleted,
  fileType,
}: VoiceRecorderComponentProps) => {
  const recorderControls = useAudioRecorder();
  const [loading, setIsLoading] = useState<boolean>(false);

  const addAudioElement = async (blob: any) => {
    setIsLoading(true);
    const fileExtension = getFileExtension(blob, "audio/");
    const fileName = getFileNameWithTimeStamp(fileType);
    const audioMp3ConverterResponse = await audioMp3Converter(
      blob,
      fileName,
      fileExtension,
      "mp3"
    );
    setIsLoading(false);
    onRecordingCompleted(audioMp3ConverterResponse);
  };

  return (
    <StyledUppyFileRecorder
      sx={(theme) => ({
        border: recorderControls?.isRecording
          ? `1px solid ${theme?.palette.divider}`
          : "none",
      })}
    >
      <Box>
        <Grid
          container
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid pl={1} pr={1} item container xs={12}>
            {recorderControls?.isRecording && recorderControls?.isPaused ? (
              <BlinkRecordComponent title="Paused" />
            ) : (
              <>
                {recorderControls?.isRecording && (
                  <BlinkRecordComponent title="Recording" />
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <AudioRecorder
              onRecordingComplete={addAudioElement}
              recorderControls={recorderControls}
              audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
              }}
              showVisualizer={true}
              downloadOnSavePress={false}
              downloadFileExtension="mp3"
            />
          </Grid>
        </Grid>
      </Box>
      {!recorderControls?.isRecording && (
        <LoadingButtonComponent
          disabled={loading}
          showloading={loading}
          dotColor={APP_COLORS.DISABLED_COLOR}
          startIcon={<KeyboardVoiceIcon />}
          fullWidth={false}
          size="large"
          variant="outlined"
          onClick={recorderControls?.startRecording}
        >
          TAP TO SPEAK
        </LoadingButtonComponent>
      )}
    </StyledUppyFileRecorder>
  );
};

export default VoiceRecorderComponent;
