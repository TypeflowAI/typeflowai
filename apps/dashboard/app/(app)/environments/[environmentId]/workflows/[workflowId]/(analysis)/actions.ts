"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@typeflowai/lib/authOptions";
import {
  getResponseCountByWorkflowId,
  getResponses,
  getWorkflowSummary,
} from "@typeflowai/lib/response/service";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TResponse, TResponseFilterCriteria } from "@typeflowai/types/responses";
import { TWorkflowSummary } from "@typeflowai/types/workflows";

export default async function revalidateWorkflowIdPath(environmentId: string, workflowId: string) {
  revalidatePath(`/environments/${environmentId}/workflows/${workflowId}`);
}

export async function getMoreResponses(
  workflowId: string,
  page: number,
  batchSize?: number
): Promise<TResponse[]> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  batchSize = batchSize ?? 10;
  const responses = await getResponses(workflowId, page, batchSize);
  return responses;
}

export async function getResponsesAction(
  workflowId: string,
  page: number,
  batchSize?: number,
  filterCriteria?: TResponseFilterCriteria
): Promise<TResponse[]> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  batchSize = batchSize ?? 10;
  const responses = await getResponses(workflowId, page, batchSize, filterCriteria);
  return responses;
}

export const getWorkflowSummaryAction = async (
  workflowId: string,
  filterCriteria?: TResponseFilterCriteria
): Promise<TWorkflowSummary> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getWorkflowSummary(workflowId, filterCriteria);
};

export const getResponseCountAction = async (
  workflowId: string,
  filters?: TResponseFilterCriteria
): Promise<number> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getResponseCountByWorkflowId(workflowId, filters);
};
