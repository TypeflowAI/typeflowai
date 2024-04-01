import cuid2 from "@paralleldrive/cuid2";

import { decryptAES128, symmetricDecrypt, symmetricEncrypt } from "@typeflowai/lib/crypto";
import { env } from "@typeflowai/lib/env.mjs";

// generate encrypted single use id for the workflow
export const generateWorkflowSingleUseId = (isEncrypted: boolean): string => {
  const cuid = cuid2.createId();
  if (!isEncrypted) {
    return cuid;
  }

  const encryptedCuid = symmetricEncrypt(cuid, env.ENCRYPTION_KEY);
  return encryptedCuid;
};

// validate the workflow single use id
export const validateWorkflowSingleUseId = (workflowSingleUseId: string): string | undefined => {
  try {
    let decryptedCuid: string | null = null;

    if (workflowSingleUseId.length === 64) {
      if (!env.TYPEFLOWAI_ENCRYPTION_KEY) {
        throw new Error("TYPEFLOWAI_ENCRYPTION_KEY is not defined");
      }

      decryptedCuid = decryptAES128(env.TYPEFLOWAI_ENCRYPTION_KEY!, workflowSingleUseId);
    } else {
      decryptedCuid = symmetricDecrypt(workflowSingleUseId, env.ENCRYPTION_KEY);
    }

    if (cuid2.isCuid(decryptedCuid)) {
      return decryptedCuid;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};
