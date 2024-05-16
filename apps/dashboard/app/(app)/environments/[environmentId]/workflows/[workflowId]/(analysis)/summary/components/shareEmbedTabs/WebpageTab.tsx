"use client";

import { CopyIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@typeflowai/ui/Button";
import CodeBlock from "@typeflowai/ui/CodeBlock";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

export default function WebpageTab({ workflowUrl }) {
  const iframeCode = `<div style="position: relative; height:100vh; max-height:100vh; overflow:auto;"> 
  <iframe 
    src="${workflowUrl}" 
    frameborder="0" style="position: absolute; left:0; top:0; width:100%; height:100%; border:0;">
  </iframe>
</div>`;

  return (
    <div className="flex h-full grow flex-col">
      <div className="flex justify-between">
        <div></div>
        <Button
          variant="darkCTA"
          title="Embed workflow in your website"
          aria-label="Embed workflow in your website"
          onClick={() => {
            navigator.clipboard.writeText(iframeCode);
            capturePosthogEvent("WorkflowShared", { shareMethod: "Web Embed" });
            toast.success("Embed code copied to clipboard!");
          }}
          EndIcon={CopyIcon}>
          Copy code
        </Button>
      </div>
      <div className="prose prose-slate max-w-full">
        <CodeBlock
          customCodeClass="text-sm h-48 overflow-y-scroll text-sm"
          language="html"
          showCopyToClipboard={false}>
          {iframeCode}
        </CodeBlock>
      </div>
    </div>
  );
}
