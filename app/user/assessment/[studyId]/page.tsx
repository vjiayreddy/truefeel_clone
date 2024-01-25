"use client";
import React, { Fragment, useEffect, useState } from "react";
import RadioGroupSelectionComponent from "@/components/Common/FormFields/EmojiInputField/RadioGropSelection";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import MobileStepperComponent from "@/components/Common/MobileStepper/MobileStepper";
import AssessmentViewLayoutOne from "@/components/Layout/Assessment/AssessmentViewOne/AssessmentViewOne";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useLazyFetchOnboardingQuestionsQuery } from "@/redux/api/assesmentsApi";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import { APP_ROUTES } from "@/utils/routes";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { getOnboardingDataByStep } from "@/redux/utils";
import VoiceRecorderComponent from "@/components/Common/FileUpload/VoiceRecorder/VoiceRecorder";
import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import InfoContentVersionOneComponent from "@/components/Common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import IntroLayoutComponent from "@/components/Layout/Intro/Intro";
import VideoLayoutComponent from "@/components/Layout/Video/VideoLayout";
import { useSession } from "next-auth/react";
import {
  calculateUnitMg,
  checkIsOnlyAudioResponse,
  checkUnitType,
} from "@/redux/services/utils";
import UploadAssessmentMediaStatusModel from "@/components/Common/UploadStatusModel/UploadStatusModel";
import { showUploadPop } from "@/redux/reducers/mediaUploadSlice";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import { Typography } from "@mui/material";
import _ from "lodash";
import { getTodayAssessmentsPayload } from "@/redux/services/homeAssessments";
import { Session } from "next-auth";
import {
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/patientsApi";

const AssessmentPage = () => {
  const router: AppRouterInstance = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const params = useParams();
  const { data: session, update } = useSession();
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const activeStep = searchParams.get("step");
  const [mediaFileInfo, setMediaFileInfo] = useState<any>(null);
  const { showPopup } = useSelector((state: any) => state?.mediaUploadSlice);
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );

  const {
    handleSubmit,
    formState,
    reset,
    control,
    register,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "all",
  });
  const watchFromStatus = watch();
  const [
    fetchOnboardingQuestions,
    {
      isLoading: isLoadingOnboardingQuestions,
      isFetching: isFetchingOnboardingQuestions,
      isError: isErrorOnboardingQuestions,
      data: assessments,
      isSuccess: isSuccessOnboardingQuestions,
    },
  ] = useLazyFetchOnboardingQuestionsQuery({});
  const [savePatientResponse, { isLoading: isLoadingSavedPatientResponse }] =
    useSavePatientResponseMutation();

  const [
    fetchPatientResponse,
    {
      isSuccess: isSuccessPatientResponse,
      isLoading: isLoadingPatientResponse,
      data: dataPatientResponse,
    },
  ] = useLazyFetchPatientResponseQuery();

  useEffect(() => {
    if (session?.user?.studyId) {
      fetchOnboardingQuestions({
        studyId: session?.user?.studyId as string,
      });
    }
  }, [session]);

  useEffect(() => {
    return () => {
      reset();
      dispatch(setCurrentAssessmentQuestion(null));
    };
  }, []);

  useEffect(() => {
    if (isSuccessOnboardingQuestions) {
      fetchPatientResponse({
        patientId: session?.user?.id,
        studyId: session?.user?.studyId,
        studyRecordId: session?.user?.studyRecordId,
      });
    }
  }, [isLoadingOnboardingQuestions]);

  useEffect(() => {
    if (isSuccessPatientResponse) {
      reset(dataPatientResponse?.formInputValues);
    }
  }, [isLoadingPatientResponse]);

  const onSubmit = async (data: any) => {
    try {
      const payload = getTodayAssessmentsPayload(
        currentQuestion,
        data,
        session as Session
      );
      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        payload.isLastQuestion = true;
      }

      const response = (await savePatientResponse({
        ...payload,
      })) as any;

      if (response?.data?.data) {
        if (
          Number(activeStep) === assessments?.onboardingQuestionsData.length
        ) {
          setIsFinalStep(true);
        } else {
          router.push(`${pathName}?step=${Number(activeStep) + 1}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (assessments?.totalSteps < Number(activeStep)) {
      setIsFinalStep(true);
    } else {
      const currrentQuestion: any = getOnboardingDataByStep(
        assessments?.onboardingQuestionsData,
        activeStep
      );
      dispatch(setCurrentAssessmentQuestion(currrentQuestion));
    }
  }, [activeStep, assessments]);

  const handleShuffleNavigation = () => {
    if (Number(activeStep) === assessments?.onboardingQuestionsData?.length) {
      setIsFinalStep(true);
    } else {
      router.push(`${pathName}?step=${Number(activeStep) + 1}`);
    }
  };

  const getConditionBasedQuestion = (
    rootQuestionId: any,
    selectedQuestion: any
  ) => {
    let subQuestion: any = null;
    if (selectedQuestion?.conditions?.length > 0) {
      selectedQuestion?.conditions?.map((item: any) => {
        if (item?.optionIds?.includes(rootQuestionId)) {
          if (selectedQuestion?.subQuestion?.length > 0) {
            selectedQuestion?.subQuestion.map((_q: any) => {
              if (item?.subQuestionIds?.includes(_q?._id)) {
                subQuestion = _q;
              }
            });
          }
        }
      });
    }

    return subQuestion;
  };

  return (
    <MobileStepperComponent
      onClickNext={handleSubmit(onSubmit)}
      onClickPrev={() => {
        router.back();
      }}
      disabledNextButton={
        !formState?.isValid ||
        assessments?.totalSteps < Number(activeStep) ||
        checkIsOnlyAudioResponse(currentQuestion?.responseType)
      }
      isSubmitting={isLoadingSavedPatientResponse}
      isError={isErrorOnboardingQuestions}
      maxSteps={assessments?.totalSteps || 0}
      isLoading={isLoadingOnboardingQuestions || isFetchingOnboardingQuestions}
      activeStep={
        Number.isInteger(Number(activeStep)) ? Number(activeStep) - 1 : 0
      }
      onClose={() => {
        router.push(APP_ROUTES.HOME);
      }}
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
                    <AssessmentViewLayoutOne>
                      {question?.questionType.includes(
                        QUESTION_ANSWER_TYPE.INTRODUCTION
                      ) && (
                        <DialogVersionOneComponent
                          fullScreen
                          open={question?.questionType.includes(
                            QUESTION_ANSWER_TYPE.INTRODUCTION
                          )}
                        >
                          <IntroLayoutComponent
                            onClickExist={() => {
                              router.push(APP_ROUTES.HOME);
                            }}
                            onClickContinue={() => {
                              router.push(
                                `${APP_ROUTES.USER_ASSESSMENT}/${
                                  params?.studyId
                                }?step=${Number(activeStep) + 1}`
                              );
                            }}
                          >
                            <SectionTitlesOneComponent
                              title={question?.title}
                              content={question?.value}
                            />
                          </IntroLayoutComponent>
                        </DialogVersionOneComponent>
                      )}

                      {question?.questionType.includes(
                        QUESTION_ANSWER_TYPE.TEXT
                      ) && (
                        <Fragment>
                          <Box component="div" className="__quesion_view">
                            <SectionTitlesOneComponent
                              title={question?.title}
                              content={question?.value}
                            />

                            {question?.responseType?.includes(
                              QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                            ) && (
                              <Box>
                                <RadioGroupSelectionComponent
                                  control={control}
                                  id={`${QUESTION_ANSWER_TYPE.SINGLE_SELECTION}-${index}`}
                                  name={
                                    question?._id +
                                    QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                  }
                                  radioGroupProps={{
                                    row: false,
                                  }}
                                  gridProps={{
                                    direction: "row",
                                    spacing: 2,
                                  }}
                                  gridItemProps={{
                                    xs: 12,
                                  }}
                                  defaultValues={null}
                                  options={question?.options || []}
                                  targetValue="_id"
                                  labelName="optionValue"
                                  varient="CHECK_BOX_BUTTON"
                                  rules={{
                                    required: true,
                                  }}
                                />
                                {!_.isEmpty(question?.conditions) &&
                                  question?.hasSubQuestion &&
                                  !_.isEmpty(question?.subQuestion) && (
                                    <Box mt={3}>
                                      {getConditionBasedQuestion(
                                        watchFromStatus[
                                          question?._id +
                                            QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                        ],
                                        question
                                      )?.questionType?.includes(
                                        QUESTION_ANSWER_TYPE.TEXT
                                      ) && (
                                        <Fragment>
                                          {getConditionBasedQuestion(
                                            watchFromStatus[
                                              question?._id +
                                                QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                            ],
                                            question
                                          )?.responseType?.includes(
                                            QUESTION_ANSWER_TYPE.TEXT
                                          ) && (
                                            <Fragment>
                                              <TextInputFieldComponent
                                                id={
                                                  getConditionBasedQuestion(
                                                    watchFromStatus[
                                                      question?._id +
                                                        QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                                    ],
                                                    question
                                                  )?._id
                                                }
                                                name={
                                                  getConditionBasedQuestion(
                                                    watchFromStatus[
                                                      question?._id +
                                                        QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                                    ],
                                                    question
                                                  )?._id +
                                                  QUESTION_ANSWER_TYPE.TEXT
                                                }
                                                label=""
                                                defaultValue={""}
                                                control={control}
                                                rules={{
                                                  required: true,
                                                }}
                                                textFieldProps={{
                                                  fullWidth: true,
                                                  multiline: checkUnitType(
                                                    question?.unit
                                                  )?.multiLine,
                                                  type: checkUnitType(
                                                    question?.unit
                                                  )?.type,
                                                  placeholder:
                                                    getConditionBasedQuestion(
                                                      watchFromStatus[
                                                        question?._id +
                                                          QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                                      ],
                                                      question
                                                    )?.inputConfig?.placeholder                                                  ,
                                                  rows: 8,
                                                }}
                                              />
                                            </Fragment>
                                          )}
                                        </Fragment>
                                      )}
                                    </Box>
                                  )}
                              </Box>
                            )}

                            {question?.responseType?.includes(
                              QUESTION_ANSWER_TYPE.TEXT
                            ) && (
                              <Box>
                                {question?.hasSubQuestion &&
                                  _.isEmpty(question?.conditions) &&
                                  !_.isEmpty(question?.subQuestion) && (
                                    <Fragment>
                                      <input
                                        type="hidden"
                                        {...register(
                                          question?._id +
                                            QUESTION_ANSWER_TYPE.TEXT
                                        )}
                                      />
                                      {question?.subQuestion?.map(
                                        (subQus: any, index: number) => {
                                          return (
                                            <Fragment key={subQus._id}>
                                              {subQus?.questionType?.includes(
                                                QUESTION_ANSWER_TYPE.TEXT
                                              ) && (
                                                <Fragment>
                                                  {subQus?.responseType?.includes(
                                                    QUESTION_ANSWER_TYPE.TEXT
                                                  ) && (
                                                    <Fragment>
                                                      <Box mt={2} mb={2}>
                                                        <Typography variant="body1">
                                                          {subQus?.value}
                                                        </Typography>
                                                      </Box>
                                                      <TextInputFieldComponent
                                                        id={question?._id}
                                                        name={
                                                          subQus?._id +
                                                          QUESTION_ANSWER_TYPE.TEXT
                                                        }
                                                        label=""
                                                        defaultValue={""}
                                                        control={control}
                                                        onInputChange={() => {
                                                          if (
                                                            subQus?.unit ===
                                                            "mg"
                                                          ) {
                                                            const {
                                                              fieldId,
                                                              total,
                                                            } = calculateUnitMg(
                                                              question,
                                                              getValues
                                                            );
                                                            setValue(
                                                              `${
                                                                fieldId +
                                                                QUESTION_ANSWER_TYPE.TEXT
                                                              }`,
                                                              total
                                                            );
                                                          }
                                                        }}
                                                        rules={{
                                                          required: true,
                                                        }}
                                                        textFieldProps={{
                                                          fullWidth: true,
                                                          multiline:
                                                            checkUnitType(
                                                              question?.unit
                                                            )?.multiLine,
                                                          type: checkUnitType(
                                                            question?.unit
                                                          )?.type,
                                                          size: "small",
                                                          InputProps: {
                                                            disabled:
                                                              subQus?.unit ===
                                                              "mg"
                                                                ? question
                                                                    ?.subQuestion
                                                                    ?.length -
                                                                    1 ===
                                                                  index
                                                                : false,

                                                            endAdornment: (
                                                              <span>
                                                                {subQus?.unit}
                                                              </span>
                                                            ),
                                                          },
                                                          placeholder:
                                                            subQus?.inputField,
                                                        }}
                                                      />
                                                    </Fragment>
                                                  )}
                                                </Fragment>
                                              )}
                                            </Fragment>
                                          );
                                        }
                                      )}
                                    </Fragment>
                                  )}

                                {!question?.hasSubQuestion &&
                                  _.isEmpty(question?.conditions) &&
                                  _.isEmpty(question?.subQuestion) && (
                                    <Fragment>
                                      {question?.responseType?.includes(
                                        QUESTION_ANSWER_TYPE.TEXT
                                      ) && (
                                        <Fragment>
                                          <TextInputFieldComponent
                                            id={question?._id}
                                            name={
                                              question?._id +
                                              QUESTION_ANSWER_TYPE.TEXT
                                            }
                                            label=""
                                            defaultValue={""}
                                            control={control}
                                            rules={{
                                              required: true,
                                            }}
                                            textFieldProps={{
                                              fullWidth: true,
                                              InputProps: {
                                                multiline: checkUnitType(
                                                  question?.unit
                                                )?.multiLine,
                                                type: checkUnitType(
                                                  question?.unit
                                                )?.type,
                                                placeholder:
                                                  question?.inputField,
                                                rows: 10,
                                                endAdornment:
                                                  question?.unit !==
                                                  "string" ? (
                                                    <span>
                                                      {question?.unit}
                                                    </span>
                                                  ) : (
                                                    <Fragment />
                                                  ),
                                              },
                                            }}
                                          />
                                        </Fragment>
                                      )}
                                    </Fragment>
                                  )}
                              </Box>
                            )}
                          </Box>

                          {question?.responseType?.includes(
                            QUESTION_ANSWER_TYPE.AUDIO
                          ) && (
                            <Box
                              component="div"
                              className="__voice_record_view"
                            >
                              <VoiceRecorderComponent
                                fileType={QUESTION_ANSWER_TYPE.AUDIO}
                                onRecordingCompleted={(data) => {
                                  setMediaFileInfo(data);
                                  dispatch(showUploadPop(true));
                                }}
                              />
                            </Box>
                          )}
                        </Fragment>
                      )}

                      {question?.questionType.includes(
                        QUESTION_ANSWER_TYPE.VIDEO
                      ) && (
                        <DialogVersionOneComponent
                          fullScreen
                          open={question?.responseType.includes(
                            QUESTION_ANSWER_TYPE.VIDEO
                          )}
                        >
                          <VideoLayoutComponent
                            videoSource={question?.demoVideoUrl}
                            onCapuredVideoCompleted={(data) => {
                              setMediaFileInfo(data);
                              dispatch(showUploadPop(true));
                            }}
                            title={question?.title}
                            description={question?.value}
                            onClickSkipButton={handleShuffleNavigation}
                            onClickStartButton={() => {
                              router.push(
                                `${APP_ROUTES.USER_ASSESSMENT}/${
                                  params?.studyId
                                }?step=${Number(activeStep) + 1}`
                              );
                            }}
                          />
                        </DialogVersionOneComponent>
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
        fileInfo={mediaFileInfo}
        currentQuestion={currentQuestion}
        isFinalStep={
          Number(activeStep) === assessments?.onboardingQuestionsData?.length
        }
        open={showPopup}
        studyId={session?.user?.studyId as string}
        onCompletedCallBack={handleShuffleNavigation}
      />

      <DialogVersionOneComponent fullScreen open={isFinalStep}>
        {assessments?.totalSteps < Number(activeStep) ? (
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

export default AssessmentPage;
