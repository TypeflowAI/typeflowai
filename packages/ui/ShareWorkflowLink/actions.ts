"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { generateWorkflowSingleUseId } from "@typeflowai/lib/utils/singleUseWorkflows";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function generateSingleUseIdAction(workflowId: string, isEncrypted: boolean): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);

  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  return generateWorkflowSingleUseId(isEncrypted);
}
