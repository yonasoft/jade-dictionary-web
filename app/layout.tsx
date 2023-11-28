import type { Metadata } from "next";
import { Murecho } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Navbar from "./ui/components/navbar/Navbar";
import { theme } from "./lib/theme";
import { FirebaseContextProvider } from "./providers/FirebaseProvider";
import {
  DictionaryContext,
  DictionaryContextProvider,
} from "./providers/DictionaryProvider";
import ResetPasswordModal from "./ui/components/modals/reset-password-modal/ResetPasswordModal";
import DeleteUserConfirmation from "./ui/components/modals/confirm-delete-user-modal/DeleteUserConfirmation";

const murecho = Murecho({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jade Dictionary",
  description: "Chinese dictionary and language tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/jadeicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript />
      </head>
      <body
        className={`${murecho.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <FirebaseContextProvider>
            <DictionaryContextProvider>
              <ModalsProvider
                modals={{
                  resetPassword: ResetPasswordModal,
                  deleteUser: DeleteUserConfirmation,
                }}
              >
                <Navbar />
                {children}
              </ModalsProvider>
            </DictionaryContextProvider>
          </FirebaseContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
