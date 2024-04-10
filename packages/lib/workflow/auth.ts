import { unstable_cache } from "next/cache";

import { ZId } from "@typeflowai/types/environment";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { hasUserEnvironmentAccess } from "../environment/auth";
import { getMembershipByUserIdTeamId } from "../membership/service";
import { getAccessFlags } from "../membership/utils";
import { getTeamByEnvironmentId } from "../team/service";
import { validateInputs } from "../utils/validate";
import { workflowCache } from "./cache";
import { getWorkflow } from "./service";

export const canUserAccessWorkflow = async (userId: string, workflowId: string): Promise<boolean> =>
  await unstable_cache(
    async () => {
      validateInputs([workflowId, ZId], [userId, ZId]);

      if (!userId) return false;

      const workflow = await getWorkflow(workflowId);
      if (!workflow) throw new Error("Workflow not found");

      const hasAccessToEnvironment = await hasUserEnvironmentAccess(userId, workflow.environmentId);
      if (!hasAccessToEnvironment) return false;

      return true;
    },
    [`canUserAccessWorkflow-${userId}-${workflowId}`],
    { revalidate: SERVICES_REVALIDATION_INTERVAL, tags: [workflowCache.tag.byId(workflowId)] }
  )();

export const verifyUserRoleAccess = async (
  environmentId: string,
  userId: string
): Promise<{
  hasCreateOrUpdateAccess: boolean;
  hasDeleteAccess: boolean;
}> => {
  const accessObject = {
    hasCreateOrUpdateAccess: true,
    hasDeleteAccess: true,
  };

  const team = await getTeamByEnvironmentId(environmentId);
  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(userId, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  if (isViewer) {
    accessObject.hasCreateOrUpdateAccess = false;
    accessObject.hasDeleteAccess = false;
  }

  return accessObject;
};
