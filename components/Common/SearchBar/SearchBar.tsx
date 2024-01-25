import TextInputFieldComponent from "@/components/formFields/textInputField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import React from "react";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

const SearchBarComponent = () => {
  const { control } = useForm();
  const router = useRouter();

  return (
    <Grid
      item
      xs={12}
      container
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <Grid item xs>
        <TextInputFieldComponent
          id="search-input"
          control={control}
          label=""
          name="search"
          textFieldProps={{
            InputProps: {
              placeholder: "Search for MRN, Patient Name, or IRB Number",
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          defaultValue=""
        />
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            router.push("/aggrid");
          }}
          size="small"
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBarComponent;
