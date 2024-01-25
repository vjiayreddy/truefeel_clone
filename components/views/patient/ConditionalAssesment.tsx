import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import RadioGroupSelectionComponent from "@/components/Common/FormFields/EmojiInputField/RadioGropSelection";
import TitleAndSubtitle from "@/components/Common/Headings/title-and-subtitle/TitleAndSubtitle";
import InfoContentVersionOneComponent from "@/components/Common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import CheckBoxControlGroup from "@/components/formFields/checkBoxGroup";
import DatePickerInputFieldComponent from "@/components/formFields/datePickerInputField";
import TextInputFieldComponent from "@/components/formFields/textInputField";
import TimePickerInputFieldComponent from "@/components/formFields/timePicker";
import ConditionalAssessmentLayout from "@/components/layouts/assessments/conditional/Conditional";
import { useRef } from "react";
import {
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/patientsApi";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import { setCurrentQuestion } from "@/redux/reducers/diaryCheckingsSlice";
import { getTodayAssessmentsPayload } from "@/redux/services/homeAssessments";
import { checkUnitType } from "@/redux/services/utils";
import { getOnboardingDataByStep } from "@/redux/utils";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { layoutModeEnum } from "@/utils/enums";
import { APP_ROUTES } from "@/utils/routes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ConditionalAssessmentProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
  isLoadingOnboardingQuestions: boolean;
}

const ConditionalAssesment = ({
  assessments,
  isSuccessOnboardingQuestions,
  isLoadingOnboardingQuestions,
}: ConditionalAssessmentProps) => {
  // Next Router
  const router: AppRouterInstance = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const activeStep = searchParams.get("step");
  // Redux
  const dispatch = useDispatch();
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );
  // Session
  const { data: session, update } = useSession();
  // State
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<layoutModeEnum>(
    layoutModeEnum.CONDITIONAL
  );

  // Hooks Form
  const {
    handleSubmit,
    formState,
    reset,
    control,
    register,
    watch,
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
      console.log(dataPatientResponse?.formInputValues);
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
      if (
        currentQuestion?.questionType?.includes(
          QUESTION_ANSWER_TYPE.INTRODUCTION
        )
      ) {
        router.push(`${pathName}?step=${Number(activeStep) + 1}`);
      } else {
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
      }
    } catch (error) {}
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

  const getMultiSelectConditionBasedQuestion = (
    rootQuestionIds: any,
    selectedQuestion: any
  ) => {
    let subQuestion: any = null;
    rootQuestionIds?.map((question: any) => {
      if (selectedQuestion?.conditions?.length > 0) {
        selectedQuestion?.conditions?.map((item: any) => {
          if (item?.optionIds?.includes(question)) {
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
    });

    return subQuestion;
  };

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
    return () => {
      reset();
      dispatch(setCurrentQuestion(null));
    };
  }, []);

  const handleCheck = (checkedId: any, fieldName: string) => {
    let newIds = [];
    const { [fieldName]: ids } = getValues();
    if (ids?.includes(checkedId)) {
      newIds = ids?.filter((id: any) => id !== checkedId);
    } else {
      newIds = [...(ids ?? []), checkedId];
    }
    return newIds;
  };

  return (
    <ConditionalAssessmentLayout
      dataLoadingIndicator={isLoadingOnboardingQuestions || isLoadingPatientResponse}
      showLoadingOnNextButton={isLoadingSavedPatientResponse}
      onClickBackToText={() => {
        setLayoutMode(layoutModeEnum.TEXT_ANSWER);
      }}
      isFinalStep={
        Number(activeStep) === assessments?.onboardingQuestionsData.length
      }
      currentQuestion={currentQuestion}
      layoutMode={layoutMode}
      onClickBackButton={() => {
        router.back();
      }}
      totalSteps={assessments?.totalSteps}
      currentStep={Number(activeStep)}
      onClickNextButton={handleSubmit(onSubmit)}
      onClickCloseIcon={() => {
        router.push(APP_ROUTES.HOME);
      }}
      onClickAudioButton={() => {
        setLayoutMode(layoutModeEnum.AUDIO);
      }}
      showAudioButton={currentQuestion?.responseType?.includes(
        QUESTION_ANSWER_TYPE.AUDIO
      )}
      disabledNextButton={
        !formState?.isValid || assessments?.totalSteps < Number(activeStep)
      }
      onSavedSignature={handleShuffleNavigation}
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
                    <Fragment>
                      {question?.questionType.includes(
                        QUESTION_ANSWER_TYPE.TEXT
                      ) && (
                        <Fragment>
                          <Box pl={1} pr={1} mb={2}>
                            <TitleAndSubtitle
                              subTitle={question?.hint}
                              title={question?.value}
                            />
                          </Box>
                        </Fragment>
                      )}
                      {question?.responseType?.includes(
                        QUESTION_ANSWER_TYPE?.BOOLEAN
                      ) && (
                        <Fragment>
                          <RadioGroupSelectionComponent
                            control={control}
                            id={`${QUESTION_ANSWER_TYPE.BOOLEAN}-${index}`}
                            name={question?._id + QUESTION_ANSWER_TYPE.BOOLEAN}
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
                                    question?._id + QUESTION_ANSWER_TYPE.BOOLEAN
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
                                            )?._id + QUESTION_ANSWER_TYPE.TEXT
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
                                            type: checkUnitType(question?.unit)
                                              ?.type,
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
                            multiline: checkUnitType(
                              question?.inputConfig?.inputType
                            )?.multiLine,
                            type: checkUnitType(
                              question?.inputConfig?.inputType
                            )?.type,
                            placeholder: question?.inputConfig?.placeholder,
                            ...(checkUnitType(question?.inputConfig?.inputType)
                              ?.multiLine && {
                              rows: 4,
                            }),
                          }}
                        />
                      )}

                      {question?.responseType?.includes(
                        QUESTION_ANSWER_TYPE.DATE_TIME
                      ) && (
                        <Fragment>
                          {question?.hasSubQuestion &&
                            _.isEmpty(question?.conditions) &&
                            !_.isEmpty(question?.subQuestion) && (
                              <Fragment>
                                {question?.subQuestion?.map(
                                  (subQus: any, index: number) => {
                                    return (
                                      <Fragment key={subQus._id}>
                                        <input
                                          type="hidden"
                                          {...register(
                                            question?._id +
                                              QUESTION_ANSWER_TYPE.DATE_TIME
                                          )}
                                        />
                                        {subQus?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.TIME
                                        ) && (
                                          <Fragment>
                                            <Box mb={2}>
                                              <Typography gutterBottom>
                                                {subQus?.value}
                                              </Typography>

                                              <TimePickerInputFieldComponent
                                                control={control}
                                                label=""
                                                defaultValue="04:00 AM"
                                                rules={{
                                                  required: true,
                                                }}
                                                name={`${subQus?._id}${QUESTION_ANSWER_TYPE.TIME}`}
                                              />
                                            </Box>
                                          </Fragment>
                                        )}
                                        {subQus?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.DATE
                                        ) && (
                                          <Fragment>
                                            <Box mb={2}>
                                              <Typography gutterBottom>
                                                {subQus?.value}
                                              </Typography>

                                              <DatePickerInputFieldComponent
                                                control={control}
                                                label=""
                                                defaultValue=""
                                                rules={{
                                                  required: true,
                                                }}
                                                name={`${subQus?._id}${QUESTION_ANSWER_TYPE.DATE}`}
                                              />
                                            </Box>
                                          </Fragment>
                                        )}
                                      </Fragment>
                                    );
                                  }
                                )}
                              </Fragment>
                            )}
                        </Fragment>
                      )}
                      {question?.responseType?.includes(
                        QUESTION_ANSWER_TYPE.MULTI_SELECTION
                      ) && (
                        <Fragment>
                          <CheckBoxControlGroup
                            gridProps={{
                              direction: "column",
                            }}
                            gridItemProps={{
                              xs: 12,
                            }}
                            variant="NORMAL"
                            options={question?.options}
                            defaultValues={[]}
                            labelName="optionValue"
                            id={`${question?._id}${QUESTION_ANSWER_TYPE.MULTI_SELECTION}`}
                            control={control}
                            name={`${question?._id}${QUESTION_ANSWER_TYPE.MULTI_SELECTION}`}
                            onChange={handleCheck}
                          />

                          {!_.isEmpty(question?.conditions) &&
                            question?.hasSubQuestion &&
                            !_.isEmpty(question?.subQuestion) && (
                              <Box mt={3}>
                                {getMultiSelectConditionBasedQuestion(
                                  watchFromStatus[
                                    question?._id +
                                      QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                  ],
                                  question
                                )?.questionType?.includes(
                                  QUESTION_ANSWER_TYPE.TEXT
                                ) && (
                                  <Fragment>
                                    {getMultiSelectConditionBasedQuestion(
                                      watchFromStatus[
                                        question?._id +
                                          QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                      ],
                                      question
                                    )?.responseType?.includes(
                                      QUESTION_ANSWER_TYPE.TEXT
                                    ) && (
                                      <Fragment>
                                        <TextInputFieldComponent
                                          id={
                                            getMultiSelectConditionBasedQuestion(
                                              watchFromStatus[
                                                question?._id +
                                                  QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                              ],
                                              question
                                            )?._id
                                          }
                                          name={
                                            getMultiSelectConditionBasedQuestion(
                                              watchFromStatus[
                                                question?._id +
                                                  QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                              ],
                                              question
                                            )?._id + QUESTION_ANSWER_TYPE.TEXT
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
                                            type: checkUnitType(question?.unit)
                                              ?.type,
                                            placeholder:
                                              getMultiSelectConditionBasedQuestion(
                                                watchFromStatus[
                                                  question?._id +
                                                    QUESTION_ANSWER_TYPE.MULTI_SELECTION
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
                    </Fragment>
                  )}
                </Fragment>
              );
            }
          )}
        </>
      )}

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
    </ConditionalAssessmentLayout>
  );
};

export default ConditionalAssesment;
