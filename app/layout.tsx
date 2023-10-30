import type { Metadata } from "next";
import { Murecho } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar/NavBar";


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
        <link rel="icon" href="image/jadeicon.ico" sizes="any" />
      </head>
      <body className={murecho.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
