import Modal from "@/components/wrappers/Modal";
import { useState } from "preact/hooks";

import { WorkflowModalProps } from "@typeflowai/types/typeflowAIWorkflows";

import { Workflow } from "./Workflow";

export function WorkflowModal({
  workflow,
  webAppUrl,
  isBrandingEnabled,
  getSetIsError,
  placement,
  clickOutside,
  darkOverlay,
  onDisplay,
  getSetIsResponseSendingFinished,
  onResponse,
  onClose,
  onFinished = () => {},
  onFileUpload,
  onRetry,
  isRedirectDisabled = false,
  languageCode,
  responseCount,
  isPreview,
  styling,
}: WorkflowModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1000); // wait for animation to finish}
  };

  const highlightBorderColor = styling?.highlightBorderColor?.light || null;

  return (
    <div id="fbjs" className="typeflowai-form">
      <Modal
        placement={placement}
        clickOutside={clickOutside}
        darkOverlay={darkOverlay}
        isOpen={isOpen}
        onClose={close}>
        <Workflow
          workflow={workflow}
          webAppUrl={webAppUrl}
          isBrandingEnabled={isBrandingEnabled}
          onDisplay={onDisplay}
          getSetIsResponseSendingFinished={getSetIsResponseSendingFinished}
          onResponse={onResponse}
          languageCode={languageCode}
          onClose={close}
          onFinished={() => {
            onFinished();
            setTimeout(() => {
              if (!workflow.redirectUrl) {
                close();
              }
            }, 3000); // close modal automatically after 3 seconds
          }}
          onRetry={onRetry}
          getSetIsError={getSetIsError}
          onFileUpload={onFileUpload}
          isRedirectDisabled={isRedirectDisabled}
          responseCount={responseCount}
          isPreview={isPreview}
          styling={styling}
          isCardBorderVisible={!highlightBorderColor}
          clickOutside={placement === "center" ? clickOutside : undefined}
        />
      </Modal>
    </div>
  );
}
