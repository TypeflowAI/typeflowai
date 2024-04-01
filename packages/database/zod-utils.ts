import z from "zod";

export const ZActionProperties = z.record(z.string());
export { ZActionClassNoCodeConfig } from "@typeflowai/types/actionClasses";
export { ZIntegrationConfig } from "@typeflowai/types/integration";

export {
  ZResponseData,
  ZResponsePersonAttributes,
  ZResponseMeta,
  ZResponseTtc,
} from "@typeflowai/types/responses";

export {
  ZWorkflowWelcomeCard,
  ZWorkflowQuestions,
  ZWorkflowPrompt,
  ZWorkflowThankYouCard,
  ZWorkflowHiddenFields,
  ZWorkflowClosedMessage,
  ZWorkflowProductOverwrites,
  ZWorkflowStyling,
  ZWorkflowVerifyEmail,
  ZWorkflowSingleUse,
} from "@typeflowai/types/workflows";

export { ZTeamBilling } from "@typeflowai/types/teams";
export { ZUserNotificationSettings } from "@typeflowai/types/user";
