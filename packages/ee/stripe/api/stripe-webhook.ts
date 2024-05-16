import Stripe from "stripe";

import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";

// Import individual handlers for different types of webhook events
import { handleCheckoutSessionCompleted } from "../handlers/checkoutSessionCompleted";
import { handleCustomerDeleted } from "../handlers/customerDeleted";
import { handleSubscriptionCreated } from "../handlers/subscriptionCreated";
import { handleSubscriptionDeleted } from "../handlers/subscriptionDeleted";
import { handleSubscriptionUpdated } from "../handlers/subscriptionUpdated";

// Initialize Stripe with your secret key and specify the API version
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
