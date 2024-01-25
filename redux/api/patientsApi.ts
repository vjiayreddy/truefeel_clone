import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "./routers";
import _ from "lodash";
import { AssessmentType } from "../types";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import moment from "moment";
export const patientApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["fetchPatientResponse"],
  endpoints: (builder) => ({
    filterPatients: builder.query({
      query: () => API_ROUTES.FILTER_PATIENTS,
      transformResponse: (response: any) => {
        if (response?.data?.length > 0) {
          const patients = _.filter(response?.data, (item: any) =>
            _.hasIn(item, "firstName")
          );
          return {
            data: _.uniqBy(patients, "firstName"),
          };
        }
        return {
          data: [],
        };
      },
    }),
    findPatientById: builder.query<any, { userId: string }>({
      query: ({ userId }) => `${API_ROUTES.FIND_PATIENT_BY_ID}/${userId}`,
    }),
    fetchPatientsSurvey: builder.query<any, { patientId: string }>({
      query: ({ patientId }) =>
        `${API_ROUTES.FETCH_PATIENT_SUDIES}/${patientId}`,
      transformResponse: (response: any) => {
        let assessments: AssessmentType[] = [];
        if (response?.data?.length > 0) {
          response?.data.map((item: any, index: number) => {
            assessments.push({
              _id: item?._id,
              title: item.title,
              label: item?.label,
              bannerImage: item?.bannerImage,
              description: item?.description,
            });
          });
        }
        return {
          assessments,
        };
      },
    }),
    fetchDashboardData: builder.query<any, { userId: string }>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let assessments: AssessmentType[] = [];
        let todaysAssessments: AssessmentType[] = [];
        let completedCount: any[] = [];
        let dialyNeedAssessments: AssessmentType[] = [];
        let diaryCheckings: any = {};
        let totalAssessments: number = 0;
        const { data: fetchedAssessments } = (await fetchWithBQ(
          `${API_ROUTES.FETCH_PATIENT_SUDIES}/${_arg.userId}`
        )) as any;

        if (fetchedAssessments.error) {
          throw new Error(fetchedAssessments.error);
        } else {
          if (fetchedAssessments?.data) {
            fetchedAssessments?.data?.patientStudy.map((item: any) => {
              if (!_.isEmpty(item?.studyRecordData)) {
                if (item?.studyRecordData[0].status === "COMPLETED") {
                  completedCount.push(item);
                }
              }
            });

            dialyNeedAssessments = _.filter(
              fetchedAssessments?.data?.patientStudy,
              (assessment) => assessment?.isAsNeededAssessment === true
            );

            todaysAssessments = _.filter(
              fetchedAssessments?.data?.patientStudy,
              (assessment) => assessment?.isAsNeededAssessment !== true
            );

            fetchedAssessments?.data?.patientStudy.map((item: any) => {
              assessments.push({
                _id: item?._id,
                title: item.title,
                label: item?.label,
                bannerImage: item?.bannerImage,
                description: item?.description,
                surveyRecordData: item?.surveyRecordData,
              });
            });
          }
        }

        return {
          data: {
            completedCount: completedCount.length || 0,
            assessments,
            diaryCheckings,
            todaysAssessments,
            dialyNeedAssessments,
          },
        };
      },
    }),
    fetchPatientResponse: builder.query<any, any>({
      query: (body: any) => {
        return {
          url: API_ROUTES.FETCH_PATIENT_RESPONSE,
          method: "GET",
          params: {
            ...body,
          },
        };
      },
      transformResponse: (response: any) => {
        let formInputValues: any = {};
        let selectedSentimentDes = null;
        console.log(response);
        if (response?.data?.length > 0) {
          response?.data?.map((item: any, index: number) => {
            let options: string[] = [];
            let subQuestions: string[] = [];

            if (item?.response?.options?.length > 0) {
              item?.response?.options?.map((opt: any) => {
                options.push(opt?.optionId);
              });
            }
            if (item?.response?.options?.length > 0) {
              if (
                item?.response?.responseType ===
                QUESTION_ANSWER_TYPE.MULTI_SELECTION
              ) {
                formInputValues[
                  `${item?.question?.questionId}${item?.response?.responseType}`
                ] = options;
              } else {
                formInputValues[
                  `${item?.question?.questionId}${item?.response?.responseType}`
                ] = options[0];
              }
            } else if (item?.response?.text) {
              formInputValues[
                `${item?.question?.questionId}${item?.response?.responseType}`
              ] = item?.response?.text;
            }

            if (
              item?.response?.responseType ===
              QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
            ) {
              if (item?.response?.options?.length > 0) {
                selectedSentimentDes = item?.response?.options?.[0];
              }
            }

            if (!_.isEmpty(item?.subQuestionResponse)) {
              item?.subQuestionResponse?.map((subQuestion: any) => {
                if (!_.isEmpty(subQuestion?.response?.options)) {
                  subQuestion?.response?.options?.map((opt: any) => {
                    subQuestions.push(opt?.optionId);
                  });
                }
                if (!_.isEmpty(subQuestion?.response?.options)) {
                  formInputValues[
                    `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                  ] = subQuestions[0];
                } else if (!_.isEmpty(subQuestion?.response?.text)) {
                  if (
                    subQuestion?.response?.responseType ===
                    QUESTION_ANSWER_TYPE.TIME
                  ) {
                    formInputValues[
                      `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                    ] = moment(
                      subQuestion?.response?.text,
                      "HH:mm:ss"
                    ).toISOString();
                  } else if (
                    subQuestion?.response?.responseType ===
                    QUESTION_ANSWER_TYPE.DATE
                  ) {
                    moment(
                      subQuestion?.response?.text,
                      "MM-DD-YYYY"
                    ).toISOString();
                  } else {
                    formInputValues[
                      `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                    ] = subQuestion?.response?.text;
                  }
                }
              });
            }
          });
        }
        return {
          formInputValues,
          selectedSentimentDes,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["fetchPatientResponse"],
    }),
    savePatientResponse: builder.mutation<any, any>({
      query: (body: any) => {
        return {
          url: API_ROUTES.SAVE_PATIENT_RESPONSE,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useFilterPatientsQuery,
  useLazyFilterPatientsQuery,
  useLazyFetchPatientsSurveyQuery,
  useLazyFetchDashboardDataQuery,
  useSavePatientResponseMutation,
  useLazyFetchPatientResponseQuery,
} = patientApi;
