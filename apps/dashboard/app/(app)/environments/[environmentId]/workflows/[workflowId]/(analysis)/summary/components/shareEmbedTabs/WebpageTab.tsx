"use client";

import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import { Button } from "@typeflowai/ui/Button";
import CodeBlock from "@typeflowai/ui/CodeBlock";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

export default function WebpageTab({ workflowUrl, workflowId }) {
  const iframeCode = `<div style="position: relative; height:100vh; max-height:100vh; overflow:auto;"> 
    <iframe 
    src="${workflowUrl}" 
    frameborder="0" style="position: absolute; left:0; top:0; width:100%; height:100%; border:0;">
    </iframe>
    </div>`;

  return (
    <div className="flex h-full grow flex-col gap-5">
      <div className="flex justify-between">
        <div className=""></div>
        <Button
          variant="darkCTA"
          title="Embed workflow in your website"
          aria-label="Embed workflow in your website"
          onClick={() => {
            capturePosthogEvent("WorkflowShared", { workflowId: workflowId, shareMethod: "Web Embed" });
            navigator.clipboard.writeText(iframeCode);
            toast.success("Embed code copied to clipboard!");
          }}
          EndIcon={DocumentDuplicateIcon}>
          Copy code
        </Button>
      </div>
      <div className="grow overflow-y-scroll rounded-xl border border-gray-200 bg-white px-4 py-[18px]">
        <CodeBlock
          customCodeClass="!whitespace-normal sm:!whitespace-pre-wrap !break-all sm:!break-normal"
          language="html"
          showCopyToClipboard={false}>
          {iframeCode}
        </CodeBlock>
      </div>
    </div>
  );
}
