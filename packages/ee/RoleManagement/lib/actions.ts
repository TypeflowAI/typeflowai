"use server";

import { getServerSession } from "next-auth";

import { hasTeamAccess, hasTeamAuthority, isOwner } from "@typeflowai/lib/auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { updateInvite } from "@typeflowai/lib/invite/service";
import {
  getMembershipByUserIdTeamId,
  transferOwnership,
  updateMembership,
} from "@typeflowai/lib/membership/service";
import { AuthenticationError, AuthorizationError, ValidationError } from "@typeflowai/types/errors";
import { TInviteUpdateInput } from "@typeflowai/types/invites";
import { TMembershipUpdateInput } from "@typeflowai/types/memberships";
import { TUser } from "@typeflowai/types/user";

export const transferOwnershipAction = async (teamId: string, newOwnerId: string) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;
  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  const hasAccess = await hasTeamAccess(user.id, teamId);
  if (!hasAccess) {
    throw new AuthorizationError("Not authorized");
  }

  const isUserOwner = await isOwner(user.id, teamId);
  if (!isUserOwner) {
    throw new AuthorizationError("Not authorized");
  }

  if (newOwnerId === user.id) {
    throw new ValidationError("You are already the owner of this team");
  }

  const membership = await getMembershipByUserIdTeamId(newOwnerId, teamId);
  if (!membership) {
    throw new ValidationError("User is not a member of this team");
  }

  await transferOwnership(user.id, newOwnerId, teamId);
};

export const updateInviteAction = async (inviteId: string, teamId: string, data: TInviteUpdateInput) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(user.id, teamId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await updateInvite(inviteId, data);
};

export const updateMembershipAction = async (
  userId: string,
  teamId: string,
  data: TMembershipUpdateInput
) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as TUser;

  if (!user) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(user.id, teamId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await updateMembership(userId, teamId, data);
};
