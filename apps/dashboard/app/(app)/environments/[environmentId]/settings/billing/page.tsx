import { BASIC_AI_RESPONSES, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { getMonthlyTeamResponseCount, getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

import SettingsTitle from "../components/SettingsTitle";
import PricingTable from "./components/PricingTable";

export default async function BillingPage({ params }) {
  let team = await getTeamByEnvironmentId(params.environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const aiLimits = {
    basic: BASIC_AI_RESPONSES,
    pro: PRO_AI_RESPONSES,
  };
  const aiResponseCount = team.billing.features.ai.responses;
  const responseCount = await getMonthlyTeamResponseCount(team.id);

  return (
    <>
      <div>
        <SettingsTitle title="Billing & Plan" />
        <PricingTable
          team={team}
          environmentId={params.environmentId}
          aiResponseCount={aiResponseCount}
          responseCount={responseCount}
          aiLimits={aiLimits}
        />
      </div>
    </>
  );
}
