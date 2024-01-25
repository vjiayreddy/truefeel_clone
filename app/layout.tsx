import ThemeRegistry from "@/theme/themeRegistry";
import "./globals.css";
import NextAuthSessionProvider from "./api/auth/[...nextauth]/providers/sessionProvider";
import NextThemeProvider from "@/theme/nextThemeProvider";
import { ReduxStateProviders } from "@/redux/provider";
import MainContainerComponent from "@/components/utils/mainComponent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "TrueFeel",
  description: "TrueFeel powered by Elocare",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["truefeel", "elocare"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "elocare" },
    {
      name: "elocare",
      url: "",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128-128.png" },
    { rel: "icon", url: "icons/icon-128-128.png" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxStateProviders>
          <NextAuthSessionProvider>
            <NextThemeProvider>
              <ThemeRegistry>
                <MainContainerComponent>
                  {children}
                  </MainContainerComponent>
              </ThemeRegistry>
            </NextThemeProvider>
          </NextAuthSessionProvider>
        </ReduxStateProviders>
      </body>
    </html>
  );
}
