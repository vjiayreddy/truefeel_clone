import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface AutoCompleteControlProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  label?: string;
  targetValue?: string;
  isEqualValue: string;
  defaultValues?: any;
  options: any[];
  control: Control<FieldValues, object> | any;
  size?: "small" | "medium";
  onChange?: (data: any) => void;
  multiple?: boolean;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}`,
  };
}

const AutoCompleteInputFiled = ({
  id,
  name,
  control,
  rules,
  defaultValues,
  isEqualValue,
  targetValue,
  options,
  onChange,
  size,
  multiple,
}: AutoCompleteControlProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValues || null}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <Autocomplete
            id={id}
            size={size}
            options={options}
            multiple={multiple}
            filterSelectedOptions
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              return option.label || option[`${targetValue}`];
            }}
            isOptionEqualToValue={(option, value) =>
              option[isEqualValue] === value[isEqualValue]
            }
            onChange={(_, data) => {
              field.onChange(data);
              onChange?.(data);
            }}
            renderTags={(options, getTagProps) => {
              return options.map((option, index: number) => (
                <Chip
                  {...getTagProps({
                    index: index,
                  })}
                  key={option._id}
                  avatar={
                    <Avatar
                      alt={option.firstName}
                      {...stringAvatar(option[targetValue as string])}
                    />
                  }
                  label={option[targetValue as string]}
                  variant="outlined"
                />
              ));
            }}
            renderOption={(props, option) => (
              <ListItem {...props} key={option?._id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={option[targetValue as string]}
                    src={option?.image}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={option[targetValue as string]}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {option?.gender}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={!!fieldState?.error}
                label="Search for members"
                placeholder="Member"
              />
            )}
            value={field.value}
          />
          {fieldState?.error && (
            <FormHelperText error>{fieldState.error.message}</FormHelperText>
          )}
        </>
      )}
    ></Controller>
  );
};

export default AutoCompleteInputFiled;
