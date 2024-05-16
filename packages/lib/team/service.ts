import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { ZOptionalNumber, ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import {
  TTeam,
  TTeamBilling,
  TTeamCreateInput,
  TTeamUpdateInput,
  ZTeamCreateInput,
} from "@typeflowai/types/teams";
import { TUserNotificationSettings } from "@typeflowai/types/user";

import { cache } from "../cache";
import { ITEMS_PER_PAGE } from "../constants";
import { environmentCache } from "../environment/cache";
import { getProducts } from "../product/service";
import { getUsersWithTeam, updateUser } from "../user/service";
import { validateInputs } from "../utils/validate";
import { teamCache } from "./cache";

export const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  billing: true,
};

export const getTeamsTag = (teamId: string) => `teams-${teamId}`;
export const getTeamsByUserIdCacheTag = (userId: string) => `users-${userId}-teams`;
export const getTeamByEnvironmentIdCacheTag = (environmentId: string) => `environments-${environmentId}-team`;

export const getTeamsByUserId = (userId: string, page?: number): Promise<TTeam[]> =>
  cache(
    async () => {
      validateInputs([userId, ZString], [page, ZOptionalNumber]);

      try {
        const teams = await prisma.team.findMany({
          where: {
            memberships: {
              some: {
                userId,
              },
            },
          },
          select,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });
        if (!teams) {
          throw new ResourceNotFoundError("Teams by UserId", userId);
        }
        return teams;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeamsByUserId-${userId}-${page}`],
    {
      tags: [teamCache.tag.byUserId(userId)],
    }
  )();

export const getTeamByEnvironmentId = (environmentId: string): Promise<TTeam | null> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);

      try {
        const team = await prisma.team.findFirst({
          where: {
            products: {
              some: {
                environments: {
                  some: {
                    id: environmentId,
                  },
                },
              },
            },
          },
          select: { ...select, memberships: true }, // include memberships
        });

        return team;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeamByEnvironmentId-${environmentId}`],
    {
      tags: [teamCache.tag.byEnvironmentId(environmentId)],
    }
  )();

export const getTeam = (teamId: string): Promise<TTeam | null> =>
  cache(
    async () => {
      validateInputs([teamId, ZString]);

      try {
        const team = await prisma.team.findUnique({
          where: {
            id: teamId,
          },
          select,
        });
        return team;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeam-${teamId}`],
    {
      tags: [teamCache.tag.byId(teamId)],
    }
  )();

export const createTeam = async (teamInput: TTeamCreateInput): Promise<TTeam> => {
  try {
    validateInputs([teamInput, ZTeamCreateInput]);

    const team = await prisma.team.create({
      data: teamInput,
      select,
    });

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const updateTeam = async (teamId: string, data: Partial<TTeamUpdateInput>): Promise<TTeam> => {
  try {
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data,
      select: { ...select, memberships: true, products: { select: { environments: true } } }, // include memberships & environments
    });

    // revalidate cache for members
    updatedTeam?.memberships.forEach((membership) => {
      teamCache.revalidate({
        userId: membership.userId,
      });
    });

    // revalidate cache for environments
    updatedTeam?.products.forEach((product) => {
      product.environments.forEach((environment) => {
        teamCache.revalidate({
          environmentId: environment.id,
        });
      });
    });

    const team = {
      ...updatedTeam,
      memberships: undefined,
      products: undefined,
    };

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("Team", teamId);
    }
    throw error; // Re-throw any other errors
  }
};

export const deleteTeam = async (teamId: string): Promise<TTeam> => {
  validateInputs([teamId, ZId]);
  try {
    const deletedTeam = await prisma.team.delete({
      where: {
        id: teamId,
      },
      select: { ...select, memberships: true, products: { select: { environments: true } } }, // include memberships & environments
    });

    // revalidate cache for members
    deletedTeam?.memberships.forEach((membership) => {
      teamCache.revalidate({
        userId: membership.userId,
      });
    });

    // revalidate cache for environments
    deletedTeam?.products.forEach((product) => {
      product.environments.forEach((environment) => {
        environmentCache.revalidate({
          id: environment.id,
        });

        teamCache.revalidate({
          environmentId: environment.id,
        });
      });
    });

    const team = {
      ...deletedTeam,
      memberships: undefined,
      products: undefined,
    };

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getTeamsWithPaidPlan = (): Promise<TTeam[]> =>
  cache(
    async () => {
      try {
        const fetchedTeams = await prisma.team.findMany({
          where: {
            OR: [
              {
                billing: {
                  path: ["features", "inAppWorkflow", "status"],
                  not: "inactive",
                },
              },
              {
                billing: {
                  path: ["features", "userTargeting", "status"],
                  not: "inactive",
                },
              },
            ],
          },
          select,
        });

        return fetchedTeams;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    ["getTeamsWithPaidPlan"],
    {
      tags: [],
    }
  )();

export const getMonthlyActiveTeamPeopleCount = (teamId: string): Promise<number> =>
  cache(
    async () => {
      validateInputs([teamId, ZId]);

      try {
        // Define the start of the month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all environment IDs for the team
        const products = await getProducts(teamId);
        const environmentIds = products.flatMap((product) => product.environments.map((env) => env.id));

        // Aggregate the count of active people across all environments
        const peopleAggregations = await prisma.person.aggregate({
          _count: {
            id: true,
          },
          where: {
            AND: [
              { environmentId: { in: environmentIds } },
              {
                actions: {
                  some: {
                    createdAt: { gte: firstDayOfMonth },
                  },
                },
              },
            ],
          },
        });

        return peopleAggregations._count.id;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getMonthlyActiveTeamPeopleCount-${teamId}`],
    {
      revalidate: 60 * 60 * 2, // 2 hours
    }
  )();

export const getMonthlyTeamResponseCount = (teamId: string): Promise<number> =>
  cache(
    async () => {
      validateInputs([teamId, ZId]);

      try {
        // Define the start of the month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all environment IDs for the team
        const products = await getProducts(teamId);
        const environmentIds = products.flatMap((product) => product.environments.map((env) => env.id));

        // Use Prisma's aggregate to count responses for all environments
        const responseAggregations = await prisma.response.aggregate({
          _count: {
            id: true,
          },
          where: {
            AND: [
              { workflow: { environmentId: { in: environmentIds } } },
              { workflow: { type: { in: ["app", "website"] } } },
              { createdAt: { gte: firstDayOfMonth } },
            ],
          },
        });

        // The result is an aggregation of the total count
        return responseAggregations._count.id;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getMonthlyTeamResponseCount-${teamId}`],
    {
      revalidate: 60 * 60 * 2, // 2 hours
    }
  )();

export const getTeamBillingInfo = (teamId: string): Promise<TTeamBilling | null> =>
  cache(
    async () => {
      validateInputs([teamId, ZId]);

      try {
        const billingInfo = await prisma.team.findUnique({
          where: {
            id: teamId,
          },
        });

        return billingInfo?.billing ?? null;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeamBillingInfo-${teamId}`],
    {
      tags: [teamCache.tag.byId(teamId)],
    }
  )();

export const subscribeTeamMembersToWorkflowResponses = async (
  environmentId: string,
  workflowId: string
): Promise<void> => {
  try {
    const team = await getTeamByEnvironmentId(environmentId);
    if (!team) {
      throw new ResourceNotFoundError("Team", environmentId);
    }

    const users = await getUsersWithTeam(team.id);
    await Promise.all(
      users.map((user) => {
        if (!user.notificationSettings?.unsubscribedTeamIds?.includes(team?.id as string)) {
          const defaultSettings = { alert: {}, weeklySummary: {} };
          const updatedNotificationSettings: TUserNotificationSettings = {
            ...defaultSettings,
            ...user.notificationSettings,
          };

          updatedNotificationSettings.alert[workflowId] = true;

          return updateUser(user.id, {
            notificationSettings: updatedNotificationSettings,
          });
        }

        return Promise.resolve();
      })
    );
  } catch (error) {
    throw error;
  }
};
