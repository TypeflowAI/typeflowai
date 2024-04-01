"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { createWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TWorkflowInput } from "@typeflowai/types/workflows";

export async function createWorkflowAction(environmentId: string, workflowBody: TWorkflowInput) {
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

  return await createWorkflow(environmentId, workflowBody);
}
