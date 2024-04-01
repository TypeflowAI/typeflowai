import Stripe from "stripe";

import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

import { ProductSubscriptionTypes, StripeProductNames } from "../lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
});

export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
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
        subscriptionStatus: "cancelled",
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
