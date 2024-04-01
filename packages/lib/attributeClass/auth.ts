import "server-only";

import { unstable_cache } from "next/cache";

import { ZId } from "@typeflowai/types/environment";
import { ZUuid } from "@typeflowai/types/user";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { hasUserEnvironmentAccess } from "../environment/auth";
import { validateInputs } from "../utils/validate";
import { getAttributeClass } from "./service";

export const canUserAccessAttributeClass = async (
  userId: string,
  attributeClassId: string
): Promise<boolean> =>
  await unstable_cache(
    async () => {
      validateInputs([userId, ZUuid], [attributeClassId, ZId]);
      if (!userId) return false;

      const attributeClass = await getAttributeClass(attributeClassId);
      if (!attributeClass) return false;

      const hasAccessToEnvironment = await hasUserEnvironmentAccess(userId, attributeClass.environmentId);
      if (!hasAccessToEnvironment) return false;

      return true;
    },

    [`users-${userId}-attributeClasses-${attributeClassId}`],
    { revalidate: SERVICES_REVALIDATION_INTERVAL, tags: [`attributeClasses-${attributeClassId}`] }
  )();
