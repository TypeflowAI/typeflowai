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
      <body className="flex h-screen flex-col">{children}</body>
    </html>
  );
}
