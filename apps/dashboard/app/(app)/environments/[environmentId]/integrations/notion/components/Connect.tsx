import TypeflowAILogo from "@/images/logo.svg";
import NotionLogo from "@/images/notion.png";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@typeflowai/ui/Button";

import { authorize } from "../lib/notion";

interface ConnectProps {
  enabled: boolean;
  environmentId: string;
  webAppUrl: string;
}

export default function Connect({ enabled, environmentId, webAppUrl }: ConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      toast.error("Connecting integration failed. Please try again!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthorizeNotion = async () => {
    setIsConnecting(true);
    authorize(environmentId, webAppUrl).then((url: string) => {
      if (url) {
        window.location.replace(url);
      }
    });
  };

  return (
    <div className="flex h-[75vh] w-full items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center rounded-lg bg-white p-8 shadow">
        <div className="flex w-1/2 justify-center -space-x-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            <Image className="w-1/2" src={TypeflowAILogo} alt="TypeflowAI Logo" />
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            <Image className="w-1/2" src={NotionLogo} alt="Google Sheet logo" />
          </div>
        </div>
        <p className="my-8">Sync responses directly with your Notion database.</p>
        {!enabled && (
          <p className="mb-8 rounded border-slate-200 bg-slate-100 p-3 text-sm">
            Notion Integration is not configured in your instance of TypeflowAI.
            <br />
            Please follow the{" "}
            <Link href="https://typeflowai.com/docs/integrations/notion" className="underline">
              docs
            </Link>{" "}
            to configure it.
          </p>
        )}
        <Button variant="darkCTA" loading={isConnecting} onClick={handleAuthorizeNotion} disabled={!enabled}>
          Connect with Notion
        </Button>
      </div>
    </div>
  );
}
