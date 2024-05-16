import { Onboarding } from "@/app/(app)/onboarding/components/Onboarding";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { IS_TYPEFLOWAI_CLOUD, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    return redirect("/auth/login");
  }

  // Redirect to home if onboarding is completed
  if (session.user.onboardingCompleted) {
    return redirect("/");
  }

  const userId = session.user.id;
  const environment = await getFirstEnvironmentByUserId(userId);
  const user = await getUser(userId);
  const team = environment ? await getTeamByEnvironmentId(environment.id) : null;

  // Ensure all necessary data is available
  if (!environment || !user || !team) {
    throw new Error("Failed to get necessary user, environment, or team information");
  }

  return (
    <Onboarding
      isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
      session={session}
      environment={environment}
      user={user}
      team={team}
      webAppUrl={WEBAPP_URL}
    />
  );
}
