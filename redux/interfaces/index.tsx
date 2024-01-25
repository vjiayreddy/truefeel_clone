import { DoctorType } from "../types";

export interface UserLoginPayload {
  email: string;
  password: string;
}
export interface UserRegistrationPayload {
  email: string;
  password: string;
}

export interface UserVerifyOtpPayload {
  to: string;
  action: string;
  otp?: string | number;
}

export interface UserProfilePayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  height?: number;
  weight?: number | null;
}

export interface CreateProtocolPayload {
  title: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  description: string;
  members: string[];
}

export interface UpdateProtocolPayload {
  title: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  description: string;
  patientIds?: string[];
}

export interface UserRegistrationResponse {
  status: string;
  statusCode: string;
  data: DoctorType;
  message: string;
  error: any[];
}

export interface IGenericResponse {
  status: string;
  message: string;
}

export interface CreateAssessmentPayload {
  title: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  protocolId: string;
  members: string[];
  surveyType: string;
}

export interface UpdateAssessmentPayload {
  title: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  patientIds: string[];
  //surveyType: string;
}

export interface CreateAssessmentQuestionPayload {
  title: string;
  description: string;
  questionOptionTypeId: string;
  surveyId: string;
  options: any[];
}

export interface FetchQuestionsParams {
  questionCategoryId?: string;
  studyId?: string;
  stage?: number;
}

export interface StartRecordStudyActivityPayload {
  patientId: string;
  studyId: string;
  isDoctorLocked: boolean;
}
