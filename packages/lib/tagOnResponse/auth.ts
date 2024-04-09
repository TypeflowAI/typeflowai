import "server-only";

import { unstable_cache } from "next/cache";

import { ZId } from "@typeflowai/types/environment";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { getMembershipByUserIdTeamId } from "../membership/service";
import { getAccessFlags } from "../membership/utils";
import { canUserAccessResponse } from "../response/auth";
import { canUserAccessTag } from "../tag/auth";
import { getTeamByEnvironmentId } from "../team/service";
import { validateInputs } from "../utils/validate";
import { tagOnResponseCache } from "./cache";

export const canUserAccessTagOnResponse = async (
  userId: string,
  tagId: string,
  responseId: string
): Promise<boolean> =>
  await unstable_cache(
    async () => {
      validateInputs([userId, ZId], [tagId, ZId], [responseId, ZId]);

      const isAuthorizedForTag = await canUserAccessTag(userId, tagId);
      const isAuthorizedForResponse = await canUserAccessResponse(userId, responseId);

      return isAuthorizedForTag && isAuthorizedForResponse;
    },
    [`users-${userId}-tagOnResponse-${tagId}-${responseId}`],
    {
      revalidate: SERVICES_REVALIDATION_INTERVAL,
      tags: [tagOnResponseCache.tag.byResponseIdAndTagId(responseId, tagId)],
    }
  )();

export const verifyUserRoleAccess = async (
  environmentId: string,
  userId: string
): Promise<{
  hasCreateOrUpdateAccess: boolean;
  hasDeleteAccess: boolean;
}> => {
  const team = await getTeamByEnvironmentId(environmentId);
  if (!team) {
    throw new Error("Team not found");
  }
  const currentUserMembership = await getMembershipByUserIdTeamId(userId, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  if (isViewer) {
    return {
      hasCreateOrUpdateAccess: false,
      hasDeleteAccess: false,
    };
  }

  return {
    hasCreateOrUpdateAccess: true,
    hasDeleteAccess: true,
  };
};
