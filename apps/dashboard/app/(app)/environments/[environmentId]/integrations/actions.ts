"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

  const isAuthorized = await canUserAccessIntegration(session.user.id, integrationId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteIntegration(integrationId);
}
