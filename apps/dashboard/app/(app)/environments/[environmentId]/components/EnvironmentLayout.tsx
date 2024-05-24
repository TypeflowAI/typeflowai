import { MainNavigation } from "@/app/(app)/environments/[environmentId]/components/MainNavigation";
import { TopControlBar } from "@/app/(app)/environments/[environmentId]/components/TopControlBar";
import type { Session } from "next-auth";

import { getIsEnterpriseSubscription } from "@typeflowai/ee/subscription/lib/service";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getEnvironment, getEnvironments } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProducts } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId, getTeamsByUserId } from "@typeflowai/lib/team/service";
import { DevEnvironmentBanner } from "@typeflowai/ui/DevEnvironmentBanner";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

interface EnvironmentLayoutProps {
  environmentId: string;
  session: Session;
  children?: React.ReactNode;
}

export const EnvironmentLayout = async ({ environmentId, session, children }: EnvironmentLayoutProps) => {
  const [environment, teams, team] = await Promise.all([
    getEnvironment(environmentId),
    getTeamsByUserId(session.user.id),
    getTeamByEnvironmentId(environmentId),
  ]);

  if (!team || !environment) {
    return <ErrorComponent />;
  }

  const [products, environments] = await Promise.all([
    getProducts(team.id),
    getEnvironments(environment.productId),
  ]);

  if (!products || !environments || !teams) {
    return <ErrorComponent />;
  }
  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);

  const isEnterprise = await getIsEnterpriseSubscription(team);

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden">
      <DevEnvironmentBanner environment={environment} />
      <div className="flex h-full">
        <MainNavigation
          environment={environment}
          team={team}
          teams={teams}
          products={products}
          session={session}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          isEnterprise={isEnterprise}
          membershipRole={currentUserMembership?.role}
        />
        <div id="mainContent" className="flex-1 overflow-y-auto bg-slate-50">
          <TopControlBar environment={environment} environments={environments} />
          <div className="mt-14">{children}</div>
        </div>
      </div>
    </div>
  );
};
