"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { canUserAccessAttributeClass } from "@typeflowai/lib/attributeClass/auth";
import { getWorkflowsByAttributeClassId } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const GetActiveInactiveWorkflowsAction = async (
  attributeClassId: string
): Promise<{ activeWorkflows: string[]; inactiveWorkflows: string[] }> => {
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

  const isAuthorized = await canUserAccessAttributeClass(session.user.id, attributeClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflows = await getWorkflowsByAttributeClassId(attributeClassId);
  const response = {
    activeWorkflows: workflows.filter((s) => s.status === "inProgress").map((workflow) => workflow.name),
    inactiveWorkflows: workflows.filter((s) => s.status !== "inProgress").map((workflow) => workflow.name),
  };
  return response;
};
