import { WorkflowInline } from "@/components/general/WorkflowInline";
import { WorkflowModal } from "@/components/general/WorkflowModal";
import { addCustomThemeToDom, addStylesToDom } from "@/lib/styles";
import { WorkflowInlineProps, WorkflowModalProps } from "@/types/props";
import { h, render } from "preact";

export const renderWorkflowInline = (props: WorkflowInlineProps & { brandColor: string }) => {
  addStylesToDom();
  addCustomThemeToDom({ brandColor: props.brandColor });

  const { containerId, ...workflowProps } = props;
  const element = document.getElementById(containerId);
  if (!element) {
    throw new Error(`renderWorkflow: Element with id ${containerId} not found.`);
  }
  render(h(WorkflowInline, workflowProps), element);
};

export const renderWorkflowModal = (props: WorkflowModalProps & { brandColor: string }) => {
  addStylesToDom();
  addCustomThemeToDom({ brandColor: props.brandColor });

  // add container element to DOM
  const element = document.createElement("div");
  element.id = "typeflowai-modal-container";
  document.body.appendChild(element);
  render(h(WorkflowModal, props), element);
};
