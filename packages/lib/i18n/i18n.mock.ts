import { mockSegment } from "segment/tests/__mocks__/segment.mock";

import { mockWorkflowLanguages } from "workflow/tests/__mock__/workflow.mock";

import {
  TWorkflow,
  TWorkflowCTAQuestion,
  TWorkflowCalQuestion,
  TWorkflowConsentQuestion,
  TWorkflowDateQuestion,
  TWorkflowFileUploadQuestion,
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
  TWorkflowNPSQuestion,
  TWorkflowOpenTextQuestion,
  TWorkflowPictureSelectionQuestion,
  TWorkflowQuestionType,
  TWorkflowRatingQuestion,
  TWorkflowThankYouCard,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

export const mockWelcomeCard: TWorkflowWelcomeCard = {
  html: {
    default:
      '<p class="fb-editor-paragraph"><br></p><p class="fb-editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">Thanks for providing your feedback - let\'s go!</span></p>',
  },
  enabled: true,
  headline: {
    default: "Welcome!",
  },
  timeToFinish: false,
  showResponseCount: false,
} as unknown as TWorkflowWelcomeCard;

export const mockOpenTextQuestion: TWorkflowOpenTextQuestion = {
  id: "lqht9sj5s6andjkmr9k1n54q",
  type: TWorkflowQuestionType.OpenText,
  headline: {
    default: "What would you like to know?",
  },

  required: true,
  inputType: "text",
  subheader: {
    default: "This is an example workflow.",
  },
  placeholder: {
    default: "Type your answer here...",
  },
};

export const mockSingleSelectQuestion: TWorkflowMultipleChoiceSingleQuestion = {
  id: "mvqx8t90np6isb6oel9eamzc",
  type: TWorkflowQuestionType.MultipleChoiceSingle,
  choices: [
    {
      id: "r52sul8ag19upaicit0fyqzo",
      label: {
        default: "Eat the cake 🍰",
      },
    },
    {
      id: "es0gc12hrpk12x13rlqm59rg",
      label: {
        default: "Have the cake 🎂",
      },
    },
  ],
  isDraft: true,
  headline: {
    default: "What do you do?",
  },
  required: true,
  subheader: {
    default: "Can't do both.",
  },
  shuffleOption: "none",
};

export const mockMultiSelectQuestion: TWorkflowMultipleChoiceMultiQuestion = {
  required: true,
  headline: {
    default: "What's important on vacay?",
  },
  choices: [
    {
      id: "mgjk3i967ject4mezs4cjadj",
      label: {
        default: "Sun ☀️",
      },
    },
    {
      id: "m1wmzagcle4bzmkmgru4ol0w",
      label: {
        default: "Ocean 🌊",
      },
    },
    {
      id: "h12xs1v3w7s579p4upb5vnzp",
      label: {
        default: "Palms 🌴",
      },
    },
  ],
  shuffleOption: "none",
  id: "cpydxgsmjg8q9iwfa8wj4ida",
  type: TWorkflowQuestionType.MultipleChoiceMulti,
  isDraft: true,
};

export const mockPictureSelectQuestion: TWorkflowPictureSelectionQuestion = {
  required: true,
  headline: {
    default: "Which is the cutest puppy?",
  },
  subheader: {
    default: "You can also pick both.",
  },
  allowMulti: true,
  choices: [
    {
      id: "bdz471uu4ut7ox38b5aprzkq",
      imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-1-small.jpg",
    },
    {
      id: "t10v5rkqw32si3orlkt9mrdw",
      imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-2-small.jpg",
    },
  ],
  id: "a8monbe8hq0mivh3irfhd3i5",
  type: TWorkflowQuestionType.PictureSelection,
  isDraft: true,
};

export const mockRatingQuestion: TWorkflowRatingQuestion = {
  required: true,
  headline: {
    default: "How would you rate My Product",
  },
  subheader: {
    default: "Don't worry, be honest.",
  },
  scale: "star",
  range: 5,
  lowerLabel: {
    default: "Not good",
  },
  upperLabel: {
    default: "Very good",
  },
  id: "waldsboahjtgqhg5p18d1awz",
  type: TWorkflowQuestionType.Rating,
  isDraft: true,
};

export const mockNpsQuestion: TWorkflowNPSQuestion = {
  required: true,
  headline: {
    default: "How likely are you to recommend My Product to a friend or colleague?",
  },
  lowerLabel: {
    default: "Not at all likely",
  },
  upperLabel: {
    default: "Extremely likely",
  },
  id: "m9pemgdih2p4exvkmeeqq6jf",
  type: TWorkflowQuestionType.NPS,
  isDraft: true,
};

export const mockCtaQuestion: TWorkflowCTAQuestion = {
  required: true,
  headline: {
    default: "You are one of our power users!",
  },
  buttonLabel: {
    default: "Book interview",
  },
  buttonExternal: false,
  dismissButtonLabel: {
    default: "Skip",
  },
  id: "gwn15urom4ffnhfimwbz3vgc",
  type: TWorkflowQuestionType.CTA,
  isDraft: true,
};

export const mockConsentQuestion: TWorkflowConsentQuestion = {
  required: true,
  headline: {
    default: "Terms and Conditions",
  },
  label: {
    default: "I agree to the terms and conditions",
  },
  id: "av561aoif3i2hjlsl6krnsfm",
  type: TWorkflowQuestionType.Consent,
  isDraft: true,
};

export const mockDateQuestion: TWorkflowDateQuestion = {
  required: true,
  headline: {
    default: "When is your birthday?",
  },
  format: "M-d-y",
  id: "ts2f6v2oo9jfmfli9kk6lki9",
  type: TWorkflowQuestionType.Date,
  isDraft: true,
};

export const mockFileUploadQuestion: TWorkflowFileUploadQuestion = {
  required: true,
  headline: {
    default: "File Upload",
  },
  allowMultipleFiles: false,
  id: "ozzxo2jj1s6mj56c79q8pbef",
  type: TWorkflowQuestionType.FileUpload,
  isDraft: true,
};

export const mockCalQuestion: TWorkflowCalQuestion = {
  required: true,
  headline: {
    default: "Schedule a call with me",
  },
  buttonLabel: {
    default: "Skip",
  },
  calUserName: "rick/get-rick-rolled",
  id: "o3bnux6p42u9ew9d02l14r26",
  type: TWorkflowQuestionType.Cal,
  isDraft: true,
};

export const mockThankYouCard: TWorkflowThankYouCard = {
  enabled: true,
  headline: {
    default: "Thank you!",
  },
  subheader: {
    default: "We appreciate your feedback.",
  },
  buttonLink: "https://typeflowai.com/signup",
  buttonLabel: { default: "Create your own Workflow" },
} as unknown as TWorkflowThankYouCard;

export const mockWorkflow: TWorkflow = {
  id: "eddb4fbgaml6z52eomejy77w",
  createdAt: new Date("2024-02-06T20:12:03.521Z"),
  updatedAt: new Date("2024-02-06T20:12:03.521Z"),
  name: "New Workflow",
  type: "link",
  environmentId: "envId",
  createdBy: "creatorId",
  status: "draft",
  welcomeCard: mockWelcomeCard,
  questions: [
    mockOpenTextQuestion,
    mockSingleSelectQuestion,
    mockMultiSelectQuestion,
    mockPictureSelectQuestion,
    mockRatingQuestion,
    mockNpsQuestion,
    mockCtaQuestion,
    mockConsentQuestion,
    mockDateQuestion,
    mockFileUploadQuestion,
    mockCalQuestion,
  ],
  thankYouCard: {
    enabled: true,
    headline: {
      default: "Thank you!",
    },
    subheader: {
      default: "We appreciate your feedback.",
    },
    buttonLink: "https://typeflowai.com/signup",
    buttonLabel: { default: "Create your own Workflow" },
  },
  hiddenFields: {
    enabled: true,
    fieldIds: [],
  },
  displayOption: "displayOnce",
  recontactDays: null,
  autoClose: null,
  runOnDate: null,
  closeOnDate: null,
  delay: 0,
  displayPercentage: null,
  autoComplete: null,
  verifyEmail: null,
  redirectUrl: null,
  productOverwrites: null,
  styling: null,
  workflowClosedMessage: null,
  singleUse: {
    enabled: false,
    isEncrypted: true,
  },
  pin: null,
  resultShareKey: null,
  triggers: [],
  languages: mockWorkflowLanguages,
  segment: mockSegment,
} as unknown as TWorkflow;

export const mockTranslatedWelcomeCard = {
  html: {
    default:
      '<p class="fb-editor-paragraph"><br></p><p class="fb-editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">Thanks for providing your feedback - let\'s go!</span></p>',
    de: "",
  },
  enabled: true,
  headline: { default: "Welcome!", de: "" },
  timeToFinish: false,
  showResponseCount: false,
};

export const mockLegacyWelcomeCard = {
  html: '<p class="fb-editor-paragraph"><br></p><p class="fb-editor-paragraph" dir="ltr"><span style="white-space: pre-wrap;">Thanks for providing your feedback - let\'s go!</span></p>',
  enabled: true,
  headline: "Welcome!",
  timeToFinish: false,
  showResponseCount: false,
};

export const mockTranslatedOpenTextQuestion = {
  ...mockOpenTextQuestion,
  headline: { default: "What would you like to know?", de: "" },
  subheader: { default: "This is an example workflow.", de: "" },
  placeholder: { default: "Type your answer here...", de: "" },
};

export const mockLegacyOpenTextQuestion = {
  ...mockOpenTextQuestion,
  headline: "What would you like to know?",
  subheader: "This is an example workflow.",
  placeholder: "Type your answer here...",
};

export const mockTranslatedSingleSelectQuestion = {
  ...mockSingleSelectQuestion,
  headline: { default: "What do you do?", de: "" },
  subheader: { default: "Can't do both.", de: "" },
  choices: mockSingleSelectQuestion.choices.map((choice) => ({
    ...choice,
    label: { default: choice.label.default, de: "" },
  })),
  otherOptionPlaceholder: undefined,
};

export const mockLegacySingleSelectQuestion = {
  ...mockSingleSelectQuestion,
  headline: "What do you do?",
  subheader: "Can't do both.",
  otherOptionPlaceholder: undefined,
  choices: mockSingleSelectQuestion.choices.map((choice) => ({
    ...choice,
    label: choice.label.default,
  })),
};

export const mockTranslatedMultiSelectQuestion = {
  ...mockMultiSelectQuestion,
  headline: { default: "What's important on vacay?", de: "" },
  choices: mockMultiSelectQuestion.choices.map((choice) => ({
    ...choice,
    label: { default: choice.label.default, de: "" },
  })),
  otherOptionPlaceholder: undefined,
};

export const mockLegacyMultiSelectQuestion = {
  ...mockMultiSelectQuestion,
  headline: "What's important on vacay?",
  otherOptionPlaceholder: undefined,
  choices: mockMultiSelectQuestion.choices.map((choice) => ({
    ...choice,
    label: choice.label.default,
  })),
};

export const mockTranslatedPictureSelectQuestion = {
  ...mockPictureSelectQuestion,
  headline: { default: "Which is the cutest puppy?", de: "" },
  subheader: { default: "You can also pick both.", de: "" },
};
export const mockLegacyPictureSelectQuestion = {
  ...mockPictureSelectQuestion,
  headline: "Which is the cutest puppy?",
  subheader: "You can also pick both.",
};

export const mockTranslatedRatingQuestion = {
  ...mockRatingQuestion,
  headline: { default: "How would you rate My Product", de: "" },
  subheader: { default: "Don't worry, be honest.", de: "" },
  lowerLabel: { default: "Not good", de: "" },
  upperLabel: { default: "Very good", de: "" },
};

export const mockLegacyRatingQuestion = {
  ...mockRatingQuestion,
  headline: "How would you rate My Product",
  subheader: "Don't worry, be honest.",
  lowerLabel: "Not good",
  upperLabel: "Very good",
};

export const mockTranslatedNpsQuestion = {
  ...mockNpsQuestion,
  headline: {
    default: "How likely are you to recommend My Product to a friend or colleague?",
    de: "",
  },
  lowerLabel: { default: "Not at all likely", de: "" },
  upperLabel: { default: "Extremely likely", de: "" },
};

export const mockLegacyNpsQuestion = {
  ...mockNpsQuestion,
  headline: "How likely are you to recommend My Product to a friend or colleague?",
  lowerLabel: "Not at all likely",
  upperLabel: "Extremely likely",
};

export const mockTranslatedCtaQuestion = {
  ...mockCtaQuestion,
  headline: { default: "You are one of our power users!", de: "" },
  buttonLabel: { default: "Book interview", de: "" },
  dismissButtonLabel: { default: "Skip", de: "" },
};

export const mockLegacyCtaQuestion = {
  ...mockCtaQuestion,
  headline: "You are one of our power users!",
  buttonLabel: "Book interview",
  dismissButtonLabel: "Skip",
};

export const mockTranslatedConsentQuestion = {
  ...mockConsentQuestion,
  headline: { default: "Terms and Conditions", de: "" },
  label: { default: "I agree to the terms and conditions", de: "" },
};

export const mockLegacyConsentQuestion = {
  ...mockConsentQuestion,
  headline: "Terms and Conditions",
  label: "I agree to the terms and conditions",
};

export const mockTranslatedDateQuestion = {
  ...mockDateQuestion,
  headline: { default: "When is your birthday?", de: "" },
};

export const mockLegacyDateQuestion = {
  ...mockDateQuestion,
  headline: "When is your birthday?",
};

export const mockTranslatedFileUploadQuestion = {
  ...mockFileUploadQuestion,
  headline: { default: "File Upload", de: "" },
};

export const mockLegacyFileUploadQuestion = {
  ...mockFileUploadQuestion,
  headline: "File Upload",
};

export const mockTranslatedCalQuestion = {
  ...mockCalQuestion,
  headline: { default: "Schedule a call with me", de: "" },
  buttonLabel: { default: "Skip", de: "" },
};

export const mockLegacyCalQuestion = {
  ...mockCalQuestion,
  headline: "Schedule a call with me",
  buttonLabel: "Skip",
};

export const mockTranslatedThankYouCard = {
  ...mockThankYouCard,
  headline: { default: "Thank you!", de: "" },
  subheader: { default: "We appreciate your feedback.", de: "" },
  buttonLabel: { default: "Create your own Workflow", de: "" },
};

export const mockLegacyThankYouCard = {
  ...mockThankYouCard,
  headline: "Thank you!",
  subheader: "We appreciate your feedback.",
  buttonLabel: "Create your own Workflow",
};

export const mockTranslatedWorkflow = {
  ...mockWorkflow,
  questions: [
    mockTranslatedOpenTextQuestion,
    mockTranslatedSingleSelectQuestion,
    mockTranslatedMultiSelectQuestion,
    mockTranslatedPictureSelectQuestion,
    mockTranslatedRatingQuestion,
    mockTranslatedNpsQuestion,
    mockTranslatedCtaQuestion,
    mockTranslatedConsentQuestion,
    mockTranslatedDateQuestion,
    mockTranslatedFileUploadQuestion,
    mockTranslatedCalQuestion,
  ],
  welcomeCard: mockTranslatedWelcomeCard,
  thankYouCard: mockTranslatedThankYouCard,
};

export const mockLegacyWorkflow = {
  ...mockWorkflow,
  createdAt: new Date("2024-02-06T20:12:03.521Z"),
  updatedAt: new Date("2024-02-06T20:12:03.521Z"),
  questions: [
    mockLegacyOpenTextQuestion,
    mockLegacySingleSelectQuestion,
    mockLegacyMultiSelectQuestion,
    mockLegacyPictureSelectQuestion,
    mockLegacyRatingQuestion,
    mockLegacyNpsQuestion,
    mockLegacyCtaQuestion,
    mockLegacyConsentQuestion,
    mockLegacyDateQuestion,
    mockLegacyFileUploadQuestion,
    mockLegacyCalQuestion,
  ],
  welcomeCard: mockLegacyWelcomeCard,
  thankYouCard: mockLegacyThankYouCard,
};
