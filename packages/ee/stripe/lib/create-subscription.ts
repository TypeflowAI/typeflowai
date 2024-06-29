import Stripe from "stripe";
import { STRIPE_API_VERSION, WEBAPP_URL } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam } from "@typeflowai/lib/team/service";
import { StripePriceLookupKeys } from "./constants";

export const createSubscription = async (
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) => {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not enabled; STRIPE_SECRET_KEY is not set.");

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");

    const isNewTeam =
      !team.billing.stripeCustomerId || !(await stripe.customers.retrieve(team.billing.stripeCustomerId));
    if (!isNewTeam) throw new Error("Stripe customer already exist.");

    const prices = (
      await stripe.prices.list({
        lookup_keys: [priceLookupKey],
      })
    ).data[0];

    if (!prices) throw new Error("Price not found.");

    const lineItem = {
      price: prices.id,
      quantity: 1,
    };

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [lineItem],
      automatic_tax: {
        enabled: true,
      },
      success_url: `${WEBAPP_URL}/billing-confirmation?environmentId=${environmentId}`,
      cancel_url: `${WEBAPP_URL}/environments/${environmentId}/settings/billing`,
      // allow_promotion_codes: true,
      subscription_data: {
        metadata: { teamId },
      },
    };

    if (priceLookupKey === StripePriceLookupKeys.pro || priceLookupKey === StripePriceLookupKeys.enterprise) {
      sessionParams.discounts = [{ coupon: "Fo5jiiWB" }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return { status: 200, data: "Your Plan has been created!", newPlan: true, url: session.url };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      data: "Something went wrong!",
      newPlan: true,
      // url: `${baseUrl}/paywall`,
      url: `${WEBAPP_URL}/environments/${environmentId}/settings/billing`,
    };
  }
};
