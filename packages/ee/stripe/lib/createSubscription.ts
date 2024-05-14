import Stripe from "stripe";

import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getTeam } from "@typeflowai/lib/team/service";

import { StripePriceLookupKeys } from "./constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const baseUrl = process.env.NODE_ENV === "production" ? WEBAPP_URL : "http://localhost:3000";

export const createSubscription = async (
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) => {
  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");

    let isNewTeam =
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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [lineItem],
      automatic_tax: {
        enabled: true,
      },
      success_url: `${baseUrl}/paywall/plan-created?environmentId=${environmentId}`,
      cancel_url: `${baseUrl}/paywall`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { teamId },
      },
    });

    return { status: 200, data: "Your Plan has been created!", newPlan: true, url: session.url };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      data: "Something went wrong!",
      newPlan: true,
      url: `${baseUrl}/paywall`,
    };
  }
};
