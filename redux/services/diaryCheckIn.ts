import { APP_ROUTES } from "@/utils/routes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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
