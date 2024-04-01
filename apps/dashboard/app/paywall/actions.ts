"use server";

import { Team } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { updateTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function startFreeTrialAction(team: Team): Promise<Team> {
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

  const updatedTeam = await updateTeam(team.id, {
    billing: {
      ...team.billing,
      subscriptionType: "free",
      features: {
        ...team.billing.features,
        ai: {
          ...team.billing.features.ai,
          responses: 10,
        },
      },
    },
  });

  return updatedTeam;
}
