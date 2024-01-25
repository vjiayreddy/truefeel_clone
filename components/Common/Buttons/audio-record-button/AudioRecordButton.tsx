import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const StyledAudioRecordButton = styled(Box)(({ theme }) => ({
  height: 50,
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 100,
  marginBottom: 20,
  position: "relative",
}));

interface AudioRecordButtonProps {
  onClick?: () => void;
}

const AudioRecordButton = ({ onClick }: AudioRecordButtonProps) => {
  return (
    <StyledAudioRecordButton onClick={onClick}>
      <Box mt={1} ml={0.6}>
        <img
          width={40}
          height={40}
          alt="audio-icon"
          src="/assets/images/audio_button.svg"
        />
      </Box>
      <Box flexGrow={1}>
        <Typography variant="body2" textAlign="center">
          Tap to record audio response
        </Typography>
      </Box>
      <Box mt={1} mr={0.6}>
        <img
          style={{
            opacity: 0,
          }}
          width={40}
          height={40}
          alt="audio-icon"
          src="/assets/images/audio_button.svg"
        />
      </Box>
    </StyledAudioRecordButton>
  );
};

export default AudioRecordButton;
