"use server";

import { Team } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { updateTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function startFreeTrialAction(team: Team): Promise<Team> {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const updatedTeam = await updateTeam(team.id, {
    billing: {
      ...team.billing,
      subscriptionType: "free",
      features: {
        ...team.billing.features,
        ai: {
          ...team.billing.features.ai,
          responses: 10,
        },
      },
    },
  });

  return updatedTeam;
}
