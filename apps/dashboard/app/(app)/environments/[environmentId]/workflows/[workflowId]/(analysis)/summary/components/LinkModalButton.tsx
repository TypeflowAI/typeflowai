"use client";

import {
  deleteResultShareUrlAction,
  generateResultShareUrlAction,
  getResultShareUrlAction,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/actions";
import { LinkIcon } from "@heroicons/react/24/outline";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { TProduct } from "@typeflowai/types/product";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";

import ShareEmbedWorkflow from "./ShareEmbedWorkflow";
import ShareWorkflowResults from "./ShareWorkflowResults";

interface WorkflowShareButtonProps {
  workflow: TWorkflow;
  className?: string;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
}

export default function WorkflowShareButton({
  workflow,
  webAppUrl,
  product,
  user,
}: WorkflowShareButtonProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showResultsLinkModal, setShowResultsLinkModal] = useState(false);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [workflowUrl, setWorkflowUrl] = useState("");

  const handlePublish = async () => {
    const key = await generateResultShareUrlAction(workflow.id);
    setWorkflowUrl(webAppUrl + "/share/" + key);
    setShowPublishModal(true);
  };

  const handleUnpublish = () => {
    deleteResultShareUrlAction(workflow.id)
      .then(() => {
        toast.success("Workflow Unpublished successfully");
        setShowPublishModal(false);
        setShowLinkModal(false);
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  useEffect(() => {
    async function fetchSharingKey() {
      const sharingKey = await getResultShareUrlAction(workflow.id);
      if (sharingKey) {
        setWorkflowUrl(webAppUrl + "/share/" + sharingKey);
        setShowPublishModal(true);
      }
    }

    fetchSharingKey();
  }, [workflow.id, webAppUrl]);

  useEffect(() => {
    if (showResultsLinkModal) {
      setShowLinkModal(false);
    }
  }, [showResultsLinkModal]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="focus:bg-muted cursor-pointer border border-slate-300 outline-none">
          <div className="min-w-auto h-auto rounded-md border bg-white p-3 sm:flex sm:min-w-[7rem] sm:px-6 sm:py-3">
            <div className="hidden w-full items-center justify-between sm:flex">
              <span className="text-sm text-slate-700"> Share</span>
              <LinkIcon className="h-4 w-4" />
            </div>
            <DownloadIcon className="block h-4 sm:hidden" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {workflow.type === "link" && (
            <DropdownMenuItem
              className="hover:ring-0"
              onClick={() => {
                setShowLinkModal(true);
              }}>
              <p className="text-slate-700">Share Workflow</p>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="hover:ring-0"
            onClick={() => {
              setShowResultsLinkModal(true);
            }}>
            <p className="text-slate-700">Publish Results</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showLinkModal && (
        <ShareEmbedWorkflow
          workflow={workflow}
          open={showLinkModal}
          setOpen={setShowLinkModal}
          product={product}
          webAppUrl={webAppUrl}
          user={user}
        />
      )}
      {showResultsLinkModal && (
        <ShareWorkflowResults
          open={showResultsLinkModal}
          setOpen={setShowResultsLinkModal}
          workflowUrl={workflowUrl}
          handlePublish={handlePublish}
          handleUnpublish={handleUnpublish}
          showPublishModal={showPublishModal}
        />
      )}
    </>
  );
}
