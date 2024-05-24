"use client";

import { ShareEmbedWorkflow } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/ShareEmbedWorkflow";
import { SuccessMessage } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SuccessMessage";
import { WorkflowStatusDropdown } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/WorkflowStatusDropdown";
import { ShareIcon, SquarePenIcon } from "lucide-react";
import { useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Badge } from "@typeflowai/ui/Badge";
import { Button } from "@typeflowai/ui/Button";

export const WorkflowAnalysisCTA = ({
  workflow,
  environment,
  isViewer,
  webAppUrl,
  user,
}: {
  workflow: TWorkflow;
  environment: TEnvironment;
  isViewer: boolean;
  webAppUrl: string;
  user: TUser;
}) => {
  const [showShareWorkflowModal, setShowShareWorkflowModal] = useState(false);

  return (
    <div className="hidden justify-end gap-x-1.5 sm:flex">
      {workflow.resultShareKey && (
        <Badge text="Results are public" type="warning" size="normal" className="rounded-lg"></Badge>
      )}
      {(environment.widgetSetupCompleted || workflow.type === "link") && workflow.status !== "draft" ? (
        <WorkflowStatusDropdown environment={environment} workflow={workflow} />
      ) : null}
      {workflow.type === "link" && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowShareWorkflowModal(true);
          }}>
          <ShareIcon className="h-5 w-5" />
        </Button>
      )}
      {!isViewer && (
        <Button
          variant="darkCTA"
          size="sm"
          className="h-full w-full px-3"
          href={`/environments/${environment.id}/workflows/${workflow.id}/edit`}>
          Edit
          <SquarePenIcon className="ml-1 h-4" />
        </Button>
      )}
      {showShareWorkflowModal && user && (
        <ShareEmbedWorkflow
          workflow={workflow}
          open={showShareWorkflowModal}
          setOpen={setShowShareWorkflowModal}
          webAppUrl={webAppUrl}
          user={user}
        />
      )}

      {user && (
        <SuccessMessage environment={environment} workflow={workflow} webAppUrl={webAppUrl} user={user} />
      )}
    </div>
  );
};
