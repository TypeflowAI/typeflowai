"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { canUserAccessApiKey } from "@typeflowai/lib/apiKey/auth";
import { createApiKey, deleteApiKey } from "@typeflowai/lib/apiKey/service";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { TApiKeyCreateInput } from "@typeflowai/types/apiKeys";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function deleteApiKeyAction(id: string) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessApiKey(session.user.id, id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteApiKey(id);
}
export async function createApiKeyAction(environmentId: string, apiKeyData: TApiKeyCreateInput) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createApiKey(environmentId, apiKeyData);
}
