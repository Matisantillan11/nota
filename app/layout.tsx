import "./globals.css";

import { Jost } from "next/font/google";

import type { Metadata } from "next";
import { Toaster } from "~/components/ui";
import { TrpcProvider } from "~/widgets/trpc/client";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOTA.",
  description: "Espacio Creativo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TrpcProvider>
          {children}
          <Toaster />
        </TrpcProvider>
      </body>
    </html>
  );
}
