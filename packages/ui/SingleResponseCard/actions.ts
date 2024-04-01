"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { canUserAccessResponse } from "@typeflowai/lib/response/auth";
import { deleteResponse } from "@typeflowai/lib/response/service";
import { canUserModifyResponseNote, canUserResolveResponseNote } from "@typeflowai/lib/responseNote/auth";
import {
  createResponseNote,
  resolveResponseNote,
  updateResponseNote,
} from "@typeflowai/lib/responseNote/service";
import { createTag, getTag } from "@typeflowai/lib/tag/service";
import { canUserAccessTagOnResponse, verifyUserRoleAccess } from "@typeflowai/lib/tagOnResponse/auth";
import { addTagToRespone, deleteTagOnResponse } from "@typeflowai/lib/tagOnResponse/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const createTagAction = async (environmentId: string, tagName: string) => {
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

  const isAuthorized = await hasUserEnvironmentAccess(session.user!.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(environmentId, session.user!.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await createTag(environmentId, tagName);
};

export const createTagToResponeAction = async (responseId: string, tagId: string) => {
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

  const isAuthorized = await canUserAccessTagOnResponse(session.user!.id, tagId, responseId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const tag = await getTag(tagId);
  const { hasDeleteAccess } = await verifyUserRoleAccess(tag!.environmentId, session.user!.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  return await addTagToRespone(responseId, tagId);
};

export const deleteTagOnResponseAction = async (responseId: string, tagId: string) => {
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

  const isAuthorized = await canUserAccessTagOnResponse(session.user!.id, tagId, responseId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const tag = await getTag(tagId);
  const { hasDeleteAccess } = await verifyUserRoleAccess(tag!.environmentId, session.user!.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  return await deleteTagOnResponse(responseId, tagId);
};

export const deleteResponseAction = async (responseId: string) => {
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
  const isAuthorized = await canUserAccessResponse(session.user!.id, responseId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await deleteResponse(responseId);
};

export const updateResponseNoteAction = async (responseNoteId: string, text: string) => {
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

  const isAuthorized = await canUserModifyResponseNote(session.user!.id, responseNoteId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  await updateResponseNote(responseNoteId, text);
};

export const resolveResponseNoteAction = async (responseId: string, responseNoteId: string) => {
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

  const isAuthorized = await canUserResolveResponseNote(session.user!.id, responseId, responseNoteId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  await resolveResponseNote(responseNoteId);
};

export const createResponseNoteAction = async (responseId: string, userId: string, text: string) => {
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
  const authotized = await canUserAccessResponse(session.user!.id, responseId);
  if (!authotized) throw new AuthorizationError("Not authorized");
  return await createResponseNote(responseId, userId, text);
};
