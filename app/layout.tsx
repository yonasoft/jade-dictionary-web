import type { Metadata } from "next";
import { Murecho, Roboto } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import Navbar from "./ui/components/navbar/Navbar";
import { theme } from "./lib/theme";
import { FirebaseContextProvider } from "./providers/FirebaseProvider";
import {
  DictionaryContext,
  DictionaryContextProvider,
} from "./providers/DictionaryProvider";
import ResetPasswordModal from "./ui/components/modals/reset-password-modal/ResetPasswordModal";
import DeleteUserConfirmation from "./ui/components/modals/confirm-delete-user-modal/DeleteUserConfirmation";
import ReauthenticateModal from "./ui/components/modals/reauth-modal/ReauthenticateModal";
import AddWordListModal from "./ui/components/modals/add-word-list-modal/AddWordListModal";
import { FC } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Jade Dictionary",
  description: "Chinese dictionary and language tools",
};


const modals: Record<string, FC<ContextModalProps<any>>> = {
  resetPassword: ResetPasswordModal,
  deleteUser: DeleteUserConfirmation,
  reAuth: ReauthenticateModal,
  addWordList: AddWordListModal,
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
        className={`${roboto.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <FirebaseContextProvider>
            <DictionaryContextProvider>
              <ModalsProvider modals={modals}>
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
