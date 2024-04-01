import { verifyTokenForLinkWorkflow } from "@typeflowai/lib/jwt";

export const getEmailVerificationStatus = async (
  workflowId: string,
  token: string
): Promise<"verified" | "not-verified" | "fishy"> => {
  if (!token) {
    return "not-verified";
  } else {
    try {
      const validateToken = await verifyTokenForLinkWorkflow(token, workflowId);
      if (validateToken) {
        return "verified";
      } else {
        return "fishy";
      }
    } catch (error) {
      return "not-verified";
    }
  }
};
