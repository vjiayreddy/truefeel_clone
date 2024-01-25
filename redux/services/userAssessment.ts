import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const mkvToMp4Converter = async (
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
      type: "video/mp4",
    });
    const _convertedFile = new File(
      [_outputBlob],
      fileName + "." + outputFileExtension,
      {
        type: _outputBlob.type,
      }
    );
    ffmpeg.on("progress", ({ progress, time }) => {});
    await ffmpeg.off("log", (e) => {});
    return {
      name: fileName + ".mp4",
      type: _outputBlob?.type,
      data: _convertedFile,
    };
  } catch (error) {
    return {
      name: fileName + "." + inputFileExtension,
      type: file?.type,
      data: file,
    };
  }
};
