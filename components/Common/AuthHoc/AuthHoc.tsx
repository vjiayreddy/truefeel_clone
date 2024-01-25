import React from "react";
import { useSession } from "next-auth/react";
import { AUTH_STATUS } from "@/utils/constants";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

export function withAuthHoc<P>(WrappedComponent: any) {
  const ComponentWithSessionInfo = (props: P) => {
    const { data: session, status } = useSession();
    if (status === AUTH_STATUS.LOADING && !session) {
      return <div />;
    } else if (status === AUTH_STATUS.UNAUTHENTICATED && !session) {
      redirect(APP_ROUTES.WELCOME);
    } else if (
      status === AUTH_STATUS.AUTHENTICATED &&
      !session?.user?.isEmailVerified
    ) {
      redirect(APP_ROUTES.VERIFICATION);
    } else if (
      status === AUTH_STATUS.AUTHENTICATED &&
      !session?.user?.isProfileCompleted
    ) {
      redirect(APP_ROUTES.CREATE_PROFILE);
    }
    return <WrappedComponent {...props} />;
  };
  return ComponentWithSessionInfo;
}
