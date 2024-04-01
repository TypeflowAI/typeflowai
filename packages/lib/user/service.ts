import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { z } from "zod";

import { prisma } from "@typeflowai/database";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TMembership } from "@typeflowai/types/memberships";
import { ZUuid } from "@typeflowai/types/user";
import { TUser, TUserCreateInput, TUserUpdateInput, ZUser, ZUserUpdateInput } from "@typeflowai/types/user";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { updateMembership } from "../membership/service";
import { deleteTeam } from "../team/service";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { userCache } from "./cache";

const responseSelection = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  onboardingCompleted: true,
  twoFactorEnabled: true,
  identityProvider: true,
  objective: true,
};

// function to retrive basic information about a user's user
export const getUser = async (id: string): Promise<TUser | null> => {
  const user = await unstable_cache(
    async () => {
      validateInputs([id, ZUuid]);

      try {
        const user = await prisma.user.findUnique({
          where: {
            id,
          },
          select: responseSelection,
        });

        if (!user) {
          return null;
        }
        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getUser-${id}`],
    {
      tags: [userCache.tag.byId(id)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return user
    ? {
        ...user,
        ...formatDateFields(user, ZUser),
      }
    : null;
};

export const getUserByEmail = async (email: string): Promise<TUser | null> => {
  const user = await unstable_cache(
    async () => {
      validateInputs([email, z.string().email()]);

      try {
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
          select: responseSelection,
        });

        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getUserByEmail-${email}`],
    {
      tags: [userCache.tag.byEmail(email)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return user
    ? {
        ...user,
        ...formatDateFields(user, ZUser),
      }
    : null;
};

const getAdminMemberships = (memberships: TMembership[]): TMembership[] =>
  memberships.filter((membership) => membership.role === "admin");

// function to update a user's user
export const updateUser = async (personId: string, data: TUserUpdateInput): Promise<TUser> => {
  validateInputs([personId, ZUuid], [data, ZUserUpdateInput.partial()]);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: personId,
      },
      data: data,
      select: responseSelection,
    });

    userCache.revalidate({
      email: updatedUser.email,
      id: updatedUser.id,
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("User", personId);
    } else {
      throw error; // Re-throw any other errors
    }
  }
};

const deleteUserById = async (id: string): Promise<TUser> => {
  validateInputs([id, ZUuid]);

  const user = await prisma.user.delete({
    where: {
      id,
    },
    select: responseSelection,
  });

  userCache.revalidate({
    email: user.email,
    id,
  });

  return user;
};

export const createUser = async (data: TUserCreateInput, supabaseUser: string): Promise<TUser> => {
  validateInputs([data, ZUserUpdateInput]);

  const user = await prisma.user.upsert({
    where: {
      id: supabaseUser,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
      id: supabaseUser,
    },
    select: responseSelection,
  });

  userCache.revalidate({
    email: user.email,
    id: user.id,
  });

  return user;
};

// function to delete a user's user including teams
export const deleteUser = async (id: string): Promise<TUser> => {
  validateInputs([id, ZUuid]);

  try {
    const currentUserMemberships = await prisma.membership.findMany({
      where: {
        userId: id,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            memberships: true,
          },
        },
      },
    });

    for (const currentUserMembership of currentUserMemberships) {
      const teamMemberships = currentUserMembership.team.memberships;
      const role = currentUserMembership.role;
      const teamId = currentUserMembership.teamId;

      const teamAdminMemberships = getAdminMemberships(teamMemberships);
      const teamHasAtLeastOneAdmin = teamAdminMemberships.length > 0;
      const teamHasOnlyOneMember = teamMemberships.length === 1;
      const currentUserIsTeamOwner = role === "owner";

      if (teamHasOnlyOneMember) {
        await deleteTeam(teamId);
      } else if (currentUserIsTeamOwner && teamHasAtLeastOneAdmin) {
        const firstAdmin = teamAdminMemberships[0];
        await updateMembership(firstAdmin.userId, teamId, { role: "owner" });
      } else if (currentUserIsTeamOwner) {
        await deleteTeam(teamId);
      }
    }

    const deletedUser = await deleteUserById(id);

    return deletedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
