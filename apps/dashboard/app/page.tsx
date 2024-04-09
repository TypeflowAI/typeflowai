import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { ONBOARDING_DISABLED } from "@typeflowai/lib/constants";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import ClientLogout from "@typeflowai/ui/ClientLogout";

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!ONBOARDING_DISABLED && session?.user && !session?.user?.onboardingCompleted) {
    return redirect(`/onboarding`);
  }

  let environment;
  try {
    environment = await getFirstEnvironmentByUserId(session?.user.id);
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
