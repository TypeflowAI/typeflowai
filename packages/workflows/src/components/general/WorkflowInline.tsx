import { WorkflowBaseProps } from "@/types/props";

import { Workflow } from "./Workflow";

export function WorkflowInline({
  workflow,
  webAppUrl,
  isBrandingEnabled,
  activeQuestionId,
  onDisplay = () => {},
  onActiveQuestionChange = () => {},
  onResponse = () => {},
  onClose = () => {},
  prefillResponseData,
  isRedirectDisabled = false,
  onFileUpload,
  responseCount,
  isPreview,
}: WorkflowBaseProps) {
  return (
    <div id="fbjs" className="typeflowai-form h-full w-full">
      <Workflow
        workflow={workflow}
        webAppUrl={webAppUrl}
        isBrandingEnabled={isBrandingEnabled}
        activeQuestionId={activeQuestionId}
        onDisplay={onDisplay}
        onActiveQuestionChange={onActiveQuestionChange}
        onResponse={onResponse}
        onClose={onClose}
        prefillResponseData={prefillResponseData}
        isRedirectDisabled={isRedirectDisabled}
        onFileUpload={onFileUpload}
        responseCount={responseCount}
        isPreview={isPreview}
      />
    </div>
  );
}
