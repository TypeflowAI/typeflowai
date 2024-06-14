import Stripe from "stripe";
import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { BASIC_AI_RESPONSES, PRO_AI_RESPONSES } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";
import { ProductSubscriptionTypes, StripeProductNames } from "../lib/constants";

export const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not enabled; STRIPE_SECRET_KEY is not set.");

  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });
  const stripeSubscriptionObject = await stripe.subscriptions.retrieve(
    checkoutSession.subscription as string
  );

  const { customer: stripeCustomer } = (await stripe.checkout.sessions.retrieve(checkoutSession.id, {
    expand: ["customer"],
  })) as { customer: Stripe.Customer };
  const team = await getTeam(stripeSubscriptionObject.metadata.teamId);
  if (!team) throw new Error("Team not found.");
  let updatedFeatures = team.billing.features;
  let subscriptionType = team.billing.subscriptionType;
  const nextRenewalDate = new Date(stripeSubscriptionObject.current_period_end * 1000)
    .toISOString()
    .slice(0, 10);

  for (const item of stripeSubscriptionObject.items.data) {
    const product = await stripe.products.retrieve(item.price.product as string);

    switch (product.name) {
      case StripeProductNames.basic:
        updatedFeatures = {
          ai: {
            ...updatedFeatures.ai,
            status: "active",
            responses: BASIC_AI_RESPONSES,
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
            responses: PRO_AI_RESPONSES,
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

  await updateTeam(team.id, {
    billing: {
      stripeCustomerId: stripeCustomer.id,
      subscriptionStatus: "active",
      subscriptionType: subscriptionType,
      nextRenewalDate: nextRenewalDate,
      features: updatedFeatures,
    },
  });

  await stripe.customers.update(stripeCustomer.id, {
    name: team.name,
    metadata: { team: team.id },
    invoice_settings: {
      default_payment_method: stripeSubscriptionObject.default_payment_method as string,
    },
  });
};
