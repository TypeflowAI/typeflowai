"use server";

import { getServerSession } from "next-auth";

import { StripePriceLookupKeys } from "@typeflowai/ee/stripe/lib/constants";
import { createCustomerPortalSession } from "@typeflowai/ee/stripe/lib/createCustomerPortalSession";
import { createSubscription } from "@typeflowai/ee/stripe/lib/createSubscription";
import { reactivateSubscription } from "@typeflowai/ee/stripe/lib/reactivateSubscription";
import { removeSubscription } from "@typeflowai/ee/stripe/lib/removeSubscription";
import { updateSubscription } from "@typeflowai/ee/stripe/lib/updateSubscription";
import { authOptions } from "@typeflowai/lib/authOptions";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { canUserAccessTeam } from "@typeflowai/lib/team/auth";
import { getTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function createPlanAction(
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const subscriptionSession = await createSubscription(teamId, environmentId, priceLookupKey);
  return subscriptionSession;
}

export async function updatePlanAction(
  action: string,
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const subscriptionSession = await updateSubscription(action, teamId, environmentId, priceLookupKey);
  return subscriptionSession;
}

export async function manageSubscriptionAction(teamId: string, environmentId: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const team = await getTeam(teamId);
  if (!team || !team.billing.stripeCustomerId)
    throw new AuthorizationError("You do not have an associated Stripe CustomerId");

  const sessionUrl = await createCustomerPortalSession(
    team.billing.stripeCustomerId,
    `${WEBAPP_URL}/environments/${environmentId}/settings/billing`
  );
  return sessionUrl;
}

export async function removeSubscriptionAction(teamId: string, environmentId: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const removedSubscription = await removeSubscription(teamId, environmentId);

  return removedSubscription.url;
}

export async function reactivateSubscriptionAction(teamId: string, environmentId: string) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const reactivatedSubscription = await reactivateSubscription(teamId, environmentId);

  return reactivatedSubscription.url;
}
