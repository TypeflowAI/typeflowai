import { Copy, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { TWorkflow } from "@typeflowai/types/workflows";

import { Button } from "../Button";
import { capturePosthogEvent } from "../PostHogClient";
import { generateSingleUseIdAction } from "./actions";
import { LanguageDropdown } from "./components/LanguageDropdown";
import { WorkflowLinkDisplay } from "./components/WorkflowLinkDisplay";

interface ShareWorkflowLinkProps {
  workflow: TWorkflow;
  webAppUrl: string;
  workflowUrl: string;
  setWorkflowUrl: (url: string) => void;
}

export const ShareWorkflowLink = ({
  workflow,
  webAppUrl,
  workflowUrl,
  setWorkflowUrl,
}: ShareWorkflowLinkProps) => {
  const [language, setLanguage] = useState("default");

  const getUrl = useCallback(async () => {
    let url = `${webAppUrl}/s/${workflow.id}`;
    const queryParams: string[] = [];

    if (workflow.singleUse?.enabled) {
      const singleUseId = await generateSingleUseIdAction(workflow.id, workflow.singleUse.isEncrypted);
      queryParams.push(`suId=${singleUseId}`);
    }

    if (language !== "default") {
      queryParams.push(`lang=${language}`);
    }

    if (queryParams.length) {
      url += `?${queryParams.join("&")}`;
    }

    setWorkflowUrl(url);
  }, [workflow, webAppUrl, language]);

  const generateNewSingleUseLink = () => {
    getUrl();
    toast.success("New single use link generated");
  };

  useEffect(() => {
    getUrl();
  }, [workflow, getUrl, language]);

  return (
    <div
      className={`flex max-w-full flex-col items-center justify-center space-x-2 ${
        workflow.singleUse?.enabled ? "flex-col" : "lg:flex-row"
      }`}>
      <WorkflowLinkDisplay workflowUrl={workflowUrl} />
      <div className="mt-2 flex items-center justify-center space-x-2">
        <LanguageDropdown workflow={workflow} setLanguage={setLanguage} />
        <Button
          variant="darkCTA"
          title="Copy workflow link to clipboard"
          aria-label="Copy workflow link to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(workflowUrl);
            capturePosthogEvent("WorkflowShared", { workflowId: workflow.id, shareMethod: "Link" });
            toast.success("URL copied to clipboard!");
          }}
          EndIcon={Copy}>
          Copy Link
        </Button>
        {workflow.singleUse?.enabled && (
          <Button
            variant="darkCTA"
            title="Regenerate single use workflow link"
            aria-label="Regenerate single use workflow link"
            onClick={generateNewSingleUseLink}>
            <RefreshCcw className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
