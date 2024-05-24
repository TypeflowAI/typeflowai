"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessTeam } from "@typeflowai/lib/team/auth";
import { updateTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TTeam } from "@typeflowai/types/teams";

export async function updateOpenAIApiKeyAction(team: TTeam, key: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, team.id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const updatedBillingConfig = {
    ...team.billing,
    features: {
      ...team.billing.features,
      ai: {
        ...team.billing.features.ai,
        openaiApiKey: key,
      },
    },
  };

  return await updateTeam(team.id, { billing: updatedBillingConfig });
}
