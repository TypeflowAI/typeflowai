import { Code, EarthIcon, Link2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { TemplateIconComponent } from "@typeflowai/ee/prompt-templates/template-icons";
import { cn } from "@typeflowai/lib/cn";
import { convertDateString, timeSince } from "@typeflowai/lib/time";
import { TEnvironment } from "@typeflowai/types/environment";
import { TWorkflow } from "@typeflowai/types/workflows";

import { WorkflowStatusIndicator } from "../../WorkflowStatusIndicator";
import { generateSingleUseIdAction } from "../actions";
import { WorkflowDropDownMenu } from "./WorkflowDropdownMenu";

interface WorkflowCardProps {
  workflow: TWorkflow;
  environment: TEnvironment;
  otherEnvironment: TEnvironment;
  isViewer: boolean;
  WEBAPP_URL: string;
  orientation: string;
  duplicateWorkflow: (workflow: TWorkflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  isAIToolsLimited: boolean;
  openAddAIToolModal: (addAIToolModal: boolean) => void;
}
export const WorkflowCard = ({
  workflow,
  environment,
  otherEnvironment,
  isViewer,
  WEBAPP_URL,
  orientation,
  deleteWorkflow,
  duplicateWorkflow,
  isAIToolsLimited,
  openAddAIToolModal,
}: WorkflowCardProps) => {
  const isWorkflowCreationDeletionDisabled = isViewer;

  const workflowStatusLabel = useMemo(() => {
    if (workflow.status === "inProgress") return "In Progress";
    else if (workflow.status === "scheduled") return "Scheduled";
    else if (workflow.status === "completed") return "Completed";
    else if (workflow.status === "draft") return "Draft";
    else if (workflow.status === "paused") return "Paused";
  }, [workflow]);

  const [singleUseId, setSingleUseId] = useState<string | undefined>();

  useEffect(() => {
    if (workflow.singleUse?.enabled) {
      generateSingleUseIdAction(workflow.id, workflow.singleUse?.isEncrypted ? true : false).then(
        setSingleUseId
      );
    } else {
      setSingleUseId(undefined);
    }
  }, [workflow]);

  const linkHref = useMemo(() => {
    return workflow.status === "draft"
      ? `/environments/${environment.id}/workflows/${workflow.id}/edit`
      : `/environments/${environment.id}/workflows/${workflow.id}/summary`;
  }, [workflow.status, workflow.id, environment.id]);

  const WorkflowTypeIndicator = ({ type }: { type: TWorkflow["type"] }) => (
    <div className="flex items-center space-x-2 text-sm text-slate-600">
      {type === "app" && (
        <>
          <Code className="h-4 w-4" />
          <span>App</span>
        </>
      )}

      {type === "website" && (
        <>
          <EarthIcon className="h-4 w-4" />
          <span> Website</span>
        </>
      )}

      {type === "link" && (
        <>
          <Link2Icon className="h-4 w-4" />
          <span> Link</span>
        </>
      )}
    </div>
  );

  const renderGridContent = () => {
    return (
      <Link
        href={linkHref}
        key={workflow.id}
        className="relative col-span-1 flex h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all ease-in-out hover:scale-105">
        <div className="flex justify-between">
          <WorkflowTypeIndicator type={workflow.type} />
          <WorkflowDropDownMenu
            workflow={workflow}
            key={`workflows-${workflow.id}`}
            environmentId={environment.id}
            environment={environment}
            otherEnvironment={otherEnvironment!}
            webAppUrl={WEBAPP_URL}
            singleUseId={singleUseId}
            isWorkflowCreationDeletionDisabled={isWorkflowCreationDeletionDisabled}
            duplicateWorkflow={duplicateWorkflow}
            deleteWorkflow={deleteWorkflow}
            isAIToolsLimited={isAIToolsLimited}
            openAddAIToolModal={openAddAIToolModal}
          />
        </div>
        <div>
          <div className="mt-4 flex flex-row">
            {workflow.icon && (
              <TemplateIconComponent
                icon={workflow.icon}
                className="h-12 w-12 "
                style={{
                  objectFit: "cover",
                }}
                alt="Workflow Image"
              />
            )}
            <div className={`mt-1 ${workflow.icon ? "ml-4" : ""}`}>
              <p className="text-md font-medium text-slate-900">{workflow.name}</p>
            </div>
          </div>
          <div
            className={cn(
              "mt-3 flex w-fit items-center gap-2 rounded-full py-1 pl-1 pr-2 text-xs text-slate-800",
              workflowStatusLabel === "Scheduled" && "bg-slate-200",
              workflowStatusLabel === "In Progress" && "bg-emerald-50",
              workflowStatusLabel === "Completed" && "bg-slate-200",
              workflowStatusLabel === "Draft" && "bg-slate-100",
              workflowStatusLabel === "Paused" && "bg-slate-100"
            )}>
            <WorkflowStatusIndicator status={workflow.status} /> {workflowStatusLabel}
          </div>
        </div>
      </Link>
    );
  };

  const renderListContent = () => {
    return (
      <Link
        href={linkHref}
        key={workflow.id}
        className="relative grid w-full grid-cols-8 place-items-center gap-3 rounded-xl border border-slate-200 bg-white p-4
    shadow-sm transition-all ease-in-out hover:scale-[101%]">
        <div className="col-span-2 mt-4 flex flex max-w-full flex-row items-center justify-self-start ">
          {workflow.icon && (
            <TemplateIconComponent
              icon={workflow.icon}
              className="h-12 w-12 "
              style={{
                objectFit: "cover",
              }}
              alt="Workflow Image"
            />
          )}
          <div className={`mt-1 ${workflow.icon ? "ml-4" : ""}`}>
            <p className="w-full truncate text-sm font-medium text-slate-900">{workflow.name}</p>
          </div>
        </div>
        <div
          className={cn(
            "flex w-fit items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm text-slate-800",
            workflowStatusLabel === "Scheduled" && "bg-slate-200",
            workflowStatusLabel === "In Progress" && "bg-emerald-50",
            workflowStatusLabel === "Completed" && "bg-slate-200",
            workflowStatusLabel === "Draft" && "bg-slate-100",
            workflowStatusLabel === "Paused" && "bg-slate-100"
          )}>
          <WorkflowStatusIndicator status={workflow.status} /> {workflowStatusLabel}{" "}
        </div>
        <div className="flex justify-between">
          <WorkflowTypeIndicator type={workflow.type} />
        </div>

        <div className="col-span-4 grid w-full grid-cols-5 place-items-center">
          <div className="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600">
            {convertDateString(workflow.createdAt.toString())}
          </div>
          <div className="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600">
            {timeSince(workflow.updatedAt.toString())}
          </div>
          <div className="place-self-end">
            <WorkflowDropDownMenu
              workflow={workflow}
              key={`workflows-${workflow.id}`}
              environmentId={environment.id}
              environment={environment}
              otherEnvironment={otherEnvironment!}
              webAppUrl={WEBAPP_URL}
              singleUseId={singleUseId}
              isWorkflowCreationDeletionDisabled={isWorkflowCreationDeletionDisabled}
              duplicateWorkflow={duplicateWorkflow}
              deleteWorkflow={deleteWorkflow}
              isAIToolsLimited={isAIToolsLimited}
              openAddAIToolModal={openAddAIToolModal}
            />
          </div>
        </div>
      </Link>
    );
  };

  if (orientation === "grid") {
    return renderGridContent();
  } else return renderListContent();
};
