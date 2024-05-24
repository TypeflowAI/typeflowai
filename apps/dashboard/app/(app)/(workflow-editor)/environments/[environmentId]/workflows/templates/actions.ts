"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { createWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TWorkflowInput } from "@typeflowai/types/workflows";

export async function createWorkflowAction(environmentId: string, workflowBody: TWorkflowInput) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createWorkflow(environmentId, workflowBody);
}
