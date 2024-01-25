"use client";
import React, { Fragment, useEffect } from "react";
import { useLazyFetchOnboardingQuestionsQuery } from "@/redux/api/assesmentsApi";
import { useSession } from "next-auth/react";
import { AS_NEED_ASSESSMENTS } from "@/utils/constants";
import RegularAssessmentView from "@/components/views/regular-assessment/RegularAssessment";
import UserHomeLayout from "@/components/layouts/patient/homeLayout";
import DiaryCheckingAssessment from "@/components/views/patient/DairyCheckinAssessment";
import DairyChekinAiAvatarAssessment from "@/components/views/patient/DairyChekinAiAvatarAssessment";
import VoiceBaseline from "@/components/views/patient/VoiceBaseline";
import ConditionalAssesment from "@/components/views/patient/ConditionalAssesment";

const AssessmentPage = () => {
  const { data: session } = useSession();
  const [
    fetchOnboardingQuestions,
    {
      isLoading: isLoadingOnboardingQuestions,
      isFetching: isFetchingOnboardingQuestions,
      data: assessments,
      isSuccess: isSuccessOnboardingQuestions,
      isError: isErrorOnboardingQuestions,
    },
  ] = useLazyFetchOnboardingQuestionsQuery({});

  useEffect(() => {
    if (session?.user?.studyId) {
      fetchOnboardingQuestions({
        studyId: session?.user?.studyId,
      });
    }
  }, [session]);

  const renderLayout = () => {
    if (assessments?.studyData?._id === AS_NEED_ASSESSMENTS.DAIRY_CHECKEN) {
      return (
        <DiaryCheckingAssessment
          assessments={assessments}
          isSuccessOnboardingQuestions={isSuccessOnboardingQuestions}
          isErrorOnboardingQuestions={isErrorOnboardingQuestions}
        />
      );
    } else if (
      assessments?.studyData?._id ===
      AS_NEED_ASSESSMENTS.DAIRY_CHECKEN_AI_AVATAR
    ) {
      return (
        <DairyChekinAiAvatarAssessment
          assessments={assessments}
          isSuccessOnboardingQuestions={isSuccessOnboardingQuestions}
          isErrorOnboardingQuestions={isErrorOnboardingQuestions}
        />
      );
    } else if (assessments?.studyData?._id === AS_NEED_ASSESSMENTS.AUDIO) {
      return (
        <VoiceBaseline
          assessments={assessments}
          isSuccessOnboardingQuestions={isSuccessOnboardingQuestions}
          isErrorOnboardingQuestions={isErrorOnboardingQuestions}
        />
      );
    } else {
      return (
        <ConditionalAssesment
          isLoadingOnboardingQuestions={isLoadingOnboardingQuestions}
          assessments={assessments}
          isErrorOnboardingQuestions={isErrorOnboardingQuestions}
          isSuccessOnboardingQuestions={isSuccessOnboardingQuestions}
        />
      );
    }
  };

  return (
    <UserHomeLayout
      loading={isLoadingOnboardingQuestions || isFetchingOnboardingQuestions}
      showAppBar={false}
      showBottomNavigation={false}
    >
      {assessments && <Fragment>{renderLayout()}</Fragment>}
    </UserHomeLayout>
  );
};

export default AssessmentPage;
