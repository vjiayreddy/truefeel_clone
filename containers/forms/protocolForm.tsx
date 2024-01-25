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
import {
  useCreateProtocolMutation,
  useUpdateProtocolMutation,
} from "@/redux/api/protocolApi";
import { useFilterPatientsQuery } from "@/redux/api/patientsApi";
import { toast } from "react-toastify";
import { AUTH_API_STATUS, DEFAULT_DATE_FORMATE } from "@/utils/constants";
import AutoCompleteInputFiled from "@/components/formFields/autoCompleteField";
import {
  getProtocolFormPayload,
  getUpdateProtocolFormPayload,
} from "@/redux/utils";
import { protocolType } from "@/redux/types";
import moment from "moment";

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
  selectedProtocol?: protocolType;
  onClose: () => void;
}

const ProtocolForm = ({
  open,
  selectedProtocol,
  onClose,
}: ProjectFormProps) => {
  const { control, handleSubmit, reset } = useForm();
  const { data: patientsData } = useFilterPatientsQuery({});

  const [createProtocol, { isLoading, isError, error, isSuccess }] =
    useCreateProtocolMutation();
  const [
    updateProtocol,
    {
      isLoading: isUpdateProtocolLoading,
      isError: isUpdateProtocolError,
      isSuccess: isUpdateProtocolSuccess,
      error: updateProtocolError,
    },
  ] = useUpdateProtocolMutation();

  const onSubmitForm = async (data: any) => {
    if (selectedProtocol) {
      const payload = getUpdateProtocolFormPayload(data);
      await updateProtocol({
        protocolId: selectedProtocol?._id,
        payload,
      });
    } else {
      const payload = getProtocolFormPayload(data);
      await createProtocol(payload);
    }
  };

  useEffect(() => {
    if (isSuccess || isUpdateProtocolSuccess) {
      if (isUpdateProtocolSuccess) {
        toast.success(AUTH_API_STATUS.PROTOCOL_UPDATED_SUCCESSFULL);
      } else {
        toast.success(AUTH_API_STATUS.PROTOCOL_REGISTRED_SUCCESSFULL);
      }
    }
    if (isError || isUpdateProtocolError) {
      if (isUpdateProtocolError) {
        toast.error((updateProtocolError as any).data.message);
      } else {
        toast.error((error as any).data.message);
      }
    }
  }, [isLoading, isUpdateProtocolLoading]);

  return (
    <StyledDialog open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {selectedProtocol
          ? `Update protocol`
          : "Create a Protocol"}
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
              label="Protocol Title"
              defaultValue={selectedProtocol?.title || ""}
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
              label="Protocol Description"
              defaultValue={selectedProtocol?.description || ""}
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
              label="Protocol Image Url"
              rules={{
                required: "Protocol Image Url is required",
              }}
              defaultValue={selectedProtocol?.bannerImage || ""}
              control={control}
              textFieldProps={{ size: "small", fullWidth: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickerInputFieldComponent
              control={control}
              name="startDate"
              label="Protocol Start Date"
              defaultValue={
                selectedProtocol?.startDate
                  ? moment(
                      selectedProtocol?.startDate,
                      DEFAULT_DATE_FORMATE
                    ).toISOString()
                  : null
              }
              rules={{
                required: "Protocol Start Date is required",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickerInputFieldComponent
              control={control}
              name="endDate"
              rules={{
                required: "Protocol End Date is required",
              }}
              label="Protocol End Date"
              defaultValue={
                selectedProtocol?.endDate
                  ? moment(
                      selectedProtocol?.endDate,
                      DEFAULT_DATE_FORMATE
                    ).toISOString()
                  : null
              }
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
              defaultValues={selectedProtocol?.members || []}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text" autoFocus color="error">
          Cancel
        </Button>
        <Button
          disabled={isLoading || isUpdateProtocolLoading}
          onClick={handleSubmit(onSubmitForm)}
          variant="text"
        >
          {selectedProtocol ? "Update a Protocol" : " Create a Protocol"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ProtocolForm;
