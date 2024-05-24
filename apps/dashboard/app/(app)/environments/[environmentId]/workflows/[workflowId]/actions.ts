"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import {
  getResponseDownloadUrl,
  getResponseMeta,
  getResponsePersonAttributes,
} from "@typeflowai/lib/response/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { canUserAccessWorkflow, verifyUserRoleAccess } from "@typeflowai/lib/workflow/auth";
import { updateWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TResponseFilterCriteria } from "@typeflowai/types/responses";
import { TWorkflow } from "@typeflowai/types/workflows";

export async function getResponsesDownloadUrlAction(
  workflowId: string,
  format: "csv" | "xlsx",
  filterCritera: TResponseFilterCriteria
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return getResponseDownloadUrl(workflowId, format, filterCritera);
}

export async function getWorkflowFilterDataAction(workflowId: string, environmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const [tags, attributes, meta] = await Promise.all([
    getTagsByEnvironmentId(environmentId),
    getResponsePersonAttributes(workflowId),
    getResponseMeta(workflowId),
  ]);

  return { environmentTags: tags, attributes, meta };
}

export async function updateWorkflowAction(workflow: TWorkflow): Promise<TWorkflow> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflow.id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(workflow.environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateWorkflow(workflow);
}
