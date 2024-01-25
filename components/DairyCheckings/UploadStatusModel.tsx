import React, { useEffect, useState } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useGetSignedUploadUrlMutation } from "@/redux/api/assesmentsApi";
import {
  shopUploadPop,
  updateAudioUploadStatus,
  resetState,
} from "@/redux/reducers/diaryCheckingsSlice";
import { S3_URL } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getDairyCheckingsPayloadForAudioUpload } from "@/redux/utils";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useSavePatientResponseMutation } from "@/redux/api/patientsApi";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

interface UploadStatusModelProps extends DialogProps {
  children?: React.ReactNode;
  audioFileInfo: any;
  studyId: string;
  onCompletedCallBack: (data: any) => void;
}

const UploadStatusModel = ({
  audioFileInfo,
  onCompletedCallBack,
  studyId,
  ...props
}: UploadStatusModelProps) => {
  const uppy = new Uppy();
  const { data: session } = useSession();
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const dispatch = useDispatch();
  const { currentQuestion, audioUploadStatus } = useSelector(
    (state: any) => state?.homeAssessmentsSlice
  );
  const [savePatientResponse] = useSavePatientResponseMutation();
  const handleSubmitAssessment = async () => {
    try {
      const payload = getDairyCheckingsPayloadForAudioUpload(
        "AUDIO",
        currentQuestion,
        session as Session,
        studyId
      );
      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${audioFileInfo?.name}`,
        isLastQuestion: true,
      })) as any;
      if (response?.data?.status === "success") {
        dispatch(
          updateAudioUploadStatus({
            message: "Congratulations! Successfully collected your thoughts",
            status: "SUCCESS",
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAudioUploadStatus({
          message:
            "We apologize, but the server is currently experiencing high traffic or is temporarily overwhelmed. Please try again in a few moments.",
          status: "ERROR",
        })
      );
    }
  };

  uppy.on("progress", (number) => {
    dispatch(
      updateAudioUploadStatus({
        progress: number,
        message: "Collecting your thoughts...",
        status: "LOADING",
      })
    );
  });

  uppy.on("error", () => {
    dispatch(
      updateAudioUploadStatus({
        progress: 0,
        message:
          "We apologize, but the server is currently experiencing high traffic or is temporarily overwhelmed. Please try again in a few moments.",
        status: "ERROR",
      })
    );
  });

  uppy.on("upload-success", (data) => {
    handleSubmitAssessment();
  });

  const handleCalcel = () => {
    dispatch(shopUploadPop(false));
  };

  // Handle Submit
  const handleSubmit = async () => {
    try {
      const signedUrlResponse = (await getSignedUploadUrl({
        fileName: audioFileInfo?.name,
        contentType: audioFileInfo?.type,
        userId: session?.user?.id as string,
      })) as any;
      const { url } = signedUrlResponse?.data?.data;
      uppy.addFile({
        name: audioFileInfo?.name,
        type: audioFileInfo?.type,
        data: audioFileInfo?.data,
      });
      uppy.use(XHRUpload, {
        endpoint: url,
        method: "PUT",
        headers: {
          "Content-Type": audioFileInfo?.type,
        },
      });
      uppy.upload();
    } catch (error) {}
  };

  const handleOk = () => {
    dispatch(resetState());
    onCompletedCallBack(currentQuestion?.stage);
  };

  useEffect(() => {
    return () => {
      uppy.close();
    };
  }, []);

  return (
    <Dialog {...props}>
      <DialogContent>
        <Box>
          <Typography>Progress : {audioUploadStatus?.progress}</Typography>
          <Typography>status : {audioUploadStatus?.status}</Typography>
          <Typography>message : {audioUploadStatus?.message}</Typography>
        </Box>
        {audioUploadStatus?.status === "SUCCESS" ? (
          <>
            <button onClick={handleOk}>Ok</button>
          </>
        ) : (
          <>
            <button onClick={handleSubmit}>Sumbit</button>
            <button onClick={handleCalcel}>cancel</button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadStatusModel;
