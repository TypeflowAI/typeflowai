import TypeflowAIClient from "@/app/(app)/components/TypeflowAIClient";
import PosthogIdentify from "@/app/(app)/environments/[environmentId]/components/PosthogIdentify";
import { ResponseFilterProvider } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { DevEnvironmentBanner } from "@typeflowai/ui/DevEnvironmentBanner";
import ToasterClient from "@typeflowai/ui/ToasterClient";

export default async function EnvLayout({ children, params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return redirect(`/auth/login`);
  }
  const hasAccess = await hasUserEnvironmentAccess(session.user.id, params.environmentId);
  if (!hasAccess) {
    throw new AuthorizationError("Not authorized");
  }

  const team = await getTeamByEnvironmentId(params.environmentId);
  if (!team) {
    throw new Error("Team not found");
  }

  const environment = await getEnvironment(params.environmentId);

  if (!environment) {
    throw new Error("Environment not found");
  }

  return (
    <>
      <ResponseFilterProvider>
        <PosthogIdentify
          session={session}
          environmentId={params.environmentId}
          teamId={team.id}
          teamName={team.name}
        />
        <TypeflowAIClient session={session} />
        <ToasterClient />
        <div className="flex h-screen flex-col">
          <DevEnvironmentBanner environment={environment} />
          <div className="h-full overflow-y-auto bg-slate-50">{children}</div>
        </div>
      </ResponseFilterProvider>
    </>
  );
}
