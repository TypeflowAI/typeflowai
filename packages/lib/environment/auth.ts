import { unstable_cache } from "next/cache";

import { prisma } from "@typeflowai/database";
import { ZId } from "@typeflowai/types/environment";
import { ZUuid } from "@typeflowai/types/user";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { teamCache } from "../team/cache";
import { validateInputs } from "../utils/validate";

export const hasUserEnvironmentAccess = async (userId: string, environmentId: string) => {
  return await unstable_cache(
    async (): Promise<boolean> => {
      validateInputs([userId, ZUuid], [environmentId, ZId]);

      const environment = await prisma.environment.findUnique({
        where: {
          id: environmentId,
        },
        select: {
          product: {
            select: {
              team: {
                select: {
                  memberships: {
                    select: {
                      userId: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const environmentUsers = environment?.product.team.memberships.map((member) => member.userId) || [];
      return environmentUsers.includes(userId);
    },
    [`hasUserEnvironmentAccess-${userId}-${environmentId}`],
    {
      revalidate: SERVICES_REVALIDATION_INTERVAL,
      tags: [teamCache.tag.byEnvironmentId(environmentId), teamCache.tag.byUserId(userId)],
    }
  )();
};
