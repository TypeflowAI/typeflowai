"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { canUserAccessWebhook } from "@typeflowai/lib/webhook/auth";
import { createWebhook, deleteWebhook, updateWebhook } from "@typeflowai/lib/webhook/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TWebhook, TWebhookInput } from "@typeflowai/types/webhooks";

export const createWebhookAction = async (
  environmentId: string,
  webhookInput: TWebhookInput
): Promise<TWebhook> => {
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

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createWebhook(environmentId, webhookInput);
};

export const deleteWebhookAction = async (id: string): Promise<TWebhook> => {
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

  const isAuthorized = await canUserAccessWebhook(session.user.id, id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteWebhook(id);
};

export const updateWebhookAction = async (
  environmentId: string,
  webhookId: string,
  webhookInput: Partial<TWebhookInput>
): Promise<TWebhook> => {
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

  const isAuthorized = await canUserAccessWebhook(session.user.id, webhookId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await updateWebhook(environmentId, webhookId, webhookInput);
};
