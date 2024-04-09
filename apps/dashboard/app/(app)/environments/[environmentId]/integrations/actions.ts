"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessIntegration } from "@typeflowai/lib/integration/auth";
import { createOrUpdateIntegration, deleteIntegration } from "@typeflowai/lib/integration/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TIntegrationInput } from "@typeflowai/types/integration";

export async function createOrUpdateIntegrationAction(
  environmentId: string,
  integrationData: TIntegrationInput
) {
  return await createOrUpdateIntegration(environmentId, integrationData);
}

export async function deleteIntegrationAction(integrationId: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessIntegration(session.user.id, integrationId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteIntegration(integrationId);
}
