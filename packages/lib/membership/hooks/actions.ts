"use server";

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { AuthenticationError } from "@typeflowai/types/errors";

import { getTeamByEnvironmentId } from "../../team/service";
import { getUser } from "../../user/service";
import { getMembershipByUserIdTeamId } from "../service";

export const getMembershipByUserIdTeamIdAction = async (environmentId: string) => {
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

  const team = await getTeamByEnvironmentId(environmentId);

  const user = session && session.user ? await getUser(session.user.id) : null;

  if (!session || !user) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(user.id, team.id);

  if (!currentUserMembership) {
    throw new Error("Membership not found");
  }

  return currentUserMembership?.role;
};
