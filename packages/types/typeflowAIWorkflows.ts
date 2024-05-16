import { TProductStyling } from "./product";
import { TResponseData, TResponseUpdate } from "./responses";
import { TUploadFileConfig } from "./storage";
import { TWorkflow, TWorkflowStyling } from "./workflows";

export interface WorkflowBaseProps {
  workflow: TWorkflow;
  webAppUrl: string;
  styling: TWorkflowStyling | TProductStyling;
  isBrandingEnabled: boolean;
  getSetIsError?: (getSetError: (value: boolean) => void) => void;
  getSetIsResponseSendingFinished?: (getSetIsResponseSendingFinished: (value: boolean) => void) => void;
  getSetQuestionId?: (getSetQuestionId: (value: string) => void) => void;
  onDisplay?: () => void;
  onResponse?: (response: TResponseUpdate) => void;
  onFinished?: () => void;
  onClose?: () => void;
  onRetry?: () => void;
  autoFocus?: boolean;
  isRedirectDisabled?: boolean;
  prefillResponseData?: TResponseData;
  languageCode: string;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  responseCount?: number;
  isPreview?: boolean;
  isCardBorderVisible?: boolean;
  startAtQuestionId?: string;
}

export interface WorkflowInlineProps extends WorkflowBaseProps {
  containerId: string;
}

export interface WorkflowModalProps extends WorkflowBaseProps {
  clickOutside: boolean;
  darkOverlay: boolean;
  placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "center";
}
