import { verifyTokenForLinkWorkflow } from "@typeflowai/lib/jwt";

interface emailVerificationDetails {
  status: "not-verified" | "verified" | "fishy";
  email?: string;
}

export const getEmailVerificationDetails = async (
  workflowId: string,
  token: string
): Promise<emailVerificationDetails> => {
  if (!token) {
    return { status: "not-verified" };
  } else {
    try {
      const verifiedEmail = await verifyTokenForLinkWorkflow(token, workflowId);
      if (verifiedEmail) {
        return { status: "verified", email: verifiedEmail };
      } else {
        return { status: "fishy" };
      }
    } catch (error) {
      return { status: "not-verified" };
    }
  }
};
