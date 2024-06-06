"use client";

import { AddAIToolModal } from "@/app/(app)/environments/[environmentId]/components/AddAIToolModal";
import { EnvironmentSwitch } from "@/app/(app)/environments/[environmentId]/components/EnvironmentSwitch";
import { CircleUserIcon, MessageCircleQuestionIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import typeflowai from "@typeflowai/js/app";
import { TEnvironment } from "@typeflowai/types/environment";
import { Button } from "@typeflowai/ui/Button";

interface TopControlButtonsProps {
  environment: TEnvironment;
  environments: TEnvironment[];
  isTypeflowAICloud: boolean;
  workflowCount: number;
  isAIToolsLimited: boolean;
}

export const TopControlButtons = ({
  environment,
  environments,
  isTypeflowAICloud,
  workflowCount,
  isAIToolsLimited,
}: TopControlButtonsProps) => {
  const router = useRouter();
  const [addAIToolModalOpen, setAddAIToolModalOpen] = useState(false);

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
        tooltip="New AI tool"
        className="h-fit w-fit p-1"
        onClick={async () => {
          if (isAIToolsLimited && workflowCount >= 2) {
            setAddAIToolModalOpen(true);
          } else {
            router.push(`/environments/${environment.id}/workflows/templates`);
          }
        }}>
        <PlusIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
      <AddAIToolModal
        open={addAIToolModalOpen}
        setOpen={setAddAIToolModalOpen}
        environmentId={environment.id}
        isTypeflowAICloud={isTypeflowAICloud}
      />
    </div>
  );
};
