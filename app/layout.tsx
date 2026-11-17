import "./globals.css";

import { Inter, Space_Grotesk } from "next/font/google";

import type { Metadata } from "next";
import { ThemeProvider } from "~/providers";
import { Toaster } from "~/components/ui";
import { TrpcProvider } from "~/widgets/trpc/client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Not Available",
  description: "A strong technical base for agentic development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TrpcProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
