import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { shouldForwardProp } from "@/utils/actions";

const StyledSelectEmojiIcon = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ dotBgColor: string }>(["dotBgColor"], prop),
})<{ dotBgColor: string }>(({ theme, bgcolor }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .__dot__icon": {
    minWidth: 10,
    minHeight: 10,
    maxWidth: 10,
    borderRadius: 100,
    backgroundColor: bgcolor ? bgcolor : "transparent",
  },
}));

interface SelectEmojiIconProps {
  imgUrl: string;
  imgWidth?: number | string;
  height?: number | string;
  activeDotColor?: string;
}

const SelectEmojiIcon = ({
  activeDotColor,
  imgUrl,
  imgWidth,
  height,
}: SelectEmojiIconProps) => {
  return (
    <StyledSelectEmojiIcon dotBgColor={activeDotColor as string}>
      <Box m={0.5}>
        <img width={imgWidth} height={height} src={imgUrl} />
      </Box>
      <Box component="div" className="__dot__icon" />
    </StyledSelectEmojiIcon>
  );
};

export default SelectEmojiIcon;
