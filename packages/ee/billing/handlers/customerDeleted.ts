import Stripe from "stripe";

import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

export const handleCustomerDeleted = async (event: Stripe.Event) => {
  const stripeSubscriptionObject = event.data.object as Stripe.Subscription;
  const teamId = stripeSubscriptionObject.metadata.teamId;
  if (!teamId) {
    console.error("No teamId found in subscription");
    return { status: 400, message: "skipping, no teamId found" };
  }

  const team = await getTeam(teamId);
  if (!team) throw new Error("Team not found.");

  let updatedFeatures = team.billing.features;
  updatedFeatures = { ai: { ...updatedFeatures.ai, status: "inactive", responses: 0, unlimited: false } };

  await updateTeam(teamId, {
    billing: {
      ...team.billing,
      stripeCustomerId: null,
      subscriptionType: null,
      subscriptionStatus: "inactive",
      features: updatedFeatures,
      nextRenewalDate: null,
    },
  });
};
