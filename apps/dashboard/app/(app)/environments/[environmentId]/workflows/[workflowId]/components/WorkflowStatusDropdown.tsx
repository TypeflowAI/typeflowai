"use client";

import { updateWorkflowAction } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/actions";
import { CheckCircleIcon, PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import { TEnvironment } from "@typeflowai/types/environment";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";
import { WorkflowStatusIndicator } from "@typeflowai/ui/WorkflowStatusIndicator";

export default function WorkflowStatusDropdown({
  environment,
  updateLocalWorkflowStatus,
  workflow,
}: {
  environment: TEnvironment;
  updateLocalWorkflowStatus?: (status: "draft" | "inProgress" | "paused" | "completed" | "archived") => void;
  workflow: TWorkflow;
}) {
  const isCloseOnDateEnabled = workflow.closeOnDate !== null;
  const closeOnDate = workflow.closeOnDate ? new Date(workflow.closeOnDate) : null;
  const isStatusChangeDisabled = (isCloseOnDateEnabled && closeOnDate && closeOnDate < new Date()) ?? false;

  return (
    <>
      {workflow.status === "draft" ? (
        <div className="flex items-center">
          {(workflow.type === "link" || environment.widgetSetupCompleted) && (
            <WorkflowStatusIndicator status={workflow.status} />
          )}
          {workflow.status === "draft" && <p className="text-sm italic text-slate-600">Draft</p>}
        </div>
      ) : (
        <Select
          value={workflow.status}
          disabled={isStatusChangeDisabled}
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
              })
              .catch((error) => {
                toast.error(`Error: ${error.message}`);
              });

            if (updateLocalWorkflowStatus)
              updateLocalWorkflowStatus(
                value as "draft" | "inProgress" | "paused" | "completed" | "archived"
              );
          }}>
          <TooltipProvider delayDuration={50}>
            <Tooltip open={isStatusChangeDisabled ? undefined : false}>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-[170px] bg-white py-6 md:w-[200px]">
                  <SelectValue>
                    <div className="flex items-center">
                      {(workflow.type === "link" || environment.widgetSetupCompleted) && (
                        <WorkflowStatusIndicator status={workflow.status} />
                      )}
                      <span className="ml-2 text-sm text-slate-700">
                        {workflow.status === "inProgress" && "In-progress"}
                        {workflow.status === "paused" && "Paused"}
                        {workflow.status === "completed" && "Completed"}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
              </TooltipTrigger>
              <SelectContent className="bg-white">
                <SelectItem className="group  font-normal hover:text-slate-900" value="inProgress">
                  <PlayCircleIcon className="-mt-1 mr-1 inline h-5 w-5 text-slate-500 group-hover:text-slate-800" />
                  In-progress
                </SelectItem>
                <SelectItem className="group  font-normal hover:text-slate-900" value="paused">
                  <PauseCircleIcon className="-mt-1 mr-1 inline h-5 w-5 text-slate-500 group-hover:text-slate-800" />
                  Paused
                </SelectItem>
                <SelectItem className="group  font-normal hover:text-slate-900" value="completed">
                  <CheckCircleIcon className="-mt-1 mr-1 inline h-5 w-5 text-slate-500 group-hover:text-slate-800" />
                  Completed
                </SelectItem>
              </SelectContent>

              <TooltipContent>
                To update the workflow status, update the &ldquo;Close
                <br /> workflow on date&rdquo; setting in the Response Options.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Select>
      )}
    </>
  );
}
