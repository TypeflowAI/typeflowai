import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | TypeflowAI",
    default: "TypeflowAI",
  },
  description: "Open-Source Workflow Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {process.env.VERCEL === "1" && <SpeedInsights sampleRate={0.1} />}
      <body className="flex h-screen flex-col">{children}</body>
    </html>
  );
}
