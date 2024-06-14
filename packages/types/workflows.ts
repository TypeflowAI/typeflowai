import { z } from "zod";
import { ZActionClass, ZNoCodeConfig } from "./actionClasses";
import { ZAttributes } from "./attributes";
import { ZAllowedFileExtension, ZColor, ZPlacement } from "./common";
import { ZId } from "./environment";
import { OpenAIModel } from "./openai";
import { ZLanguage } from "./product";
import { ZPromptAttributes } from "./prompt";
import { ZSegment } from "./segment";
import { ZBaseStyling } from "./styling";

export const ZI18nString = z.record(z.string()).refine((obj) => "default" in obj, {
  message: "Object must have a 'default' key",
});

export type TI18nString = z.infer<typeof ZI18nString>;

export const ZWorkflowThankYouCard = z.object({
  enabled: z.boolean(),
  headline: ZI18nString.optional(),
  subheader: ZI18nString.optional(),
  buttonLabel: ZI18nString.optional(),
  buttonLink: z.optional(z.string()),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export enum TWorkflowQuestionTypeEnum {
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
  Matrix = "matrix",
  Address = "address",
}

export const ZWorkflowWelcomeCard = z
  .object({
    enabled: z.boolean(),
    headline: ZI18nString.optional(),
    html: ZI18nString.optional(),
    fileUrl: z.string().optional(),
    buttonLabel: ZI18nString.optional(),
    timeToFinish: z.boolean().default(true),
    showResponseCount: z.boolean().default(false),
    videoUrl: z.string().optional(),
  })
  .refine((schema) => !(schema.enabled && !schema.headline), {
    message: "Welcome card must have a headline",
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

export const ZWorkflowBackgroundBgType = z.enum(["animation", "color", "upload", "image"]);

export type TWorkflowBackgroundBgType = z.infer<typeof ZWorkflowBackgroundBgType>;

export const ZWorkflowStyling = ZBaseStyling.extend({
  overwriteThemeStyling: z.boolean().nullish(),
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
  label: ZI18nString,
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
  "isCompletelySubmitted",
  "isPartiallySubmitted",
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

export const ZWorkflowAddressLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowConsentLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["skipped", "accepted"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowMultipleChoiceLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped", "equals", "notEquals", "includesOne", "includesAll"]).optional(),
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

export const ZWorkflowCTALogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["clicked", "submitted", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowRatingLogic = ZWorkflowLogicBase.extend({
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

export const ZWorkflowPictureSelectionLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["submitted", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowCalLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["booked", "skipped"]).optional(),
  value: z.undefined(),
});

const ZWorkflowMatrixLogic = ZWorkflowLogicBase.extend({
  condition: z.enum(["isCompletelySubmitted", "isPartiallySubmitted", "skipped"]).optional(),
  value: z.undefined(),
});

export const ZWorkflowLogic = z.union([
  ZWorkflowOpenTextLogic,
  ZWorkflowConsentLogic,
  ZWorkflowMultipleChoiceLogic,
  ZWorkflowNPSLogic,
  ZWorkflowCTALogic,
  ZWorkflowRatingLogic,
  ZWorkflowPictureSelectionLogic,
  ZWorkflowFileUploadLogic,
  ZWorkflowCalLogic,
  ZWorkflowMatrixLogic,
  ZWorkflowAddressLogic,
]);

export type TWorkflowLogic = z.infer<typeof ZWorkflowLogic>;

export const ZWorkflowQuestionBase = z.object({
  id: z.string(),
  type: z.string(),
  headline: ZI18nString,
  subheader: ZI18nString.optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  required: z.boolean(),
  buttonLabel: ZI18nString.optional(),
  backButtonLabel: ZI18nString.optional(),
  scale: z.enum(["number", "smiley", "star"]).optional(),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]).optional(),
  logic: z.array(ZWorkflowLogic).optional(),
  isDraft: z.boolean().optional(),
});

export const ZWorkflowOpenTextQuestionInputType = z.enum(["text", "email", "url", "number", "phone"]);
export type TWorkflowOpenTextQuestionInputType = z.infer<typeof ZWorkflowOpenTextQuestionInputType>;

export const ZWorkflowOpenTextQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.OpenText),
  placeholder: ZI18nString.optional(),
  longAnswer: z.boolean().optional(),
  logic: z.array(ZWorkflowOpenTextLogic).optional(),
  inputType: ZWorkflowOpenTextQuestionInputType.optional().default("text"),
});

export type TWorkflowOpenTextQuestion = z.infer<typeof ZWorkflowOpenTextQuestion>;

export const ZWorkflowConsentQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Consent),
  html: ZI18nString.optional(),
  label: ZI18nString,
  placeholder: z.string().optional(),
  logic: z.array(ZWorkflowConsentLogic).optional(),
});

export type TWorkflowConsentQuestion = z.infer<typeof ZWorkflowConsentQuestion>;

export const ZShuffleOption = z.enum(["none", "all", "exceptLast"]);

export type TShuffleOption = z.infer<typeof ZShuffleOption>;

export const ZWorkflowMultipleChoiceQuestion = ZWorkflowQuestionBase.extend({
  type: z.union([
    z.literal(TWorkflowQuestionTypeEnum.MultipleChoiceSingle),
    z.literal(TWorkflowQuestionTypeEnum.MultipleChoiceMulti),
  ]),
  choices: z.array(ZWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceLogic).optional(),
  shuffleOption: ZShuffleOption.optional(),
  otherOptionPlaceholder: ZI18nString.optional(),
}).refine(
  (question) => {
    const { logic, type } = question;

    if (type === TWorkflowQuestionTypeEnum.MultipleChoiceSingle) {
      // The single choice question should not have 'includesAll' logic
      return !logic?.some((l) => l.condition === "includesAll");
    } else {
      // The multi choice question should not have 'notEquals' logic
      return !logic?.some((l) => l.condition === "notEquals");
    }
  },
  {
    message:
      "MultipleChoiceSingle question should not have 'includesAll' logic and MultipleChoiceMulti question should not have 'notEquals' logic",
  }
);

export type TWorkflowMultipleChoiceQuestion = z.infer<typeof ZWorkflowMultipleChoiceQuestion>;

export const ZWorkflowNPSQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.NPS),
  lowerLabel: ZI18nString.optional(),
  upperLabel: ZI18nString.optional(),
  logic: z.array(ZWorkflowNPSLogic).optional(),
});

export type TWorkflowNPSQuestion = z.infer<typeof ZWorkflowNPSQuestion>;

export const ZWorkflowCTAQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.CTA),
  html: ZI18nString.optional(),
  buttonUrl: z.string().optional(),
  buttonExternal: z.boolean(),
  dismissButtonLabel: ZI18nString.optional(),
  logic: z.array(ZWorkflowCTALogic).optional(),
});

export type TWorkflowCTAQuestion = z.infer<typeof ZWorkflowCTAQuestion>;

export const ZWorkflowRatingQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Rating),
  scale: z.enum(["number", "smiley", "star"]),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]),
  lowerLabel: ZI18nString.optional(),
  upperLabel: ZI18nString.optional(),
  logic: z.array(ZWorkflowRatingLogic).optional(),
});

export const ZWorkflowDateQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Date),
  html: ZI18nString.optional(),
  format: z.enum(["M-d-y", "d-M-y", "y-M-d"]),
});

export type TWorkflowDateQuestion = z.infer<typeof ZWorkflowDateQuestion>;

export type TWorkflowRatingQuestion = z.infer<typeof ZWorkflowRatingQuestion>;

export const ZWorkflowPictureSelectionQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.PictureSelection),
  allowMulti: z.boolean().optional().default(false),
  choices: z.array(ZWorkflowPictureChoice),
  logic: z.array(ZWorkflowPictureSelectionLogic).optional(),
});

export type TWorkflowPictureSelectionQuestion = z.infer<typeof ZWorkflowPictureSelectionQuestion>;

export const ZWorkflowFileUploadQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.FileUpload),
  allowMultipleFiles: z.boolean(),
  maxSizeInMB: z.number().optional(),
  allowedFileExtensions: z.array(ZAllowedFileExtension).optional(),
  logic: z.array(ZWorkflowFileUploadLogic).optional(),
});

export type TWorkflowFileUploadQuestion = z.infer<typeof ZWorkflowFileUploadQuestion>;

export const ZWorkflowCalQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Cal),
  calUserName: z.string(),
  logic: z.array(ZWorkflowCalLogic).optional(),
});

export type TWorkflowCalQuestion = z.infer<typeof ZWorkflowCalQuestion>;

export const ZWorkflowMatrixQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Matrix),
  rows: z.array(ZI18nString),
  columns: z.array(ZI18nString),
  logic: z.array(ZWorkflowMatrixLogic).optional(),
});

export type TWorkflowMatrixQuestion = z.infer<typeof ZWorkflowMatrixQuestion>;

export const ZWorkflowAddressQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionTypeEnum.Address),
  isAddressLine1Required: z.boolean().default(false),
  isAddressLine2Required: z.boolean().default(false),
  isCityRequired: z.boolean().default(false),
  isStateRequired: z.boolean().default(false),
  isZipRequired: z.boolean().default(false),
  isCountryRequired: z.boolean().default(false),
});
export type TWorkflowAddressQuestion = z.infer<typeof ZWorkflowAddressQuestion>;

export const ZWorkflowQuestion = z.union([
  ZWorkflowOpenTextQuestion,
  ZWorkflowConsentQuestion,
  ZWorkflowMultipleChoiceQuestion,
  ZWorkflowNPSQuestion,
  ZWorkflowCTAQuestion,
  ZWorkflowRatingQuestion,
  ZWorkflowPictureSelectionQuestion,
  ZWorkflowDateQuestion,
  ZWorkflowFileUploadQuestion,
  ZWorkflowCalQuestion,
  ZWorkflowMatrixQuestion,
  ZWorkflowAddressQuestion,
]);

export type TWorkflowQuestion = z.infer<typeof ZWorkflowQuestion>;

export const ZWorkflowQuestions = z.array(ZWorkflowQuestion);

export type TWorkflowQuestions = z.infer<typeof ZWorkflowQuestions>;

export const ZWorkflowQuestionType = z.enum([
  TWorkflowQuestionTypeEnum.Address,
  TWorkflowQuestionTypeEnum.CTA,
  TWorkflowQuestionTypeEnum.Consent,
  TWorkflowQuestionTypeEnum.Date,
  TWorkflowQuestionTypeEnum.FileUpload,
  TWorkflowQuestionTypeEnum.Matrix,
  TWorkflowQuestionTypeEnum.MultipleChoiceMulti,
  TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
  TWorkflowQuestionTypeEnum.NPS,
  TWorkflowQuestionTypeEnum.OpenText,
  TWorkflowQuestionTypeEnum.PictureSelection,
  TWorkflowQuestionTypeEnum.Rating,
  TWorkflowQuestionTypeEnum.Cal,
]);

export type TWorkflowQuestionType = z.infer<typeof ZWorkflowQuestionType>;

export const ZWorkflowLanguage = z.object({
  language: ZLanguage,
  default: z.boolean(),
  enabled: z.boolean(),
});

export type TWorkflowLanguage = z.infer<typeof ZWorkflowLanguage>;

export const ZWorkflowQuestionsObject = z.object({
  questions: ZWorkflowQuestions,
  hiddenFields: ZWorkflowHiddenFields,
});

export type TWorkflowQuestionsObject = z.infer<typeof ZWorkflowQuestionsObject>;

export const ZWorkflowDisplayOption = z.enum([
  "displayOnce",
  "displayMultiple",
  "respondMultiple",
  "displaySome",
]);

export type TWorkflowDisplayOption = z.infer<typeof ZWorkflowDisplayOption>;

export const ZWorkflowType = z.enum(["link", "app", "website"]);

export type TWorkflowType = z.infer<typeof ZWorkflowType>;

export const ZWorkflowStatus = z.enum(["draft", "scheduled", "inProgress", "paused", "completed"]);

export type TWorkflowStatus = z.infer<typeof ZWorkflowStatus>;

export const ZWorkflowInlineTriggers = z.object({
  codeConfig: z.object({ identifier: z.string() }).optional(),
  noCodeConfig: ZNoCodeConfig.omit({ type: true }).optional(),
});

export type TWorkflowInlineTriggers = z.infer<typeof ZWorkflowInlineTriggers>;

export const ZWorkflow = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  type: ZWorkflowType,
  environmentId: z.string(),
  createdBy: z.string().nullable(),
  status: ZWorkflowStatus,
  displayOption: ZWorkflowDisplayOption,
  autoClose: z.number().nullable(),
  triggers: z.array(z.object({ actionClass: ZActionClass })),
  icon: z.string().nullable().optional(),
  redirectUrl: z.string().url().nullable(),
  recontactDays: z.number().nullable(),
  displayLimit: z.number().nullable(),
  welcomeCard: ZWorkflowWelcomeCard,
  questions: ZWorkflowQuestions,
  prompt: ZWorkflowPrompt,
  thankYouCard: ZWorkflowThankYouCard,
  hiddenFields: ZWorkflowHiddenFields,
  delay: z.number(),
  autoComplete: z.number().nullable(),
  runOnDate: z.date().nullable(),
  closeOnDate: z.date().nullable(),
  productOverwrites: ZWorkflowProductOverwrites.nullable(),
  styling: ZWorkflowStyling.nullable(),
  workflowClosedMessage: ZWorkflowClosedMessage.nullable(),
  segment: ZSegment.nullable(),
  singleUse: ZWorkflowSingleUse.nullable(),
  verifyEmail: ZWorkflowVerifyEmail.nullable(),
  pin: z.string().nullish(),
  resultShareKey: z.string().nullable(),
  displayPercentage: z.number().min(0.01).max(100).nullable(),
  languages: z.array(ZWorkflowLanguage),
});

export const ZWorkflowInput = z.object({
  name: z.string(),
  type: ZWorkflowType.optional(),
  createdBy: z.string().cuid().nullish(),
  status: ZWorkflowStatus.optional(),
  displayOption: ZWorkflowDisplayOption.optional(),
  icon: z.string().nullable().optional(),
  autoClose: z.number().nullish(),
  redirectUrl: z.string().url().nullish(),
  recontactDays: z.number().nullish(),
  welcomeCard: ZWorkflowWelcomeCard.optional(),
  questions: ZWorkflowQuestions.optional(),
  prompt: ZWorkflowPrompt.optional(),
  thankYouCard: ZWorkflowThankYouCard.optional(),
  hiddenFields: ZWorkflowHiddenFields.optional(),
  delay: z.number().optional(),
  autoComplete: z.number().nullish(),
  runOnDate: z.date().nullish(),
  closeOnDate: z.date().nullish(),
  styling: ZWorkflowStyling.optional(),
  workflowClosedMessage: ZWorkflowClosedMessage.nullish(),
  singleUse: ZWorkflowSingleUse.nullish(),
  verifyEmail: ZWorkflowVerifyEmail.optional(),
  pin: z.string().nullish(),
  resultShareKey: z.string().nullish(),
  displayPercentage: z.number().min(0.01).max(100).nullish(),
  triggers: z.array(z.object({ actionClass: ZActionClass })).optional(),
});

export type TWorkflow = z.infer<typeof ZWorkflow>;

export type TWorkflowDates = {
  createdAt: TWorkflow["createdAt"];
  updatedAt: TWorkflow["updatedAt"];
  runOnDate: TWorkflow["runOnDate"];
  closeOnDate: TWorkflow["closeOnDate"];
};

export type TWorkflowInput = z.infer<typeof ZWorkflowInput>;

export type TWorkflowEditorTabs = "questions" | "settings" | "styling";

export const ZWorkflowQuestionSummaryOpenText = z.object({
  type: z.literal("openText"),
  question: ZWorkflowOpenTextQuestion,
  responseCount: z.number(),
  samples: z.array(
    z.object({
      id: z.string(),
      updatedAt: z.date(),
      value: z.string(),
      person: z
        .object({
          id: ZId,
          userId: z.string(),
        })
        .nullable(),
      personAttributes: ZAttributes.nullable(),
    })
  ),
});

export type TWorkflowQuestionSummaryOpenText = z.infer<typeof ZWorkflowQuestionSummaryOpenText>;

export const ZWorkflowQuestionSummaryMultipleChoice = z.object({
  type: z.union([z.literal("multipleChoiceMulti"), z.literal("multipleChoiceSingle")]),
  question: ZWorkflowMultipleChoiceQuestion,
  responseCount: z.number(),
  choices: z.array(
    z.object({
      value: z.string(),
      count: z.number(),
      percentage: z.number(),
      others: z
        .array(
          z.object({
            value: z.string(),
            person: z
              .object({
                id: ZId,
                userId: z.string(),
              })
              .nullable(),
            personAttributes: ZAttributes.nullable(),
          })
        )
        .optional(),
    })
  ),
});

export type TWorkflowQuestionSummaryMultipleChoice = z.infer<typeof ZWorkflowQuestionSummaryMultipleChoice>;

export const ZWorkflowQuestionSummaryPictureSelection = z.object({
  type: z.literal("pictureSelection"),
  question: ZWorkflowPictureSelectionQuestion,
  responseCount: z.number(),
  choices: z.array(
    z.object({
      id: z.string(),
      imageUrl: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
});

export type TWorkflowQuestionSummaryPictureSelection = z.infer<
  typeof ZWorkflowQuestionSummaryPictureSelection
>;

export const ZWorkflowQuestionSummaryRating = z.object({
  type: z.literal("rating"),
  question: ZWorkflowRatingQuestion,
  responseCount: z.number(),
  average: z.number(),
  choices: z.array(
    z.object({
      rating: z.number(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  dismissed: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
});

export type TWorkflowQuestionSummaryRating = z.infer<typeof ZWorkflowQuestionSummaryRating>;

export const ZWorkflowQuestionSummaryNps = z.object({
  type: z.literal("nps"),
  question: ZWorkflowNPSQuestion,
  responseCount: z.number(),
  total: z.number(),
  score: z.number(),
  promoters: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
  passives: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
  detractors: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
  dismissed: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
});

export type TWorkflowQuestionSummaryNps = z.infer<typeof ZWorkflowQuestionSummaryNps>;

export const ZWorkflowQuestionSummaryCta = z.object({
  type: z.literal("cta"),
  question: ZWorkflowCTAQuestion,
  impressionCount: z.number(),
  clickCount: z.number(),
  skipCount: z.number(),
  responseCount: z.number(),
  ctr: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
});

export type TWorkflowQuestionSummaryCta = z.infer<typeof ZWorkflowQuestionSummaryCta>;

export const ZWorkflowQuestionSummaryConsent = z.object({
  type: z.literal("consent"),
  question: ZWorkflowConsentQuestion,
  responseCount: z.number(),
  accepted: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
  dismissed: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
});

export type TWorkflowQuestionSummaryConsent = z.infer<typeof ZWorkflowQuestionSummaryConsent>;

export const ZWorkflowQuestionSummaryDate = z.object({
  type: z.literal("date"),
  question: ZWorkflowDateQuestion,
  responseCount: z.number(),
  samples: z.array(
    z.object({
      id: z.string(),
      updatedAt: z.date(),
      value: z.string(),
      person: z
        .object({
          id: ZId,
          userId: z.string(),
        })
        .nullable(),
      personAttributes: ZAttributes.nullable(),
    })
  ),
});

export type TWorkflowQuestionSummaryDate = z.infer<typeof ZWorkflowQuestionSummaryDate>;

export const ZWorkflowQuestionSummaryFileUpload = z.object({
  type: z.literal("fileUpload"),
  question: ZWorkflowFileUploadQuestion,
  responseCount: z.number(),
  files: z.array(
    z.object({
      id: z.string(),
      updatedAt: z.date(),
      value: z.array(z.string()),
      person: z
        .object({
          id: ZId,
          userId: z.string(),
        })
        .nullable(),
      personAttributes: ZAttributes.nullable(),
    })
  ),
});

export type TWorkflowQuestionSummaryFileUpload = z.infer<typeof ZWorkflowQuestionSummaryFileUpload>;

export const ZWorkflowQuestionSummaryCal = z.object({
  type: z.literal("cal"),
  question: ZWorkflowCalQuestion,
  responseCount: z.number(),
  booked: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
  skipped: z.object({
    count: z.number(),
    percentage: z.number(),
  }),
});

export type TWorkflowQuestionSummaryCal = z.infer<typeof ZWorkflowQuestionSummaryCal>;

export const ZWorkflowQuestionSummaryMatrix = z.object({
  type: z.literal("matrix"),
  question: ZWorkflowMatrixQuestion,
  responseCount: z.number(),
  data: z.array(
    z.object({
      rowLabel: z.string(),
      columnPercentages: z.record(z.string(), z.number()),
      totalResponsesForRow: z.number(),
    })
  ),
});

export type TWorkflowQuestionSummaryMatrix = z.infer<typeof ZWorkflowQuestionSummaryMatrix>;

export const ZWorkflowQuestionSummaryHiddenFields = z.object({
  type: z.literal("hiddenField"),
  id: z.string(),
  responseCount: z.number(),
  samples: z.array(
    z.object({
      updatedAt: z.date(),
      value: z.string(),
      person: z
        .object({
          id: ZId,
          userId: z.string(),
        })
        .nullable(),
      personAttributes: ZAttributes.nullable(),
    })
  ),
});

export type TWorkflowQuestionSummaryHiddenFields = z.infer<typeof ZWorkflowQuestionSummaryHiddenFields>;

export const ZWorkflowQuestionSummaryAddress = z.object({
  type: z.literal("address"),
  question: ZWorkflowAddressQuestion,
  responseCount: z.number(),
  samples: z.array(
    z.object({
      id: z.string(),
      updatedAt: z.date(),
      value: z.array(z.string()),
      person: z
        .object({
          id: ZId,
          userId: z.string(),
        })
        .nullable(),
      personAttributes: ZAttributes.nullable(),
    })
  ),
});

export type TWorkflowQuestionSummaryAddress = z.infer<typeof ZWorkflowQuestionSummaryAddress>;

export const ZWorkflowQuestionSummary = z.union([
  ZWorkflowQuestionSummaryOpenText,
  ZWorkflowQuestionSummaryMultipleChoice,
  ZWorkflowQuestionSummaryPictureSelection,
  ZWorkflowQuestionSummaryRating,
  ZWorkflowQuestionSummaryNps,
  ZWorkflowQuestionSummaryCta,
  ZWorkflowQuestionSummaryConsent,
  ZWorkflowQuestionSummaryDate,
  ZWorkflowQuestionSummaryFileUpload,
  ZWorkflowQuestionSummaryCal,
  ZWorkflowQuestionSummaryMatrix,
  ZWorkflowQuestionSummaryAddress,
]);

export type TWorkflowQuestionSummary = z.infer<typeof ZWorkflowQuestionSummary>;

export const ZWorkflowSummary = z.object({
  meta: z.object({
    displayCount: z.number(),
    totalResponses: z.number(),
    startsPercentage: z.number(),
    completedResponses: z.number(),
    completedPercentage: z.number(),
    dropOffCount: z.number(),
    dropOffPercentage: z.number(),
    ttcAverage: z.number(),
  }),
  dropOff: z.array(
    z.object({
      questionId: z.string().cuid2(),
      headline: z.string(),
      ttc: z.number(),
      impressions: z.number(),
      dropOffCount: z.number(),
      dropOffPercentage: z.number(),
    })
  ),
  summary: z.array(z.union([ZWorkflowQuestionSummary, ZWorkflowQuestionSummaryHiddenFields])),
});

export const ZWorkflowFilterCriteria = z.object({
  name: z.string().optional(),
  status: z.array(ZWorkflowStatus).optional(),
  type: z.array(ZWorkflowType).optional(),
  createdBy: z
    .object({
      userId: z.string(),
      value: z.array(z.enum(["you", "others"])),
    })
    .optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
});

export type TWorkflowFilterCriteria = z.infer<typeof ZWorkflowFilterCriteria>;

const ZWorkflowFilters = z.object({
  name: z.string(),
  createdBy: z.array(z.enum(["you", "others"])),
  status: z.array(ZWorkflowStatus),
  type: z.array(ZWorkflowType),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]),
});

export type TWorkflowFilters = z.infer<typeof ZWorkflowFilters>;

const ZFilterOption = z.object({
  label: z.string(),
  value: z.string(),
});

export type TFilterOption = z.infer<typeof ZFilterOption>;

const ZSortOption = z.object({
  label: z.string(),
  value: z.enum(["createdAt", "updatedAt", "name"]),
});

export type TSortOption = z.infer<typeof ZSortOption>;
export type TWorkflowSummary = z.infer<typeof ZWorkflowSummary>;

export const ZWorkflowRecallItem = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["question", "hiddenField", "attributeClass"]),
});

export type TWorkflowRecallItem = z.infer<typeof ZWorkflowRecallItem>;
