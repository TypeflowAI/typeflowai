import Stripe from "stripe";

import { BASIC_AI_RESPONSES, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

import { ProductSubscriptionTypes, StripeProductNames } from "../lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
});

export const handleSubscriptionCreated = async (event: Stripe.Event) => {
  const stripeSubscriptionObject = event.data.object as Stripe.Subscription;
  const teamId = stripeSubscriptionObject.metadata.teamId;
  if (!teamId) {
    console.error("No teamId found in subscription");
    return { status: 400, message: "skipping, no teamId found" };
  }

  const team = await getTeam(teamId);
  if (!team) throw new Error("Team not found.");
  let updatedFeatures = team.billing.features;
  let subscriptionType = team.billing.subscriptionType;

  for (const item of stripeSubscriptionObject.items.data) {
    const product = await stripe.products.retrieve(item.price.product as string);

    switch (product.name) {
      case StripeProductNames.basic:
        updatedFeatures = {
          ai: { ...updatedFeatures.ai, status: "active", responses: BASIC_AI_RESPONSES, unlimited: false },
        };
        subscriptionType = ProductSubscriptionTypes.basic;
        break;

      case StripeProductNames.pro:
        updatedFeatures = {
          ai: { ...updatedFeatures.ai, status: "active", responses: PRO_AI_RESPONSES, unlimited: false },
        };
        subscriptionType = ProductSubscriptionTypes.pro;
        break;

      case StripeProductNames.enterprise:
        updatedFeatures = {
          ai: { ...updatedFeatures.ai, status: "active", responses: null, unlimited: true },
        };
        subscriptionType = ProductSubscriptionTypes.enterprise;
        break;
    }
  }

  await updateTeam(teamId, {
    billing: {
      ...team.billing,
      subscriptionType: subscriptionType,
      subscriptionStatus: "active",
      features: updatedFeatures,
    },
  });
};
