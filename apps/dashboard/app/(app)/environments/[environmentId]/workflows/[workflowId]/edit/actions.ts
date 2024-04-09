"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessWorkflow, verifyUserRoleAccess } from "@typeflowai/lib/workflow/auth";
import { deleteWorkflow, getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { formatWorkflowDateFields } from "@typeflowai/lib/workflow/util";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TWorkflow } from "@typeflowai/types/workflows";

export async function updateWorkflowAction(workflow: TWorkflow): Promise<TWorkflow> {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflow.id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(workflow.environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  const _workflow = {
    ...workflow,
    ...formatWorkflowDateFields(workflow),
  };

  return await updateWorkflow(_workflow);
}

export const deleteWorkflowAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);
  const { hasDeleteAccess } = await verifyUserRoleAccess(workflow!.environmentId, session.user.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  await deleteWorkflow(workflowId);
};
