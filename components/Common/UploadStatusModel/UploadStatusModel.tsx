import React, { useEffect } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useGetSignedUploadUrlMutation } from "@/redux/api/assesmentsApi";
import {
  showUploadPop,
  updateAssessmentMediaUploadStatus,
  resetStateCurrentState,
} from "@/redux/reducers/mediaUploadSlice";
import { AUTH_API_STATUS, S3_URL } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useSavePatientResponseMutation } from "@/redux/api/patientsApi";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
import {
  getAssessmentMediaUploadPayload,
  getMediaType,
} from "@/redux/services/utils";
import axios from "axios";
import Grid from "@mui/material/Grid";

interface UploadAssessmentMediaStatusModelProps extends DialogProps {
  children?: React.ReactNode;
  fileInfo: any;
  studyId: string;
  currentQuestion: any;
  isFinalStep?: boolean;
  onCompletedCallBack: (data: any) => void;
}

const UploadAssessmentMediaStatusModel = ({
  fileInfo,
  onCompletedCallBack,
  studyId,
  isFinalStep,
  currentQuestion,
  ...props
}: UploadAssessmentMediaStatusModelProps) => {
  const uppy = new Uppy();
  const { data: session } = useSession();
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const dispatch = useDispatch();
  const { mediaUploadStatus } = useSelector(
    (state: any) => state?.mediaUploadSlice
  );
  const [savePatientResponse] = useSavePatientResponseMutation();
  const handleSubmitAssessment = async () => {
    try {
      const _mediaType = getMediaType(fileInfo?.type);
      const payload = getAssessmentMediaUploadPayload(
        _mediaType,
        currentQuestion,
        session as Session
      );

      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${session?.user?.id}/${fileInfo?.name}`,
        isLastQuestion: isFinalStep,
      })) as any;
      if (response?.data?.status === "success") {
        dispatch(
          updateAssessmentMediaUploadStatus({
            message: "Congratulations! Successfully collected your thoughts",
            status: "SUCCESS",
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAssessmentMediaUploadStatus({
          message:
            "We apologize, but the server is currently experiencing high traffic or is temporarily overwhelmed. Please try again in a few moments.",
          status: "ERROR",
        })
      );
    }
  };

  uppy.on("progress", (number) => {
    dispatch(
      updateAssessmentMediaUploadStatus({
        progress: number,
        message: "Collecting your thoughts...",
        status: "LOADING",
      })
    );
  });

  uppy.on("error", () => {
    dispatch(
      updateAssessmentMediaUploadStatus({
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
    dispatch(showUploadPop(false));
  };

  const handlePostVideo = (s3Url: string, file: any) => {
    return new Promise((resolve, reject) => {
      axios
        .put(s3Url, file, {
          headers: {
            "Content-Type": file?.type,
          },
          onUploadProgress(progressEvent) {
            const { loaded, total } = progressEvent;
            if (total) {
              let percent = Math.floor((loaded * 100) / total);
              if (percent <= 100) {
                dispatch(
                  updateAssessmentMediaUploadStatus({
                    progress: percent,
                    message: "Collecting your thoughts...",
                    status: "LOADING",
                  })
                );
              }
            }
          },
        })
        .then((response) => {
          handleSubmitAssessment();
          resolve(response);
        })
        .catch((error) => {
          dispatch(
            updateAssessmentMediaUploadStatus({
              message:
                "We apologize, but the server is currently experiencing high traffic or is temporarily overwhelmed. Please try again in a few moments.",
              status: "ERROR",
            })
          );
          reject(error);
        });
    });
  };

  // Handle Submit
  const handleSubmit = async () => {
    try {
      const signedUrlResponse = (await getSignedUploadUrl({
        fileName: fileInfo?.name,
        contentType: fileInfo?.type,
        userId: session?.user?.id as string,
      })) as any;
      const { url } = signedUrlResponse?.data?.data;
      const _mediaType = getMediaType(fileInfo?.type);
      if (_mediaType === "VIDEO") {
        await handlePostVideo(url, fileInfo);
      } else {
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
      }
    } catch (error) {
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  const handleOk = () => {
    dispatch(resetStateCurrentState());
    onCompletedCallBack(currentQuestion?.stage);
  };

  useEffect(() => {
    return () => {
      uppy.close();
    };
  }, []);

  // useEffect(() => {
  //   if (fileInfo && showUploadPop) {
  //     handleSubmit();
  //   }
  // }, [fileInfo]);

  useEffect(() => {
    if (mediaUploadStatus === "SUCCESS") {
      handleOk();
    }
    if (mediaUploadStatus === "ERROR") {
      alert("Something went to wrong please try again...");
      dispatch(resetStateCurrentState());
    }
  }, [mediaUploadStatus]);

  return (
    <Dialog {...props}>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
          <Box mt={1}>
            <Typography>Saving...</Typography>
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAssessmentMediaStatusModel;
