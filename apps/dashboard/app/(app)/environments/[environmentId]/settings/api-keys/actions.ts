"use server";

import { getServerSession } from "next-auth";

import { canUserAccessApiKey } from "@typeflowai/lib/apiKey/auth";
import { createApiKey, deleteApiKey } from "@typeflowai/lib/apiKey/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { TApiKeyCreateInput } from "@typeflowai/types/apiKeys";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function deleteApiKeyAction(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessApiKey(session.user.id, id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteApiKey(id);
}
export async function createApiKeyAction(environmentId: string, apiKeyData: TApiKeyCreateInput) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createApiKey(environmentId, apiKeyData);
}
