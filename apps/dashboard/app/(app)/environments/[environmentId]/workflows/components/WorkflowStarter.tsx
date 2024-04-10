"use client";

import TemplateList from "@/app/(app)/environments/[environmentId]/workflows/templates/TemplateList";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import type { TEnvironment } from "@typeflowai/types/environment";
import type { TProduct } from "@typeflowai/types/product";
import { TTemplate } from "@typeflowai/types/templates";
import { TUser } from "@typeflowai/types/user";
import { TWorkflowInput } from "@typeflowai/types/workflows";
import LoadingSpinner from "@typeflowai/ui/LoadingSpinner";

import { createWorkflowAction } from "../actions";
import { adjustEngineForTemplate, adjustPromptForTemplate } from "../templates/lib";

export default function WorkflowStarter({
  environmentId,
  environment,
  product,
  user,
  isEngineLimited,
}: {
  environmentId: string;
  environment: TEnvironment;
  product: TProduct;
  user: TUser;
  isEngineLimited: boolean;
}) {
  const [isCreateWorkflowLoading, setIsCreateWorkflowLoading] = useState(false);
  const router = useRouter();

  const newWorkflowFromTemplate = async (template: TTemplate) => {
    setIsCreateWorkflowLoading(true);
    const engineTemplateAdjusted = adjustEngineForTemplate(template, isEngineLimited);
    const adjustedTemplate = adjustPromptForTemplate(engineTemplateAdjusted);
    const workflowType = environment?.widgetSetupCompleted ? "web" : "link";
    const autoComplete = workflowType === "web" ? 50 : null;
    const augmentedTemplate = {
      ...adjustedTemplate.preset,
      type: workflowType,
      autoComplete,
    } as TWorkflowInput;
    try {
      const workflow = await createWorkflowAction(environmentId, augmentedTemplate);
      router.push(`/environments/${environmentId}/workflows/${workflow.id}/edit`);
    } catch (e) {
      toast.error("An error occured creating a new workflow");
      setIsCreateWorkflowLoading(false);
    }
  };
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col py-12">
      {isCreateWorkflowLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="px-7 pb-4">
            <h1 className="text-3xl font-extrabold text-slate-700">
              You&apos;re all set! Time to create your first workflow.
            </h1>
          </div>
          <TemplateList
            environmentId={environmentId}
            onTemplateClick={(template) => {
              newWorkflowFromTemplate(template);
            }}
            environment={environment}
            product={product}
            user={user}
            isEngineLimited={isEngineLimited}
          />
        </>
      )}
    </div>
  );
}
