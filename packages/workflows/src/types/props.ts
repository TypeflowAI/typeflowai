import { TResponseData, TResponseUpdate } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow } from "@typeflowai/types/workflows";

export interface WorkflowBaseProps {
  workflow: TWorkflow;
  webAppUrl: string;
  isBrandingEnabled: boolean;
  activeQuestionId?: string;
  onDisplay?: () => void;
  onResponse?: (response: TResponseUpdate) => void;
  onFinished?: () => void;
  onClose?: () => void;
  onActiveQuestionChange?: (questionId: string) => void;
  autoFocus?: boolean;
  isRedirectDisabled?: boolean;
  prefillResponseData?: TResponseData;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  responseCount?: number;
  isPreview?: boolean;
}

export interface WorkflowInlineProps extends WorkflowBaseProps {
  containerId: string;
}

export interface WorkflowModalProps extends WorkflowBaseProps {
  clickOutside: boolean;
  darkOverlay: boolean;
  highlightBorderColor: string | null;
  placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "center";
}
