"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";

import { DeleteDialog } from "../DeleteDialog";
import { deleteResponseAction, getResponseAction } from "./actions";
import { ResponseNotes } from "./components/ResponseNote";
import { ResponseTagsWrapper } from "./components/ResponseTagsWrapper";
import { SingleResponseCardBody } from "./components/SingleResponseCardBody";
import { SingleResponseCardHeader } from "./components/SingleResponseCardHeader";
import { isValidValue } from "./util";

interface SingleResponseCardProps {
  workflow: TWorkflow;
  response: TResponse;
  user?: TUser;
  pageType: "people" | "response";
  environmentTags: TTag[];
  environment: TEnvironment;
  updateResponse?: (responseId: string, responses: TResponse) => void;
  deleteResponse?: (responseId: string) => void;
  isViewer: boolean;
}

export const SingleResponseCard = ({
  workflow,
  response,
  user,
  pageType,
  environmentTags,
  environment,
  updateResponse,
  deleteResponse,
  isViewer,
}: SingleResponseCardProps) => {
  const environmentId = workflow.environmentId;
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  let skippedQuestions: string[][] = [];
  let temp: string[] = [];

  if (response.finished) {
    workflow.questions.forEach((question) => {
      if (!isValidValue(response.data[question.id])) {
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

  const handleDeleteResponse = async () => {
    setIsDeleting(true);
    try {
      if (isViewer) {
        throw new Error("You are not authorized to perform this action.");
      }
      await deleteResponseAction(response.id);
      deleteResponse?.(response.id);

      router.refresh();
      toast.success("Response deleted successfully.");
      setDeleteDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateFetchedResponses = async () => {
    const updatedResponse = await getResponseAction(response.id);
    if (updatedResponse !== null && updateResponse) {
      updateResponse(response.id, updatedResponse);
    }
  };

  return (
    <div className={clsx("group relative", isOpen && "min-h-[300px]")}>
      <div
        className={clsx(
          "relative z-20 my-6 rounded-xl border border-slate-200 bg-white shadow-sm transition-all",
          pageType === "response" &&
            (isOpen
              ? "w-3/4"
              : user && response.notes.length
                ? "w-[96.5%]"
                : cn("w-full", user ? "group-hover:w-[96.5%]" : ""))
        )}>
        <SingleResponseCardHeader
          pageType="response"
          response={response}
          workflow={workflow}
          environment={environment}
          user={user}
          isViewer={isViewer}
          setDeleteDialogOpen={setDeleteDialogOpen}
        />

        <SingleResponseCardBody workflow={workflow} response={response} skippedQuestions={skippedQuestions} />

        <ResponseTagsWrapper
          environmentId={environmentId}
          responseId={response.id}
          tags={response.tags.map((tag) => ({ tagId: tag.id, tagName: tag.name }))}
          environmentTags={environmentTags}
          updateFetchedResponses={updateFetchedResponses}
          isViewer={isViewer}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          deleteWhat="response"
          onDelete={handleDeleteResponse}
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
          updateFetchedResponses={updateFetchedResponses}
        />
      )}
    </div>
  );
};
