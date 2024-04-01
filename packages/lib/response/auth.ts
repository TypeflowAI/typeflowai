import "server-only";

import { unstable_cache } from "next/cache";

import { ZId } from "@typeflowai/types/environment";
import { ZUuid } from "@typeflowai/types/user";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { hasUserEnvironmentAccess } from "../environment/auth";
import { validateInputs } from "../utils/validate";
import { getWorkflow } from "../workflow/service";
import { responseCache } from "./cache";
import { getResponse } from "./service";

export const canUserAccessResponse = async (userId: string, responseId: string): Promise<boolean> =>
  await unstable_cache(
    async () => {
      validateInputs([userId, ZUuid], [responseId, ZId]);

      if (!userId) return false;

      const response = await getResponse(responseId);
      if (!response) return false;

      const workflow = await getWorkflow(response.workflowId);
      if (!workflow) return false;

      const hasAccessToEnvironment = await hasUserEnvironmentAccess(userId, workflow.environmentId);
      if (!hasAccessToEnvironment) return false;

      return true;
    },
    [`canUserAccessResponse-${userId}-${responseId}`],
    { revalidate: SERVICES_REVALIDATION_INTERVAL, tags: [responseCache.tag.byId(responseId)] }
  )();
