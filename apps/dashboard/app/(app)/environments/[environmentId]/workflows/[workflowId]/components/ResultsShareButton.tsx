"use client";

import {
  deleteResultShareUrlAction,
  generateResultShareUrlAction,
  getResultShareUrlAction,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/actions";
import { CopyIcon, DownloadIcon, GlobeIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";

import { ShareEmbedWorkflow } from "../(analysis)/summary/components/ShareEmbedWorkflow";
import { ShareWorkflowResults } from "../(analysis)/summary/components/ShareWorkflowResults";

interface ResultsShareButtonProps {
  workflow: TWorkflow;
  webAppUrl: string;
  user?: TUser;
}

export const ResultsShareButton = ({ workflow, webAppUrl, user }: ResultsShareButtonProps) => {
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
        toast.success("Results unpublished successfully.");
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

  const copyUrlToClipboard = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          toast.success("Link to results copied to clipboard.");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error("Failed to copy link to results to clipboard.");
        });
    } else {
      console.error("Cannot copy URL: not running in a browser environment.");
      toast.error("Failed to copy URL: not in a browser environment.");
    }
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="focus:bg-muted cursor-pointer border border-slate-200 outline-none hover:border-slate-300">
          <div className="min-w-auto h-auto rounded-md border bg-white p-3 sm:flex sm:min-w-[7rem] sm:px-6 sm:py-3">
            <div className="hidden w-full items-center justify-between sm:flex">
              <span className="text-sm text-slate-700">Share results</span>
              <LinkIcon className="ml-2 h-4 w-4" />
            </div>
            <DownloadIcon className="block h-4 sm:hidden" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {workflow.resultShareKey ? (
            <DropdownMenuItem
              className="hover:ring-0"
              onClick={() => {
                navigator.clipboard.writeText(workflowUrl);
                toast.success("Link to public results copied");
              }}>
              <p className="text-slate-700">
                Copy link to public results <CopyIcon className="ml-1.5 inline h-4 w-4" />
              </p>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-slate-700 hover:ring-0"
              onClick={() => {
                copyUrlToClipboard();
              }}>
              <p className="flex items-center text-slate-700">
                Copy link <CopyIcon className="ml-1.5 h-4 w-4" />
              </p>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="hover:ring-0"
            onClick={() => {
              setShowResultsLinkModal(true);
            }}>
            <p className="flex items-center text-slate-700">
              {workflow.resultShareKey ? "Unpublish from web" : "Publish to web"}
              <GlobeIcon className="ml-1.5 h-4 w-4" />
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showLinkModal && user && (
        <ShareEmbedWorkflow
          workflow={workflow}
          open={showLinkModal}
          setOpen={setShowLinkModal}
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
    </div>
  );
};
