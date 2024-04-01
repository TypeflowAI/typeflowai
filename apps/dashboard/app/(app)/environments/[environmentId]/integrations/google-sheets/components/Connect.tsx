"use client";

import TypeflowAILogo from "@/images/logo_square_color.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@typeflowai/ui/Button";

import GoogleSheetLogo from "../images/google-sheets-small.png";
import { authorize } from "../lib/google";

interface ConnectProps {
  enabled: boolean;
  environmentId: string;
  webAppUrl: string;
}

export default function Connect({ enabled, environmentId, webAppUrl }: ConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const handleGoogleLogin = async () => {
    setIsConnecting(true);
    authorize(environmentId, webAppUrl).then((url: string) => {
      if (url) {
        window.location.replace(url);
      }
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center rounded-lg bg-white p-8 shadow">
        <div className="flex w-1/2 justify-center -space-x-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            <Image className="w-1/2 rounded-md" src={TypeflowAILogo} alt="TypeflowAI Logo" />
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            <Image className="w-1/2" src={GoogleSheetLogo} alt="Google Sheet logo" />
          </div>
        </div>
        <p className="my-8">Sync responses directly with Google Sheets.</p>
        {!enabled && (
          <p className="mb-8 rounded border-gray-200 bg-gray-100 p-3 text-sm">
            Google Sheets Integration is not configured in your instance of TypeflowAI.
            <br />
            Please follow the{" "}
            <Link href="https://typeflowai.com/docs/integrations/google-sheets" className="underline">
              docs
            </Link>{" "}
            to configure it.
          </p>
        )}
        <Button variant="darkCTA" loading={isConnecting} onClick={handleGoogleLogin} disabled={!enabled}>
          Connect with Google
        </Button>
      </div>
    </div>
  );
}
