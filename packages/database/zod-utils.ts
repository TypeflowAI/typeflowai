import z from "zod";

export { ZProductStyling } from "@typeflowai/types/styling";
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
  ZWorkflowInlineTriggers,
} from "@typeflowai/types/workflows";

export { ZSegmentFilters } from "@typeflowai/types/segment";
export { ZTeamBilling } from "@typeflowai/types/teams";
export { ZLanguages } from "@typeflowai/types/product";
export { ZUserNotificationSettings } from "@typeflowai/types/user";
