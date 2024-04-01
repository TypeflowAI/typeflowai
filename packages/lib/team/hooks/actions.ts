"use server";

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { AuthenticationError, ResourceNotFoundError } from "@typeflowai/types/errors";

import { getTeam, getTeamBillingInfo } from "../service";

export const getTeamBillingInfoAction = async (teamId: string) => {
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

  const team = await getTeam(teamId);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!team) {
    throw new ResourceNotFoundError("Team", teamId);
  }

  return await getTeamBillingInfo(teamId);
};
