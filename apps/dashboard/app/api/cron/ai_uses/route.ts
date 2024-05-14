import { responses } from "@/app/lib/api/response";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@typeflowai/database";
import { ProductSubscriptionTypes } from "@typeflowai/ee/stripe/lib/constants";
import { BASIC_AI_RESPONSES, CRON_SECRET, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { updateTeam } from "@typeflowai/lib/team/service";

export async function POST(): Promise<NextResponse> {
  if (headers().get("x-api-key") !== CRON_SECRET) {
    return responses.notAuthenticatedResponse();
  }

  const today = new Date().toISOString().slice(0, 10);

  const teamsToRenew = await prisma.team.findMany({
    where: {
      billing: {
        path: ["nextRenewalDate"],
        equals: today,
      },
    },
  });

  if (!teamsToRenew.length) {
    return responses.successResponse({ message: "No teams to renew AI uses" });
  }

  for (const team of teamsToRenew) {
    const billingData = team.billing;
    let updatedFeatures = team.billing.features;

    switch (team.billing.subscriptionType) {
      case ProductSubscriptionTypes.basic:
        updatedFeatures.ai.responses = BASIC_AI_RESPONSES;
        updatedFeatures.ai.unlimited = false;
        break;
      case ProductSubscriptionTypes.pro:
        updatedFeatures.ai.responses = PRO_AI_RESPONSES;
        updatedFeatures.ai.unlimited = false;
        break;
      case ProductSubscriptionTypes.enterprise:
        updatedFeatures.ai.responses = null;
        updatedFeatures.ai.unlimited = true;
        break;
    }

    const currentRenewalDate = new Date(today);
    currentRenewalDate.setMonth(currentRenewalDate.getMonth() + 1);
    const nextRenewalDateString = currentRenewalDate.toISOString().slice(0, 10);

    await updateTeam(team.id, {
      billing: {
        ...billingData,
        features: updatedFeatures,
        nextRenewalDate: nextRenewalDateString,
      },
    });
  }

  return responses.successResponse({}, true);
}
