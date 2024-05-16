import Stripe from "stripe";

import { STRIPE_API_VERSION } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: STRIPE_API_VERSION,
});

export const createCustomerPortalSession = async (stripeCustomerId: string, returnUrl: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
};
