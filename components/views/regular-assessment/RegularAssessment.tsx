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
  getInputType,
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

interface RegularAssessmentViewProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
}

const RegularAssessmentView = ({
  assessments,
  isSuccessOnboardingQuestions,
  isErrorOnboardingQuestions,
}: RegularAssessmentViewProps) => {
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
  }, [isSuccessOnboardingQuestions]);

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
                                `${APP_ROUTES.PATIENT_ASSESSMENTS}?step=${
                                  Number(activeStep) + 1
                                }`
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

                      <Box component="div" className="__quesion_view">
                        {question.questionType.includes(
                          QUESTION_ANSWER_TYPE.TEXT
                        ) && (
                          <Fragment>
                            <SectionTitlesOneComponent
                              title={question?.value}
                              content={question?.title}
                            />

                            {question?.responseType?.includes(
                              QUESTION_ANSWER_TYPE.BOOLEAN
                            ) && (
                              <Fragment>
                                <RadioGroupSelectionComponent
                                  control={control}
                                  id={`${QUESTION_ANSWER_TYPE.BOOLEAN}-${index}`}
                                  name={
                                    question?._id + QUESTION_ANSWER_TYPE.BOOLEAN
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
                                            QUESTION_ANSWER_TYPE.BOOLEAN
                                        ],
                                        question
                                      )?.questionType?.includes(
                                        QUESTION_ANSWER_TYPE.TEXT
                                      ) && (
                                        <Fragment>
                                          {getConditionBasedQuestion(
                                            watchFromStatus[
                                              question?._id +
                                                QUESTION_ANSWER_TYPE.BOOLEAN
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
                                                        QUESTION_ANSWER_TYPE.BOOLEAN
                                                    ],
                                                    question
                                                  )?._id
                                                }
                                                name={
                                                  getConditionBasedQuestion(
                                                    watchFromStatus[
                                                      question?._id +
                                                        QUESTION_ANSWER_TYPE.BOOLEAN
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
                                                  multiline: true,
                                                  type: getConditionBasedQuestion(
                                                    watchFromStatus[
                                                      question?._id +
                                                        QUESTION_ANSWER_TYPE.BOOLEAN
                                                    ],
                                                    question
                                                  )?.inputConfig?.placeholder,
                                                  placeholder:
                                                    getConditionBasedQuestion(
                                                      watchFromStatus[
                                                        question?._id +
                                                          QUESTION_ANSWER_TYPE.BOOLEAN
                                                      ],
                                                      question
                                                    )?.inputConfig?.placeholder,
                                                  rows: 8,
                                                }}
                                              />
                                            </Fragment>
                                          )}
                                        </Fragment>
                                      )}
                                    </Box>
                                  )}
                              </Fragment>
                            )}
                            {question?.responseType?.includes(
                              QUESTION_ANSWER_TYPE.TEXT
                            ) && (
                              <TextInputFieldComponent
                                id={`${question?._id}${QUESTION_ANSWER_TYPE.TEXT}-${index}`}
                                name={`${question?._id}${QUESTION_ANSWER_TYPE.TEXT}`}
                                label=""
                                defaultValue={""}
                                control={control}
                                rules={{
                                  required: true,
                                }}
                                textFieldProps={{
                                  fullWidth: true,
                                  multiline: checkUnitType(question?.unit)
                                    ?.multiLine,
                                  type: checkUnitType(question?.unit)?.type,
                                  placeholder:
                                    question?.inputConfig?.placeholder,
                                }}
                              />
                            )}
                          </Fragment>
                        )}
                        {question?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.AUDIO
                        ) && (
                          <Box component="div" className="__voice_record_view">
                            <VoiceRecorderComponent
                              fileType={QUESTION_ANSWER_TYPE.AUDIO}
                              onRecordingCompleted={(data) => {
                                setMediaFileInfo(data);
                                dispatch(showUploadPop(true));
                              }}
                            />
                          </Box>
                        )}
                      </Box>
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

export default RegularAssessmentView;
