"use server";

import { getServerSession } from "next-auth";

import { canUserAccessAttributeClass } from "@typeflowai/lib/attributeClass/auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getWorkflowsByAttributeClassId } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const GetActiveInactiveWorkflowsAction = async (
  attributeClassId: string
): Promise<{ activeWorkflows: string[]; inactiveWorkflows: string[] }> => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessAttributeClass(session.user.id, attributeClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflows = await getWorkflowsByAttributeClassId(attributeClassId);
  const response = {
    activeWorkflows: workflows.filter((s) => s.status === "inProgress").map((workflow) => workflow.name),
    inactiveWorkflows: workflows.filter((s) => s.status !== "inProgress").map((workflow) => workflow.name),
  };
  return response;
};
