import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import { useForm } from "react-hook-form";
import DatePickerInputFieldComponent from "@/components/formFields/datePickerInputField";
import { useFilterPatientsQuery } from "@/redux/api/patientsApi";
import { toast } from "react-toastify";
import {
  ASSESSMENT_TYPES,
  AUTH_API_STATUS,
  DEFAULT_DATE_FORMATE,
} from "@/utils/constants";
import AutoCompleteInputFiled from "@/components/formFields/autoCompleteField";
import {
  getAssessmentFormPayload,
  getAssessmentUpdareFormPayload,
} from "@/redux/utils";
import { protocolType } from "@/redux/types";
import moment from "moment";
import SelectInputFieldComponent from "@/components/formFields/selectInputField";
import { useSearchParams } from "next/navigation";
import {
  useCreateAssessmentMutation,
  useUpdateAssessmentByIdMutation,
} from "@/redux/api/assesmentsApi";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ProjectFormProps {
  open: boolean;
  selectedAssessment?: protocolType;
  onClose: () => void;
}

const AssessmentFormContainer = ({
  open,
  selectedAssessment,
  onClose,
}: ProjectFormProps) => {
  const { control, handleSubmit } = useForm();
  const { data: patientsData } = useFilterPatientsQuery({});
  const searchParams = useSearchParams();
  const protocolId = searchParams.get("protocolId");
  const [createAssessment, { isLoading, isError, error, isSuccess }] =
    useCreateAssessmentMutation();
  const [
    updateAssessmentById,
    {
      isLoading: isUpdateAssessmentLoading,
      isError: isUpdateAssessmentError,
      isSuccess: isUpdateAssessmentSuccess,
      error: updateAssessmentError,
    },
  ] = useUpdateAssessmentByIdMutation();

  const onSubmitForm = async (data: any) => {
    if (selectedAssessment) {
      const payload = getAssessmentUpdareFormPayload(data);
      await updateAssessmentById({
        assessmentId: selectedAssessment?._id,
        payload,
      });
    } else {
      const payload = getAssessmentFormPayload(protocolId as string, data);
      await createAssessment(payload);
    }
  };

  useEffect(() => {
    if (isSuccess || isUpdateAssessmentSuccess) {
      if (isUpdateAssessmentSuccess) {
        toast.success(AUTH_API_STATUS.ASSESSMENT_UPDATED_SUCCESSFULL);
      } else {
        toast.success(AUTH_API_STATUS.ASSESSMENT_CREATED_SUCCESSFULL);
      }
    }
    if (isError || isUpdateAssessmentError) {
      if (isUpdateAssessmentError) {
        toast.error((updateAssessmentError as any).data.message);
      } else {
        toast.error((error as any).data.message);
      }
    }
  }, [isLoading, isUpdateAssessmentLoading]);

  return (
    <StyledDialog open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {selectedAssessment ? `Update Assessment` : "Create new assessment"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="title_input"
              name="title"
              label="Assessment Title"
              defaultValue={selectedAssessment?.title || ""}
              control={control}
              rules={{
                required: "Protocol Title is required",
              }}
              textFieldProps={{ size: "small", fullWidth: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="description_input"
              name="description"
              label="Assessment Description"
              defaultValue={selectedAssessment?.description || ""}
              control={control}
              rules={{
                required: "Protocol Description is required",
              }}
              textFieldProps={{
                size: "small",
                fullWidth: true,
                multiline: true,
                rows: 3,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInputFieldComponent
              id="imageUrl_input"
              name="bannerImage"
              label="Assessment Image Url"
              rules={{
                required: "Assessment Image Url is required",
              }}
              defaultValue={selectedAssessment?.bannerImage || ""}
              control={control}
              textFieldProps={{ size: "small", fullWidth: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePickerInputFieldComponent
              control={control}
              name="startDate"
              label="Start Date"
              defaultValue={
                selectedAssessment?.startDate
                  ? moment(
                      selectedAssessment?.startDate,
                      DEFAULT_DATE_FORMATE
                    ).toISOString()
                  : null
              }
              rules={{
                required: "Start Date is required",
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePickerInputFieldComponent
              control={control}
              name="endDate"
              rules={{
                required: "Assessment End Date is required",
              }}
              label="End Date"
              defaultValue={
                selectedAssessment?.endDate
                  ? moment(
                      selectedAssessment?.endDate,
                      DEFAULT_DATE_FORMATE
                    ).toISOString()
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectInputFieldComponent
              options={ASSESSMENT_TYPES}
              control={control}
              id="Assessment-type-input"
              label="Type"
              name="surveyType"
              defaultValue=""
              rules={{
                required: "Start Date is required",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <AutoCompleteInputFiled
              options={patientsData?.data || []}
              rules={{
                required: "Select atleast one member",
              }}
              isEqualValue="_id"
              id="members-input"
              targetValue="firstName"
              control={control}
              name="members"
              multiple={true}
              defaultValues={selectedAssessment?.members || []}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text" autoFocus color="error">
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmitForm)}
          variant="text"
        >
          {selectedAssessment ? "Update a Assessment" : " Create a Assessment"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AssessmentFormContainer;
