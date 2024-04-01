"use client";

import {
  copyToOtherEnvironmentAction,
  deleteWorkflowAction,
  duplicateWorkflowAction,
} from "@/app/(app)/environments/[environmentId]/actions";
import {
  ArrowUpOnSquareStackIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  LinkIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import type { TEnvironment } from "@typeflowai/types/environment";
import type { TWorkflow } from "@typeflowai/types/workflows";
import { DeleteDialog } from "@typeflowai/ui/DeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";
import LoadingSpinner from "@typeflowai/ui/LoadingSpinner";

import { updateWorkflowAction } from "../actions";
import { handleFileUpload } from "../lib";

interface WorkflowDropDownMenuProps {
  environmentId: string;
  workflow: TWorkflow;
  environment: TEnvironment;
  otherEnvironment: TEnvironment;
  webAppUrl: string;
  singleUseId?: string;
  isWorkflowCreationDeletionDisabled?: boolean;
}

export default function WorkflowDropDownMenu({
  environmentId,
  workflow,
  environment,
  otherEnvironment,
  webAppUrl,
  singleUseId,
  isWorkflowCreationDeletionDisabled,
}: WorkflowDropDownMenuProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const workflowUrl = useMemo(() => webAppUrl + "/s/" + workflow.id, [workflow.id, webAppUrl]);

  const handleDeleteWorkflow = async (workflow) => {
    setLoading(true);
    try {
      await deleteWorkflowAction(workflow.id);
      router.refresh();
      setDeleteDialogOpen(false);
      toast.success("Workflow deleted successfully.");
    } catch (error) {
      toast.error("An error occured while deleting workflow");
    }
    setLoading(false);
  };

  const duplicateWorkflowAndRefresh = async (workflowId) => {
    setLoading(true);
    try {
      await duplicateWorkflowAction(environmentId, workflowId);
      router.refresh();
      toast.success("Workflow duplicated successfully.");
    } catch (error) {
      toast.error("Failed to duplicate the workflow.");
    }
    setLoading(false);
  };

  const handleUpload = async (file: File, environmentId: string) => {
    setLoading(true);
    try {
      const { url, error } = await handleFileUpload(file, environmentId);

      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }

      await updateWorkflowAction(workflow, url);

      router.refresh();
    } catch (err) {
      toast.error("Icon update failed. Please try again.");
      setLoading(false);
    }

    setLoading(false);
  };

  const copyToOtherEnvironment = async (workflowId) => {
    setLoading(true);
    try {
      await copyToOtherEnvironmentAction(environmentId, workflowId, otherEnvironment.id);
      if (otherEnvironment.type === "production") {
        toast.success("Workflow copied to production env.");
      } else if (otherEnvironment.type === "development") {
        toast.success("Workflow copied to development env.");
      }
      router.replace(`/environments/${otherEnvironment.id}`);
    } catch (error) {
      toast.error(`Failed to copy to ${otherEnvironment.type}`);
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="opacity-0.2 absolute left-0 top-0 h-full w-full bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="z-10 cursor-pointer" asChild>
          <div>
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            {!isWorkflowCreationDeletionDisabled && (
              <>
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center"
                    href={`/environments/${environmentId}/workflows/${workflow.id}/edit`}>
                    <PencilSquareIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button
                    className="flex w-full items-center"
                    onClick={async () => {
                      duplicateWorkflowAndRefresh(workflow.id);
                    }}>
                    <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                    Duplicate
                  </button>
                </DropdownMenuItem>
              </>
            )}
            {!isWorkflowCreationDeletionDisabled && (
              <>
                {environment.type === "development" ? (
                  <DropdownMenuItem>
                    <button
                      className="flex w-full items-center"
                      onClick={() => {
                        copyToOtherEnvironment(workflow.id);
                      }}>
                      <ArrowUpOnSquareStackIcon className="mr-2 h-4 w-4" />
                      Copy to Prod
                    </button>
                  </DropdownMenuItem>
                ) : environment.type === "production" ? (
                  <DropdownMenuItem>
                    <button
                      className="flex w-full items-center"
                      onClick={() => {
                        copyToOtherEnvironment(workflow.id);
                      }}>
                      <ArrowUpOnSquareStackIcon className="mr-2 h-4 w-4" />
                      Copy to Dev
                    </button>
                  </DropdownMenuItem>
                ) : null}
              </>
            )}
            {workflow.type === "link" && workflow.status !== "draft" && (
              <>
                <DropdownMenuItem>
                  <Link
                    className="flex w-full items-center"
                    href={
                      singleUseId
                        ? `/s/${workflow.id}?suId=${singleUseId}&preview=true`
                        : `/s/${workflow.id}?preview=true`
                    }
                    target="_blank">
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Preview Workflow
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    className="flex w-full items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        singleUseId ? `${workflowUrl}?suId=${singleUseId}` : workflowUrl
                      );
                      toast.success("Copied link to clipboard");
                      router.refresh();
                    }}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Link
                  </button>
                </DropdownMenuItem>
              </>
            )}
            {!isWorkflowCreationDeletionDisabled && (
              <DropdownMenuItem>
                <button
                  className="flex w-full  items-center"
                  onClick={() => {
                    setDeleteDialogOpen(true);
                  }}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <button
                className="flex w-full  items-center"
                onClick={() => {
                  console.log("Empieza el metodo handleUpload");
                  inputRef.current?.click();
                }}>
                <PhotoIcon className="mr-2 h-4 w-4" />
                Change Icon
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        id="hiddenFileInput"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await handleUpload(file, environmentId);
          }
        }}
      />

      {!isWorkflowCreationDeletionDisabled && (
        <DeleteDialog
          deleteWhat="Workflow"
          open={isDeleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onDelete={() => handleDeleteWorkflow(workflow)}
          text="Are you sure you want to delete this workflow and all of its responses? This action cannot be undone."
        />
      )}
    </>
  );
}
