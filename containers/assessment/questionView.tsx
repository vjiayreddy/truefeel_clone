"use client";
import { ASSESSMENT_QUES_TYPES_LIST } from "@/utils/constants";
import {
  Typography,
  styled,
  Box,
  Grid,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import React from "react";
import RadioGroup from "@mui/material/RadioGroup";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import "react-device-frameset/styles/device-emulator.min.css";
import { useSelector } from "react-redux";

const StyledQuestionTitle = styled(Typography)(({ theme }) => ({}));

const StyledFrameLogo = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledDeviceFrame = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const QuestionViewContainer = () => {
  const { assessmentSlice } = useSelector((state: any) => state);
  const { selectedQuestion } = assessmentSlice;
  return (
    <>
      <DeviceFrameset
        device="iPhone 8"
        color="gold"
        landscape={false}
        width={300}
      >
        {!selectedQuestion && (
          <StyledFrameLogo>
            <img width={150} src="/assets/images/logo.svg" />
          </StyledFrameLogo>
        )}
        {selectedQuestion && (
          <StyledDeviceFrame>
            <Box
              sx={(theme) => ({
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              })}
            >
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.AUDIO && (
                <>
                  <Box pt={3} sx={{ minHeight: 50 }}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img width={75} src="/assets/images/icons/audio-wave.gif" />
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.VIDEO && (
                <>
                  <Box p={3} sx={{ minHeight: 50 }}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img width={75} src="/assets/images/icons/video-on.gif" />
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.SINGLE_SELECTION && (
                <>
                  <Box p={3}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <RadioGroup
                      aria-labelledby="radio-group"
                      name="row-radio-buttons-group"
                    >
                      {selectedQuestion?.options?.map((opt: any) => (
                        <FormControlLabel
                          key={opt?._id}
                          value={opt?.optionLabel}
                          control={<Radio />}
                          label={opt?.optionValue}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.MULTIPLE_SELECTION && (
                <>
                  <Box p={3}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FormGroup>
                      {selectedQuestion?.options?.map((opt: any) => (
                        <FormControlLabel
                          key={opt?._id}
                          control={<Checkbox name={opt?.optionLabel} />}
                          label={opt?.optionLabel}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.RATING && (
                <>
                  <Box p={3}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <RadioGroup
                      aria-labelledby="radio-group"
                      name="row-radio-buttons-group"
                      row
                    >
                      {selectedQuestion?.options?.map((opt: any) => (
                        <FormControlLabel
                          sx={{ margin: 0 }}
                          key={opt?._id}
                          value={opt?.optionValue}
                          control={
                            <Radio
                              checkedIcon={
                                <Card
                                  sx={(theme) => ({
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                    fontWeight: 600,
                                    fontSize: 16,
                                  })}
                                >
                                  <CardContent>{opt?.optionValue}</CardContent>
                                </Card>
                              }
                              icon={
                                <Card
                                  sx={(theme) => ({
                                    fontWeight: 500,
                                    fontSize: 16,
                                  })}
                                >
                                  <CardContent>{opt?.optionValue}</CardContent>
                                </Card>
                              }
                            />
                          }
                          label={""}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.EMOJI_RATING && (
                <>
                  <Box p={3}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <RadioGroup
                      aria-labelledby="radio-group"
                      name="row-radio-buttons-group"
                    >
                      {selectedQuestion?.options?.map((opt: any) => (
                        <FormControlLabel
                          key={opt?._id}
                          value={opt?.optionValue}
                          control={
                            <Radio
                              checkedIcon={
                                <img
                                  width={35}
                                  style={{
                                    border: "3px solid grey",
                                    borderRadius: 100,
                                  }}
                                  src={`/assets/images/icons/${opt?.optionLabel}.svg`}
                                />
                              }
                              icon={
                                <img
                                  width={35}
                                  src={`/assets/images/icons/${opt?.optionLabel}.svg`}
                                />
                              }
                            />
                          }
                          label={opt?.optionLabel}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </>
              )}
              {selectedQuestion?.questionOptionTypeData?.optiontype ===
                ASSESSMENT_QUES_TYPES_LIST.TEXT && (
                <>
                  <Box p={3}>
                    <StyledQuestionTitle textAlign="center" variant="h5">
                      {selectedQuestion?.title}
                    </StyledQuestionTitle>
                  </Box>
                  <Box
                    p={2}
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TextField
                      placeholder="Please enter your answer"
                      fullWidth={true}
                      multiline={true}
                      rows={5}
                    />
                  </Box>
                </>
              )}
            </Box>
            <Box
              sx={(theme) => ({
                minHeight: 40,
              })}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Button variant="text">Pervious</Button>
                </Grid>
                <Grid item>
                  <Button variant="text">Next</Button>
                </Grid>
              </Grid>
            </Box>
          </StyledDeviceFrame>
        )}
      </DeviceFrameset>
    </>
  );
};

export default QuestionViewContainer;
