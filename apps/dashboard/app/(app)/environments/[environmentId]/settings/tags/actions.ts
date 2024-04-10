"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessTag, verifyUserRoleAccess } from "@typeflowai/lib/tag/auth";
import { deleteTag, getTag, mergeTags, updateTagName } from "@typeflowai/lib/tag/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const deleteTagAction = async (tagId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTag(session.user.id, tagId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const tag = await getTag(tagId);
  const { hasDeleteAccess } = await verifyUserRoleAccess(tag!.environmentId, session.user!.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  return await deleteTag(tagId);
};

export const updateTagNameAction = async (tagId: string, name: string) => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessTag(session.user.id, tagId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const tag = await getTag(tagId);
  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(tag!.environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateTagName(tagId, name);
};

export const mergeTagsAction = async (originalTagId: string, newTagId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorizedForOld = await canUserAccessTag(session.user.id, originalTagId);
  const isAuthorizedForNew = await canUserAccessTag(session.user.id, newTagId);
  if (!isAuthorizedForOld || !isAuthorizedForNew) throw new AuthorizationError("Not authorized");

  const tag = await getTag(originalTagId);
  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(tag!.environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await mergeTags(originalTagId, newTagId);
};
