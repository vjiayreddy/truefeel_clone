import React from "react";
import Uppy, { UploadResult } from "@uppy/core";
import { useUppy, Dashboard } from "@uppy/react";
import Webcam from "@uppy/webcam";
import Aws3 from "@uppy/aws-s3";
import Compressor from "@uppy/compressor";
import ScreenCapture from "@uppy/screen-capture";
import ImageEditor from "@uppy/image-editor";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";
import "@uppy/image-editor/dist/style.css";
import "@uppy/screen-capture/dist/style.css";
import {
  awsS3Config,
  compressorConfig,
  onBeforeUpload,
  screenCaptureConfig,
  setUppyOptions,
  webcamConfig,
} from "../../utils/uppyConfig";

interface FileUploadControlProps {
  uploadPath: string;
  onCompleted: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
}

const FileUploadControl = ({
  uploadPath,
  onCompleted,
}: FileUploadControlProps) => {
  const uppy = useUppy(() => {
    const uppyConfig = new Uppy({
      id: "uppy-file-upload",
      autoProceed: false,
      allowMultipleUploads: true,
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 20000000,
        // allowedFileTypes: [".PNG", ".webp", ".JPG", ".JPEG"],
      },
      infoTimeout: 5000,
      locale: {
        strings: {},
      },
      onBeforeUpload: (files) => {
        const _files = onBeforeUpload(files, uploadPath);
        return _files;
      },
    })
      .use(ScreenCapture, screenCaptureConfig)
      .use(Aws3, awsS3Config)
      .use(Compressor, compressorConfig)
      .use(Webcam, webcamConfig);
    uppyConfig.setOptions(setUppyOptions);
    uppyConfig.on("upload", () => {});
    uppyConfig.on("complete", onCompleted);
    return uppyConfig;
  });
  return (
    <Dashboard
      uppy={uppy}
      id="uppy-upload"
      note="File size must not exceed 20 MB"
      plugins={["Webcam", "ScreenCapture", "ImageEditor"]}
    />
  );
};

export default FileUploadControl;
