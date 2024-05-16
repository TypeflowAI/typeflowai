"use client";

import { SuccessMessage } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SuccessMessage";
import { ResultsShareButton } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/ResultsShareButton";
import { WorkflowStatusDropdown } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/WorkflowStatusDropdown";
import { updateWorkflowAction } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/actions";
import { CircleEllipsisIcon, ShareIcon, SquarePenIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Badge } from "@typeflowai/ui/Badge";
import { Button } from "@typeflowai/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";
import { WorkflowStatusIndicator } from "@typeflowai/ui/WorkflowStatusIndicator";

import { ShareEmbedWorkflow } from "../(analysis)/summary/components/ShareEmbedWorkflow";

interface SummaryHeaderProps {
  workflowId: string;
  environment: TEnvironment;
  workflow: TWorkflow;
  webAppUrl: string;
  product: TProduct;
  user?: TUser;
  membershipRole?: TMembershipRole;
}
export const SummaryHeader = ({
  workflowId,
  environment,
  workflow,
  webAppUrl,
  product,
  user,
  membershipRole,
}: SummaryHeaderProps) => {
  const params = useParams();
  const sharingKey = params.sharingKey as string;
  const isSharingPage = !!sharingKey;

  const router = useRouter();

  const isCloseOnDateEnabled = workflow.closeOnDate !== null;
  const closeOnDate = workflow.closeOnDate ? new Date(workflow.closeOnDate) : null;
  const isStatusChangeDisabled = (isCloseOnDateEnabled && closeOnDate && closeOnDate < new Date()) ?? false;
  const { isViewer } = getAccessFlags(membershipRole);
  const [showShareWorkflowModal, setShowShareWorkflowModal] = useState(false);

  return (
    <div className="mb-11 mt-6 flex flex-wrap items-center justify-between">
      <div>
        <div className="flex gap-4">
          <p className="text-3xl font-bold text-slate-800">{workflow.name}</p>
          {workflow.resultShareKey && !isSharingPage && (
            <Badge text="Results are public" type="warning" size="normal"></Badge>
          )}
        </div>
        <span className="text-base font-extralight text-slate-600">{product.name}</span>
      </div>
      {!isSharingPage && (
        <>
          <div className="hidden justify-end gap-x-1.5 sm:flex">
            {!isViewer &&
            (environment.widgetSetupCompleted || workflow.type === "link") &&
            workflow.status !== "draft" ? (
              <WorkflowStatusDropdown environment={environment} workflow={workflow} />
            ) : null}
            {workflow.type === "link" && (
              <Button
                variant="secondary"
                onClick={() => {
                  setShowShareWorkflowModal(true);
                }}>
                <ShareIcon className="h-5 w-5" />
              </Button>
            )}
            {!isViewer && (
              <Button
                variant="darkCTA"
                className="h-full w-full px-3 lg:px-6"
                href={`/environments/${environment.id}/workflows/${workflowId}/edit`}>
                Edit
                <SquarePenIcon className="ml-1 h-4" />
              </Button>
            )}
          </div>
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" className="h-full w-full rounded-md p-2">
                  <CircleEllipsisIcon className="h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2">
                {workflow.type === "link" && user && (
                  <>
                    <ResultsShareButton workflow={workflow} webAppUrl={webAppUrl} user={user} />
                    <DropdownMenuSeparator />
                  </>
                )}
                {(environment?.widgetSetupCompleted || workflow.type === "link") &&
                workflow?.status !== "draft" ? (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger
                        disabled={isStatusChangeDisabled}
                        style={isStatusChangeDisabled ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                        <div className="flex items-center">
                          {(workflow.type === "link" || environment.widgetSetupCompleted) && (
                            <WorkflowStatusIndicator status={workflow.status} />
                          )}
                          <span className="ml-1 text-sm text-slate-700">
                            {workflow.status === "inProgress" && "In-progress"}
                            {workflow.status === "paused" && "Paused"}
                            {workflow.status === "completed" && "Completed"}
                          </span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                            value={workflow.status}
                            onValueChange={(value) => {
                              const castedValue = value as "draft" | "inProgress" | "paused" | "completed";
                              updateWorkflowAction({ ...workflow, status: castedValue })
                                .then(() => {
                                  toast.success(
                                    value === "inProgress"
                                      ? "Workflow live"
                                      : value === "paused"
                                        ? "Workflow paused"
                                        : value === "completed"
                                          ? "Workflow completed"
                                          : ""
                                  );
                                  router.refresh();
                                })
                                .catch((error) => {
                                  toast.error(`Error: ${error.message}`);
                                });
                            }}>
                            <DropdownMenuRadioItem
                              value="inProgress"
                              className="cursor-pointer break-all text-slate-600">
                              In-progress
                            </DropdownMenuRadioItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioItem
                              value="paused"
                              className="cursor-pointer break-all text-slate-600">
                              Paused
                            </DropdownMenuRadioItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioItem
                              value="completed"
                              className="cursor-pointer break-all text-slate-600">
                              Completed
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <Button
                  variant="darkCTA"
                  size="sm"
                  className="flex h-full w-full justify-center px-3 lg:px-6"
                  href={`/environments/${environment.id}/workflows/${workflowId}/edit`}>
                  Edit
                  <SquarePenIcon className="ml-1 h-4" />
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {user && (
            <SuccessMessage environment={environment} workflow={workflow} webAppUrl={webAppUrl} user={user} />
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
        </>
      )}
    </div>
  );
};
