import { APP_COLORS } from "@/theme/colors";
import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

interface LoadingButtonProps extends ButtonProps {
  showloading?: boolean;
  dotHeight?: string;
  dotWidth?: string;
  dotColor?: string;
}

const LoadingButtonComponent = ({
  showloading = false,
  dotColor,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button {...props}>
      {showloading ? (
        <>
          <ThreeDots
            height={props?.dotHeight || "40"}
            width={props?.dotWidth || "40"}
            radius="9"
            color={dotColor || APP_COLORS.WHITE}
            ariaLabel="loading"
            wrapperStyle={{}}
            visible={true}
          />
        </>
      ) : (
        <>{props.children}</>
      )}
    </Button>
  );
};

export default LoadingButtonComponent;
