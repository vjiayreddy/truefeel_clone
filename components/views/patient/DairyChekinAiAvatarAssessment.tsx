"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { AUTH_API_STATUS, QUESTION_ANSWER_TYPE } from "@/utils/constants";
import _ from "lodash";
import { useSession } from "next-auth/react";
import {
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/patientsApi";
import { getOnboardingDataByStep } from "@/redux/utils";
import { Session } from "next-auth";
import { useDispatch, useSelector } from "react-redux";
import DialogVersionOneComponent from "@/components/Common/Dialogs/DialogVersionOne/DialogVersionOne";
import InfoContentVersionOneComponent from "@/components/Common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { getHomeAssemmentPayload } from "@/redux/services/homeAssessments";
import { toast } from "react-toastify";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import { setCurrentQuestion } from "@/redux/reducers/homeAssessmentsSlice";
import { layoutModeEnum } from "@/utils/enums";
import DiaryCheckinAiAvatarLayout from "@/components/layouts/assessments/diary-checkin-ai-avatar/DiaryCheckinAiAvatar";
import AvatarVideoComponent from "@/components/AvatarVideo/AvatarVideo";

interface DiaryCheckingAssessmentProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
}

const DairyChekinAiAvatarAssessment = ({
  assessments,
  isSuccessOnboardingQuestions,
  isErrorOnboardingQuestions,
}: DiaryCheckingAssessmentProps) => {
  const video = useRef<HTMLVideoElement>(null!);

  //State
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<layoutModeEnum>(
    layoutModeEnum.AVATAR
  );
  const [sentimentDescription, setSentimentDescription] = useState<
    string | any
  >(null);

  // Next Router
  const router: AppRouterInstance = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const routePath = usePathname();
  const activeStep = searchParams.get("step");
  const { data: session, update } = useSession();

  // Hooks Form

  // Video Events
  useEffect(() => {
    if (!video.current) {
      console.log("video.current");
      return;
    }

    const onWaiting = () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    };

    const onPlay = () => {
      if (isWaiting) {
        setIsWaiting(false);
      } else {
        console.log("onPlay-else");
        setIsPlaying(true);
      }
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsWaiting(false);
    };

    const element = video.current;
    element.addEventListener("timeupdate", function () {
      setIsWaiting(false);
      setElapsedSec(element.currentTime);
    });

    element.addEventListener("waiting", onWaiting);
    element.addEventListener("play", onPlay);
    element.addEventListener("playing", onPlay);
    element.addEventListener("pause", onPause);

    // clean up
    return () => {
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("playing", onPlay);
      element.removeEventListener("pause", onPause);
    };
  }, [video.current]);

  // Handle Video Playback
  const handleVideoPlayback = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause();
      } else {
        video.current.play();
      }
    }
  };

  const [
    fetchPatientResponse,
    {
      isSuccess: isSuccessPatientResponse,
      isLoading: isLoadingPatientResponse,
      data: dataPatientResponse,
    },
  ] = useLazyFetchPatientResponseQuery();
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );
  const [savePatientResponse, { isLoading: isLoadingSavedPatientResponse }] =
    useSavePatientResponseMutation();

  // Handle Navigate routes
  const handleShuffleNavigation = (stage: number) => {
    if (layoutMode === layoutModeEnum.AUDIO) {
      setLayoutMode(layoutModeEnum.AVATAR);
    }
    if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
      setIsFinalStep(true);
    } else {
      router.push(`${routePath}?step=${Number(activeStep) + 1}`);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setCurrentQuestion(null));
    };
  }, [session]);

  useEffect(() => {
    if (assessments?.totalSteps < Number(activeStep)) {
      setIsFinalStep(true);
    } else if (assessments?.length <= 0) {
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
  }, [activeStep, assessments]);

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
      setSentimentDescription(
        dataPatientResponse?.selectedSentimentDes?.description
      );
    }
  }, [isLoadingPatientResponse]);

  return (
    <DiaryCheckinAiAvatarLayout
      onClickBackToText={() => {
        setLayoutMode(layoutModeEnum.AVATAR);
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
      onClickCloseIcon={() => {
        router.push(APP_ROUTES.HOME);
      }}
      onClickAudioButton={() => {
        setLayoutMode(layoutModeEnum.AUDIO);
      }}
      showAudioButton={currentQuestion?.questionType?.includes(
        QUESTION_ANSWER_TYPE.AI_AVATAR
      )}
      showInfoView={false}
      infoContent={sentimentDescription as string}
      onTriggerAfterSavedAudioAssessment={handleShuffleNavigation}
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <Fragment>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
                    <AvatarVideoComponent
                      type="video/mp4"
                      videoRef={video}
                      timer={`${Math.floor(elapsedSec / 60)}:${Math.floor(
                        elapsedSec % 60
                      )}`}
                      isPlaying={isPlaying}
                      src={question?.demoVideoUrl}
                      handlePlayPauseClick={handleVideoPlayback}
                    />
                  )}
                </Fragment>
              );
            }
          )}
        </Fragment>
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
    </DiaryCheckinAiAvatarLayout>
  );
};

export default DairyChekinAiAvatarAssessment;
