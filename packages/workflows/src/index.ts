import { WorkflowInline } from "@/components/general/WorkflowInline";
import { WorkflowModal } from "@/components/general/WorkflowModal";
import { addCustomThemeToDom, addStylesToDom } from "@/lib/styles";
import { h, render } from "preact";
import { WorkflowInlineProps, WorkflowModalProps } from "@typeflowai/types/typeflowAIWorkflows";

// Force the page to be dynamic and allow streaming responses up to 180 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 180;

export const renderWorkflowInline = (props: WorkflowInlineProps) => {
  addStylesToDom();
  addCustomThemeToDom({ styling: props.styling });

  const element = document.getElementById(props.containerId);
  if (!element) {
    throw new Error(`renderWorkflow: Element with id ${props.containerId} not found.`);
  }
  render(h(WorkflowInline, props), element);
};

export const renderWorkflowModal = (props: WorkflowModalProps) => {
  addStylesToDom();
  addCustomThemeToDom({ styling: props.styling });

  // add container element to DOM
  const element = document.createElement("div");
  element.id = "typeflowai-modal-container";
  document.body.appendChild(element);
  render(h(WorkflowModal, props), element);
};

if (typeof window !== "undefined") {
  window.typeflowAIWorkflows = {
    renderWorkflowInline,
    renderWorkflowModal,
  };
}
