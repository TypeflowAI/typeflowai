"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TEnvironment } from "@typeflowai/types/environment";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Confetti } from "@typeflowai/ui/Confetti";

import { ShareEmbedWorkflow } from "./ShareEmbedWorkflow";

interface SummaryMetadataProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  webAppUrl: string;
  user: TUser;
}

export const SuccessMessage = ({ environment, workflow, webAppUrl, user }: SummaryMetadataProps) => {
  const searchParams = useSearchParams();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const isAppWorkflow = workflow.type === "app" || workflow.type === "website";

  useEffect(() => {
    const newWorkflowParam = searchParams?.get("success");
    if (newWorkflowParam && workflow && environment) {
      setConfetti(true);
      toast.success(
        isAppWorkflow && !environment.widgetSetupCompleted
          ? "Almost there! Install widget to start receiving responses."
          : "Congrats! Your workflow is live.",
        {
          icon: isAppWorkflow && !environment.widgetSetupCompleted ? "🤏" : "🎉",
          duration: 5000,
          position: "bottom-right",
        }
      );
      if (workflow.type === "link") {
        setShowLinkModal(true);
      }
      // Remove success param from url
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [environment, isAppWorkflow, searchParams, workflow]);

  return (
    <>
      <ShareEmbedWorkflow
        workflow={workflow}
        open={showLinkModal}
        setOpen={setShowLinkModal}
        webAppUrl={webAppUrl}
        user={user}
      />
      {confetti && <Confetti />}
    </>
  );
};
