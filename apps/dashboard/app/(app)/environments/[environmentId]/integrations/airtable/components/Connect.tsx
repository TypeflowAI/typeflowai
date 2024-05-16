"use client";

import { authorize } from "@/app/(app)/environments/[environmentId]/integrations/airtable/lib/airtable";
import TypeflowAILogo from "@/images/logo.svg";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@typeflowai/ui/Button";

import AirtableLogo from "../images/airtable.svg";

interface AirtableConnectProps {
  enabled: boolean;
  environmentId: string;
  webAppUrl: string;
}

export default function AirtableConnect({ environmentId, enabled, webAppUrl }: AirtableConnectProps) {
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
            <Image className="w-1/2" src={TypeflowAILogo} alt="TypeflowAI Logo" />
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            <Image className="w-1/2" src={AirtableLogo} alt="Airtable Logo" />
          </div>
        </div>
        <p className="my-8">Sync responses directly with Airtable.</p>
        {!enabled && (
          <p className="mb-8 rounded border-slate-200 bg-slate-100 p-3 text-sm">
            Airtable Integration is not configured in your instance of TypeflowAI.
          </p>
        )}
        <Button variant="darkCTA" loading={isConnecting} onClick={handleGoogleLogin} disabled={!enabled}>
          Connect with Airtable
        </Button>
      </div>
    </div>
  );
}
