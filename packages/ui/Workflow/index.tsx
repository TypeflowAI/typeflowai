import { useCallback, useEffect, useMemo } from "react";

import { WorkflowInlineProps, WorkflowModalProps } from "@typeflowai/types/typeflowAIWorkflows";

import { loadWorkflowScript } from "./lib/loadScript";

const createContainerId = () => `typeflowai-workflow-container`;
declare global {
  interface Window {
    typeflowAIWorkflows: {
      renderWorkflowInline: (props: WorkflowInlineProps) => void;
      renderWorkflowModal: (props: WorkflowModalProps) => void;
    };
  }
}

export const WorkflowInline = (props: Omit<WorkflowInlineProps, "containerId">) => {
  const containerId = useMemo(() => createContainerId(), []);
  const renderInline = useCallback(
    () => window.typeflowAIWorkflows.renderWorkflowInline({ ...props, containerId }),
    [containerId, props]
  );

  useEffect(() => {
    const loadScript = async () => {
      if (!window.typeflowAIWorkflows) {
        try {
          await loadWorkflowScript();
          renderInline();
        } catch (error) {
          console.error("Failed to load the workflows package: ", error);
        }
      } else {
        renderInline();
      }
    };

    loadScript();
  }, [containerId, props, renderInline]);

  return <div id={containerId} className="w-full" />;
};
