"use client";
import React from "react";
import UserGreeting from "@/components/Common/Greeting/Greeting";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import AssessmentCompletedInfoCard from "./AssessmentCompletedInfoCard";
import Grid from "@mui/material/Grid";
import AssessmentCard from "@/components/Common/Cards/assessment-card/AssessmentCard";
import UpToDateCard from "@/components/Common/Cards/upto-date-card/UpToDateCard";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStartRecordSurveyMutation } from "@/redux/api/assesmentsApi";
import _ from "lodash";
import moment from "moment";
import { APP_ROUTES } from "@/utils/routes";
import InfoCardComponent from "@/components/Common/Cards/InfoCard/InfoCard";
import { NO_ASSESSMENTS_FOUND } from "@/utils/constants";

interface AssessmentsListProps {
  data: any;
  isLoadingAssessments: boolean;
}

const StyledAssessmentsList = styled(Box)(({ theme }) => ({
  padding: 24,
  "& .__greeting_box": {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const AssessmentsList = ({
  data,
  isLoadingAssessments,
}: AssessmentsListProps) => {
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
    <StyledAssessmentsList>
      <Box component="div" className="__greeting_box">
        <UserGreeting />
      </Box>
      <Typography mt={2} mb={1} variant="h6">
        Weekly goal
      </Typography>
      <Box mb={3}>
        <AssessmentCompletedInfoCard
          isLoadingAssessments={isLoadingAssessments}
          total={data?.assessments?.length || 0}
          active={data?.completedCount || 0}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Today’s Assessments</Typography>
      </Box>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12}>
          <UpToDateCard />
        </Grid>

        {data?.todaysAssessments?.length > 0 && (
          <>
            {data?.todaysAssessments?.map((assessment: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={assessment?._id}>
                <AssessmentCard
                  title={assessment?.title}
                  content={assessment?.description}
                  disabled={
                    assessment?.studyRecordData?.[0]?.status === "COMPLETED"
                      ? false
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
                    const router = `${APP_ROUTES.PATIENT_ASSESSMENTS}?step=1`;
                    handleRecordSurvey(assessment?._id, router, false);
                  }}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
      <Box mb={2} mt={2}>
        <Typography variant="subtitle1">As-Needed Assessments</Typography>
      </Box>

      {data?.dialyNeedAssessments?.length > 0 && (
        <Grid container spacing={2} alignItems="stretch">
          {data?.dialyNeedAssessments?.map((assessment: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={assessment?._id}>
              <AssessmentCard
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
                  assessment?.studyRecordData?.length > 0 ? "Continue" : "Start"
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
    </StyledAssessmentsList>
  );
};

export default AssessmentsList;
