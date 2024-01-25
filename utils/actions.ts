import { Moment } from "moment";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const shouldForwardProp = <CustomProps extends Record<string, any>>(
  props: Array<keyof CustomProps>,
  prop: PropertyKey
): boolean => !props.includes(prop as string);

export const handleEmojiRating = (
  checkedId: any,
  fieldName: string,
  getValues: any
) => {
  const { [`${fieldName}`]: ids } = getValues();
  const newIds = ids?.includes(checkedId)
    ? ids?.filter((id: any) => id !== checkedId)
    : [...(ids ?? []), checkedId];
  return newIds;
};

export const stringReplaceWithWhiteSpace = (
  value: string,
  replaceWith: string
) => {
  if (value) {
    const newValue = value.toLowerCase().replace(/\s/g, replaceWith);
    return newValue;
  }
  return null;
};

export const feetAndInchesToCentimeters = (feet: number, inches: number) => {
  let totalInches = feet * 12 + inches;
  let centimeters = totalInches * 2.54;
  return Number(centimeters.toFixed(0));
};

export const getGreetingTime = (currentTime: Moment) => {
  if (!currentTime || !currentTime.isValid()) {
    return "Hello";
  }
  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format("HH"));
  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    return "Good afternoon";
  } else if (currentHour >= splitEvening) {
    return "Good evening";
  }
  return "Good morning";
};

// getFile name with timestamp
export function getFileNameWithTimeStamp(key: string) {
  let timestamp = new Date().getTime().toString();
  if (key) {
    return key + "_" + timestamp;
  }
  return timestamp;
}

// convert recorded audio file to mp3 file
export const audioMp3Converter = async (
  blob: Blob,
  fileName: string,
  inputFileExtension: string,
  outputFileExtension: string
) => {
  let file = new File([blob], fileName, { type: blob.type });
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    await ffmpeg.writeFile(
      `input.${inputFileExtension}`,
      await fetchFile(file)
    );
    await ffmpeg.exec([
      "-i",
      `input.${inputFileExtension}`,
      `output.${outputFileExtension}`,
    ]);
    const _outputFileData = await ffmpeg.readFile(
      `output.${outputFileExtension}`
    );
    const _fileBufferData = new Uint8Array(_outputFileData as ArrayBuffer);
    const _outputBlob = new Blob([_fileBufferData.buffer], {
      type: "audio/mp3",
    });
    const _convertedFile = new File([_outputBlob], fileName + ".mp3", {
      type: _outputBlob.type,
    });
    await ffmpeg.off("log", (e) => {});
    return {
      name: fileName + ".mp3",
      type: _outputBlob?.type,
      data: _convertedFile,
    };
  } catch (error) {
    return {
      name: fileName + ".webm",
      type: file?.type,
      data: file,
    };
  }
};

export const calculatePercentage = (part: number, whole: number) => {
  if (typeof part !== "number" || typeof whole !== "number") {
    throw new TypeError("Inputs must be numbers");
  }
  const percentage = (part / whole) * 100;
  if (percentage) {
    return Math.ceil(percentage);
  }
  return 0;
};

//const milliseconds = 76329456;

export const formateRecordingTime = (milliseconds: number) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};
