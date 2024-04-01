// import Navigation from "@/app/(app)/environments/[environmentId]/components/Navigation";
import NavigationDesktop from "@/app/(app)/environments/[environmentId]/components/NavigationDesktop";
import NavigationMobile from "@/app/(app)/environments/[environmentId]/components/NavigationMobile";
import { Session } from "@supabase/supabase-js";

import { IS_TYPEFLOWAI_CLOUD, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment, getEnvironments } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProducts } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId, getTeamsByUserId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

interface EnvironmentsNavbarProps {
  environmentId: string;
  session: Session;
  isTypeflowAICloud: boolean;
  isMobile: boolean;
}

export default async function EnvironmentsNavbar({
  environmentId,
  session,
  isMobile,
}: EnvironmentsNavbarProps) {
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

  return isMobile ? (
    <NavigationMobile
      environment={environment}
      team={team}
      teams={teams}
      products={products}
      environments={environments}
      isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
      webAppUrl={WEBAPP_URL}
      membershipRole={currentUserMembership?.role}
    />
  ) : (
    <NavigationDesktop
      environment={environment}
      team={team}
      teams={teams}
      products={products}
      environments={environments}
      isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
      webAppUrl={WEBAPP_URL}
      membershipRole={currentUserMembership?.role}
    />
  );
  // return (
  //   <Navigation
  //     environment={environment}
  //     team={team}
  //     teams={teams}
  //     products={products}
  //     environments={environments}
  //     isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
  //     webAppUrl={WEBAPP_URL}
  //     membershipRole={currentUserMembership?.role}
  //   />
  // );
}
