import {
  // LanguagesIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
// import { getLanguageLabel } from "../../../ee/multi-language/lib/iso-languages";
import { getPersonIdentifier } from "@typeflowai/lib/person/utils";
import { timeSince } from "@typeflowai/lib/time";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { PersonAvatar } from "../../Avatars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../Tooltip";
import { WorkflowStatusIndicator } from "../../WorkflowStatusIndicator";
import { isSubmissionTimeMoreThan5Minutes } from "../util";

interface TooltipRendererProps {
  shouldRender: boolean;
  tooltipContent: ReactNode;
  children: ReactNode;
}

interface SingleResponseCardHeaderProps {
  pageType: "people" | "response";
  response: TResponse;
  workflow: TWorkflow;
  environment: TEnvironment;
  user?: TUser;
  isViewer: boolean;
  setDeleteDialogOpen: (deleteDialogOpen: boolean) => void;
}

export const SingleResponseCardHeader = ({
  pageType,
  response,
  workflow,
  environment,
  user,
  isViewer,
  setDeleteDialogOpen,
}: SingleResponseCardHeaderProps) => {
  const displayIdentifier = response.person
    ? getPersonIdentifier(response.person, response.personAttributes)
    : null;
  const environmentId = workflow.environmentId;
  const canResponseBeDeleted = response.finished
    ? true
    : isSubmissionTimeMoreThan5Minutes(response.updatedAt);
  const TooltipRenderer = (props: TooltipRendererProps) => {
    const { children, shouldRender, tooltipContent } = props;
    if (shouldRender) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent avoidCollisions align="start">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <>{children}</>;
  };

  const renderTooltip = Boolean(
    (response.personAttributes && Object.keys(response.personAttributes).length > 0) ||
      (response.meta.userAgent && Object.keys(response.meta.userAgent).length > 0)
  );

  const tooltipContent = (
    <>
      {response.singleUseId && (
        <div>
          <p className="py-1 font-bold text-slate-700">SingleUse ID:</p>
          <span>{response.singleUseId}</span>
        </div>
      )}
      {response.personAttributes && Object.keys(response.personAttributes).length > 0 && (
        <div>
          <p className="py-1 font-bold text-slate-700">Person attributes:</p>
          {Object.keys(response.personAttributes).map((key) => (
            <p key={key}>
              {key}:{" "}
              <span className="font-bold">{response.personAttributes && response.personAttributes[key]}</span>
            </p>
          ))}
        </div>
      )}

      {response.meta.userAgent && Object.keys(response.meta.userAgent).length > 0 && (
        <div className="text-slate-600">
          {response.personAttributes && Object.keys(response.personAttributes).length > 0 && (
            <hr className="my-2 border-slate-200" />
          )}
          <p className="py-1 font-bold text-slate-700">Device info:</p>
          {response.meta.userAgent?.browser && <p>Browser: {response.meta.userAgent.browser}</p>}
          {response.meta.userAgent?.os && <p>OS: {response.meta.userAgent.os}</p>}
          {response.meta.userAgent && (
            <p>
              Device:{" "}
              {response.meta.userAgent.device ? response.meta.userAgent.device : "PC / Generic device"}
            </p>
          )}
          {response.meta.url && <p>URL: {response.meta.url}</p>}
          {response.meta.action && <p>Action: {response.meta.action}</p>}
          {response.meta.source && <p>Source: {response.meta.source}</p>}
          {response.meta.country && <p>Country: {response.meta.country}</p>}
        </div>
      )}
    </>
  );
  const deleteSubmissionToolTip = <>This response is in progress.</>;

  return (
    <div className="space-y-2 border-b border-slate-200 px-6 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center space-x-4">
          {pageType === "response" && (
            <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
              <div className="group">
                {response.person?.id ? (
                  user ? (
                    <Link
                      className="flex items-center"
                      href={`/environments/${environmentId}/people/${response.person.id}`}>
                      <PersonAvatar personId={response.person.id} />
                      <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600 hover:underline">
                        {displayIdentifier}
                      </h3>
                    </Link>
                  ) : (
                    <div className="flex items-center">
                      <PersonAvatar personId={response.person.id} />
                      <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600">
                        {displayIdentifier}
                      </h3>
                    </div>
                  )
                ) : (
                  <div className="flex items-center">
                    <PersonAvatar personId="anonymous" />
                    <h3 className="ml-4 pb-1 font-semibold text-slate-600">Anonymous</h3>
                  </div>
                )}
              </div>
            </TooltipRenderer>
          )}

          {pageType === "people" && (
            <div className="flex items-center justify-center space-x-2 rounded-full bg-slate-100 p-1 px-2 text-sm text-slate-600">
              {(workflow.type === "link" || environment.widgetSetupCompleted) && (
                <WorkflowStatusIndicator status={workflow.status} />
              )}
              <Link
                className="hover:underline"
                href={`/environments/${environmentId}/workflows/${workflow.id}/summary`}>
                {workflow.name}
              </Link>
            </div>
          )}
          {/* {response.language && response.language !== "default" && (
            <div className="flex space-x-2 rounded-full bg-slate-700 px-2 py-1 text-xs text-white">
              <div>{getLanguageLabel(response.language)}</div>
              <LanguagesIcon className="h-4 w-4" />
            </div>
          )} */}
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <time className="text-slate-500" dateTime={timeSince(response.updatedAt.toISOString())}>
            {timeSince(response.updatedAt.toISOString())}
          </time>
          {user && !isViewer && (
            <TooltipRenderer shouldRender={!canResponseBeDeleted} tooltipContent={deleteSubmissionToolTip}>
              <TrashIcon
                onClick={() => {
                  if (canResponseBeDeleted) {
                    setDeleteDialogOpen(true);
                  }
                }}
                className={`h-4 w-4 ${
                  canResponseBeDeleted
                    ? "cursor-pointer text-slate-500 hover:text-red-700"
                    : "cursor-not-allowed text-slate-400"
                } `}
              />
            </TooltipRenderer>
          )}
        </div>
      </div>
    </div>
  );
};
