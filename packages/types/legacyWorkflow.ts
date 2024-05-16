import { z } from "zod";

import { ZAllowedFileExtension } from "./common";
import {
  TWorkflowQuestionType,
  ZWorkflow,
  ZWorkflowCTALogic,
  ZWorkflowCalLogic,
  ZWorkflowConsentLogic,
  ZWorkflowFileUploadLogic,
  ZWorkflowMultipleChoiceMultiLogic,
  ZWorkflowMultipleChoiceSingleLogic,
  ZWorkflowNPSLogic,
  ZWorkflowOpenTextLogic,
  ZWorkflowOpenTextQuestionInputType,
  ZWorkflowPictureChoice,
  ZWorkflowPictureSelectionLogic,
  ZWorkflowQuestionBase,
  ZWorkflowRatingLogic,
} from "./workflows";

const ZLegacyWorkflowQuestionBase = ZWorkflowQuestionBase.extend({
  headline: z.string(),
  subheader: z.string().optional(),
  buttonLabel: z.string().optional(),
  backButtonLabel: z.string().optional(),
});

export const ZLegacyWorkflowOpenTextQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.OpenText),
  placeholder: z.string().optional(),
  longAnswer: z.boolean().optional(),
  logic: z.array(ZWorkflowOpenTextLogic).optional(),
  inputType: ZWorkflowOpenTextQuestionInputType.optional().default("text"),
});

export type TLegacyWorkflowOpenTextQuestion = z.infer<typeof ZLegacyWorkflowOpenTextQuestion>;

export const ZLegacyWorkflowConsentQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Consent),
  html: z.string().optional(),
  label: z.string(),
  placeholder: z.string().optional(),
  logic: z.array(ZWorkflowConsentLogic).optional(),
});

export type TLegacyWorkflowConsentQuestion = z.infer<typeof ZLegacyWorkflowConsentQuestion>;

export const ZLegacyWorkflowChoice = z.object({
  id: z.string(),
  label: z.string(),
});

export type TLegacyWorkflowChoice = z.infer<typeof ZLegacyWorkflowChoice>;

export const ZLegacyWorkflowMultipleChoiceSingleQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceSingle),
  choices: z.array(ZLegacyWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceSingleLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
  otherOptionPlaceholder: z.string().optional(),
});

export type TLegacyWorkflowMultipleChoiceSingleQuestion = z.infer<
  typeof ZLegacyWorkflowMultipleChoiceSingleQuestion
>;

export const ZLegacyWorkflowMultipleChoiceMultiQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceMulti),
  choices: z.array(ZLegacyWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceMultiLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
  otherOptionPlaceholder: z.string().optional(),
});

export type TLegacyWorkflowMultipleChoiceMultiQuestion = z.infer<
  typeof ZLegacyWorkflowMultipleChoiceMultiQuestion
>;

export const ZLegacyWorkflowNPSQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.NPS),
  lowerLabel: z.string(),
  upperLabel: z.string(),
  logic: z.array(ZWorkflowNPSLogic).optional(),
});

export type TLegacyWorkflowNPSQuestion = z.infer<typeof ZLegacyWorkflowNPSQuestion>;

export const ZLegacyWorkflowCTAQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.CTA),
  html: z.string().optional(),
  buttonUrl: z.string().optional(),
  buttonExternal: z.boolean(),
  dismissButtonLabel: z.string().optional(),
  logic: z.array(ZWorkflowCTALogic).optional(),
});

export type TLegacyWorkflowCTAQuestion = z.infer<typeof ZLegacyWorkflowCTAQuestion>;

export const ZLegacyWorkflowRatingQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Rating),
  scale: z.enum(["number", "smiley", "star"]),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]),
  lowerLabel: z.string(),
  upperLabel: z.string(),
  logic: z.array(ZWorkflowRatingLogic).optional(),
});

export const ZLegacyWorkflowDateQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Date),
  html: z.string().optional(),
  format: z.enum(["M-d-y", "d-M-y", "y-M-d"]),
});

export type TLegacyWorkflowDateQuestion = z.infer<typeof ZLegacyWorkflowDateQuestion>;

export type TLegacyWorkflowRatingQuestion = z.infer<typeof ZLegacyWorkflowRatingQuestion>;

export const ZLegacyWorkflowPictureSelectionQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.PictureSelection),
  allowMulti: z.boolean().optional().default(false),
  choices: z.array(ZWorkflowPictureChoice),
  logic: z.array(ZWorkflowPictureSelectionLogic).optional(),
});

export type TLegacyWorkflowPictureSelectionQuestion = z.infer<typeof ZLegacyWorkflowPictureSelectionQuestion>;

export const ZLegacyWorkflowFileUploadQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.FileUpload),
  allowMultipleFiles: z.boolean(),
  maxSizeInMB: z.number().optional(),
  allowedFileExtensions: z.array(ZAllowedFileExtension).optional(),
  logic: z.array(ZWorkflowFileUploadLogic).optional(),
});

export type TLegacyWorkflowFileUploadQuestion = z.infer<typeof ZLegacyWorkflowFileUploadQuestion>;

export const ZLegacyWorkflowCalQuestion = ZLegacyWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.Cal),
  calUserName: z.string(),
  logic: z.array(ZWorkflowCalLogic).optional(),
});

export type TLegacyWorkflowCalQuestion = z.infer<typeof ZLegacyWorkflowCalQuestion>;

export const ZLegacyWorkflowQuestion = z.union([
  ZLegacyWorkflowOpenTextQuestion,
  ZLegacyWorkflowConsentQuestion,
  ZLegacyWorkflowMultipleChoiceSingleQuestion,
  ZLegacyWorkflowMultipleChoiceMultiQuestion,
  ZLegacyWorkflowNPSQuestion,
  ZLegacyWorkflowCTAQuestion,
  ZLegacyWorkflowRatingQuestion,
  ZLegacyWorkflowPictureSelectionQuestion,
  ZLegacyWorkflowDateQuestion,
  ZLegacyWorkflowFileUploadQuestion,
  ZLegacyWorkflowCalQuestion,
]);

export const ZLegacyWorkflowThankYouCard = z.object({
  enabled: z.boolean(),
  headline: z.string().optional(),
  subheader: z.string().optional(),
  buttonLabel: z.optional(z.string()),
  buttonLink: z.optional(z.string()),
  imageUrl: z.string().optional(),
});

export type TLegacyWorkflowThankYouCard = z.infer<typeof ZLegacyWorkflowThankYouCard>;

export const ZLegacyWorkflowWelcomeCard = z.object({
  enabled: z.boolean(),
  headline: z.string(),
  html: z.string().optional(),
  fileUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
  timeToFinish: z.boolean().default(true),
  showResponseCount: z.boolean().default(false),
});

export type TLegacyWorkflowWelcomeCard = z.infer<typeof ZLegacyWorkflowWelcomeCard>;

export type TLegacyWorkflowQuestion = z.infer<typeof ZLegacyWorkflowQuestion>;

export const ZLegacyWorkflowQuestions = z.array(ZLegacyWorkflowQuestion);

export const ZLegacyWorkflow = ZWorkflow.extend({
  questions: ZLegacyWorkflowQuestions,
  thankYouCard: ZLegacyWorkflowThankYouCard,
  welcomeCard: ZLegacyWorkflowWelcomeCard,
});

export type TLegacyWorkflow = z.infer<typeof ZLegacyWorkflow>;
