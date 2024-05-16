import "server-only";

import { ZId } from "@typeflowai/types/environment";

import { cache } from "../cache";
import { hasUserEnvironmentAccess } from "../environment/auth";
import { validateInputs } from "../utils/validate";
import { getWorkflow } from "../workflow/service";
import { responseCache } from "./cache";
import { getResponse } from "./service";

export const canUserAccessResponse = (userId: string, responseId: string): Promise<boolean> =>
  cache(
    async () => {
      validateInputs([userId, ZId], [responseId, ZId]);

      if (!userId) return false;

      try {
        const response = await getResponse(responseId);
        if (!response) return false;

        const workflow = await getWorkflow(response.workflowId);
        if (!workflow) return false;

        const hasAccessToEnvironment = await hasUserEnvironmentAccess(userId, workflow.environmentId);
        if (!hasAccessToEnvironment) return false;

        return true;
      } catch (error) {
        throw error;
      }
    },
    [`canUserAccessResponse-${userId}-${responseId}`],
    {
      tags: [responseCache.tag.byId(responseId)],
    }
  )();
