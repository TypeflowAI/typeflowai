import { TActionClassNoCodeConfig } from "@typeflowai/types/actionClasses";
import { TIntegrationConfig } from "@typeflowai/types/integration";
import { TProductStyling } from "@typeflowai/types/product";
import { TResponseData, TResponseMeta, TResponsePersonAttributes } from "@typeflowai/types/responses";
import { TBaseFilters } from "@typeflowai/types/segment";
import { TTeamBilling } from "@typeflowai/types/teams";
import { TUserNotificationSettings } from "@typeflowai/types/user";
import {
  TWorkflowClosedMessage,
  TWorkflowHiddenFields,
  TWorkflowProductOverwrites,
  TWorkflowQuestions,
  TWorkflowSingleUse,
  TWorkflowStyling,
  TWorkflowThankYouCard,
  TWorkflowVerifyEmail,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

declare global {
  namespace PrismaJson {
    export type ActionProperties = { [key: string]: string };
    export type ActionClassNoCodeConfig = TActionClassNoCodeConfig;
    export type IntegrationConfig = TIntegrationConfig;
    export type ResponseData = TResponseData;
    export type ResponseMeta = TResponseMeta;
    export type ResponsePersonAttributes = TResponsePersonAttributes;
    export type welcomeCard = TWorkflowWelcomeCard;
    export type WorkflowQuestions = TWorkflowQuestions;
    export type WorkflowThankYouCard = TWorkflowThankYouCard;
    export type WorkflowHiddenFields = TWorkflowHiddenFields;
    export type WorkflowProductOverwrites = TWorkflowProductOverwrites;
    export type WorkflowStyling = TWorkflowStyling;
    export type WorkflowClosedMessage = TWorkflowClosedMessage;
    export type WorkflowSingleUse = TWorkflowSingleUse;
    export type WorkflowVerifyEmail = TWorkflowVerifyEmail;
    export type TeamBilling = TTeamBilling;
    export type UserNotificationSettings = TUserNotificationSettings;
    export type SegmentFilter = TBaseFilters;
    export type Styling = TProductStyling;
  }
}
