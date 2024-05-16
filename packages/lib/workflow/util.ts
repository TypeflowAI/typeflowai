import "server-only";

import { Prisma } from "@prisma/client";

import { TLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TSegment } from "@typeflowai/types/segment";
import { TWorkflow, TWorkflowFilterCriteria } from "@typeflowai/types/workflows";

export const transformPrismaWorkflow = (workflowPrisma: any): TWorkflow => {
  let segment: TSegment | null = null;

  if (workflowPrisma.segment) {
    segment = {
      ...workflowPrisma.segment,
      workflows: workflowPrisma.segment.workflows.map((workflow) => workflow.id),
    };
  }

  const transformedWorkflow: TWorkflow = {
    ...workflowPrisma,
    triggers: workflowPrisma.triggers.map((trigger) => trigger.actionClass.name),
    segment,
  };

  return transformedWorkflow;
};

export const buildWhereClause = (filterCriteria?: TWorkflowFilterCriteria) => {
  const whereClause: Prisma.WorkflowWhereInput["AND"] = [];

  // for name
  if (filterCriteria?.name) {
    whereClause.push({ name: { contains: filterCriteria.name, mode: "insensitive" } });
  }

  // for status
  if (filterCriteria?.status && filterCriteria?.status?.length) {
    whereClause.push({ status: { in: filterCriteria.status } });
  }

  // for type
  if (filterCriteria?.type && filterCriteria?.type?.length) {
    whereClause.push({ type: { in: filterCriteria.type } });
  }

  // for createdBy
  if (filterCriteria?.createdBy?.value && filterCriteria?.createdBy?.value?.length) {
    if (filterCriteria.createdBy.value.length === 1) {
      if (filterCriteria.createdBy.value[0] === "you") {
        whereClause.push({ createdBy: filterCriteria.createdBy.userId });
      }
      if (filterCriteria.createdBy.value[0] === "others") {
        whereClause.push({ createdBy: { not: filterCriteria.createdBy.userId } });
      }
    }
  }

  return { AND: whereClause };
};

export const buildOrderByClause = (
  sortBy?: TWorkflowFilterCriteria["sortBy"]
): Prisma.WorkflowOrderByWithRelationInput[] | undefined => {
  if (!sortBy) {
    return undefined;
  }

  if (sortBy === "name") {
    return [{ name: "asc" }];
  }

  return [{ [sortBy]: "desc" }];
};

export const anyWorkflowHasFilters = (workflows: TWorkflow[] | TLegacyWorkflow[]): boolean => {
  return workflows.some((workflow) => {
    if ("segment" in workflow && workflow.segment) {
      return workflow.segment.filters && workflow.segment.filters.length > 0;
    }
    return false;
  });
};
