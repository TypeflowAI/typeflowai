"use server";

import {
  getResponseCountByWorkflowId,
  getResponseFilteringValues,
  getResponses,
  getWorkflowSummary,
} from "@typeflowai/lib/response/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getWorkflowIdByResultShareKey } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TResponse, TResponseFilterCriteria } from "@typeflowai/types/responses";
import { TWorkflowSummary } from "@typeflowai/types/workflows";

export async function getResponsesByWorkflowSharingKeyAction(
  sharingKey: string,
  page: number,
  batchSize?: number,
  filterCriteria?: TResponseFilterCriteria
): Promise<TResponse[]> {
  const workflowId = await getWorkflowIdByResultShareKey(sharingKey);
  if (!workflowId) throw new AuthorizationError("Not authorized");

  batchSize = batchSize ?? 10;
  const responses = await getResponses(workflowId, page, batchSize, filterCriteria);
  return responses;
}

export const getSummaryByWorkflowSharingKeyAction = async (
  sharingKey: string,
  filterCriteria?: TResponseFilterCriteria
): Promise<TWorkflowSummary> => {
  const workflowId = await getWorkflowIdByResultShareKey(sharingKey);
  if (!workflowId) throw new AuthorizationError("Not authorized");

  return await getWorkflowSummary(workflowId, filterCriteria);
};

export const getResponseCountByWorkflowSharingKeyAction = async (
  sharingKey: string,
  filterCriteria?: TResponseFilterCriteria
): Promise<number> => {
  const workflowId = await getWorkflowIdByResultShareKey(sharingKey);
  if (!workflowId) throw new AuthorizationError("Not authorized");

  return await getResponseCountByWorkflowId(workflowId, filterCriteria);
};

export const getWorkflowFilterDataByWorkflowSharingKeyAction = async (
  sharingKey: string,
  environmentId: string
) => {
  const workflowId = await getWorkflowIdByResultShareKey(sharingKey);
  if (!workflowId) throw new AuthorizationError("Not authorized");

  const [tags, { personAttributes: attributes, meta, hiddenFields }] = await Promise.all([
    getTagsByEnvironmentId(environmentId),
    getResponseFilteringValues(workflowId),
  ]);

  return { environmentTags: tags, attributes, meta, hiddenFields };
};
