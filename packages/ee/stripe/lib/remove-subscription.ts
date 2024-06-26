import Stripe from "stripe";
import { STRIPE_API_VERSION, WEBAPP_URL } from "@typeflowai/lib/constants";
import { env } from "@typeflowai/lib/env";
import { getTeam, updateTeam } from "@typeflowai/lib/team/service";

export const removeSubscription = async (teamId: string, environmentId: string) => {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not enabled; STRIPE_SECRET_KEY is not set.");

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

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
    updatedFeatures.ai.status = "canceled";

    await updateTeam(teamId, {
      billing: {
        ...team.billing,
        features: updatedFeatures,
        subscriptionStatus: "canceled",
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
      url: `${WEBAPP_URL}/environments/${environmentId}/settings/billing`,
    };
  }
};
