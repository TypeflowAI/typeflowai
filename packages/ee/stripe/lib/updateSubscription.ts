import Stripe from "stripe";

import {
  BASIC_AI_RESPONSES,
  PRO_AI_RESPONSES,
  STRIPE_API_VERSION,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

import { StripePriceLookupKeys } from "./constants";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const baseUrl = process.env.NODE_ENV === "production" ? WEBAPP_URL : "http://localhost:3000";

export const updateSubscription = async (
  action: string,
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) => {
  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");

    let isNewTeam =
      !team.billing.stripeCustomerId || !(await stripe.customers.retrieve(team.billing.stripeCustomerId));
    if (isNewTeam) throw new Error("Stripe customer doesn't exist.");

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

    const existingSubscription = (
      (await stripe.customers.retrieve(team.billing.stripeCustomerId as string, {
        expand: ["subscriptions"],
      })) as any
    ).subscriptions.data[0] as Stripe.Subscription;

    if (!existingSubscription) throw new Error("Stripe subscription doesn't exist.");

    let subscriptionType = team.billing.subscriptionType;
    const currentResponsesUsed = team.billing.features.ai.responses ?? 0;
    let newResponsesCount = currentResponsesUsed;

    if (action === "upgrade") {
      if (existingSubscription.schedule) {
        await stripe.subscriptionSchedules.release(existingSubscription.schedule as string);
      }
      await stripe.subscriptions.update(existingSubscription.id, {
        items: [{ id: existingSubscription.items.data[0].id, price: lineItem.price }],
        proration_behavior: "always_invoice",
        cancel_at_period_end: false,
        metadata: { teamId },
      });
      subscriptionType = priceLookupKey;
      if (priceLookupKey === StripePriceLookupKeys.basic) {
        newResponsesCount = BASIC_AI_RESPONSES;
      } else if (priceLookupKey === StripePriceLookupKeys.pro) {
        newResponsesCount = PRO_AI_RESPONSES - (BASIC_AI_RESPONSES - currentResponsesUsed);
      }
    } else if (action === "downgrade") {
      await createNewScheduledSubscription(existingSubscription, lineItem, teamId);
    }

    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        subscriptionType: subscriptionType,
        subscriptionStatus: action === "upgrade" ? "active" : "scheduled",
        features: {
          ...team.billing.features,
          ai: {
            ...team.billing.features.ai,
            responses: newResponsesCount,
          },
        },
      },
    });

    return {
      status: 200,
      data: "Subscription updated successfully.",
      newPlan: false,
      url: `${baseUrl}/environments/${environmentId}/settings/billing`,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      data: "Something went wrong!",
      newPlan: true,
      url: `${baseUrl}/environments/${environmentId}/settings/billing`,
    };
  }
};

async function createNewScheduledSubscription(
  existingSubscription: Stripe.Subscription,
  lineItem: { price: string; quantity?: number },
  teamId: string
) {
  // If the subscription is already scheduled, reset the schedule.
  // To avoid errors like: Unable to update a phase that is currently active
  if (existingSubscription.schedule) {
    await stripe.subscriptionSchedules.release(existingSubscription.schedule as string);
  }
  // Create new schedule from existing subscription
  const schedule = await stripe.subscriptionSchedules.create({
    from_subscription: existingSubscription.id,
  });
  // Update schedule
  await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "release",
    phases: [
      {
        items: [{ price: existingSubscription.items.data[0].price.id, quantity: lineItem.quantity }],
        start_date: existingSubscription.current_period_start,
        end_date: existingSubscription.current_period_end,
      },
      {
        items: [{ price: lineItem.price, quantity: lineItem.quantity }],
        start_date: existingSubscription.current_period_end,
      },
    ],
    metadata: { teamId },
  });
}
