"use client";

import { EnvironmentSwitch } from "@/app/(app)/environments/[environmentId]/components/EnvironmentSwitch";
import { CircleUserIcon, MessageCircleQuestionIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import typeflowai from "@typeflowai/js/app";
import { TEnvironment } from "@typeflowai/types/environment";
import { Button } from "@typeflowai/ui/Button";

interface TopControlButtonsProps {
  environment: TEnvironment;
  environments: TEnvironment[];
  isTypeflowAICloud: boolean;
}

export const TopControlButtons = ({
  environment,
  environments,
  isTypeflowAICloud,
}: TopControlButtonsProps) => {
  const router = useRouter();
  return (
    <div className="z-50 flex items-center space-x-2">
      <EnvironmentSwitch environment={environment} environments={environments} />
      {isTypeflowAICloud && (
        <Button
          variant="minimal"
          size="icon"
          tooltip="Share feedback"
          className="h-fit w-fit bg-slate-50 p-1"
          onClick={() => {
            typeflowai.track("Top Menu: Product Feedback");
          }}>
          <MessageCircleQuestionIcon className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      )}
      <Button
        variant="minimal"
        size="icon"
        tooltip="Account"
        className="h-fit w-fit bg-slate-50 p-1"
        onClick={() => {
          router.push(`/environments/${environment.id}/settings/profile`);
        }}>
        <CircleUserIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        tooltip="New workflow"
        className="h-fit w-fit p-1"
        onClick={() => {
          router.push(`/environments/${environment.id}/workflows/templates`);
        }}>
        <PlusIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
    </div>
  );
};
