import z from "zod";

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

export const ZAllowedFileExtension = z.enum([
  "png",
  "jpeg",
  "jpg",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "plain",
  "csv",
  "mp4",
  "mov",
  "avi",
  "mkv",
  "webm",
  "zip",
  "rar",
  "7z",
  "tar",
]);

export type TAllowedFileExtension = z.infer<typeof ZAllowedFileExtension>;

export const ZUserObjective = z.enum([
  "increase_conversion",
  "improve_user_retention",
  "increase_user_adoption",
  "sharpen_marketing_messaging",
  "support_sales",
  "other",
]);

export type TUserObjective = z.infer<typeof ZUserObjective>;

export const ZWorkflowWelcomeCard = z.object({
  enabled: z.boolean(),
  headline: z.string().optional(),
  html: z.string().optional(),
  fileUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
  timeToFinish: z.boolean().default(true),
  showResponseCount: z.boolean().default(false),
});

export type TWorkflowWelcomeCard = z.infer<typeof ZWorkflowWelcomeCard>;

export const ZWorkflowThankYouCard = z.object({
  enabled: z.boolean(),
  headline: z.optional(z.string()),
  subheader: z.optional(z.string()),
  buttonLabel: z.optional(z.string()),
  buttonLink: z.optional(z.string()),
  imageUrl: z.string().optional(),
});

export type TWorkflowThankYouCard = z.infer<typeof ZWorkflowThankYouCard>;

export const ZWorkflowHiddenFields = z.object({
  enabled: z.boolean(),
  fieldIds: z.optional(z.array(z.string())),
});

export type TWorkflowHiddenFields = z.infer<typeof ZWorkflowHiddenFields>;

export const ZWorkflowChoice = z.object({
  id: z.string(),
  label: z.string(),
});

export enum PromptAttributes {
  actAs = "Act as",
  style = "Style",
  tone = "Tone",
  length = "Length",
  language = "Language",
  readerComprehension = "Reader Comprehension",
  outputAs = "Output as",
  formatting = "Formatting",
}

export enum promptActAs {
  ProblemSolver = "Problem Solver",
  CodeGenerator = "Code Generator",
  InformationResearcher = "Information Researcher",
  LanguageTranslator = "Language Translator",
  LearningAssistant = "Learning Assistant",
  CreativeWriter = "Creative Writer",
  DataAnalyzer = "Data Analyzer",
  TechnicalAdvisor = "Technical Advisor",
  HealthAndFitnessGuide = "Health and Fitness Guide",
  TravelPlanner = "Travel Planner",
  EntertainmentRecommender = "Entertainment Recommender",
  CookingAndRecipeAdvisor = "Cooking and Recipe Advisor",
  HistoricalInquirer = "Historical Inquirer",
  FinancialAdvisor = "Financial Advisor",
  Copywriter = "Copywriter",
  MarketingManager = "Marketing Manager",
}

export enum promptStyle {
  Formal = "Formal",
  Informal = "Informal",
  Casual = "Casual",
  Emotional = "Emotional",
  Creative = "Creative",
  Persuasive = "Persuasive",
  Business = "Business",
  Technical = "Technical",
  Legal = "Legal",
  Medical = "Medical",
  Academic = "Academic",
}

export enum promptTone {
  Funny = "Funny",
  Serious = "Serious",
  Friendly = "Friendly",
  Professional = "Professional",
  Empathetic = "Empathetic",
  Confident = "Confident",
  Enthusiastic = "Enthusiastic",
  Assertive = "Assertive",
  Encouraging = "Encouraging",
  Excited = "Excited",
  Witty = "Witty",
  Sympathetic = "Sympathetic",
  Analytical = "Analytical",
  Authoritative = "Authoritative",
  Romantic = "Romantic",
}

export enum promptLanguage {
  Spanish = "Spanish",
  French = "French",
  German = "German",
  Italian = "Italian",
  Arabic = "Arabic",
  Japanese = "Japanese",
  Chinese = "Chinese",
  USEnglish = "US English",
  UKEnglish = "UK English",
  AustralianEnglish = "Australian English",
  NewZealandEnglish = "New Zealand English",
  Irish = "Irish",
  Scottish = "Scottish",
}

export enum promptReaderComprehension {
  Age5Years = "5 years old",
  Age10Years = "10 years old",
  Age25Years = "25 years old",
  Age85Years = "85 years old",
  IQ69 = "IQ 69",
  IQ115 = "IQ 115",
  IQ150 = "IQ 150",
  Beginner = "beginner, assume no prior knowledge",
  Intermediate = "intermediate, assume some prior knowledge",
  Advanced = "advanced, assume extensive prior knowledge",
  PhDGraduate = "PhD Graduate",
  TriplePhDGalacticBrain = "Triple PhD galactic brain",
}

export enum promptLength {
  Characters280 = "280 characters",
  ShortSimpleToPoint = "Short, simple and to the point",
  Paragraph1 = "1 Paragraph",
  Paragraphs3 = "3 Paragraphs",
  Words100 = "100 Words",
  Words300 = "300 Words",
  Words500 = "500 Words",
  Words1000 = "1000 Words",
}

export enum promptOutputAs {
  NumberedList = "Numbered list",
  BulletedList = "Bulleted list",
  BulletedListWithNestedItems = "Bulleted list with nested items",
  TaskList = "Task List",
  Markdown = "Markdown",
  Blockquote = "Blockquote",
  CodeBlock = "Code block",
  JSON = "JSON",
  YAML = "YAML",
  XML = "XML",
  SQL = "SQL",
}

export enum promptFormatting {
  BoldImportantWords = "Bold the important words",
  OnlyTextNoComments = "Only the text. No comments before and after.",
  HighlightKeyWords = "Highlight key words and phrases",
}

export const ZPromptAttributes = z.object({
  actAs: z.nativeEnum(promptActAs).optional(),
  style: z.nativeEnum(promptStyle).optional(),
  tone: z.nativeEnum(promptTone).optional(),
  language: z.nativeEnum(promptLanguage).optional(),
  readerComprehension: z.nativeEnum(promptReaderComprehension).optional(),
  length: z.nativeEnum(promptLength).optional(),
  outputAs: z.nativeEnum(promptOutputAs).optional(),
  formatting: z.nativeEnum(promptFormatting).optional(),
});

export enum OpenAIModel {
  GPT35Turbo = "gpt-3.5-turbo",
  GPT35Turbo16k = "gpt-3.5-turbo-16k",
  GPT4 = "gpt-4",
  GPT432k = "gpt-4-32k",
  GPT4Turbo = "gpt-4-vision-preview",
}

export const ZOpenAIModel = z.nativeEnum(OpenAIModel);

export const ZWorkflowPrompt = z.object({
  enabled: z.boolean(),
  id: z.string(),
  description: z.string().optional(),
  message: z.string().optional(),
  attributes: ZPromptAttributes.default({}),
  isVisible: z.boolean().default(true),
  engine: z.nativeEnum(OpenAIModel).default(OpenAIModel.GPT35Turbo),
});

export type TWorkflowPrompt = z.infer<typeof ZWorkflowPrompt>;

export type TWorkflowChoice = z.infer<typeof ZWorkflowChoice>;

export const ZWorkflowPictureChoice = z.object({
  id: z.string(),
  imageUrl: z.string(),
});

export type TWorkflowPictureChoice = z.infer<typeof ZWorkflowPictureChoice>;

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
  // "submitted" condition is legacy and should be removed later
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
  placeholder: z.string().optional(),
  logic: z.array(ZWorkflowConsentLogic).optional(),
});

export type TWorkflowConsentQuestion = z.infer<typeof ZWorkflowConsentQuestion>;

export const ZWorkflowMultipleChoiceSingleQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceSingle),
  choices: z.array(ZWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceSingleLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
  otherOptionPlaceholder: z.string().optional(),
});

export type TWorkflowMultipleChoiceSingleQuestion = z.infer<typeof ZWorkflowMultipleChoiceSingleQuestion>;

export const ZWorkflowMultipleChoiceMultiQuestion = ZWorkflowQuestionBase.extend({
  type: z.literal(TWorkflowQuestionType.MultipleChoiceMulti),
  choices: z.array(ZWorkflowChoice),
  logic: z.array(ZWorkflowMultipleChoiceMultiLogic).optional(),
  shuffleOption: z.enum(["none", "all", "exceptLast"]).optional(),
  otherOptionPlaceholder: z.string().optional(),
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

export const ZWorkflowClosedMessage = z
  .object({
    enabled: z.boolean().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
  })
  .nullable()
  .optional();

export type TWorkflowClosedMessage = z.infer<typeof ZWorkflowClosedMessage>;

export const ZWorkflowAttributeFilter = z.object({
  attributeClassId: z.string().cuid2(),
  condition: z.enum(["equals", "notEquals"]),
  value: z.string(),
});

export type TWorkflowAttributeFilter = z.infer<typeof ZWorkflowAttributeFilter>;

export const ZWorkflowType = z.enum(["web", "email", "link", "mobile"]);

export type TWorkflowType = z.infer<typeof ZWorkflowType>;

const ZWorkflowStatus = z.enum(["draft", "inProgress", "paused", "completed"]);

export type TWorkflowStatus = z.infer<typeof ZWorkflowStatus>;

const ZWorkflowDisplayOption = z.enum(["displayOnce", "displayMultiple", "respondMultiple"]);

export type TWorkflowDisplayOption = z.infer<typeof ZWorkflowDisplayOption>;

export const ZColor = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const ZPlacement = z.enum(["bottomLeft", "bottomRight", "topLeft", "topRight", "center"]);

export type TPlacement = z.infer<typeof ZPlacement>;

export const ZWorkflowProductOverwrites = z.object({
  brandColor: ZColor.nullish(),
  highlightBorderColor: ZColor.nullish(),
  placement: ZPlacement.nullish(),
  clickOutsideClose: z.boolean().nullish(),
  darkOverlay: z.boolean().nullish(),
});

export type TWorkflowProductOverwrites = z.infer<typeof ZWorkflowProductOverwrites>;

export const ZWorkflowStylingBackground = z.object({
  bg: z.string().nullish(),
  bgType: z.enum(["animation", "color", "image"]).nullish(),
  brightness: z.number().nullish(),
});

export type TWorkflowStylingBackground = z.infer<typeof ZWorkflowStylingBackground>;

export const ZWorkflowStyling = z.object({
  background: ZWorkflowStylingBackground.nullish(),
  hideProgressBar: z.boolean().nullish(),
});

export type TWorkflowStyling = z.infer<typeof ZWorkflowStyling>;

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

export const ZWorkflow = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  type: ZWorkflowType,
  environmentId: z.string(),
  createdBy: z.string().nullable(),
  status: ZWorkflowStatus,
  attributeFilters: z.array(ZWorkflowAttributeFilter),
  displayOption: ZWorkflowDisplayOption,
  autoClose: z.number().nullable(),
  triggers: z.array(z.string()),
  redirectUrl: z.string().url().nullable(),
  recontactDays: z.number().nullable(),
  welcomeCard: ZWorkflowWelcomeCard,
  questions: ZWorkflowQuestions,
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
  displayPercentage: z.number().min(1).max(100).nullable(),
});

export type TWorkflow = z.infer<typeof ZWorkflow>;

export const ZTemplate = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.any().optional(),
  category: z
    .enum(["Marketing", "Sales", "Startup", "Support", "Virtual Assistant", "Agency", "Human Resources"])
    .optional(),
  subcategory: z.string().optional(),
  objectives: z.array(ZUserObjective).optional(),
  isPremium: z.boolean().optional(),
  preset: z.object({
    name: z.string(),
    icon: z.any().optional(),
    welcomeCard: ZWorkflowWelcomeCard,
    questions: ZWorkflowQuestions,
    prompt: ZWorkflowPrompt,
    thankYouCard: ZWorkflowThankYouCard,
    hiddenFields: ZWorkflowHiddenFields,
  }),
});

export type TTemplate = z.infer<typeof ZTemplate>;
