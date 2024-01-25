"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { protocolType } from "@/redux/types";
import { Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteProtocolMutation } from "@/redux/api/protocolApi";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const StyleMainCard = styled(Card)(() => ({
  width: "100%",
  minHeight: 200,
  position: "relative",
  overflow: "hidden",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "top center",
}));

const StyleMainCardOverly = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "baseline",
  justifyContent: "flex-end",
  background: `rgba(2,0,36,0.6)`,
  color: theme.palette.common.white,
  padding: 10,
}));

const StyleMainCardOverlyMenuIcon = styled(Box)(() => ({
  position: "absolute",
  zIndex: 2,
  top: 0,
  right: 0,
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
}));

interface ProtocolCardComponent {
  data: protocolType;
  onEditProtocol: (id: string) => void;
}

const ProtocolCardComponent = ({
  data,
  onEditProtocol,
}: ProtocolCardComponent) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const [deleteProtocol, { isLoading, isError, isSuccess, error }] =
    useDeleteProtocolMutation();

  const handleDeleteProtocol = async (id: string) => {
    await deleteProtocol({
      id,
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StyleMainCard style={{ backgroundImage: `url(${data.bannerImage})` }}>
        <StyleMainCardOverly>
          <StyledSubTitle gutterBottom variant="body1">
            {data?.title}
          </StyledSubTitle>
          <Typography variant="h6">3 assessments</Typography>
        </StyleMainCardOverly>
        <StyleMainCardOverlyMenuIcon>
          <IconButton onClick={handleClick}>
            <MoreVertIcon
              sx={(theme) => ({ color: theme.palette.common.white })}
            />
          </IconButton>
        </StyleMainCardOverlyMenuIcon>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              onEditProtocol(data?._id);
              handleClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDeleteProtocol(data?._id);
              handleClose();
            }}
          >
            Delete
          </MenuItem>
          <MenuItem onClick={handleClose}>Archive</MenuItem>
          <MenuItem
            onClick={() => {
              router.push(
                `${APP_ROUTES.PROTOCOLS_ASSESSMENTS}?protocolId=${data._id}`
              );
              handleClose();
            }}
          >
            Assessments
          </MenuItem>
        </Menu>
      </StyleMainCard>
    </>
  );
};

export default ProtocolCardComponent;
