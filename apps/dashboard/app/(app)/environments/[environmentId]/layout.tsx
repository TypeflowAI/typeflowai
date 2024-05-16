import EnvironmentAlert from "@/app/(app)/environments/[environmentId]/components/EnvironmentAlert";
import EnvironmentsNavbar from "@/app/(app)/environments/[environmentId]/components/EnvironmentsNavbar";
import { ResponseFilterProvider } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import ToasterClient from "@typeflowai/ui/ToasterClient";

import TypeflowAIClient from "../../components/TypeflowAIClient";
import PosthogIdentify from "./components/PosthogIdentify";

export default async function EnvironmentLayout({ children, params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return redirect(`/auth/login`);
  }
  const hasAccess = await hasUserEnvironmentAccess(session.user.id, params.environmentId);
  if (!hasAccess) {
    throw new AuthorizationError("Not authorized");
  }

  const environment = await getEnvironment(params.environmentId);

  if (!environment) {
    return <ErrorComponent />;
  }

  const team = await getTeamByEnvironmentId(params.environmentId);
  if (!team) {
    throw new Error("Team not found");
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
        <div className="hidden h-screen lg:flex lg:flex-col">
          <EnvironmentsNavbar environmentId={params.environmentId} session={session} isMobile={false} />
          <div className="h-screen">
            <EnvironmentAlert className="ml-64" environment={environment} />
            <main className="h-full flex-1 overflow-y-auto bg-slate-50">
              {children}
              <main />
            </main>
          </div>
        </div>
        <div className="flex w-full lg:hidden">
          <EnvironmentsNavbar environmentId={params.environmentId} session={session} isMobile={true} />
        </div>
        <main className="h-full flex-1 overflow-y-auto bg-slate-50">
          {children}
          <main />
        </main>
      </ResponseFilterProvider>
    </>
  );
}
