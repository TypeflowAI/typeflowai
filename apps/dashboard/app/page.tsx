import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ONBOARDING_DISABLED } from "@typeflowai/lib/constants";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import ClientLogout from "@typeflowai/ui/ClientLogout";

export default async function Home() {
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

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user?.id as string;

  const { data: userDetails, error } = await supabaseServerClient
    .from("User")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting user details:", error);
    return <ClientLogout />;
  }

  if (!ONBOARDING_DISABLED && userDetails && !userDetails.onboardingCompleted) {
    return redirect(`/onboarding`);
  }

  let environment;
  try {
    environment = await getFirstEnvironmentByUserId(userId);
    if (!environment) {
      throw new Error("No environment found");
    }
  } catch (error) {
    console.error("error getting environment", error);
  }

  let team;
  try {
    team = await getTeamByEnvironmentId(environment.id);
    if (!team) {
      throw new Error("Team not found");
    }
  } catch (error) {
    console.error("error getting team", error);
  }

  if (team.billing.subscriptionType === null && team.billing.subscriptionStatus === "inactive") {
    return redirect(`/paywall`);
  }

  if (!environment) {
    console.error("Failed to get first environment of user; signing out");
    return <ClientLogout />;
  }

  return redirect(`/environments/${environment.id}`);
}
