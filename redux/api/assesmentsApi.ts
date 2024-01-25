import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "./routers";
import {
  CreateAssessmentPayload,
  CreateAssessmentQuestionPayload,
  FetchQuestionsParams,
  IGenericResponse,
  UpdateAssessmentPayload,
  StartRecordStudyActivityPayload,
} from "../interfaces";
import { stringReplaceWithWhiteSpace } from "@/utils/actions";
import _ from "lodash";
import {
  ASSESSMENT_QUES_TYPES_LIST,
  AS_NEED_ASSESSMENTS,
} from "@/utils/constants";

interface AssessmentResponse {
  data: any[];
  message: string;
  status: string;
  statusCode: number;
  totalCount: number;
}

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: [
    "assessmentsByProtocolId",
    "singleAssessmentById",
    "fetchQuestionByQuesCatId",
    "fetchOnboardingQuestions",
    "fetcHomeAssessmentQuestions",
  ],
  endpoints: (builder) => ({
    getAssessmentsByProtocolId: builder.query<
      AssessmentResponse,
      { protocolId: any }
    >({
      query: ({ protocolId }) =>
        `${API_ROUTES.FFETCH_SURVEY}?protocolId=${protocolId}`,
      providesTags: ["assessmentsByProtocolId"],
    }),
    getSingleAssessmentQuestionsById: builder.query<any, { assessmentId: any }>(
      {
        query: ({ assessmentId }) =>
          `${API_ROUTES.FETCH_SINGLE_SURVEY_QUESTIONS}?surveyId=${assessmentId}`,
        providesTags: ["singleAssessmentById"],
        transformResponse: (response: any) => {
          let allQuestions: any[] = [];
          if (!_.isEmpty(response?.data)) {
            if (!_.isEmpty(response?.data?.questions)) {
              response?.data?.questions?.map((question: any) => {
                allQuestions.push({
                  createdAt: question?.createdAt,
                  title: question?.title,
                  questionOptionTypeData: question?.questionOptionTypeData,
                  isActive: question?.isActive,
                  surveyId: question?.surveyId,
                  options: question?.options,
                  label: question?.label,
                  _id: question?._id,
                });
              });
            }

            return {
              data: allQuestions,
            };
          } else {
            return {
              data: allQuestions,
            };
          }
        },
      }
    ),
    createAssessment: builder.mutation<
      IGenericResponse,
      CreateAssessmentPayload
    >({
      query: (body) => {
        return {
          url: API_ROUTES.CREATE_SURVEY,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["assessmentsByProtocolId"],
    }),
    updateAssessmentById: builder.mutation<
      IGenericResponse,
      { assessmentId: string; payload: UpdateAssessmentPayload }
    >({
      query: ({ assessmentId, payload }) => {
        return {
          url: `${API_ROUTES.UPDATE_SURVEY}/${assessmentId}`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["assessmentsByProtocolId"],
    }),
    getQuestionTypes: builder.query({
      query: () => `${API_ROUTES.FETCH_QUESTION_TYPES}`,
      transformResponse: (response: any) => {
        const questionTypes: any[] = [];
        if (response?.data?.length > 0) {
          response.data.map((questionType: any) => {
            questionTypes.push({
              label: questionType?.optiontype,
              value: questionType._id,
            });
          });
          return {
            data: questionTypes,
          };
        }
        return {
          data: questionTypes,
        };
      },
    }),
    createAssessmentQuestion: builder.mutation<
      IGenericResponse,
      { payload: CreateAssessmentQuestionPayload }
    >({
      query: ({ payload }) => {
        return {
          url: `${API_ROUTES.CREATE_SURVEY_QUESTION}`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["singleAssessmentById"],
    }),
    updateAssessmentQuestion: builder.mutation<
      IGenericResponse,
      { questionId: string; payload: CreateAssessmentQuestionPayload }
    >({
      query: ({ payload, questionId }) => {
        return {
          url: `${API_ROUTES.UPDATE_SURVEY_QUESTION}/${questionId}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["singleAssessmentById"],
    }),
    fetchEmojies: builder.query<any, void>({
      query: () => `${API_ROUTES.FETCH_EMOJIS}`,
      transformResponse: (response: any) => {
        const emojiData: any[] = [];
        if (response?.data?.length > 0) {
          response?.data?.map((emoji: any) => {
            emojiData.push({
              _id: emoji?._id,
              label: emoji?.emojiValue,
              value: stringReplaceWithWhiteSpace(emoji?.emojiValue, "_"),
            });
          });
          return {
            data: emojiData,
          };
        } else {
          return {
            data: emojiData,
          };
        }
      },
    }),
    fetchQuestionByQuesCatId: builder.query<any, any>({
      query: (arg) => {
        return {
          url: API_ROUTES.FETCH_SINGLE_SURVEY_QUESTIONS,
          params: { ...arg },
        };
      },
      providesTags: ["fetchQuestionByQuesCatId"],
      transformResponse: (response: any) => {
        let allQuestions: any[] = [];
        if (response?.data?.length > 0) {
          response?.data?.map((question: any) => {
            allQuestions.push({
              createdAt: question?.createdAt,
              title: question?.title,
              questionOptionTypeData: question?.questionOptionTypeData,
              isActive: question?.isActive,
              surveyId: question?.surveyId,
              options: question?.options,
              label: question?.label,
              _id: question?._id,
            });
          });
          return {
            data: allQuestions,
          };
        } else {
          return {
            data: allQuestions,
          };
        }
      },
    }),
    fetchOnboardingQuestions: builder.query<any, FetchQuestionsParams>({
      providesTags: ["fetchOnboardingQuestions"],
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let onboardingQuestionsData: any = null;
        let studyData: any = null;
        let emojiData: any[] = [];
        const _fetchOnboardingQuestionsData = await fetchWithBQ({
          url: API_ROUTES.FETCH_SINGLE_SURVEY_QUESTIONS,
          params: {
            ..._arg,
          },
        });
        const getIndex = (value: number, data: any) => {
          const _findStateOneIndex = _.findIndex(data, (item: any) => {
            if (item?.stage === value) {
              return true;
            } else if (item?.stage === value) {
              return true;
            }
          });
          return _findStateOneIndex;
        };

        if (_fetchOnboardingQuestionsData.error) {
          throw _fetchOnboardingQuestionsData.error;
        } else {
          const { data } = _fetchOnboardingQuestionsData?.data as any;
          const { questions } = data;
          onboardingQuestionsData = questions;
          studyData = data?.studyData;
        }

        if (
          studyData?.assessmentTemplateData?._id ===
          AS_NEED_ASSESSMENTS.DAIRY_CHECKEN
        ) {
          const _fetchEmojiData = await fetchWithBQ(API_ROUTES.FETCH_EMOJIS);
          if (_fetchEmojiData.error) {
            throw _fetchEmojiData?.error;
          } else {
            const { data: emojiesData } = _fetchEmojiData?.data as any;
            emojiData = emojiesData;
            const _findStateOneIndex = getIndex(1, onboardingQuestionsData);
            const _findStateTwoIndex = getIndex(2, onboardingQuestionsData);
            if (_findStateOneIndex !== -1) {
              onboardingQuestionsData[_findStateOneIndex]["emojies"] =
                emojiesData;
            }
            if (_findStateTwoIndex) {
              onboardingQuestionsData[_findStateTwoIndex]["stage_1_qus_id"] =
                onboardingQuestionsData[_findStateOneIndex]._id;
              onboardingQuestionsData[_findStateTwoIndex]["emojies"] =
                emojiesData;
            }
          }
        }

        return {
          data: {
            onboardingQuestionsData,
            totalSteps: onboardingQuestionsData?.length || 0,
            studyData: studyData?.assessmentTemplateData || null,
            emojiData,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),

    fetcHomeAssessmentQuestions: builder.query<any, FetchQuestionsParams>({
      providesTags: ["fetcHomeAssessmentQuestions"],
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let onboardingQuestionsData: any = null;
        let studyInfo: any = null;
        let emojiData: any[] = [];
        const _fetchOnboardingQuestionsData = await fetchWithBQ({
          url: API_ROUTES.FETCH_SINGLE_SURVEY_QUESTIONS,
          params: {
            ..._arg,
          },
        });
        const getIndex = (value: number, data: any) => {
          const _findStateOneIndex = _.findIndex(data, (item: any) => {
            if (item?.stage === value) {
              return true;
            } else if (item?.stage === value) {
              return true;
            }
          });
          return _findStateOneIndex;
        };
        const fetchEmojiData = await fetchWithBQ(API_ROUTES.FETCH_EMOJIS);
        const { data } = _fetchOnboardingQuestionsData?.data as any;
        const { data: _emojiesData } = fetchEmojiData?.data as any;
        emojiData = _emojiesData;
        onboardingQuestionsData = data?.questions;
        studyInfo = data?.studyInfo;
        const _findStateOneIndex = getIndex(1, data?.questions);
        const _findStateTwoIndex = getIndex(2, data?.questions);
        if (_findStateTwoIndex) {
          onboardingQuestionsData[_findStateTwoIndex]["stage_1_qus_id"] =
            onboardingQuestionsData[_findStateOneIndex]._id;
          onboardingQuestionsData[_findStateTwoIndex]["options"] =
            onboardingQuestionsData[0].options;
        }
        return {
          data: {
            emojies: emojiData,
            onboardingQuestionsData,
            studyInfo: studyInfo,
            totalSteps: onboardingQuestionsData?.length || 0,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),

    startRecordSurvey: builder.mutation<any, StartRecordStudyActivityPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.START_RECORD_STUDY_ACTIVITY,
          method: "POST",
          body: body,
        };
      },
    }),
    getSignedUploadUrl: builder.mutation<
      any,
      { fileName: string; contentType: string; userId: string }
    >({
      query: (body) => {
        return {
          url: API_ROUTES.GET_S3_SIGNED_UPLOAD_URL,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useLazyGetAssessmentsByProtocolIdQuery,
  useCreateAssessmentMutation,
  useUpdateAssessmentByIdMutation,
  useGetQuestionTypesQuery,
  useCreateAssessmentQuestionMutation,
  useGetSingleAssessmentQuestionsByIdQuery,
  useFetchEmojiesQuery,
  useUpdateAssessmentQuestionMutation,
  useLazyFetchQuestionByQuesCatIdQuery,
  useLazyFetchOnboardingQuestionsQuery,
  useLazyFetcHomeAssessmentQuestionsQuery,
  useStartRecordSurveyMutation,
  useGetSignedUploadUrlMutation,
} = assessmentApi;
