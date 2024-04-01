import { z } from "zod";

import { ZAllowedFileExtension, ZColor, ZPlacement } from "./common";
import { OpenAIModel } from "./openai";
import { TPerson } from "./people";
import { ZPromptAttributes } from "./prompt";

export const ZWorkflowThankYouCard = z.object({
  enabled: z.boolean(),
  headline: z.optional(z.string()),
  subheader: z.optional(z.string()),
});

export enum TWorkflowQuestionType {
  FileUpload = "fileUpload",
  OpenText = "openText",
  MultipleChoiceSingle = "multipleChoiceSingle",
  MultipleChoiceMulti = "multipleChoiceMulti",
  NPS = "nps",
  CTA = "cta",
  Rating = "rating",
  Consent = "consent",
  PictureSelection = "pictureSelection",
  Cal = "cal",
  Date = "date",
}

export const ZWorkflowWelcomeCard = z.object({
  enabled: z.boolean(),
  headline: z.optional(z.string()),
  html: z.string().optional(),
  fileUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
  timeToFinish: z.boolean().default(true),
  showResponseCount: z.boolean().default(false),
});

export const ZWorkflowPrompt = z.object({
  enabled: z.boolean(),
  id: z.string(),
  description: z.string().optional(),
  message: z.string().optional(),
  attributes: ZPromptAttributes.default({}),
  isVisible: z.boolean().default(true),
  engine: z.nativeEnum(OpenAIModel).default(OpenAIModel.GPT35Turbo),
});

export const ZWorkflowHiddenFields = z.object({
  enabled: z.boolean(),
  fieldIds: z.optional(z.array(z.string())),
});

export const ZWorkflowProductOverwrites = z.object({
  brandColor: ZColor.nullish(),
  highlightBorderColor: ZColor.nullish(),
  placement: ZPlacement.nullish(),
  clickOutsideClose: z.boolean().nullish(),
  darkOverlay: z.boolean().nullish(),
});

export type TWorkflowProductOverwrites = z.infer<typeof ZWorkflowProductOverwrites>;

export const ZWorkflowBackgroundBgType = z.enum(["animation", "color", "image"]);

export type TWorkflowBackgroundBgType = z.infer<typeof ZWorkflowBackgroundBgType>;

export const ZWorkflowStylingBackground = z.object({
  bg: z.string().nullish(),
  bgType: z.enum(["animation", "color", "image"]).nullish(),
  brightness: z.number().nullish(),
});

export type TWorkflowStylingBackground = z.infer<typeof ZWorkflowStylingBackground>;

export const ZWorkflowStyling = z.object({
  background: ZWorkflowStylingBackground.nullish(),
});

export type TWorkflowStyling = z.infer<typeof ZWorkflowStyling>;

export const ZWorkflowClosedMessage = z
  .object({
    enabled: z.boolean().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
  })
  .nullable()
  .optional();

export const ZWorkflowSingleUse = z
  .object({
    enabled: z.boolean(),
    heading: z.optional(z.string()),
    subheading: z.optional(z.string()),
    isEncrypted: z.boolean(),
  })
  .nullable();

export type TWorkflowSingleUse = z.infer<typeof ZWorkflowSingleUse>;

export const ZWorkflowVerifyEmail = z
  .object({
    name: z.optional(z.string()),
    subheading: z.optional(z.string()),
  })
  .optional();

export type TWorkflowVerifyEmail = z.infer<typeof ZWorkflowVerifyEmail>;

export type TWorkflowWelcomeCard = z.infer<typeof ZWorkflowWelcomeCard>;

export type TWorkflowPrompt = z.infer<typeof ZWorkflowPrompt>;

export type TWorkflowThankYouCard = z.infer<typeof ZWorkflowThankYouCard>;

export type TWorkflowHiddenFields = z.infer<typeof ZWorkflowHiddenFields>;

export type TWorkflowClosedMessage = z.infer<typeof ZWorkflowClosedMessage>;

export const ZWorkflowChoice = z.object({
  id: z.string(),
  label: z.string(),
});

export const ZWorkflowPictureChoice = z.object({
  id: z.string(),
  imageUrl: z.string(),
});

export type TWorkflowChoice = z.infer<typeof ZWorkflowChoice>;

export const ZWorkflowLogicCondition = z.enum([
  "accepted",
  "clicked",
  "submitted",
  "skipped",
  "equals",
  "notEquals",
  "lessThan",
  "lessEqual",
  "greaterThan",
  "greaterEqual",
  "includesAll",
  "includesOne",
  "uploaded",
  "notUploaded",
  "booked",
]);

export type TWorkflowLogicCondition = z.infer<typeof ZWorkflowLogicCondition>;

export const ZWorkflowLogicBase = z.object({
  condition: ZWorkflowLogicCondition.optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  destination: z.union([z.string(), z.literal("end")]).optional(),
});

export const ZWorkflowFileUploadLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["uploaded", "notUploaded"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowOpenTextLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowConsentLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["skipped", "accepted"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowMultipleChoiceSingleLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped", "equals", "notEquals"]).optional(),
  value: z.string().optional(),
});

export const ZWorkflowMultipleChoiceMultiLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped", "includesAll", "includesOne", "equals"]).optional(),
  value: z.union([z.array(z.string()), z.string()]).optional(),
});

export const ZWorkflowNPSLogic = ZWorkflowLogicBase.extend({
  condition: z
    .enum([
      "equals",
      "notEquals",
      "lessThan",
      "lessEqual",
      "greaterThan",
      "greaterEqual",
      "submitted",
      "skipped",
    ])
    .optional(),
  value: z.union([z.string(), z.number()]).optional(),
});

const ZWorkflowCTALogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["clicked", "submitted", "skipped"]).optional(),
  value: z.undefined(),
});

const ZWorkflowRatingLogic = ZWorkflowLogicBase.extend({
  condition: z
    .enum([
      "equals",
      "notEquals",
      "lessThan",
      "lessEqual",
      "greaterThan",
      "greaterEqual",
      "submitted",
      "skipped",
    ])
    .optional(),
  value: z.union([z.string(), z.number()]).optional(),
});

const ZWorkflowPictureSelectionLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped"]).optional(),
  value: z.undefined(),
});

const ZWorkflowCalLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["booked", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowLogic = z.union([
  ZWorkflowOpenTextLogic,
  ZWorkflowConsentLogic,
  ZWorkflowMultipleChoiceSingleLogic,
  ZWorkflowMultipleChoiceMultiLogic,
  ZWorkflowNPSLogic,
  ZWorkflowCTALogic,
  ZWorkflowRatingLogic,
  ZWorkflowPictureSelectionLogic,
  ZWorkflowFileUploadLogic,
  ZWorkflowCalLogic,
]);

export type TWorkflowLogic = z.infer<typeof ZWorkflowLogic>;

const ZWorkflowQuestionBase = z.object({
  id: z.string(),
  type: z.string(),
  headline: z.string(),
  subheader: z.string().optional(),
  imageUrl: z.string().optional(),
  required: z.boolean(),
  buttonLabel: z.string().optional(),
  backButtonLabel: z.string().optional(),
  scale: z.enum(["number", "smiley", "star"]).optional(),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]).optional(),
  logic: z.array(ZWorkflowLogic).optional(),
  isDraft: z.boolean().optional(),
});

export const ZWorkflowOpenTextQuestionInputType = z.enum(["text", "email", "url", "number", "phone"]);
export type TWorkflowOpenTextQuestionInputType = z.infer<typeof ZWorkflowOpenTextQuestionInputType>;

export const ZWorkflowOpenTextQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.OpenText),
  placeholder: z.string().optional(),
  longAnswer: z.boolean().optional(),
  logic: z.array(ZWorkflowOpenTextLogic).optional(),
  inputType: ZWorkflowOpenTextQuestionInputType.optional().default("text"),
});

export type TWorkflowOpenTextQuestion = z.infer<typeof ZWorkflowOpenTextQuestion>;

export const ZWorkflowConsentQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Consent),
  html: z.string().optional(),
  label: z.string(),
  dismissButtonLabel: z.string().optional(),
  placeholder: z.string().optional(),
  logic: z.array(ZWorkflowConsentLogic).optional(),
});

export type TWorkflowConsentQuestion = z.infer<typeof ZWorkflowConsentQuestion>;

export const ZWorkflowMultipleChoiceSingleQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceSingle),
  choices: z.array(ZWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceSingleLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
});

export type TWorkflowMultipleChoiceSingleQuestion = z.infer<typeof ZWorkflowMultipleChoiceSingleQuestion>;

export const ZWorkflowMultipleChoiceMultiQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceMulti),
  choices: z.array(ZWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceMultiLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
});

export type TWorkflowMultipleChoiceMultiQuestion = z.infer<typeof ZWorkflowMultipleChoiceMultiQuestion>;

export const ZWorkflowNPSQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.NPS),
  lowerLabel: z.string(),
  upperLabel: z.string(),
  logic: z.array(ZWorkflowNPSLogic).optional(),
});

export type TWorkflowNPSQuestion = z.infer<typeof ZWorkflowNPSQuestion>;

export const ZWorkflowCTAQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.CTA),
  html: z.string().optional(),
  buttonUrl: z.string().optional(),
  buttonExternal: z.boolean(),
  dismissButtonLabel: z.string().optional(),
  logic: z.array(ZWorkflowCTALogic).optional(),
});

export type TWorkflowCTAQuestion = z.infer<typeof ZWorkflowCTAQuestion>;

// export const ZWorkflowWelcomeQuestion = ZWorkflowQuestionBase.extend({
//   type: z.literal(TWorkflowQuestionType.Welcome),
//   html: z.string().optional(),
//   fileUrl: z.string().optional(),
//   buttonUrl: z.string().optional(),
//   timeToFinish: z.boolean().default(false),
//   logic: z.array(ZWorkflowCTALogic).optional(),
// });

// export type TWorkflowWelcomeQuestion = z.infer<typeof ZWorkflowWelcomeQuestion>;

export const ZWorkflowRatingQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Rating),
  scale: z.enum(["number", "smiley", "star"]),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]),
  lowerLabel: z.string(),
  upperLabel: z.string(),
  logic: z.array(ZWorkflowRatingLogic).optional(),
});

export const ZWorkflowDateQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Date),
  html: z.string().optional(),
  format: z.enum(["M-d-y", "d-M-y", "y-M-d"]),
});

export type TWorkflowDateQuestion = z.infer<typeof ZWorkflowDateQuestion>;

export type TWorkflowRatingQuestion = z.infer<typeof ZWorkflowRatingQuestion>;

export const ZWorkflowPictureSelectionQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.PictureSelection),
  allowMulti: z.boolean().optional().default(false),
  choices: z.array(ZWorkflowPictureChoice),
  logic: z.array(ZWorkflowPictureSelectionLogic).optional(),
});

export type TWorkflowPictureSelectionQuestion = z.infer<typeof ZWorkflowPictureSelectionQuestion>;

export const ZWorkflowFileUploadQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.FileUpload),
  allowMultipleFiles: z.boolean(),
  maxSizeInMB: z.number().optional(),
  allowedFileExtensions: z.array(ZAllowedFileExtension).optional(),
  logic: z.array(ZWorkflowFileUploadLogic).optional(),
});

export type TWorkflowFileUploadQuestion = z.infer<typeof ZWorkflowFileUploadQuestion>;

export const ZWorkflowCalQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Cal),
  calUserName: z.string(),
  logic: z.array(ZWorkflowCalLogic).optional(),
});

export type TWorkflowCalQuestion = z.infer<typeof ZWorkflowCalQuestion>;

export const ZWorkflowQuestion = z.union([
  ZWorkflowOpenTextQuestion,
  ZWorkflowConsentQuestion,
  ZWorkflowMultipleChoiceSingleQuestion,
  ZWorkflowMultipleChoiceMultiQuestion,
  ZWorkflowNPSQuestion,
  ZWorkflowCTAQuestion,
  ZWorkflowRatingQuestion,
  ZWorkflowPictureSelectionQuestion,
  ZWorkflowDateQuestion,
  ZWorkflowFileUploadQuestion,
  ZWorkflowCalQuestion,
]);

export type TWorkflowQuestion = z.infer<typeof ZWorkflowQuestion>;

export const ZWorkflowQuestions = z.array(ZWorkflowQuestion);

export type TWorkflowQuestions = z.infer<typeof ZWorkflowQuestions>;

export const ZWorkflowAttributeFilter = z.object({
  attributeClassId: z.string().cuid2(),
  condition: z.enum(["equals", "notEquals"]),
  value: z.string(),
});

export type TWorkflowAttributeFilter = z.infer<typeof ZWorkflowAttributeFilter>;

const ZWorkflowDisplayOption = z.enum(["displayOnce", "displayMultiple", "respondMultiple"]);

export type TWorkflowDisplayOption = z.infer<typeof ZWorkflowDisplayOption>;

const ZWorkflowType = z.enum(["web", "email", "link", "mobile"]);

export type TWorkflowType = z.infer<typeof ZWorkflowType>;

const ZWorkflowStatus = z.enum(["draft", "inProgress", "paused", "completed"]);

export type TWorkflowStatus = z.infer<typeof ZWorkflowStatus>;

export const ZWorkflow = z.object({
  id: z.string().cuid2(),

  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  type: ZWorkflowType,
  environmentId: z.string(),
  status: ZWorkflowStatus,
  attributeFilters: z.array(ZWorkflowAttributeFilter),
  displayOption: ZWorkflowDisplayOption,
  autoClose: z.number().nullable(),
  triggers: z.array(z.string()),
  icon: z.string().nullable().optional(),
  redirectUrl: z.string().url().nullable(),
  recontactDays: z.number().nullable(),
  welcomeCard: ZWorkflowWelcomeCard,
  questions: ZWorkflowQuestions,
  prompt: ZWorkflowPrompt,
  thankYouCard: ZWorkflowThankYouCard,
  hiddenFields: ZWorkflowHiddenFields,
  delay: z.number(),
  autoComplete: z.number().nullable(),
  closeOnDate: z.date().nullable(),
  productOverwrites: ZWorkflowProductOverwrites.nullable(),
  styling: ZWorkflowStyling.nullable(),
  workflowClosedMessage: ZWorkflowClosedMessage.nullable(),
  singleUse: ZWorkflowSingleUse.nullable(),
  verifyEmail: ZWorkflowVerifyEmail.nullable(),
  pin: z.string().nullable().optional(),
  resultShareKey: z.string().nullable(),
});

export const ZWorkflowInput = z.object({
  name: z.string(),
  type: ZWorkflowType.optional(),
  status: ZWorkflowStatus.optional(),
  displayOption: ZWorkflowDisplayOption.optional(),
  autoClose: z.number().optional(),
  icon: z.string().nullable().optional(),
  redirectUrl: z.string().url().optional(),
  recontactDays: z.number().optional(),
  welcomeCard: ZWorkflowWelcomeCard.optional(),
  questions: ZWorkflowQuestions.optional(),
  prompt: ZWorkflowPrompt.optional(),
  thankYouCard: ZWorkflowThankYouCard.optional(),
  hiddenFields: ZWorkflowHiddenFields,
  delay: z.number().optional(),
  autoComplete: z.number().optional(),
  closeOnDate: z.date().optional(),
  workflowClosedMessage: ZWorkflowClosedMessage.optional(),
  verifyEmail: ZWorkflowVerifyEmail.optional(),
  attributeFilters: z.array(ZWorkflowAttributeFilter).optional(),
  triggers: z.array(z.string()).optional(),
});

export type TWorkflow = z.infer<typeof ZWorkflow>;
export type TWorkflowDates = {
  createdAt: TWorkflow["createdAt"];
  updatedAt: TWorkflow["updatedAt"];
  closeOnDate: TWorkflow["closeOnDate"];
};
export type TWorkflowInput = z.infer<typeof ZWorkflowInput>;

export const ZWorkflowTWorkflowQuestionType = z.union([
  z.literal("fileUpload"),
  z.literal("openText"),
  z.literal("multipleChoiceSingle"),
  z.literal("multipleChoiceMulti"),
  z.literal("nps"),
  z.literal("cta"),
  z.literal("rating"),
  z.literal("consent"),
  z.literal("pictureSelection"),
  z.literal("cal"),
  z.literal("date"),
]);

export type TWorkflowTWorkflowQuestionType = z.infer<typeof ZWorkflowTWorkflowQuestionType>;

export interface TWorkflowQuestionSummary<T> {
  question: T;
  responses: {
    id: string;
    value: string | number | string[];
    updatedAt: Date;
    person: TPerson | null;
  }[];
}
