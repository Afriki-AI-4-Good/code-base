import "@mantine/core/styles.css";
import "@fontsource-variable/inter/wght.css";
import "~/features/inbox/styles.css";
import "~/styles/globals.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";

import { theme } from "~/shared/theme";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Afriki",
  description:
    "An agentic AI solution for NGO monitoring, retrieval, translation, funding calls, reports, and workflows.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
