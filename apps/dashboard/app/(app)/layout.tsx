import TypeflowAIClient from "@/app/(app)/components/TypeflowAIClient";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import ClientLogout from "@typeflowai/ui/ClientLogout";
import { NoMobileOverlay } from "@typeflowai/ui/NoMobileOverlay";
import { PHProvider, PostHogPageview } from "@typeflowai/ui/PostHogClient";

import PosthogIdentify from "./components/PosthogIdentify";

export default async function AppLayout({ children }) {
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
      userDetails &&
      userDetails.onboardingCompleted &&
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
              <PosthogIdentify session={session} userDetails={userDetails} />
              <TypeflowAIClient session={session} />
            </>
          ) : null}
          {children}
        </>
      </PHProvider>
    </>
  );
}
