"use client";
import MobileStepperComponent from "@/components/Common/MobileStepper/MobileStepper";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import AssessmentViewLayoutOne from "@/components/Layout/Assessment/AssessmentViewOne/AssessmentViewOne";
import Box from "@mui/material/Box";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import { Divider, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import EmojiInputFieldComponent from "@/components/Common/FormFields/EmojiInputField/EmojiInputField";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
} from "@/utils/constants";
import _ from "lodash";
import { useSession } from "next-auth/react";
import {
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/patientsApi";
import { getEmojiSentiments, getOnboardingDataByStep } from "@/redux/utils";
import { Session } from "next-auth";
import { useDispatch, useSelector } from "react-redux";
import VoiceRecorderComponent from "@/components/Common/FileUpload/VoiceRecorder/VoiceRecorder";
import SentimentsSelectionField from "@/components/Common/FormFields/EmojiInputField/SentimentsSelectionField";
import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import InfoContentVersionOneComponent from "@/components/Common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import RadioGroupSelectionComponent from "@/components/Common/FormFields/EmojiInputField/RadioGropSelection";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { getHomeAssemmentPayload } from "@/redux/services/homeAssessments";
import { toast } from "react-toastify";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import UploadAssessmentMediaStatusModel from "@/components/Common/UploadStatusModel/UploadStatusModel";
import { setCurrentQuestion } from "@/redux/reducers/homeAssessmentsSlice";
import { showUploadPop } from "@/redux/reducers/mediaUploadSlice";

interface DiaryCheckingViewProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
}

const DiaryCheckingView = ({
  assessments,
  isSuccessOnboardingQuestions,
  isErrorOnboardingQuestions,
}: DiaryCheckingViewProps) => {
  const router: AppRouterInstance = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const routePath = usePathname();
  const activeStep = searchParams.get("step");
  const [sentimentDescription, setSentimentDescription] = useState(null);
  const [sentiment, setSentiment] = useState<string>("");
  const [audioFileInfo, setAudioFileInfo] = useState<any>(null);
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const { data: session, update } = useSession();

  const { control, handleSubmit, formState, reset, getValues } = useForm({
    mode: "all",
  });

  const [
    fetchPatientResponse,
    {
      isSuccess: isSuccessPatientResponse,
      isLoading: isLoadingPatientResponse,
      data: dataPatientResponse,
    },
  ] = useLazyFetchPatientResponseQuery();
  const { showPopup } = useSelector((state: any) => state?.mediaUploadSlice);
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );
  const [savePatientResponse, { isLoading: isLoadingSavedPatientResponse }] =
    useSavePatientResponseMutation();

  const onSubmit = async (data: any) => {
    try {
      const finalPayload = getHomeAssemmentPayload(
        currentQuestion,
        data,
        session as Session,
        assessments?.emojiData
      );

      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        finalPayload.payload.isLastQuestion = true;
      }

      const response = (await savePatientResponse({
        ...finalPayload?.payload,
      })) as any;

      if (response?.data?.data) {
        if (
          Number(activeStep) === assessments?.onboardingQuestionsData.length
        ) {
          setIsFinalStep(true);
        } else {
          if (finalPayload?.payload?.questionStage === 4) {
            if (finalPayload?.payload?.options?.[0]?.optionValue === "No") {
              setIsFinalStep(true);
            } else {
              router.push(`${routePath}?step=${Number(activeStep) + 1}`);
            }
          } else {
            router.push(`${routePath}?step=${Number(activeStep) + 1}`);
          }
        }
      }
    } catch (error) {
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };
  const handleShuffleNavigation = (stage: number) => {
    if (stage === 1) {
      router.push(`${routePath}?step=${Number(activeStep) + 3}`);
    } else {
      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        setIsFinalStep(true);
      } else {
        router.push(`${routePath}?step=${Number(activeStep) + 1}`);
      }
    }
  };

  useEffect(() => {
    return () => {
      reset();
      dispatch(setCurrentQuestion(null));
    };
  }, [session]);

  useEffect(() => {
    if (assessments?.totalSteps < Number(activeStep)) {
      setIsFinalStep(true);
    } else {
      if (assessments?.length <= 0) {
        setIsFinalStep(true);
      } else {
        dispatch(
          setCurrentAssessmentQuestion(
            getOnboardingDataByStep(
              assessments?.onboardingQuestionsData,
              activeStep
            )
          )
        );
      }
    }
  }, [activeStep, assessments]);

  useEffect(() => {
    if (isSuccessOnboardingQuestions) {
      fetchPatientResponse({
        patientId: session?.user?.id,
        studyId: session?.user?.studyId,
        studyRecordId: session?.user?.studyRecordId,
      });
    }
  }, [isSuccessOnboardingQuestions]);

  useEffect(() => {
    if (isSuccessPatientResponse) {
      reset(dataPatientResponse?.formInputValues);
      setSentiment(dataPatientResponse?.selectedSentimentDes?.optionValue);
      setSentimentDescription(
        dataPatientResponse?.selectedSentimentDes?.description
      );
    }
  }, [isLoadingPatientResponse]);


  return (
    <MobileStepperComponent
      isError={isErrorOnboardingQuestions}
      disabledNextButton={
        !formState?.isValid || assessments?.totalSteps < Number(activeStep)
      }
      isSubmitting={isLoadingSavedPatientResponse}
      onClickNext={handleSubmit(onSubmit)}
      onClickPrev={() => {
        router.back();
      }}
      onClose={() => {
        router.push(APP_ROUTES.HOME);
      }}
      maxSteps={assessments?.totalSteps || 0}
      activeStep={
        Number.isInteger(Number(activeStep)) ? Number(activeStep) - 1 : 0
      }
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
                    <AssessmentViewLayoutOne>
                      <Box component="div" className="__quesion_view">
                        <SectionTitlesOneComponent
                          title={
                            question?.stage === 3
                              ? `${question?.value} ${sentiment}?`
                              : question?.value
                          }
                          content={null}
                          node={
                            currentQuestion?.stage === 1 ? (
                              <Box mb={2}>
                                <Typography
                                  sx={(theme) => ({
                                    color: theme.palette.grey[600],
                                  })}
                                  variant="body1"
                                >
                                  Tap your current mood
                                </Typography>
                              </Box>
                            ) : null
                          }
                        />

                        {question?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.EMOJI_RATING
                        ) && (
                          <EmojiInputFieldComponent
                            defaultValues={null}
                            id={question?._id}
                            name={
                              question?.stage == 2
                                ? question?.stage_1_qus_id +
                                  QUESTION_ANSWER_TYPE.EMOJI_RATING
                                : question?._id +
                                  QUESTION_ANSWER_TYPE.EMOJI_RATING
                            }
                            control={control}
                            disabled={question?.stage === 2}
                            rules={{
                              required: true,
                            }}
                            labelName="optionValue"
                            targetValue="_id"
                            options={question?.options}
                          />
                        )}

                        {question?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
                        ) && (
                          <Box mt={2}>
                            <EmojiInputFieldComponent
                              defaultValues={null}
                              id={question?._id}
                              name={
                                question?.stage_1_qus_id +
                                QUESTION_ANSWER_TYPE.EMOJI_RATING
                              }
                              control={control}
                              disabled={true}
                              rules={{
                                required: true,
                              }}
                              labelName="optionValue"
                              targetValue="_id"
                              options={question?.options}
                            />
                            <Box mt={2}>
                              <SentimentsSelectionField
                                control={control}
                                id={question?._id}
                                name={
                                  question?._id +
                                  QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
                                }
                                targetValue="_id"
                                defaultValues={null}
                                rules={{
                                  required: true,
                                }}
                                labelName="sentimentValue"
                                options={getEmojiSentiments(
                                  getValues(
                                    question?.stage_1_qus_id +
                                      QUESTION_ANSWER_TYPE.EMOJI_RATING
                                  ),
                                  question?.options,
                                  assessments?.emojiData
                                )}
                                onChange={(
                                  _,
                                  { description, sentimentLabel }
                                ) => {
                                  setSentiment(sentimentLabel);
                                  setSentimentDescription(description);
                                }}
                              />
                            </Box>
                          </Box>
                        )}

                        {question?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.BOOLEAN
                        ) && (
                          <Box mt={4}>
                            <RadioGroupSelectionComponent
                              control={control}
                              id={question?._id}
                              name={
                                question?._id + QUESTION_ANSWER_TYPE.BOOLEAN
                              }
                              radioGroupProps={{
                                row: false,
                              }}
                              targetValue="_id"
                              varientBtnProps={{
                                size: "large",
                                sx: {
                                  width: 200,
                                },
                              }}
                              gridProps={{
                                direction: "column",
                                spacing: 2,
                              }}
                              varient="BUTTON"
                              defaultValues={null}
                              rules={{
                                required: true,
                              }}
                              labelName="optionValue"
                              options={question?.options}
                            />
                          </Box>
                        )}

                        {question?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.TEXT
                        ) && (
                          <TextInputFieldComponent
                            id={question?._id}
                            name={question?._id + QUESTION_ANSWER_TYPE.TEXT}
                            label=""
                            defaultValue={""}
                            control={control}
                            rules={{
                              required: true,
                            }}
                            textFieldProps={{
                              fullWidth: true,
                              multiline: true,
                              rows: 8,
                            }}
                          />
                        )}
                      </Box>
                      {question?.responseType?.includes(
                        QUESTION_ANSWER_TYPE.AUDIO
                      ) && (
                        <Fragment>
                          <Box mt={2} mb={2}>
                            <Divider>Or</Divider>
                          </Box>
                          <Box component="div" className="__voice_record_view">
                            <VoiceRecorderComponent
                              fileType="AUDIO"
                              onRecordingCompleted={(data) => {
                                setAudioFileInfo(data);
                                dispatch(showUploadPop(true));
                              }}
                            />
                          </Box>
                        </Fragment>
                      )}
                      {currentQuestion?.stage == 2 && sentimentDescription && (
                        <Box component="div" className="__info_view">
                          {sentimentDescription}
                        </Box>
                      )}
                    </AssessmentViewLayoutOne>
                  )}
                </Fragment>
              );
            }
          )}
        </>
      )}
      <UploadAssessmentMediaStatusModel
        fileInfo={audioFileInfo}
        currentQuestion={currentQuestion}
        isFinalStep={
          Number(activeStep) === assessments?.onboardingQuestionsData.length
        }
        open={showPopup}
        studyId={session?.user?.studyId as string}
        onCompletedCallBack={handleShuffleNavigation}
      />
      <DialogVersionOneComponent fullScreen open={isFinalStep}>
        {assessments?.totalSteps < Number(activeStep) ||
        assessments?.length === 0 ? (
          <InfoContentVersionOneComponent
            title="Sorry!"
            subTitle="We Haven't Found Any Assessments"
            imgUrl="/icons/no_items.svg"
            btnProps={{
              size: "large",
              onClick: () => {
                update({
                  ...session,
                  user: {
                    ...session?.user,
                    studyId: null,
                    studyRecordId: null,
                  },
                });
                router.replace(APP_ROUTES.HOME);
              },
            }}
            btnName="Go to Study Dashboard"
          />
        ) : (
          <InfoContentVersionOneComponent
            title="Thank you!"
            subTitle="Congratulations, you’ve completed this assessment."
            btnProps={{
              size: "large",
              onClick: () => {
                update({
                  ...session,
                  user: {
                    ...session?.user,
                    studyId: null,
                    studyRecordId: null,
                  },
                });
                router.replace(APP_ROUTES.HOME);
              },
            }}
            btnName="Go to Study Dashboard"
          />
        )}
      </DialogVersionOneComponent>
    </MobileStepperComponent>
  );
};

export default DiaryCheckingView;
