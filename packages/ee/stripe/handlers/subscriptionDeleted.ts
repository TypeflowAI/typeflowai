import Stripe from "stripe";

import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const handleSubscriptionDeleted = async (event: Stripe.Event) => {
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

  let customerExists =
    !team.billing.stripeCustomerId || !(await stripe.customers.retrieve(team.billing.stripeCustomerId));

  const stripeCustomerId = customerExists ? team.billing.stripeCustomerId : null;
  const subscriptionType = customerExists ? team.billing.subscriptionType : null;

  await updateTeam(teamId, {
    billing: {
      ...team.billing,
      stripeCustomerId: stripeCustomerId,
      subscriptionType: subscriptionType,
      subscriptionStatus: "inactive",
      features: updatedFeatures,
      nextRenewalDate: null,
    },
  });
};
