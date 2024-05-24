import { TWorkflowFilterCriteria, TWorkflowFilters } from "@typeflowai/types/workflows";

export const getFormattedFilters = (
  workflowFilters: TWorkflowFilters,
  userId: string
): TWorkflowFilterCriteria => {
  const filters: TWorkflowFilterCriteria = {};

  if (workflowFilters.name) {
    filters.name = workflowFilters.name;
  }

  if (workflowFilters.status && workflowFilters.status.length) {
    filters.status = workflowFilters.status;
  }

  if (workflowFilters.type && workflowFilters.type.length) {
    filters.type = workflowFilters.type;
  }

  if (workflowFilters.createdBy && workflowFilters.createdBy.length) {
    filters.createdBy = {
      userId: userId,
      value: workflowFilters.createdBy,
    };
  }

  if (workflowFilters.sortBy) {
    filters.sortBy = workflowFilters.sortBy;
  }

  return filters;
};
