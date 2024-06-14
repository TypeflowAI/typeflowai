import Stripe from "stripe";
import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
// Import individual handlers for different types of webhook events
import { handleCheckoutSessionCompleted } from "../handlers/checkout-session-completed";
import { handleCustomerDeleted } from "../handlers/customer-deleted";
import { handleSubscriptionCreated } from "../handlers/subscription-created";
import { handleSubscriptionDeleted } from "../handlers/subscription-deleted";
import { handleSubscriptionUpdated } from "../handlers/subscription-updated";

const webhookHandler = async (requestBody: string, stripeSignature: string) => {
  let event: Stripe.Event;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    console.error("Stripe is not enabled, skipping webhook");
    return { status: 400, message: "Stripe is not enabled, skipping webhook" };
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  try {
    event = stripe.webhooks.constructEvent(requestBody, stripeSignature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (err! instanceof Error) console.error(err);
    return { status: 400, message: `Webhook Error: ${errorMessage}` };
  }

  // Handle the event type appropriately by dispatching to the respective handler
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event);
      break;
    case "customer.subscription.created":
      await handleSubscriptionCreated(event);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event);
      break;
    case "customer.deleted":
      await handleCustomerDeleted(event);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // Confirm receipt of the event
  return { status: 200, message: { received: true } };
};

export default webhookHandler;
