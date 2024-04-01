"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { StripePriceLookupKeys } from "@typeflowai/ee/billing/lib/constants";
import { createCustomerPortalSession } from "@typeflowai/ee/billing/lib/createCustomerPortalSession";
import { createSubscription } from "@typeflowai/ee/billing/lib/createSubscription";
import { reactivateSubscription } from "@typeflowai/ee/billing/lib/reactivateSubscription";
import { removeSubscription } from "@typeflowai/ee/billing/lib/removeSubscription";
import { updateSubscription } from "@typeflowai/ee/billing/lib/updateSubscription";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { canUserAccessTeam } from "@typeflowai/lib/team/auth";
import { getTeam } from "@typeflowai/lib/team/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function createPlanAction(
  teamId: string,
  environmentId: string,
  priceLookupKey: StripePriceLookupKeys
) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

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
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const subscriptionSession = await updateSubscription(action, teamId, environmentId, priceLookupKey);
  return subscriptionSession;
}

export async function manageSubscriptionAction(teamId: string, environmentId: string) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

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
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const removedSubscription = await removeSubscription(teamId, environmentId);

  return removedSubscription.url;
}

export async function reactivateSubscriptionAction(teamId: string, environmentId: string) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTeam(session.user.id, teamId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const reactivatedSubscription = await reactivateSubscription(teamId, environmentId);

  return reactivatedSubscription.url;
}
