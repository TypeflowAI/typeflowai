import Stripe from "stripe";

import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const baseUrl = process.env.NODE_ENV === "production" ? WEBAPP_URL : "http://localhost:3000";

export const removeSubscription = async (teamId: string, environmentId: string) => {
  try {
    const team = await getTeam(teamId);
    if (!team) throw new Error("Team not found.");
    if (!team.billing.stripeCustomerId) {
      return { status: 400, data: "No subscription exists for given team!", newPlan: false, url: "" };
    }

    const existingCustomer = (await stripe.customers.retrieve(team.billing.stripeCustomerId, {
      expand: ["subscriptions"],
    })) as Stripe.Customer;
    const existingSubscription = existingCustomer.subscriptions?.data[0] as Stripe.Subscription;

    if (!existingSubscription) throw new Error("Stripe subscription doesn't exist.");

    if (existingSubscription.schedule) {
      await stripe.subscriptionSchedules.release(existingSubscription.schedule as string);
    }

    await stripe.subscriptions.update(existingSubscription.id, { cancel_at_period_end: true });

    let updatedFeatures = team.billing.features;
    updatedFeatures.ai.status = "cancelled";

    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        features: updatedFeatures,
        subscriptionStatus: "cancelled",
        nextRenewalDate: null,
      },
    });

    return {
      status: 200,
      data: "Successfully removed from your existing subscription!",
      newPlan: false,
      url: "",
    };
  } catch (err) {
    console.log("Error in removing subscription:", err);

    return {
      status: 500,
      data: "Something went wrong!",
      newPlan: true,
      url: `${baseUrl}/environments/${environmentId}/settings/billing`,
    };
  }
};
