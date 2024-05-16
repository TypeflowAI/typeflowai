import cuid2 from "@paralleldrive/cuid2";

import { ENCRYPTION_KEY, TYPEFLOWAI_ENCRYPTION_KEY } from "@typeflowai/lib/constants";
import { decryptAES128, symmetricDecrypt, symmetricEncrypt } from "@typeflowai/lib/crypto";

// generate encrypted single use id for the workflow
export const generateWorkflowSingleUseId = (isEncrypted: boolean): string => {
  const cuid = cuid2.createId();
  if (!isEncrypted) {
    return cuid;
  }

  const encryptedCuid = symmetricEncrypt(cuid, ENCRYPTION_KEY);
  return encryptedCuid;
};

// validate the workflow single use id
export const validateWorkflowSingleUseId = (workflowSingleUseId: string): string | undefined => {
  try {
    let decryptedCuid: string | null = null;

    if (workflowSingleUseId.length === 64) {
      if (!TYPEFLOWAI_ENCRYPTION_KEY) {
        throw new Error("TYPEFLOWAI_ENCRYPTION_KEY is not defined");
      }

      decryptedCuid = decryptAES128(TYPEFLOWAI_ENCRYPTION_KEY!, workflowSingleUseId);
    } else {
      decryptedCuid = symmetricDecrypt(workflowSingleUseId, ENCRYPTION_KEY);
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
