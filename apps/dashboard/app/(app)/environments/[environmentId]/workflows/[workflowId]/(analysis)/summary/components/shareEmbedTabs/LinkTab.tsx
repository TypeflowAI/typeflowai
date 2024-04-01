"use client";

import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { ArrowUpRightIcon } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { WorkflowInline } from "@typeflowai/ui/Workflow";

interface EmailTabProps {
  workflowUrl: string;
  webAppUrl: string;
  workflow: TWorkflow;
  brandColor: string;
}

export default function LinkTab({ workflowUrl, webAppUrl, workflow, brandColor }: EmailTabProps) {
  const linkTextRef = useRef(null);

  const handleTextSelection = () => {
    if (linkTextRef.current) {
      const range = document.createRange();
      range.selectNodeContents(linkTextRef.current);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="flex h-full grow flex-col gap-5">
      <div className="flex flex-wrap justify-between gap-2">
        <div
          ref={linkTextRef}
          className="relative grow overflow-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
          onClick={() => handleTextSelection()}>
          <span style={{ wordBreak: "break-all" }}>{workflowUrl}</span>
        </div>
        <Button
          variant="darkCTA"
          title="Copy workflow link to clipboard"
          aria-label="Copy workflow link to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(workflowUrl);
            toast.success("URL copied to clipboard!");
          }}
          EndIcon={DocumentDuplicateIcon}>
          Copy URL
        </Button>
      </div>
      <div className="relative grow overflow-y-scroll rounded-xl border border-gray-200 bg-white px-4 py-[18px]">
        <WorkflowInline
          brandColor={brandColor}
          workflow={workflow}
          webAppUrl={webAppUrl}
          isBrandingEnabled={false}
          autoFocus={false}
          isRedirectDisabled={false}
          key={workflow.id}
          onFileUpload={async () => ""}
        />

        <Button
          variant="minimal"
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 transform rounded-lg border border-slate-200 bg-white"
          )}
          EndIcon={ArrowUpRightIcon}
          title="Open workflow in new tab"
          aria-label="Open workflow in new tab"
          endIconClassName="h-4 w-4 "
          href={`${workflowUrl}?preview=true`}
          target="_blank">
          Open in new tab
        </Button>
      </div>
    </div>
  );
}
