import { useEffect, useMemo } from "react";

import { TResponseData, TResponseUpdate } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow } from "@typeflowai/types/workflows";
import { renderWorkflowInline, renderWorkflowModal } from "@typeflowai/workflows";

const createContainerId = () => `typeflowai-workflow-container`;

interface WorkflowProps {
  workflow: TWorkflow;
  webAppUrl: string;
  brandColor: string;
  isBrandingEnabled: boolean;
  activeQuestionId?: string;
  onDisplay?: () => void;
  onResponse?: (response: TResponseUpdate) => void;
  onFinished?: () => void;
  onActiveQuestionChange?: (questionId: string) => void;
  onClose?: () => void;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  autoFocus?: boolean;
  prefillResponseData?: TResponseData;
  isRedirectDisabled?: boolean;
  responseCount?: number;
  isPreview?: boolean;
}

interface WorkflowModalProps extends WorkflowProps {
  placement?: "topRight" | "bottomRight" | "bottomLeft" | "topLeft" | "center";
  clickOutside?: boolean;
  darkOverlay?: boolean;
  highlightBorderColor?: string | null;
}

export const WorkflowInline = ({
  workflow,
  webAppUrl,
  brandColor,
  isBrandingEnabled,
  activeQuestionId,
  onDisplay = () => {},
  onResponse = () => {},
  onActiveQuestionChange = () => {},
  onClose = () => {},
  autoFocus,
  prefillResponseData,
  isRedirectDisabled,
  onFileUpload,
  responseCount,
  isPreview,
}: WorkflowProps) => {
  const containerId = useMemo(() => createContainerId(), []);
  useEffect(() => {
    renderWorkflowInline({
      workflow,
      webAppUrl,
      brandColor,
      isBrandingEnabled,
      containerId,
      onDisplay,
      onResponse,
      onClose,
      activeQuestionId,
      onActiveQuestionChange,
      autoFocus,
      prefillResponseData,
      isRedirectDisabled,
      onFileUpload,
      responseCount,
      isPreview,
    });
  }, [
    activeQuestionId,
    brandColor,
    containerId,
    isBrandingEnabled,
    onActiveQuestionChange,
    onClose,
    onDisplay,
    onResponse,
    workflow,
    webAppUrl,
    autoFocus,
    prefillResponseData,
    isRedirectDisabled,
    onFileUpload,
    responseCount,
    isPreview,
  ]);
  return <div id={containerId} className="h-full w-full" />;
};

export const WorkflowModal = ({
  workflow,
  webAppUrl,
  brandColor,
  isBrandingEnabled,
  activeQuestionId,
  placement = "bottomRight",
  clickOutside = false,
  darkOverlay = false,
  highlightBorderColor = null,
  onDisplay = () => {},
  onResponse = () => {},
  onActiveQuestionChange = () => {},
  onClose = () => {},
  autoFocus,
  isRedirectDisabled,
  onFileUpload,
  responseCount,
  isPreview,
}: WorkflowModalProps) => {
  useEffect(() => {
    renderWorkflowModal({
      workflow,
      webAppUrl,
      brandColor,
      isBrandingEnabled,
      placement,
      clickOutside,
      darkOverlay,
      highlightBorderColor,
      onDisplay,
      onResponse,
      onClose,
      activeQuestionId,
      onActiveQuestionChange,
      autoFocus,
      isRedirectDisabled,
      onFileUpload,
      responseCount,
      isPreview,
    });
  }, [
    activeQuestionId,
    brandColor,
    clickOutside,
    darkOverlay,
    isBrandingEnabled,
    highlightBorderColor,
    onActiveQuestionChange,
    onClose,
    onDisplay,
    onResponse,
    placement,
    workflow,
    webAppUrl,
    autoFocus,
    isRedirectDisabled,
    onFileUpload,
    responseCount,
    isPreview,
  ]);
  return <div id="typeflowai-workflow"></div>;
};
