import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import { useForm, useFieldArray } from "react-hook-form";
import SelectInputFieldComponent from "@/components/formFields/selectInputField";
import {
  ASSESSMENT_QUES_TYPES_LIST,
  AUTH_API_STATUS,
  QUES_CAT_ID,
} from "@/utils/constants";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import {
  useCreateAssessmentQuestionMutation,
  useFetchEmojiesQuery,
  useGetQuestionTypesQuery,
  useUpdateAssessmentQuestionMutation,
} from "@/redux/api/assesmentsApi";
import _ from "lodash";
import CheckBoxControlGroup from "@/components/formFields/checkBoxGroup";
import { handleEmojiRating } from "@/utils/actions";
import { useSelector, useDispatch } from "react-redux";

const QuestionFormContainer = () => {
  const { control, handleSubmit, watch, reset, getValues } = useForm({
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      questionOptionTypeId: "",
      emojiRating: [],
      options: [
        {
          optionValue: "",
        },
        {
          optionValue: "",
        },
      ],
    },
  });
  const { assessmentSlice } = useSelector((state: any) => state);
  const { selectedQuestion } = assessmentSlice;
  const dispatch = useDispatch();
  const params = useParams();
  const { data: questionTypesData, isLoading } = useGetQuestionTypesQuery({});
  const { data: emojiData, isLoading: isEmojiesLoading } =
    useFetchEmojiesQuery();
  const [
    createAssessmentQuestion,
    {
      isSuccess: isUAQSuccess,
      isError: isUAQError,
      error: UAQError,
      isLoading: isUAQLoading,
    },
  ] = useCreateAssessmentQuestionMutation();

  const [
    updateAssessmentQuestion,
    { isSuccess, isError, error, isLoading: isCreateAssessmentQuestionLoading },
  ] = useUpdateAssessmentQuestionMutation();

  const questionOptionTypeId = watch("questionOptionTypeId");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const finedQuestionOptionType = (questionOptionTypeId: string) => {
    const questionType = _.find(
      questionTypesData?.data,
      (item: any) => item.value === questionOptionTypeId
    );
    return questionType ? questionType?.label : "";
  };

  const onSubmit = async (data: any) => {
    const questionType = finedQuestionOptionType(data?.questionOptionTypeId);
    let payload: any = {};
    if (
      questionType === ASSESSMENT_QUES_TYPES_LIST.AUDIO ||
      questionType === ASSESSMENT_QUES_TYPES_LIST.TEXT ||
      questionType === ASSESSMENT_QUES_TYPES_LIST.VIDEO
    ) {
      payload = {
        ...data,
        options: [],
      };
    } else if (questionType === ASSESSMENT_QUES_TYPES_LIST.EMOJI_RATING) {
      const { emojiRating, ...rest } = data;
      payload = {
        ...rest,
        options: emojiRating.map((item: string) => {
          return {
            optionValue: item,
          };
        }),
      };
    } else {
      payload = {
        ...data,
      };
    }
    delete payload["emojiRating"];
    if (selectedQuestion) {
      await updateAssessmentQuestion({
        questionId: selectedQuestion?._id,
        payload: {
          surveyId: params?.id,
          questionCategoryId: QUES_CAT_ID,
          ...payload,
        },
      });
    } else {
      await createAssessmentQuestion({
        payload: {
          surveyId: params?.id,
          questionCategoryId: QUES_CAT_ID,
          ...payload,
        },
      });
    }
  };

  React.useEffect(() => {
    const subscription = watch(() => null);
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(AUTH_API_STATUS.ASSESSMENT_QUESTION_CREATED_SUCCESSFULL);
    }
    if (isError) {
      toast.error((error as any).data.message);
    }
  }, [isLoading, isCreateAssessmentQuestionLoading]);

  useEffect(() => {
    if (selectedQuestion) {
      reset({
        title: selectedQuestion?.title,
        description: selectedQuestion?.description,
        questionOptionTypeId: selectedQuestion?.questionOptionTypeData?._id,
        options: selectedQuestion?.options,
      });
    }
  }, [selectedQuestion]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInputFieldComponent
            id="title_input"
            name="title"
            label="Question Title"
            defaultValue={""}
            control={control}
            rules={{
              required: "Question Title is required",
            }}
            textFieldProps={{ size: "small", fullWidth: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputFieldComponent
            id="description_input"
            name="description"
            label="Question Description"
            defaultValue={""}
            control={control}
            rules={{
              required: false,
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
          <SelectInputFieldComponent
            options={isLoading ? [] : (questionTypesData?.data as any[])}
            control={control}
            id="question-type-input"
            label="Input Type"
            name="questionOptionTypeId"
            defaultValue=""
            rules={{
              required: "Input type is required",
            }}
          />
        </Grid>

        {(finedQuestionOptionType(questionOptionTypeId) ===
          ASSESSMENT_QUES_TYPES_LIST.SINGLE_SELECTION ||
          finedQuestionOptionType(questionOptionTypeId) ===
            ASSESSMENT_QUES_TYPES_LIST.MULTIPLE_SELECTION ||
          finedQuestionOptionType(questionOptionTypeId) ===
            ASSESSMENT_QUES_TYPES_LIST.RATING) && (
          <Grid container item xs={12} spacing={1}>
            {fields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <TextInputFieldComponent
                  id={`input-option-value-${index}`}
                  name={`options.${index}.optionValue`}
                  label={`Option - ${index + 1}`}
                  defaultValue={""}
                  control={control}
                  rules={{
                    required: "Option is required",
                  }}
                  textFieldProps={{
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                      endAdornment:
                        index > 1 ? (
                          <InputAdornment position="end">
                            <IconButton
                              color="error"
                              sx={{ padding: 0 }}
                              onClick={() => remove(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        ) : (
                          <></>
                        ),
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {finedQuestionOptionType(questionOptionTypeId) ===
          ASSESSMENT_QUES_TYPES_LIST.EMOJI_RATING && (
          <Grid item xs={12}>
            <CheckBoxControlGroup
              gridItemProps={{}}
              options={isEmojiesLoading ? [] : emojiData?.data}
              targetValue="label"
              name="emojiRating"
              id="emoji_rating_input"
              control={control}
              variant="EMOJI"
              labelName="label"
              rules={{
                required: "Please select atleat Two items",
              }}
              onChange={(checkedValue, fieldName) =>
                handleEmojiRating(checkedValue, fieldName, getValues)
              }
            />
          </Grid>
        )}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          item
          xs={12}
          spacing={2}
        >
          <Grid item xs>
            {(finedQuestionOptionType(questionOptionTypeId) ===
              ASSESSMENT_QUES_TYPES_LIST.SINGLE_SELECTION ||
              finedQuestionOptionType(questionOptionTypeId) ===
                ASSESSMENT_QUES_TYPES_LIST.MULTIPLE_SELECTION ||
              finedQuestionOptionType(questionOptionTypeId) ===
                ASSESSMENT_QUES_TYPES_LIST.RATING) && (
              <Button
                onClick={() =>
                  append({
                    optionValue: "",
                  })
                }
                startIcon={<AddIcon />}
                variant="text"
              >
                Add More Options
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              {selectedQuestion ? "Update" : "Submit"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                reset({});
              }}
              color="error"
              variant="contained"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionFormContainer;
