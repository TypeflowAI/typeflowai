import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import HelpscoutBeacon from "@typeflowai/ui/HelpscoutClient";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | TypeflowAI",
    default: "TypeflowAI",
  },
  description: "Open-Source Workflow Suite",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      {process.env.VERCEL === "1" && <SpeedInsights sampleRate={0.1} />}
      <HelpscoutBeacon />
      <body className="flex h-dvh flex-col transition-all ease-in-out">{children}</body>
    </html>
  );
};

export default RootLayout;
