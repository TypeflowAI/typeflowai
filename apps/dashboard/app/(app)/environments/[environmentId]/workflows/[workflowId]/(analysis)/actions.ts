"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getResponses } from "@typeflowai/lib/response/service";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TResponse } from "@typeflowai/types/responses";

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
