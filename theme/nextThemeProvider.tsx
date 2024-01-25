"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

interface NextThemeProviderProps {
  children: React.ReactNode;
}

const NextThemeProvider = ({ children }: NextThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <>{children}</>;
  }
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default NextThemeProvider;
