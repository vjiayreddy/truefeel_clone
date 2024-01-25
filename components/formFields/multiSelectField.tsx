import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";

import Grid, { GridProps } from "@mui/material/Grid";
import React from "react";
import { Control, FieldValues, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { SxProps, Card, CardContent } from "@mui/material";
import { stringReplaceWithWhiteSpace } from "@/utils/actions";

interface CheckBoxControlGroupProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  labelName?: string;
  defaultValues?: any;
  variant?: "IMAGE" | "CHIP" | "NORMAL" | "COLOR_BOX" | "EMOJI";
  onChange: (checkValue: any, fieldName: string) => void;
  options: any[];
  control: Control<FieldValues, object> | any;
  gridProps?: GridProps;
  gridItemProps?: GridProps;
  colorBoxSx?: SxProps;
  targetValue: string;
}

const CheckBoxControlGroup = ({
  gridProps,
  name,
  control,
  options,
  onChange,
  defaultValues,
  variant,
  labelName,
  gridItemProps,
  rules,
  targetValue,
}: CheckBoxControlGroupProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValues}
        render={({ field: { onChange, value, ...field }, fieldState }) => {
          return (
            <Grid container {...gridProps}>
              {options.map((option) => (
                <Grid item {...gridItemProps} key={option._id}>
                  <FormControlLabel
                    sx={{ width: "100%", margin: 0, padding: 0 }}
                    label={variant === "NORMAL" ? option[`${labelName}`] : ""}
                    control={
                      <CheckBox
                        onChange={onChange}
                        checked={value}
                        {...field}
                      />
                    }
                  />
                </Grid>
              ))}
              {!!fieldState?.error && (
                <FormHelperText sx={{ marginLeft: 0 }} error={true}>
                  {fieldState?.error?.message}
                </FormHelperText>
              )}
            </Grid>
          );
        }}
      />
    </FormControl>
  );
};

export default CheckBoxControlGroup;
