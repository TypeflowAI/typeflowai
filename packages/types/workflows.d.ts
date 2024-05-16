import { WorkflowInlineProps, WorkflowModalProps } from "./typeflowAIWorkflows";

declare global {
  interface Window {
    typeflowAIWorkflows: {
      renderWorkflowInline: (props: WorkflowInlineProps) => void;
      renderWorkflowModal: (props: WorkflowModalProps) => void;
    };
  }
}
