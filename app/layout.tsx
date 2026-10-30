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
  title: "Tamil Nadu Creators Club (TNCC) – A Creative Community for Everyone.",
  description: "Join Tamil Nadu Creators Club, a free community organized by Valavan Academy. Connect with creators, participate in competitions, showcase your work and discover creative opportunities across Tamil Nadu.",
  keywords: ["Tamil Nadu creators", "TNCC", "Valavan Academy", "creator community", "designers", "video editors", "creative competitions", "Tamil Nadu"],
  openGraph: {
    title: "Tamil Nadu Creators Club (TNCC) – A Creative Community for Everyone.",
    description: "Join Tamil Nadu Creators Club, a free community organized by Valavan Academy. Connect with creators, participate in competitions, showcase your work and discover creative opportunities across Tamil Nadu.",
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
      <head>
        <link rel="preload" href="/regional_map_logo.glb?v=3" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/draco/draco_decoder.wasm" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
