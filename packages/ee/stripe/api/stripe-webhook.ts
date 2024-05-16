import Stripe from "stripe";

import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";

import { handleCheckoutSessionCompleted } from "../handlers/checkoutSessionCompleted";
import { handleCustomerDeleted } from "../handlers/customerDeleted";
import { handleSubscriptionCreated } from "../handlers/subscriptionCreated";
import { handleSubscriptionDeleted } from "../handlers/subscriptionDeleted";
import { handleSubscriptionUpdated } from "../handlers/subscriptionUpdated";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET!;

const webhookHandler = async (requestBody: string, stripeSignature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(requestBody, stripeSignature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (err! instanceof Error) console.error(err);
    return { status: 400, message: `Webhook Error: ${errorMessage}` };
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(event);
  } else if (event.type === "customer.subscription.created") {
    await handleSubscriptionCreated(event);
  } else if (event.type === "customer.subscription.updated") {
    await handleSubscriptionUpdated(event);
  } else if (event.type === "customer.subscription.deleted") {
    await handleSubscriptionDeleted(event);
  } else if (event.type === "customer.deleted") {
    await handleCustomerDeleted(event);
  }
  return { status: 200, message: { received: true } };
};

export default webhookHandler;
