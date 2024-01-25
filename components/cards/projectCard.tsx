"use client";
import { protocolType } from "@/redux/types";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDeleteProtocolMutation } from "@/redux/api/protocolApi";

interface ProjectCardComponentProps {
  data: protocolType;
  onEditProtocol: (id: string) => void;
}

const ProjectCardComponent = ({
  data,
  onEditProtocol,
}: ProjectCardComponentProps) => {
  const router = useRouter();
  const [deleteProtocol, { isLoading, isError, isSuccess, error }] =
    useDeleteProtocolMutation();

  const handleDeleteProtocol = async (id: string) => {
    await deleteProtocol({
      id,
    });
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        action={
          <>
            <IconButton
              size="small"
              aria-label="edit"
              onClick={() => {
                onEditProtocol(data?._id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete"
              onClick={() => handleDeleteProtocol(data?._id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        title={data.title}
        subheader={<Box mt={1}>Due Date : {data.endDate}</Box>}
      />

      <CardMedia
        onClick={() => {
          router.push("/participants");
        }}
        component="img"
        height="180"
        image={data.bannerImage}
        alt="green iguana"
      />
      <CardContent
        onClick={() => {
          router.push("/participants");
        }}
      >
        <Typography variant="body2">{data.description}</Typography>
        <Grid container alignItems="center">
          <Grid item xs>
            <Box pt={1} mb={1}>
              <Typography
                sx={{ fontWeight: 600 }}
                gutterBottom
                variant="caption"
              >
                Participating Members ({data.members.length})
              </Typography>
            </Box>
            <AvatarGroup sx={{ display: "inline-flex" }} max={4}>
              {data.members.map((member) => (
                <Avatar
                  key={member._id}
                  sx={{ width: 24, height: 24 }}
                  alt={member.firstName}
                  src={
                    member.image ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACBCAMAAADQfiliAAAAMFBMVEXk5ueutLeqsLTq6+yyuLvAxcfT1tjY29y4vcDg4uPO0dPKztC8wcTn6end3+HQ1NXO0aCsAAAC2ElEQVR4nO2ayXbrIAxAGQ0YZP//39ZDkqYZsORI5Lx3uJssutCtEJOwUp1Op9PpdDqdTqfzXwLw97d5+JB9XCl+Ts0lAIaijb5ijPbBtoyvsr6Lf7FwQ7tEjO4x/E4MTRRAxdfx1zzkBgoQ3sZfFaK8wFiJv1XDJJuGI4GVJCow1IaggUK9Bm4I1kJyGAGtvVQpgMcJaDMIKaCKYEfGwKLjay2yMsGIT4HQfECW4YbE8oyciVccu4CCQhFYpgO7AXYtuFLYDyyEqbjDLYBejW4EZgNLHARtRu7ZQE0B++YwkQ0icykGsoFmNhjIAobZYP4XDZgr8fs5+H4d0OeCYzZIZAPu9eD7a6KNVIOZV0BBpu7OE7OBoh3SlkLkPygSt2f+exPxiGK4DygLE2kYRG6vlMOyzM2RkgSB68KCxSfBCDXV8Cc19hX5AnpVMuyr0U3BoxTMLNhOwyxLsm1NxCZtxLpIO4fVaKSq8MbBHdr4Bk3+UitH9tviK953dsWbyjeF5M2LPBidm4TfsMk/vrEYN6qmb02ghuK0uaCjD23jbw6QpjDmhTlM7cOvAmB/gaavfWCX/37OvkTntjFwLha/ZCItf5GPrlLIZa/8x5mwEPMgOiCgQo7u1US8F9mKUqSxbYN/88z4bOH5Hz/tlJ/yXpUwJTAWxZJ9WlN5l4gzV0lAeP/IeujAgJ2qe+GBgxs+3azXTeh0/N3hs4M70NtHz+RPyuHDBOyY0x8FAL2X/M5hPFUNMHMk4KJQzhiQ2zZV6Ld55PUID/U2bbkFqArsGaAq0Ft3KPC1gPvSgg7+PpVkBPDdJSA3cPEKqCd5oSLYDVArE72PT1FAjIMlP++SQExJtu3oNcePwcIp0IiHULky3Dn6NALz3dmHlINhOHEsJ2K+PAhHE5L4wc05qv1GyPIC9S2S/rXJCVx1c5DblO6oGSRnGlB9BLvvDYlRE+h0Op3Od/kBmOwiVrAapnoAAAAASUVORK5CYII="
                  }
                />
              ))}
            </AvatarGroup>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProjectCardComponent;
