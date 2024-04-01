"use client";

import WorkflowShareButton from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/LinkModalButton";
import SuccessMessage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SuccessMessage";
import WorkflowStatusDropdown from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/WorkflowStatusDropdown";
import { updateWorkflowAction } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/actions";
import { EllipsisHorizontalIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
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

interface SummaryHeaderProps {
  workflowId: string;
  environment: TEnvironment;
  workflow: TWorkflow;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  membershipRole?: TMembershipRole;
}
const SummaryHeader = ({
  workflowId,
  environment,
  workflow,
  webAppUrl,
  product,
  user,
  membershipRole,
}: SummaryHeaderProps) => {
  const router = useRouter();

  const isCloseOnDateEnabled = workflow.closeOnDate !== null;
  const closeOnDate = workflow.closeOnDate ? new Date(workflow.closeOnDate) : null;
  const isStatusChangeDisabled = (isCloseOnDateEnabled && closeOnDate && closeOnDate < new Date()) ?? false;
  const { isViewer } = getAccessFlags(membershipRole);

  return (
    <div className="mb-11 mt-6 flex flex-wrap items-center justify-between">
      <div>
        <div className="flex gap-4">
          <p className="text-3xl font-bold text-slate-800">{workflow.name}</p>
          {workflow.resultShareKey && <Badge text="Public Results" type="success" size="normal"></Badge>}
        </div>
        <span className="text-base font-extralight text-slate-600">{product.name}</span>
      </div>
      <div className="hidden justify-end gap-x-1.5 sm:flex">
        <WorkflowShareButton workflow={workflow} webAppUrl={webAppUrl} product={product} user={user} />
        {!isViewer &&
        (environment?.widgetSetupCompleted || workflow.type === "link") &&
        workflow?.status !== "draft" ? (
          <WorkflowStatusDropdown environment={environment} workflow={workflow} />
        ) : null}
        {!isViewer && (
          <Button
            variant="darkCTA"
            className="h-full w-full px-3 lg:px-6"
            href={`/environments/${environment.id}/workflows/${workflowId}/edit`}>
            Edit
            <PencilSquareIcon className="ml-1 h-4" />
          </Button>
        )}
      </div>
      <div className="block sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="h-full w-full rounded-md p-2">
              <EllipsisHorizontalIcon className="h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            {workflow.type === "link" && (
              <>
                <WorkflowShareButton
                  className="flex w-full justify-center p-1"
                  workflow={workflow}
                  webAppUrl={webAppUrl}
                  product={product}
                  user={user}
                />
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
              <PencilSquareIcon className="ml-1 h-4" />
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SuccessMessage
        environment={environment}
        workflow={workflow}
        webAppUrl={webAppUrl}
        product={product}
        user={user}
      />
    </div>
  );
};

export default SummaryHeader;
