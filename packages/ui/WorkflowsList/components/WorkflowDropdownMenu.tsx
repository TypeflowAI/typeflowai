"use client";

import {
  ArrowUpFromLineIcon,
  CopyIcon,
  EyeIcon,
  ImageIcon,
  LinkIcon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import type { TEnvironment } from "@typeflowai/types/environment";
import type { TWorkflow } from "@typeflowai/types/workflows";

import { DeleteDialog } from "../../DeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../DropdownMenu";
import { LoadingSpinner } from "../../LoadingSpinner";
import {
  copyToOtherEnvironmentAction,
  deleteWorkflowAction,
  duplicateWorkflowAction,
  getWorkflowAction,
  handleFileUpload,
  updateWorkflowAction,
} from "../actions";

interface WorkflowDropDownMenuProps {
  environmentId: string;
  workflow: TWorkflow;
  environment: TEnvironment;
  otherEnvironment: TEnvironment;
  webAppUrl: string;
  singleUseId?: string;
  isWorkflowCreationDeletionDisabled?: boolean;
  duplicateWorkflow: (workflow: TWorkflow) => void;
  deleteWorkflow: (workflowId: string) => void;
  isAIToolsLimited: boolean;
  openAddAIToolModal: (addAIToolModal: boolean) => void;
}

export const WorkflowDropDownMenu = ({
  environmentId,
  workflow,
  environment,
  otherEnvironment,
  webAppUrl,
  singleUseId,
  isWorkflowCreationDeletionDisabled,
  deleteWorkflow,
  duplicateWorkflow,
  isAIToolsLimited,
  openAddAIToolModal,
}: WorkflowDropDownMenuProps) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const workflowUrl = useMemo(() => webAppUrl + "/s/" + workflow.id, [workflow.id, webAppUrl]);

  const handleDeleteWorkflow = async (workflow: TWorkflow) => {
    setLoading(true);
    try {
      await deleteWorkflowAction(workflow.id);
      deleteWorkflow(workflow.id);
      router.refresh();
      setDeleteDialogOpen(false);
      toast.success("Workflow deleted successfully.");
    } catch (error) {
      toast.error("An error occured while deleting workflow");
    }
    setLoading(false);
  };

  const duplicateWorkflowAndRefresh = async (workflowId: string) => {
    setLoading(true);
    try {
      if (isAIToolsLimited) {
        openAddAIToolModal(true);
        setLoading(false);
        return;
      }
      const duplicatedWorkflow = await duplicateWorkflowAction(environmentId, workflowId);
      router.refresh();
      const transformedDuplicatedWorkflow = await getWorkflowAction(duplicatedWorkflow.id);
      if (transformedDuplicatedWorkflow) duplicateWorkflow(transformedDuplicatedWorkflow);
      toast.success("Workflow duplicated successfully.");
    } catch (error) {
      toast.error("Failed to duplicate the workflow.");
    }
    setLoading(false);
  };

  const copyToOtherEnvironment = async (workflowId: string) => {
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
      console.error(err);
      toast.error("Icon update failed. Please try again.");
      setLoading(false);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="opacity-0.2 absolute left-0 top-0 h-full w-full bg-slate-100">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div
      id={`${workflow.name.toLowerCase().split(" ").join("-")}-workflow-actions`}
      onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="z-10 cursor-pointer" asChild>
          <div className="rounded-lg border p-2 hover:bg-slate-50">
            <span className="sr-only">Open options</span>
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
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
                    <SquarePenIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <button
                    type="button"
                    className="flex w-full items-center"
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsDropDownOpen(false);
                      duplicateWorkflowAndRefresh(workflow.id);
                    }}>
                    <CopyIcon className="mr-2 h-4 w-4" />
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
                      type="button"
                      className="flex w-full items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropDownOpen(false);
                        copyToOtherEnvironment(workflow.id);
                      }}>
                      <ArrowUpFromLineIcon className="mr-2 h-4 w-4" />
                      Copy to Prod
                    </button>
                  </DropdownMenuItem>
                ) : environment.type === "production" ? (
                  <DropdownMenuItem>
                    <button
                      type="button"
                      className="flex w-full items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropDownOpen(false);
                        copyToOtherEnvironment(workflow.id);
                      }}>
                      <ArrowUpFromLineIcon className="mr-2 h-4 w-4" />
                      Copy to Dev
                    </button>
                  </DropdownMenuItem>
                ) : null}
              </>
            )}
            {workflow.type === "link" && workflow.status !== "draft" && (
              <>
                <DropdownMenuItem>
                  <div
                    className="flex w-full cursor-pointer items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropDownOpen(false);
                      const previewUrl = singleUseId
                        ? `/s/${workflow.id}?suId=${singleUseId}&preview=true`
                        : `/s/${workflow.id}?preview=true`;
                      window.open(previewUrl, "_blank");
                    }}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Preview Workflow
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    type="button"
                    className="flex w-full items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropDownOpen(false);
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
                  type="button"
                  className="flex w-full  items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDropDownOpen(false);
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
                  inputRef.current?.click();
                }}>
                <ImageIcon className="mr-2 h-4 w-4" />
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
    </div>
  );
};
