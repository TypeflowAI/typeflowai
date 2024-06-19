import Stripe from "stripe";
import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";
import { ProductSubscriptionTypes, StripeProductNames } from "../lib/constants";

export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
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

  if (stripeSubscriptionObject.cancel_at_period_end) {
    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        subscriptionStatus: "canceled",
      },
    });
    return { status: 200, message: "Subscription cancel scheduled for end of period" };
  }

  if (stripeSubscriptionObject.schedule) {
    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        subscriptionStatus: "scheduled",
      },
    });
    return { status: 200, message: "Subscription scheduled for end of period" };
  }

  const nextRenewalDate = new Date(stripeSubscriptionObject.current_period_end * 1000)
    .toISOString()
    .slice(0, 10);

  let updatedFeatures = team.billing.features;
  let subscriptionType = team.billing.subscriptionType;

  for (const item of stripeSubscriptionObject.items.data) {
    const product = await stripe.products.retrieve(item.price.product as string);

    switch (product.name) {
      case StripeProductNames.basic:
        updatedFeatures = {
          ai: {
            ...updatedFeatures.ai,
            status: "active",
            unlimited: false,
          },
        };
        subscriptionType = ProductSubscriptionTypes.basic;
        break;

      case StripeProductNames.pro:
        updatedFeatures = {
          ai: {
            ...updatedFeatures.ai,
            status: "active",
            unlimited: false,
          },
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
      nextRenewalDate: nextRenewalDate,
    },
  });
};
