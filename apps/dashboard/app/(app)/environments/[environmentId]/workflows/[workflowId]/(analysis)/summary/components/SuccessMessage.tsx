"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TEnvironment } from "@typeflowai/types/environment";
import { TProduct } from "@typeflowai/types/product";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Confetti } from "@typeflowai/ui/Confetti";

import ShareEmbedWorkflow from "./ShareEmbedWorkflow";

interface SummaryMetadataProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  singleUseIds?: string[];
}

export default function SuccessMessage({
  environment,
  workflow,
  webAppUrl,
  product,
  user,
}: SummaryMetadataProps) {
  const searchParams = useSearchParams();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const newWorkflowParam = searchParams?.get("success");
    if (newWorkflowParam && workflow && environment) {
      setConfetti(true);
      toast.success(
        workflow.type === "web" && !environment.widgetSetupCompleted
          ? "Almost there! Install widget to start receiving responses."
          : "Congrats! Your workflow is live.",
        {
          icon: workflow.type === "web" && !environment.widgetSetupCompleted ? "🤏" : "🎉",
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
  }, [environment, searchParams, workflow]);

  return (
    <>
      <ShareEmbedWorkflow
        workflow={workflow}
        open={showLinkModal}
        setOpen={setShowLinkModal}
        webAppUrl={webAppUrl}
        product={product}
        user={user}
      />
      {confetti && <Confetti />}
    </>
  );
}
