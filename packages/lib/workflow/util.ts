import "server-only";

import { TWorkflowDates } from "@typeflowai/types/workflows";

export const formatWorkflowDateFields = (workflow: TWorkflowDates): TWorkflowDates => {
  if (typeof workflow.createdAt === "string") {
    workflow.createdAt = new Date(workflow.createdAt);
  }
  if (typeof workflow.updatedAt === "string") {
    workflow.updatedAt = new Date(workflow.updatedAt);
  }
  if (typeof workflow.closeOnDate === "string") {
    workflow.closeOnDate = new Date(workflow.closeOnDate);
  }

  return workflow;
};
