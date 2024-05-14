"use server";

import { getServerSession } from "next-auth";

import { hasTeamAccess, hasTeamAuthority, isOwner } from "@typeflowai/lib/auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { INVITE_DISABLED } from "@typeflowai/lib/constants";
import {
  deleteInvite,
  getInvite,
  inviteUser,
  resendInvite,
  updateInvite,
} from "@typeflowai/lib/invite/service";
import { createInviteToken } from "@typeflowai/lib/jwt";
import {
  deleteMembership,
  getMembershipByUserIdTeamId,
  getMembershipsByUserId,
  transferOwnership,
  updateMembership,
} from "@typeflowai/lib/membership/service";
import { verifyUserRoleAccess } from "@typeflowai/lib/team/auth";
import { deleteTeam, updateTeam } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";
import { AuthenticationError, AuthorizationError, ValidationError } from "@typeflowai/types/errors";
import { TInviteUpdateInput } from "@typeflowai/types/invites";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TMembershipUpdateInput } from "@typeflowai/types/memberships";
import { TUser } from "@typeflowai/types/user";

export const updateTeamNameAction = async (teamId: string, teamName: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(session.user.id, teamId);
  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await updateTeam(teamId, { name: teamName });
};

export const deleteInviteAction = async (inviteId: string, teamId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(session.user.id, teamId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  return await deleteInvite(inviteId);
};

export const deleteMembershipAction = async (userId: string, teamId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(session.user.id, teamId);

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  const { hasDeleteMembersAccess } = await verifyUserRoleAccess(teamId, session.user.id);
  if (!hasDeleteMembersAccess) {
    throw new AuthenticationError("Not authorized");
  }

  if (userId === session.user.id) {
    throw new AuthenticationError("You cannot delete yourself from the team");
  }

  return await deleteMembership(userId, teamId);
};

export const leaveTeamAction = async (teamId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const membership = await getMembershipByUserIdTeamId(session.user.id, teamId);

  if (!membership) {
    throw new AuthenticationError("Not a member of this team");
  }

  if (membership.role === "owner") {
    throw new ValidationError("You cannot leave a team you own");
  }

  const memberships = await getMembershipsByUserId(session.user.id);
  if (!memberships || memberships?.length <= 1) {
    throw new ValidationError("You cannot leave the only team you are a member of");
  }

  await deleteMembership(session.user.id, teamId);
};

export const createInviteTokenAction = async (inviteId: string) => {
  const { email } = await getInvite(inviteId);
  const inviteToken = createInviteToken(inviteId, email, {
    expiresIn: "7d",
  });

  return { inviteToken: encodeURIComponent(inviteToken) };
};

export const resendInviteAction = async (inviteId: string) => {
  return await resendInvite(inviteId);
};

export const inviteUserAction = async (
  teamId: string,
  email: string,
  name: string,
  role: TMembershipRole
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const currentUser = session && session.user ? await getUser(session.user.id) : null;

  if (!currentUser) {
    throw new Error("User not available");
  }

  const isUserAuthorized = await hasTeamAuthority(session.user.id, teamId);

  if (INVITE_DISABLED) {
    throw new AuthenticationError("Invite disabled");
  }

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  const { hasCreateOrUpdateMembersAccess } = await verifyUserRoleAccess(teamId, session.user.id);
  if (!hasCreateOrUpdateMembersAccess) {
    throw new AuthenticationError("Not authorized");
  }

  const invite = await inviteUser({
    teamId,
    currentUser: { id: session.user.id, name: currentUser.name },
    invitee: {
      email,
      name,
      role,
    },
  });

  return invite;
};

export const deleteTeamAction = async (teamId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const { hasDeleteAccess } = await verifyUserRoleAccess(teamId, session.user.id);

  if (!hasDeleteAccess) {
    throw new AuthorizationError("Not authorized");
  }

  return await deleteTeam(teamId);
};

export const transferPropietaryAction = async (teamId: string, newOwnerId: string) => {
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
