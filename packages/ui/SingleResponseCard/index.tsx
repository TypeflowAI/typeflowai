"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getPersonIdentifier } from "@typeflowai/lib/person/util";
import { timeSince } from "@typeflowai/lib/time";
import { formatDateWithOrdinal } from "@typeflowai/lib/utils/datetime";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { TWorkflow } from "@typeflowai/types/workflows";

import { PersonAvatar } from "../Avatars";
import { DeleteDialog } from "../DeleteDialog";
import { FileUploadResponse } from "../FileUploadResponse";
import { LoadingWrapper } from "../LoadingWrapper";
import { PictureSelectionResponse } from "../PictureSelectionResponse";
import { RatingResponse } from "../RatingResponse";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { WorkflowStatusIndicator } from "../WorkflowStatusIndicator";
import { deleteResponseAction } from "./actions";
import QuestionSkip from "./components/QuestionSkip";
import ResponseNotes from "./components/ResponseNote";
import ResponseTagsWrapper from "./components/ResponseTagsWrapper";

export interface SingleResponseCardProps {
  workflow: TWorkflow;
  response: TResponse;
  user?: TUser;
  pageType: string;
  environmentTags: TTag[];
  environment: TEnvironment;
}

interface TooltipRendererProps {
  shouldRender: boolean;
  tooltipContent: ReactNode;
  children: ReactNode;
}

function TooltipRenderer(props: TooltipRendererProps) {
  const { children, shouldRender, tooltipContent } = props;
  if (shouldRender) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{children}</>;
}

function DateResponse({ date }: { date?: string }) {
  if (!date) return null;

  const formattedDateString = formatDateWithOrdinal(new Date(date));
  return <p className="ph-no-capture my-1 font-semibold text-slate-700">{formattedDateString}</p>;
}

export default function SingleResponseCard({
  workflow,
  response,
  user,
  pageType,
  environmentTags,
  environment,
}: SingleResponseCardProps) {
  const environmentId = workflow.environmentId;
  const router = useRouter();
  const displayIdentifier = response.person ? getPersonIdentifier(response.person) : null;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const canResponseBeDeleted = response.finished
    ? true
    : isSubmissionTimeMoreThan5Minutes(response.updatedAt);
  let skippedQuestions: string[][] = [];
  let temp: string[] = [];
  const { membershipRole, isLoading, error } = useMembershipRole(environmentId);
  const { isViewer } = getAccessFlags(membershipRole);
  const isFirstQuestionAnswered = response.data[workflow.questions[0].id] ? true : false;
  const promptId = workflow.prompt.id;

  function isValidValue(value: any) {
    return (
      (typeof value === "string" && value.trim() !== "") ||
      (Array.isArray(value) && value.length > 0) ||
      typeof value === "number"
    );
  }

  if (response.finished) {
    workflow.questions.forEach((question) => {
      if (!response.data[question.id]) {
        temp.push(question.id);
      } else {
        if (temp.length > 0) {
          skippedQuestions.push([...temp]);
          temp = [];
        }
      }
    });
  } else {
    for (let index = workflow.questions.length - 1; index >= 0; index--) {
      const question = workflow.questions[index];
      if (!response.data[question.id]) {
        if (skippedQuestions.length === 0) {
          temp.push(question.id);
        } else if (skippedQuestions.length > 0 && !isValidValue(response.data[question.id])) {
          temp.push(question.id);
        }
      } else {
        if (temp.length > 0) {
          temp.reverse();
          skippedQuestions.push([...temp]);
          temp = [];
        }
      }
    }
  }
  // Handle the case where the last entries are empty
  if (temp.length > 0) {
    skippedQuestions.push(temp);
  }

  function handleArray(data: string | number | string[]): string {
    if (Array.isArray(data)) {
      return data.join(", ");
    } else {
      return String(data);
    }
  }

  const handleDeleteSubmission = async () => {
    setIsDeleting(true);
    try {
      if (isViewer) {
        throw new Error("You are not authorized to perform this action.");
      }
      await deleteResponseAction(response.id);
      router.refresh();
      toast.success("Submission deleted successfully.");
      setDeleteDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTooltip = Boolean(
    (response.personAttributes && Object.keys(response.personAttributes).length > 0) ||
      (response.meta?.userAgent && Object.keys(response.meta.userAgent).length > 0)
  );

  function isSubmissionTimeMoreThan5Minutes(submissionTimeISOString: Date) {
    const submissionTime: Date = new Date(submissionTimeISOString);
    const currentTime: Date = new Date();
    const timeDifference: number = (currentTime.getTime() - submissionTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
    return timeDifference > 5;
  }

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

      {response.meta?.userAgent && Object.keys(response.meta.userAgent).length > 0 && (
        <div className="text-slate-600">
          {response.personAttributes && Object.keys(response.personAttributes).length > 0 && (
            <hr className="my-2 border-slate-200" />
          )}
          <p className="py-1 font-bold text-slate-700">Device info:</p>
          {response.meta?.userAgent?.browser && <p>Browser: {response.meta.userAgent.browser}</p>}
          {response.meta?.userAgent?.os && <p>OS: {response.meta.userAgent.os}</p>}
          {response.meta?.userAgent && (
            <p>
              Device:{" "}
              {response.meta.userAgent.device ? response.meta.userAgent.device : "PC / Generic device"}
            </p>
          )}
          {response.meta?.source && <p>Source: {response.meta.source}</p>}
        </div>
      )}
    </>
  );
  const deleteSubmissionToolTip = <>This response is in progress.</>;
  const hasHiddenFieldsEnabled = workflow.hiddenFields?.enabled;
  const fieldIds = workflow.hiddenFields?.fieldIds || [];
  const hasFieldIds = !!fieldIds.length;

  return (
    <div className={clsx("group relative", isOpen && "min-h-[300px]")}>
      <div
        className={clsx(
          "relative z-10 my-6 rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition-all",
          pageType === "response" &&
            (isOpen
              ? "w-3/4"
              : response.notes.length
                ? "w-[96.5%]"
                : cn("w-full", user ? "group-hover:w-[96.5%]" : ""))
        )}>
        <div className="space-y-2 px-6 pb-5 pt-6">
          <div className="flex items-center justify-between">
            {pageType === "response" && (
              <div>
                {response.person?.id ? (
                  user ? (
                    <Link
                      className="group flex items-center"
                      href={`/environments/${environmentId}/people/${response.person.id}`}>
                      <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
                        <PersonAvatar personId={response.person.id} />
                      </TooltipRenderer>
                      <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600 hover:underline">
                        {displayIdentifier}
                      </h3>
                    </Link>
                  ) : (
                    <div className="group flex items-center">
                      <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
                        <PersonAvatar personId={response.person.id} />
                      </TooltipRenderer>
                      <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600">
                        {displayIdentifier}
                      </h3>
                    </div>
                  )
                ) : (
                  <div className="group flex items-center">
                    <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
                      <PersonAvatar personId="anonymous" />
                    </TooltipRenderer>
                    <h3 className="ml-4 pb-1 font-semibold text-slate-600">Anonymous</h3>
                  </div>
                )}
              </div>
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

            <div className="flex cursor-pointer space-x-4 text-sm">
              <time className="text-slate-500" dateTime={timeSince(response.updatedAt.toISOString())}>
                {timeSince(response.updatedAt.toISOString())}
              </time>
              {user && !isViewer && (
                <TooltipRenderer
                  shouldRender={!canResponseBeDeleted}
                  tooltipContent={deleteSubmissionToolTip}>
                  <TrashIcon
                    onClick={() => {
                      if (canResponseBeDeleted) {
                        setDeleteDialogOpen(true);
                      }
                    }}
                    className={`h-4 w-4 ${
                      canResponseBeDeleted
                        ? "text-slate-500 hover:text-red-700"
                        : "cursor-not-allowed text-gray-400"
                    } `}
                  />
                </TooltipRenderer>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-b-lg bg-white p-6">
          {workflow.welcomeCard.enabled && (
            <QuestionSkip
              skippedQuestions={[]}
              questions={workflow.questions}
              status={"welcomeCard"}
              isFirstQuestionAnswered={isFirstQuestionAnswered}
            />
          )}
          <div className="space-y-6">
            {workflow.questions.map((question) => {
              const skipped = skippedQuestions.find((skippedQuestionElement) =>
                skippedQuestionElement.includes(question.id)
              );

              // If found, remove it from the list
              if (skipped) {
                skippedQuestions = skippedQuestions.filter((item) => item !== skipped);
              }

              return (
                <div key={`${question.id}`}>
                  {isValidValue(response.data[question.id]) ? (
                    <p className="text-sm text-slate-500">{question.headline}</p>
                  ) : (
                    <QuestionSkip
                      skippedQuestions={skipped}
                      questions={workflow.questions}
                      status={
                        response.finished ||
                        (skippedQuestions.length > 0 &&
                          !skippedQuestions[skippedQuestions.length - 1].includes(question.id))
                          ? "skipped"
                          : "aborted"
                      }
                    />
                  )}
                  {typeof response.data[question.id] !== "object" ? (
                    question.type === TWorkflowQuestionType.Rating ? (
                      <div>
                        <RatingResponse
                          scale={question.scale}
                          answer={response.data[question.id]}
                          range={question.range}
                        />
                      </div>
                    ) : question.type === TWorkflowQuestionType.Date ? (
                      <DateResponse date={response.data[question.id] as string} />
                    ) : question.type === TWorkflowQuestionType.Cal ? (
                      <p className="ph-no-capture my-1 font-semibold capitalize text-slate-700">
                        {response.data[question.id]}
                      </p>
                    ) : (
                      <p className="ph-no-capture my-1 font-semibold text-slate-700">
                        {response.data[question.id]}
                      </p>
                    )
                  ) : question.type === TWorkflowQuestionType.PictureSelection ? (
                    <PictureSelectionResponse
                      choices={question.choices}
                      selected={response.data[question.id]}
                    />
                  ) : question.type === TWorkflowQuestionType.FileUpload ? (
                    <FileUploadResponse selected={response.data[question.id]} />
                  ) : (
                    <p className="ph-no-capture my-1 font-semibold text-slate-700">
                      {handleArray(response.data[question.id])}
                    </p>
                  )}
                </div>
              );
            })}
            {response.data[promptId] && (
              <div>
                <p className="text-sm text-slate-500">{workflow.prompt.description}</p>
                <p className="ph-no-capture my-1 font-semibold text-slate-700">{response.data[promptId]}</p>
              </div>
            )}
          </div>
          {hasHiddenFieldsEnabled && hasFieldIds && (
            <div className="mt-6 flex flex-col gap-6">
              {fieldIds.map((field) => {
                return (
                  <div key={field}>
                    <p className="text-sm text-slate-500">Hidden Field: {field}</p>
                    <p className="ph-no-capture my-1 font-semibold text-slate-700">{response.data[field]}</p>
                  </div>
                );
              })}
            </div>
          )}
          {response.finished && (
            <div className="mt-4 flex">
              <CheckCircleIcon className="h-6 w-6 text-slate-400" />
              <p className="mx-2 rounded-lg bg-slate-100 px-2 text-slate-700">Completed</p>
            </div>
          )}
        </div>

        {user && (
          <LoadingWrapper isLoading={isLoading} error={error}>
            {!isViewer && (
              <ResponseTagsWrapper
                environmentId={environmentId}
                responseId={response.id}
                tags={response.tags.map((tag) => ({ tagId: tag.id, tagName: tag.name }))}
                environmentTags={environmentTags}
              />
            )}
          </LoadingWrapper>
        )}

        <DeleteDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          deleteWhat="response"
          onDelete={handleDeleteSubmission}
          isDeleting={isDeleting}
        />
      </div>
      {user && pageType === "response" && (
        <ResponseNotes
          user={user}
          responseId={response.id}
          notes={response.notes}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
