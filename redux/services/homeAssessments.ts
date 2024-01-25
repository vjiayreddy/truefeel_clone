import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { APP_ROUTES } from "@/utils/routes";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import _ from "lodash";
import moment from "moment";

export const onSubmitNavigation = (
  response: any,
  currentQuestion: any,
  finalPayload: any,
  activeStep: number | string | null,
  router: AppRouterInstance,
  setIsFinalStep: any,
  studyId: string,
  data: any
) => {
  if (response?.error) {
  } else {
    if (currentQuestion.stage === 2) {
      router.push(
        `${APP_ROUTES.DIARY_CHECKINGS}/${studyId}?step=${
          Number(activeStep) + 1
        }&sentiment=${finalPayload?.payload?.options?.[0]["optionValue"]}`
      );
    } else if (currentQuestion?.stage === 4) {
      if (finalPayload.payload.options[0]?.optionValue == "No") {
        setIsFinalStep(true);
      } else {
        router.push(
          `${APP_ROUTES.DIARY_CHECKINGS}/${studyId}?step=${
            Number(activeStep) + 1
          }`
        );
      }
    } else {
      if (Number(activeStep) === data?.totalSteps) {
        setIsFinalStep(true);
      } else {
        router.push(
          `${APP_ROUTES.DIARY_CHECKINGS}/${studyId}?step=${
            Number(activeStep) + 1
          }`
        );
      }
    }
  }
};

export const getHomeAssemmentPayload = (
  question: any,
  formData: any,
  session: Session,
  emojies: any[]
) => {
  let options: any[] = [];
  let answerType: any = null;
  let _quesId: any = null;
  let textAnswer = null;
  let isLastQuestion = false;
  Object.keys(formData).forEach((key) => {
    if (key.includes(question?._id)) {
      answerType = key.replace(question?._id, "");
      _quesId = key.replace(answerType, "");
    }
  });

  if (answerType === QUESTION_ANSWER_TYPE.EMOJI_RATING) {
    if (question?.options?.length > 0) {
      let selectedEmoji = _.find(
        question?.options,
        (item) => item?._id === formData[`${_quesId}${answerType}`]
      );
      if (selectedEmoji) {
        const { _id, optionValue } = selectedEmoji;
        options.push({
          optionId: _id,
          optionValue: optionValue,
          description: "NA",
        });
      }
    }
  } else if (
    answerType === QUESTION_ANSWER_TYPE.SINGLE_SELECTION ||
    answerType === QUESTION_ANSWER_TYPE?.BOOLEAN
  ) {
    let selectedEmoji = _.find(
      question?.options,
      (item) =>
        item?._id ===
        formData[
          `${question?.stage_1_qus_id}${QUESTION_ANSWER_TYPE.EMOJI_RATING}`
        ]
    );
    if (selectedEmoji) {
      const _findEmojiSentiments = _.find(
        emojies,
        (emoji) => emoji?.emojiValue === selectedEmoji?.optionValue
      );

      if (_findEmojiSentiments) {
        const getSelectedSentiment = _.find(
          _findEmojiSentiments?.sentimentData,
          (item) => item?._id === formData[`${_quesId}${answerType}`]
        );
        if (getSelectedSentiment) {
          const { sentimentValue, _id, description } = getSelectedSentiment;
          options.push({
            optionId: _id,
            optionValue: sentimentValue,
            description: description,
          });
        }
      }
    } else {
      if (question?.options?.length > 0) {
        const _findSelectedOption = _.find(
          question?.options,
          (item) => item?._id === formData[`${_quesId}${answerType}`]
        );
        if (_findSelectedOption) {
          const { _id, optionValue } = _findSelectedOption;
          options.push({
            optionId: _id,
            optionValue: optionValue,
            description: "NA",
          });
        }
      }
    }
  } else if (answerType === QUESTION_ANSWER_TYPE.TEXT) {
    textAnswer = formData[`${_quesId}${answerType}`];
  }

  if (question?.stage === 4) {
    if (options?.length > 0) {
      if (options?.[0]?.optionValue === "No") {
        isLastQuestion = true;
      }
    }
  }

  const payload = {
    patientId: session?.user?.id as string,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    responseType: answerType,
    isLastQuestion: isLastQuestion,
    text: textAnswer,
    filePath: null,
    options: options,
  };
  return {
    payload,
  };
};

export const homeAssessmentsMediaUploadPayload = (
  answerType: string,
  question: any,
  session: Session
) => {
  let questionOption: any = null;
  questionOption = _.find(
    question?.questionOptionType,
    (item) => item?.label === answerType
  );

  const payload = {
    patientId: session?.user?.id as string,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    responseType: answerType,
    isLastQuestion: false,
    text: null,
    filePath: null,
    options: [],
  };
  return payload;
};

export const getTodayAssessmentsPayload = (
  question: any,
  formData: any,
  session: Session
) => {
  let rootOptions: any[] = [];
  let rootTextAns = "";
  let rootQuesAnswerType: any = null;
  let rootQuestionId: any = null;
  let subQuestionAnswerTypes: any = [];
  let subQuesOptions: any[] = [];
  let subQuestionIds: any = [];

  Object.keys(formData).forEach((key) => {
    if (key.includes(question?._id)) {
      console.log(key.includes(question?._id));
      rootQuesAnswerType = key.replace(question?._id, "");
      rootQuestionId = key.replace(rootQuesAnswerType, "");
    }
    if (!_.isEmpty(question?.subQuestion)) {
      question?.subQuestion?.map((item: any) => {
        if (key.includes(item?._id)) {
          const subQuestionAnswerType = key.replace(item?._id, "");
          const subQuestionId = key.replace(subQuestionAnswerType, "");
          subQuestionIds.push(subQuestionId);
          subQuestionAnswerTypes.push(subQuestionAnswerType);
        }
      });
    }
  });

  if (
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.SINGLE_SELECTION ||
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.BOOLEAN ||
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.MULTI_SELECTION
  ) {
    if (!_.isEmpty(question?.options)) {
      let _findSelectedOption = null;
      if (rootQuesAnswerType === QUESTION_ANSWER_TYPE.MULTI_SELECTION) {
        const _values = formData[`${rootQuestionId}${rootQuesAnswerType}`];
        _values?.map((v: string) => {
          _findSelectedOption = _.find(
            question?.options,
            (item) => item?._id === v
          );
          if (_findSelectedOption) {
            const { _id, optionValue, description } = _findSelectedOption;
            rootOptions.push({
              optionId: _id,
              optionValue: optionValue,
              description: description,
            });
          }
        });
      } else {
        _findSelectedOption = _.find(
          question?.options,
          (item) =>
            item?._id === formData[`${rootQuestionId}${rootQuesAnswerType}`]
        );
        if (_findSelectedOption) {
          const { _id, optionValue, description } = _findSelectedOption;
          rootOptions.push({
            optionId: _id,
            optionValue: optionValue,
            description: description,
          });
        }
      }
    }
  }
  if (rootQuesAnswerType === QUESTION_ANSWER_TYPE.TEXT) {
    rootTextAns = formData[`${rootQuestionId}${rootQuesAnswerType}`].toString();
  }

  if (!_.isEmpty(subQuestionIds)) {
    if (!_.isEmpty(question?.subQuestion)) {
      question?.subQuestion.map((subQus: any, index: number) => {
        if (subQuestionIds.includes(subQus._id)) {
          let subQuesAnswerText = null;
          const { _id, title, value, stage, unit } = subQus;
          if (subQuestionAnswerTypes[index] === QUESTION_ANSWER_TYPE?.TEXT) {
            subQuesAnswerText =
              formData[
                `${subQus._id}${subQuestionAnswerTypes[index]}`
              ].toString();
          } else if (
            subQuestionAnswerTypes[index] === QUESTION_ANSWER_TYPE?.TIME
          ) {
            subQuesAnswerText = moment(
              new Date(
                formData[`${subQus._id}${subQuestionAnswerTypes[index]}`]
              ),
              "HH:mm:ss"
            ).format("hh:mm A");
          }
          subQuesOptions.push({
            questionId: _id,
            questionTitle: title,
            questionValue: value,
            questionStage: stage,
            unit: unit,
            responseType: subQuestionAnswerTypes[index],
            text: subQuesAnswerText,
          });
        }
      });
    }
  }
  const finalPayload = {
    patientId: session?.user?.id as string,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    unit: question?.unit,
    responseType: rootQuesAnswerType,
    text: rootTextAns,
    filePath: "",
    options: rootOptions,
    isLastQuestion: false,
    hasSubQuestionResponse: question?.hasSubQuestion,
    subQuestionResponse: subQuesOptions,
  };

  return finalPayload;
};
