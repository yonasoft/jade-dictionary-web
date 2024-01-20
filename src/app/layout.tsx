import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Head from "next/head";
import { ReactNode, FC } from "react";

import { MantineProvider, Space } from "@mantine/core";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import "./globals.css";
import AddWordListModal from "../components/modals/add-word-list-modal/AddWordListModal";
import DeleteUserConfirmation from "../components/modals/confirm-delete-user-modal/DeleteUserConfirmation";
import ReauthenticateModal from "../components/modals/reauth-modal/ReauthenticateModal";
import ResetPasswordModal from "../components/modals/reset-password-modal/ResetPasswordModal";
import Navbar from "../components/navbar/Navbar";
import { theme } from "../lib/theme";
import { FirebaseContextProvider } from "../providers/FirebaseProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

interface RootLayoutProps {
  children: ReactNode;
}

const metadata: Metadata = {
  title: "Jade Dictionary",
  description: "Chinese dictionary and language tools",
};

const modals: Record<string, FC<ContextModalProps<any>>> = {
  resetPassword: ResetPasswordModal,
  deleteUser: DeleteUserConfirmation,
  reAuth: ReauthenticateModal,
  addWordList: AddWordListModal,
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/image/jadeicon.ico"
          type="image/icon"
          sizes="<generated>"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta charSet="UTF-8" />
        <meta name="description" content={metadata.description as string} />
        <title>{metadata.title as string}</title>
      </head>
      <body
        className={`${roboto.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <FirebaseContextProvider>
            <ModalsProvider modals={modals}>
              <Navbar />
              <Space h={64} />
              <main>{children}</main>
            </ModalsProvider>
          </FirebaseContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
