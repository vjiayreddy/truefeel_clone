import { Session } from "next-auth";
import _ from "lodash";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { unitEnum } from "@/utils/enums";

export const getAssessmentMediaUploadPayload = (
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

export const checkIsOnlyAudioResponse = (responseType: string[]) => {
  if (responseType?.length == 1) {
    if (responseType[0] === QUESTION_ANSWER_TYPE.AUDIO) {
      return true;
    }
  }
  return false;
};

export const getFileExtension = (blob: any, replaceString: string) => {
  const _fileType = blob?.type;
  const slug = _fileType.split(";");
  const slugValue = slug[0];
  const fileExtension = slugValue.replace(replaceString, "");
  return fileExtension;
};

export const getMediaType = (fileType: string) => {
  const _fileType = fileType;
  const slug = _fileType.split(";");
  const slugValue = slug[0];
  if (slugValue.includes("audio")) {
    return "AUDIO";
  } else {
    return "VIDEO";
  }
};

export const calculateUnitMg = (question: any, getValues: any) => {
  const _subQuestion = [...question?.subQuestion];
  const _resultOption = _subQuestion.pop();
  const total =
    Number(getValues(`${_subQuestion[0]?._id + QUESTION_ANSWER_TYPE.TEXT}`)) *
    Number(getValues(`${_subQuestion[1]?._id + QUESTION_ANSWER_TYPE.TEXT}`));
  return {
    fieldId: _resultOption?._id,
    total: total,
  };
};

export const checkUnitType = (unitType: any) => {
  let inputType = { multiLine: true, type: "string" };
  if (unitType === unitEnum?.MILI_GRAM || unitType === unitEnum?.NUMBER) {
    inputType.multiLine = false;
    inputType.type = "number";
    return inputType;
  }
  return inputType;
};

export const getInputType = (input: string) => {
  if (input === "STRING") {
    return "text";
  }
  if (input === "NUMBER") {
    return "number";
  }
  if (input === "DATE") {
    return "date";
  }
  return "text";
};
