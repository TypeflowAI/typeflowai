import { TeamSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(team)/components/TeamSettingsNavbar";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { BASIC_AI_RESPONSES, IS_TYPEFLOWAI_CLOUD, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getMonthlyTeamResponseCount, getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

import PricingTable from "./components/PricingTable";

export default async function BillingPage({ params }) {
  let team = await getTeamByEnvironmentId(params.environmentId);
  if (!team) {
    throw new Error("Team not found");
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const aiLimits = {
    basic: BASIC_AI_RESPONSES,
    pro: PRO_AI_RESPONSES,
  };
  const aiResponseCount = team.billing.features.ai.responses;
  const responseCount = await getMonthlyTeamResponseCount(team.id);

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Team Settings">
        <TeamSettingsNavbar
          environmentId={params.environmentId}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          membershipRole={currentUserMembership?.role}
          activeId="billing"
        />
      </PageHeader>
      <PricingTable
        team={team}
        environmentId={params.environmentId}
        aiResponseCount={aiResponseCount}
        responseCount={responseCount}
        aiLimits={aiLimits}
      />
    </PageContentWrapper>
  );
}
