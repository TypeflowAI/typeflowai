import Stripe from "stripe";

import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const baseUrl = process.env.NODE_ENV === "production" ? WEBAPP_URL : "http://localhost:3000";

export const reactivateSubscription = async (teamId: string, environmentId: string) => {
  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");

    let isNewTeam =
      !team.billing.stripeCustomerId || !(await stripe.customers.retrieve(team.billing.stripeCustomerId));
    if (isNewTeam) throw new Error("Stripe customer doesn't exist.");

    const existingSubscription = (
      (await stripe.customers.retrieve(team.billing.stripeCustomerId as string, {
        expand: ["subscriptions"],
      })) as any
    ).subscriptions.data[0] as Stripe.Subscription;

    if (!existingSubscription) throw new Error("Stripe subscription doesn't exist.");

    if (existingSubscription.schedule) {
      await stripe.subscriptionSchedules.release(existingSubscription.schedule as string);
    }

    await stripe.subscriptions.update(existingSubscription.id, {
      cancel_at_period_end: false,
    });

    const nextRenewalDate = new Date(existingSubscription.current_period_end * 1000)
      .toISOString()
      .slice(0, 10);

    let updatedFeatures = team.billing.features;
    updatedFeatures.ai.status = "active";

    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        features: updatedFeatures,
        subscriptionStatus: "active",
        nextRenewalDate: nextRenewalDate,
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
