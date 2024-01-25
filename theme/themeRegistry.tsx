"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./emotionCache";
import { lightTheme, globalStyles } from "./themeConfig";
import { useTheme } from "next-themes";
import { GlobalStyles } from "@mui/material";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      {theme && (
        // <ThemeProvider theme={theme === "light" ? lightTheme : lightTheme}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          {/* <GlobalStyles styles={globalStyles} /> */}
          <>{children}</>
        </ThemeProvider>
      )}
    </NextAppDirEmotionCacheProvider>
  );
}
