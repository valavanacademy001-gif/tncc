import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const displayFont = localFont({
  src: [
    {
      path: "../public/fonts/Juturu-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Juturu-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Juturu-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Juturu-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Juturu-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Juturu-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-display-custom",
});

export const metadata: Metadata = {
  title: "TNCC — Tamil Nadu Creators Club",
  description: "Tamil Nadu's premier creative marketplace and community platform. Connect creators with opportunities, build, collaborate, and grow.",
  keywords: ["Tamil Nadu creators", "freelancers", "creative marketplace", "TNCC", "designers", "Tamil Nadu", "projects"],
  openGraph: {
    title: "TNCC — Tamil Nadu Creators Club",
    description: "Where Tamil Nadu's creative talent meets opportunity.",
    type: "website",
  },
};

import { UserProvider } from "@/lib/user-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${displayFont.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
