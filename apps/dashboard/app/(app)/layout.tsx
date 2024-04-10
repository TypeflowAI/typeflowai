import TypeflowAIClient from "@/app/(app)/components/TypeflowAIClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { authOptions } from "@typeflowai/lib/authOptions";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { NoMobileOverlay } from "@typeflowai/ui/NoMobileOverlay";
import { PHProvider, PostHogPageview } from "@typeflowai/ui/PostHogClient";

import PosthogIdentify from "./components/PosthogIdentify";

export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user?.id as string;

  if (IS_TYPEFLOWAI_CLOUD) {
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

    if (
      session &&
      session.user.onboardingCompleted &&
      team.billing.subscriptionType === null &&
      team.billing.subscriptionStatus === "inactive"
    ) {
      return redirect(`/paywall`);
    }
  }

  return (
    <>
      <NoMobileOverlay />
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <>
          {session ? (
            <>
              <PosthogIdentify session={session} />
              <TypeflowAIClient session={session} />
            </>
          ) : null}
          {children}
        </>
      </PHProvider>
    </>
  );
}
