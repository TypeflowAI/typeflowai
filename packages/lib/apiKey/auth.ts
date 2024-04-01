import "server-only";

import { unstable_cache } from "next/cache";

import { ZId } from "@typeflowai/types/environment";
import { ZUuid } from "@typeflowai/types/user";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { hasUserEnvironmentAccess } from "../environment/auth";
import { validateInputs } from "../utils/validate";
import { apiKeyCache } from "./cache";
import { getApiKey } from "./service";

export const canUserAccessApiKey = async (userId: string, apiKeyId: string): Promise<boolean> =>
  await unstable_cache(
    async () => {
      validateInputs([userId, ZUuid], [apiKeyId, ZId]);

      const apiKeyFromServer = await getApiKey(apiKeyId);
      if (!apiKeyFromServer) return false;

      const hasAccessToEnvironment = await hasUserEnvironmentAccess(userId, apiKeyFromServer.environmentId);
      if (!hasAccessToEnvironment) return false;

      return true;
    },

    [`canUserAccessApiKey-${userId}-${apiKeyId}`],
    { revalidate: SERVICES_REVALIDATION_INTERVAL, tags: [apiKeyCache.tag.byId(apiKeyId)] }
  )();
