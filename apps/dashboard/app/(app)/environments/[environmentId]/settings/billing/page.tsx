import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { BASIC_AI_RESPONSES, IS_TYPEFLOWAI_CLOUD, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getMonthlyTeamResponseCount, getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import SettingsTitle from "../components/SettingsTitle";
import PricingTable from "./components/PricingTable";

export default async function ProfileSettingsPage({ params }) {
  if (!IS_TYPEFLOWAI_CLOUD) {
    notFound();
  }

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

  let team = await getTeamByEnvironmentId(params.environmentId);

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const aiLimits = {
    basic: BASIC_AI_RESPONSES,
    pro: PRO_AI_RESPONSES,
  };
  const aiResponseCount = team.billing.features.ai.responses;
  const responseCount = await getMonthlyTeamResponseCount(team.id);
  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isAdmin, isOwner } = getAccessFlags(currentUserMembership?.role);
  const isPricingDisabled = !isOwner && !isAdmin;

  return (
    <>
      <div>
        <SettingsTitle title="Billing & Plan" />
        {!isPricingDisabled ? (
          <PricingTable
            team={team}
            environmentId={params.environmentId}
            aiResponseCount={aiResponseCount}
            responseCount={responseCount}
            aiLimits={aiLimits}
          />
        ) : (
          <ErrorComponent />
        )}
      </div>
    </>
  );
}
