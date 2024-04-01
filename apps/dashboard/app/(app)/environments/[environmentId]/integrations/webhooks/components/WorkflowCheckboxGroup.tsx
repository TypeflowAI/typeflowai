import React from "react";

import { TWorkflow } from "@typeflowai/types/workflows";
import { Checkbox } from "@typeflowai/ui/Checkbox";

interface WorkflowCheckboxGroupProps {
  workflows: TWorkflow[];
  selectedWorkflows: string[];
  selectedAllWorkflows: boolean;
  onSelectAllWorkflows: () => void;
  onSelectedWorkflowChange: (workflowId: string) => void;
  allowChanges: boolean;
}

export const WorkflowCheckboxGroup: React.FC<WorkflowCheckboxGroupProps> = ({
  workflows,
  selectedWorkflows,
  selectedAllWorkflows,
  onSelectAllWorkflows,
  onSelectedWorkflowChange,
  allowChanges,
}) => {
  return (
    <div className="mt-1 rounded-lg border border-slate-200">
      <div className="grid content-center rounded-lg bg-slate-50 p-3 text-left text-sm text-slate-900">
        <div className="my-1 flex items-center space-x-2">
          <Checkbox
            type="button"
            id="allWorkflows"
            className="bg-white"
            value=""
            checked={selectedAllWorkflows}
            onCheckedChange={onSelectAllWorkflows}
            disabled={!allowChanges}
          />
          <label
            htmlFor="allWorkflows"
            className={`flex cursor-pointer items-center ${selectedAllWorkflows ? "font-semibold" : ""} ${
              !allowChanges ? "cursor-not-allowed opacity-50" : ""
            }`}>
            All current and new workflows
          </label>
        </div>
        {workflows.map((workflow) => (
          <div key={workflow.id} className="my-1 flex items-center space-x-2">
            <Checkbox
              type="button"
              id={workflow.id}
              value={workflow.id}
              className="bg-white"
              checked={selectedWorkflows.includes(workflow.id) && !selectedAllWorkflows}
              disabled={selectedAllWorkflows || !allowChanges}
              onCheckedChange={() => {
                if (allowChanges) {
                  onSelectedWorkflowChange(workflow.id);
                }
              }}
            />
            <label
              htmlFor={workflow.id}
              className={`flex cursor-pointer items-center ${
                selectedAllWorkflows ? "cursor-not-allowed opacity-50" : ""
              } ${!allowChanges ? "cursor-not-allowed opacity-50" : ""}`}>
              {workflow.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowCheckboxGroup;
