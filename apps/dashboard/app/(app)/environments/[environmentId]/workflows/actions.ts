"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { createWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TWorkflow, TWorkflowInput } from "@typeflowai/types/workflows";

export async function createWorkflowAction(environmentId: string, workflowBody: TWorkflowInput) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createWorkflow(environmentId, workflowBody);
}

export async function updateWorkflowAction(workflow: TWorkflow, iconUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const icon = iconUrl;

  return await updateWorkflow({ ...workflow, icon });
}
