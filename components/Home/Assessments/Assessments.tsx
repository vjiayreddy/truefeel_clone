"use client";
import SectionTitlesOneComponent from "@/components/Common/Headings/SectionTitlesOne/SectionTitlesOne";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import StudyCardComponent from "@/components/Common/Cards/StudyCard/StudyCard";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { useSession } from "next-auth/react";
import { getGreetingTime } from "@/utils/actions";
import moment from "moment";
import { useStartRecordSurveyMutation } from "@/redux/api/assesmentsApi";
import { toast } from "react-toastify";
import TotalAssessmentsComponent from "@/components/Common/Cards/TotalAssessments/TotalAssessments";
import InfoCardComponent from "@/components/Common/Cards/InfoCard/InfoCard";
import { NO_ASSESSMENTS_FOUND } from "@/utils/constants";
import LoadingDialogComponent from "@/components/Common/Dialogs/LoadingDialog/LoadingDialog";
import _ from "lodash";

interface AllAssessmentsComponentProps {
  data: any;
  isLoadingAssessments: boolean;
}

const AllAssessmentsComponent = ({
  isLoadingAssessments,
  data,
}: AllAssessmentsComponentProps) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [startRecordSurvey, { isLoading }] = useStartRecordSurveyMutation();
  // handle push router
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  // handle create new survey record before start assessements
  const handleRecordSurvey = async (
    studyId: string,
    route: string,
    isDoctorLocked: boolean
  ) => {
    try {
      const response = await startRecordSurvey({
        patientId: session?.user?.id as string,
        studyId,
        isDoctorLocked: isDoctorLocked,
      });
      if ((response as any)?.data.status === "success") {
        const { data: surveyRecordData } = response as any;
        update({
          ...session,
          user: {
            ...session?.user,
            studyId: studyId,
            studyRecordId: surveyRecordData?.data?._id,
          },
        });
        handleNavigation(route);
      } else {
        toast.error(
          "Unable to process your request. Please check your input and try again"
        );
      }
    } catch (error) {
      if ((error as any)?.data?.message === "") {
        toast.error(
          "Unable to process your request. Please check your input and try again"
        );
      }
    }
  };

  return (
    <Box p={3}>
      <SectionTitlesOneComponent
        titleProps={{ mb: 1 }}
        title={`${getGreetingTime(moment())}, ${session?.user?.firstName}`}
        content="Weekly goal"
      />
      <>
        <Box mb={3}>
          <TotalAssessmentsComponent
            isLoadingAssessments={isLoadingAssessments}
            total={!_.isEmpty(data?.assessments) ? data?.assessments.length : 0}
            active={data?.completedCount || 0}
          />
        </Box>
        <Box mb={3}>
          <Typography variant="subtitle1">Today's Assessments</Typography>
        </Box>
        <Grid container spacing={3}>
          {data?.todaysAssessments?.length > 0 && (
            <>
              {data?.todaysAssessments?.map((assessment: any) => (
                <Grid item xs={12} key={assessment?._id}>
                  <StudyCardComponent
                    title={assessment?.title}
                    content={assessment?.description}
                    disabled={
                      assessment?.studyRecordData?.[0]?.status === "COMPLETED"
                        ? true
                        : false
                    }
                    timeStamp={
                      assessment?.studyRecordData?.length > 0
                        ? moment(
                            new Date(
                              assessment?.studyRecordData?.[0].startDate?.mongoTimestamp
                            )
                          ).fromNow()
                        : null
                    }
                    status={
                      assessment?.studyRecordData?.length > 0
                        ? `${assessment?.studyRecordData?.[0]?.status}`
                        : null
                    }
                    onClick={() => {
                      //const router = `${APP_ROUTES.USER_ASSESSMENT}/${assessment?._id}?step=1`;
                      const router = `${APP_ROUTES.PATIENT_ASSESSMENTS}?step=1`;
                      handleRecordSurvey(assessment?._id, router, false);
                    }}
                  />
                </Grid>
              ))}
            </>
          )}
          {data?.todaysAssessments?.length < 0 && (
            <Grid item xs={12}>
              <InfoCardComponent title={NO_ASSESSMENTS_FOUND} />
            </Grid>
          )}
        </Grid>

        <Box mt={3} mb={3}>
          <Typography mb={3} variant="subtitle1">
            As Needed Assessments
          </Typography>
          {data?.dialyNeedAssessments?.length > 0 && (
            <Grid container spacing={3}>
              {data?.dialyNeedAssessments?.map((assessment: any) => (
                <Grid item xs={12} key={assessment?._id}>
                  <StudyCardComponent
                    disabled={false}
                    timeStamp={
                      assessment?.studyRecordData?.length > 0
                        ? moment(
                            new Date(
                              assessment?.studyRecordData?.[0].startDate?.mongoTimestamp
                            )
                          ).fromNow()
                        : null
                    }
                    btnName={
                      assessment?.studyRecordData?.length > 0
                        ? "Continue"
                        : "Start"
                    }
                    status={
                      assessment?.studyRecordData?.length > 0
                        ? `${assessment?.studyRecordData?.[0]?.status}`
                        : null
                    }
                    showbtnloading={false}
                    title={assessment?.title}
                    content={assessment?.description}
                    onClick={() => {
                      //const router = `${APP_ROUTES.USER_HOME_ASSESSMENTS}/${assessment?._id}?step=1`;
                      const router = `${APP_ROUTES.PATIENT_ASSESSMENTS}?step=1`;
                      handleRecordSurvey(assessment?._id, router, false);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {data?.dialyNeedAssessments?.length < 0 && (
            <Grid container>
              <Grid item xs={12}>
                <InfoCardComponent title={NO_ASSESSMENTS_FOUND} />
              </Grid>
            </Grid>
          )}
        </Box>
      </>
      <LoadingDialogComponent
        open={isLoading}
        loadingMessage="Please wait..."
      />
    </Box>
  );
};

export default AllAssessmentsComponent;
