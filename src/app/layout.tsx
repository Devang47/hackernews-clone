import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/header";
import { Toaster } from "sonner";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hacker news clone",
  description: "Hacker news clone by @devang47",
  icons: [{ rel: "icon", url: "/favicon.png" }],
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <section>
            <div className="container mx-auto max-w-4xl px-4">
              <Header />

              {children}
            </div>
          </section>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
