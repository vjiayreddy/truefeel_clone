"use client";
import { BRAND_NAME, adminMenuItems, drawerWidth } from "@/utils/constants";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import SvgIcon from "@/components/icon/icon";
import { APP_COLORS } from "@/theme/colors";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";

interface SideDrawerComponentProps {
  open: boolean;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SideDrawerComponent = ({ open }: SideDrawerComponentProps) => {
  const router = useRouter();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Typography sx={{ fontWeight: 800 }} variant="h4">
          EloCare
        </Typography>
        {/* <img alt={BRAND_NAME} src="/assets/images/logo.svg" width={150} /> */}
      </DrawerHeader>
      <List subheader={<ListSubheader>Navigation</ListSubheader>}>
        {adminMenuItems.map((item, index) => (
          <ListItemButton
            key={item?.title}
            onClick={() => {
              router.push(item?.link);
            }}
          >
            <ListItemIcon sx={{ minWidth: 30 }}>
              <SvgIcon
                name={item?.icon}
                style={{ color: APP_COLORS.PRIMARY_COLOR, width: "22px" }}
              />
            </ListItemIcon>
            <ListItemText>{item?.title}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default SideDrawerComponent;
