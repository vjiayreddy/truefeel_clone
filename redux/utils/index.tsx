import authOptions from "@/app/api/auth/[...nextauth]/utils/authOptions";
import moment from "moment";
import { Session, getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import _ from "lodash";
import {
  ON_BOARDING_PROTOCOL_ID,
  ON_BOARDING_SURVEY_ID,
  QUESTION_ANSWER_TYPE,
} from "@/utils/constants";

export const getProtocolFormPayload = (payload: any) => {
  const members: string[] = [];
  if (payload?.members?.length > 0) {
    payload?.members.map((member: any) => {
      members.push(member?._id);
    });
  }
  return {
    ...payload,
    endDate: moment(new Date(payload?.endDate)).format("DD-MM-YYYY"),
    startDate: moment(new Date(payload?.startDate)).format("DD-MM-YYYY"),
    members,
  };
};

export const getUpdateProtocolFormPayload = (payload: any) => {
  const patientIds: string[] = [];
  if (payload?.members?.length > 0) {
    payload?.members.map((member: any) => {
      patientIds.push(member?._id);
    });
  }
  delete payload["members"];
  return {
    ...payload,
    endDate: moment(new Date(payload?.endDate)).format("DD-MM-YYYY"),
    startDate: moment(new Date(payload?.startDate)).format("DD-MM-YYYY"),
    patientIds,
  };
};

export const getAssessmentFormPayload = (protocolId: string, payload: any) => {
  const members: string[] = [];
  if (payload?.members?.length > 0) {
    payload?.members.map((member: any) => {
      members.push(member?._id);
    });
  }
  return {
    ...payload,
    protocolId,
    endDate: moment(new Date(payload?.endDate)).format("DD-MM-YYYY"),
    startDate: moment(new Date(payload?.startDate)).format("DD-MM-YYYY"),
    members,
  };
};

export const getAssessmentUpdareFormPayload = (payload: any) => {
  const patientIds: string[] = [];
  if (payload?.members?.length > 0) {
    payload?.members.map((member: any) => {
      patientIds.push(member?._id);
    });
  }
  return {
    ...payload,
    endDate: moment(new Date(payload?.endDate)).format("DD-MM-YYYY"),
    startDate: moment(new Date(payload?.startDate)).format("DD-MM-YYYY"),
    patientIds,
  };
};

export const getNextAuthProps = async (props: any) => {
  const callbackUrl = props?.searchParams?.callbackUrl;
  const session = await getServerSession(authOptions);
  const isAuthenticated = session ? true : false;
  const csrfToken = await getCsrfToken();
  return {
    csrfToken,
    callbackUrl,
    isAuthenticated,
  };
};

export const getDairyCheckingsPayload = (
  question: any,
  formData: any,
  studyId: string,
  session: Session
) => {
  let options: any[] = [];
  let answerType: any = null;
  let _quesId: any = null;
  let textAnswer = null;
  Object.keys(formData).forEach((key) => {
    if (key.includes(question?._id)) {
      answerType = key.replace(question?._id, "");
      _quesId = key.replace(answerType, "");
    }
  });

  if (answerType === QUESTION_ANSWER_TYPE.EMOJI_RATING) {
    if (question?.emojies?.length > 0) {
      let selectedEmoji = _.find(
        question?.emojies,
        (item) => item?._id === formData[`${_quesId}${answerType}`]
      );
      if (selectedEmoji) {
        const { emojiValue, _id } = selectedEmoji;
        options.push({
          optionId: _id,
          optionValue: emojiValue,
          description: "NA",
        });
      }
    }
  } else if (answerType === QUESTION_ANSWER_TYPE.SINGLE_SELECTION) {
    let selectedEmoji = _.find(
      question?.emojies,
      (item) =>
        item?._id ===
        formData[
          `${question?.stage_1_qus_id}${QUESTION_ANSWER_TYPE.EMOJI_RATING}`
        ]
    );
    if (selectedEmoji?.sentimentData) {
      const _findSentimentData = _.find(
        selectedEmoji?.sentimentData,
        (item) => item?._id === formData[`${_quesId}${answerType}`]
      );
      if (_findSentimentData) {
        const { sentimentValue, _id, description } = _findSentimentData;
        options.push({
          optionId: _id,
          optionValue: sentimentValue,
          description: description,
        });
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
    text: textAnswer,
    filePath: null,
    options: options,
  };
  return {
    payload,
  };
};

export const getDairyCheckingsPayloadForAudioUpload = (
  answerType: string,
  question: any,
  session: Session,
  studyId: string
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

export const getOnboardingDataByStep = (
  onboardingQuestionsData: any[],
  activeStep: any
) => {
  const _activeStep = Number(activeStep);
  if (Number.isInteger(_activeStep) && onboardingQuestionsData?.length > 0) {
    const step = _activeStep - 1;
    const _question = onboardingQuestionsData[step];
    if (!_.isEmpty(_question)) {
      return _question;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// Get Last Saved Form values
export const getFormDefaultValue = (currentQuestion: any, data: any[]) => {
  let _findQuestion = null;
  if (currentQuestion?.stage === 2) {
    const getSelectedEmojiValue = _.find(
      data,
      (item) => currentQuestion?.stage_1_qus_id === item?.questionId
    );
    _findQuestion = _.find(
      data,
      (item) => currentQuestion?._id === item?.questionId
    );
    if (getSelectedEmojiValue) {
      let question = { ..._findQuestion };
      question = {
        ..._findQuestion,
        response: {
          ..._findQuestion?.response,
          options: getSelectedEmojiValue?.response?.options,
        },
      };
      _findQuestion = question;
    }
  } else {
    _findQuestion = _.find(
      data,
      (item) => currentQuestion?._id === item?.questionId
    );
  }
  if (_findQuestion) {
    return _findQuestion;
  }
  return null;
};

// Get emoji sentiments by emoji id
export const getEmojiSentiments = (
  emojiId: string,
  options: any[],
  emojiesData: any[]
) => {
  let emojiSentiments = [];
  let findEmoji = _.find(options, (emoji) => emoji?._id === emojiId);
  if (emojiesData?.length > 0) {
    const _findEmojiById = _.find(
      emojiesData,
      (item) => item?.emojiValue === findEmoji?.optionValue
    );
    if (_findEmojiById) {
      emojiSentiments = _findEmojiById?.sentimentData;
    }
  }
  return emojiSentiments;
};
