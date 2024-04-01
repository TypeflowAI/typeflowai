import Modal from "@/components/wrappers/Modal";
import { WorkflowModalProps } from "@/types/props";
import { useState } from "preact/hooks";

import { Workflow } from "./Workflow";

export function WorkflowModal({
  workflow,
  webAppUrl,
  isBrandingEnabled,
  activeQuestionId,
  placement,
  clickOutside,
  darkOverlay,
  highlightBorderColor,
  onDisplay = () => {},
  onActiveQuestionChange = () => {},
  onResponse = () => {},
  onClose = () => {},
  onFinished = () => {},
  onFileUpload,
  isRedirectDisabled = false,
  responseCount,
  isPreview,
}: WorkflowModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 1000); // wait for animation to finish}
  };

  return (
    <div id="fbjs" className="typeflowai-form">
      <Modal
        placement={placement}
        clickOutside={clickOutside}
        darkOverlay={darkOverlay}
        highlightBorderColor={highlightBorderColor}
        isOpen={isOpen}
        onClose={close}>
        <Workflow
          workflow={workflow}
          webAppUrl={webAppUrl}
          isBrandingEnabled={isBrandingEnabled}
          activeQuestionId={activeQuestionId}
          onDisplay={onDisplay}
          onActiveQuestionChange={onActiveQuestionChange}
          onResponse={onResponse}
          onClose={close}
          onFinished={() => {
            onFinished();
            setTimeout(() => {
              if (!workflow.redirectUrl) {
                close();
              }
            }, 4000); // close modal automatically after 4 seconds
          }}
          onFileUpload={onFileUpload}
          isRedirectDisabled={isRedirectDisabled}
          responseCount={responseCount}
          isPreview={isPreview}
        />
      </Modal>
    </div>
  );
}
