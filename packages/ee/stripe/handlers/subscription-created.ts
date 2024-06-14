import Stripe from "stripe";
import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { BASIC_AI_RESPONSES, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";
import { ProductSubscriptionTypes, StripeProductNames } from "../lib/constants";

export const handleSubscriptionCreated = async (event: Stripe.Event) => {
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
      stripeCustomerId: stripeSubscriptionObject.customer as string,
      subscriptionType: subscriptionType,
      subscriptionStatus: "active",
      features: updatedFeatures,
    },
  });
};
