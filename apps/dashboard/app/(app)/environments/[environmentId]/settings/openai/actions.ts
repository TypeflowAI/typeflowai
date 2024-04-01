"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { canUserAccessTeam } from "@typeflowai/lib/team/auth";
import { updateTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TTeam } from "@typeflowai/types/teams";

export async function updateOpenAIApiKeyAction(team: TTeam, key: string) {
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

  const isAuthorized = await canUserAccessTeam(session.user.id, team.id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const updatedBillingConfig = {
    ...team.billing,
    features: {
      ...team.billing.features,
      ai: {
        ...team.billing.features.ai,
        openaiApiKey: key,
      },
    },
  };

  return await updateTeam(team.id, { billing: updatedBillingConfig });
}
