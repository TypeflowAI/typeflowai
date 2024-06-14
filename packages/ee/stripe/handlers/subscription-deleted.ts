import Stripe from "stripe";
import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

export const handleSubscriptionDeleted = async (event: Stripe.Event) => {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not enabled; STRIPE_SECRET_KEY is not set.");

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

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
