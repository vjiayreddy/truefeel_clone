"use client";
import React, { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import { Dashboard } from "@uppy/react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";

const UppyUploadComponent = () => {
  const [uppy] = useState(() =>
    new Uppy().use(Webcam, {
      mobileNativeCamera: true,
      modes: ["video-audio"],
    })
  );
  return <Dashboard uppy={uppy} plugins={["Webcam"]} />;
};

export default UppyUploadComponent;
