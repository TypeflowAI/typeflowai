import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@typeflowai/database";
import { ZOptionalNumber, ZString } from "@typeflowai/types/common";
import { DatabaseError, ResourceNotFoundError, ValidationError } from "@typeflowai/types/errors";
import {
  TCurrentUser,
  TInvite,
  TInviteUpdateInput,
  TInvitee,
  ZCurrentUser,
  ZInvite,
  ZInviteUpdateInput,
  ZInvitee,
} from "@typeflowai/types/invites";

import { ITEMS_PER_PAGE, SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { sendInviteMemberEmail } from "../emails/emails";
import { getMembershipByUserIdTeamId } from "../membership/service";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { inviteCache } from "./cache";

const inviteSelect = {
  id: true,
  email: true,
  name: true,
  teamId: true,
  creatorId: true,
  acceptorId: true,
  accepted: true,
  createdAt: true,
  expiresAt: true,
  role: true,
};
interface InviteWithCreator extends TInvite {
  creator: {
    name: string | null;
    email: string;
  };
}
export const getInvitesByTeamId = async (teamId: string, page?: number): Promise<TInvite[]> => {
  const invites = await unstable_cache(
    async () => {
      validateInputs([teamId, ZString], [page, ZOptionalNumber]);

      return prisma.invite.findMany({
        where: { teamId },
        select: inviteSelect,
        take: page ? ITEMS_PER_PAGE : undefined,
        skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
      });
    },
    [`getInvitesByTeamId-${teamId}-${page}`],
    {
      tags: [inviteCache.tag.byTeamId(teamId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return invites.map((invite: TInvite) => formatDateFields(invite, ZInvite));
};

export const updateInvite = async (inviteId: string, data: TInviteUpdateInput): Promise<TInvite | null> => {
  validateInputs([inviteId, ZString], [data, ZInviteUpdateInput]);

  try {
    const invite = await prisma.invite.update({
      where: { id: inviteId },
      data,
      select: inviteSelect,
    });

    if (invite === null) {
      throw new ResourceNotFoundError("Invite", inviteId);
    }

    inviteCache.revalidate({
      id: invite.id,
      teamId: invite.teamId,
    });

    return invite;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("Invite", inviteId);
    } else {
      throw error; // Re-throw any other errors
    }
  }
};

export const deleteInvite = async (inviteId: string): Promise<TInvite> => {
  validateInputs([inviteId, ZString]);

  try {
    const invite = await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    if (invite === null) {
      throw new ResourceNotFoundError("Invite", inviteId);
    }

    inviteCache.revalidate({
      id: invite.id,
      teamId: invite.teamId,
    });

    return invite;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getInvite = async (inviteId: string): Promise<InviteWithCreator> => {
  const invite = await unstable_cache(
    async () => {
      validateInputs([inviteId, ZString]);

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invite) {
        throw new ResourceNotFoundError("Invite", inviteId);
      }
      return invite;
    },
    [`getInvite-${inviteId}`],
    { tags: [inviteCache.tag.byId(inviteId)], revalidate: SERVICES_REVALIDATION_INTERVAL }
  )();
  return {
    ...formatDateFields(invite, ZInvite),
    creator: invite.creator,
  };
};

export const resendInvite = async (inviteId: string): Promise<TInvite> => {
  validateInputs([inviteId, ZString]);
  const invite = await prisma.invite.findUnique({
    where: {
      id: inviteId,
    },
    select: {
      email: true,
      name: true,
      creator: true,
    },
  });

  if (!invite) {
    throw new ResourceNotFoundError("Invite", inviteId);
  }

  await sendInviteMemberEmail(inviteId, invite.creator?.name ?? "", invite.name ?? "", invite.email);

  const updatedInvite = await prisma.invite.update({
    where: {
      id: inviteId,
    },
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  inviteCache.revalidate({
    id: updatedInvite.id,
    teamId: updatedInvite.teamId,
  });

  return updatedInvite;
};

export const inviteUser = async ({
  currentUser,
  invitee,
  teamId,
}: {
  teamId: string;
  invitee: TInvitee;
  currentUser: TCurrentUser;
}): Promise<TInvite> => {
  validateInputs([teamId, ZString], [invitee, ZInvitee], [currentUser, ZCurrentUser]);

  const { name, email, role } = invitee;
  const { id: currentUserId, name: currentUserName } = currentUser;
  const existingInvite = await prisma.invite.findFirst({ where: { email, teamId } });

  if (existingInvite) {
    throw new ValidationError("Invite already exists");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const member = await getMembershipByUserIdTeamId(user.id, teamId);

    if (member) {
      throw new ValidationError("User is already a member of this team");
    }
  }

  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
  const expiresAt = new Date(Date.now() + expiresIn);

  const invite = await prisma.invite.create({
    data: {
      email,
      name,
      team: { connect: { id: teamId } },
      creator: { connect: { id: currentUserId } },
      acceptor: user ? { connect: { id: user.id } } : undefined,
      role,
      expiresAt,
    },
  });

  inviteCache.revalidate({
    id: invite.id,
    teamId: invite.teamId,
  });

  await sendInviteMemberEmail(invite.id, email, currentUserName, name);
  return invite;
};
