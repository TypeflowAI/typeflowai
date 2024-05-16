import { createId } from "@paralleldrive/cuid2";

import { agencyTemplates } from "@typeflowai/ee/prompt-templates/agency";
import { hrTemplates } from "@typeflowai/ee/prompt-templates/hr";
import { marketingTemplates } from "@typeflowai/ee/prompt-templates/marketing";
import { salesTemplates } from "@typeflowai/ee/prompt-templates/sales";
import { startupTemplates } from "@typeflowai/ee/prompt-templates/startup";
import { supportTemplates } from "@typeflowai/ee/prompt-templates/support";
import { vaTemplates } from "@typeflowai/ee/prompt-templates/va";
import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflow,
  TWorkflowCTAQuestion,
  TWorkflowDisplayOption,
  TWorkflowHiddenFields,
  TWorkflowOpenTextQuestion,
  TWorkflowQuestionType,
  TWorkflowStatus,
  TWorkflowType,
} from "@typeflowai/types/workflows";
import templateIcon from "@typeflowai/ui/icons/templates/default.svg";

const thankYouCardDefault = {
  enabled: true,
  headline: { default: "Thank you!" },
  subheader: { default: "We appreciate your feedback." },
  buttonLabel: { default: "Create your own Workflow" },
  buttonLink: "https://typeflowai.com/signup",
};

const hiddenFieldsDefault: TWorkflowHiddenFields = {
  enabled: true,
  fieldIds: [],
};

const welcomeCardDefault = {
  enabled: false,
  headline: { default: "Welcome!" },
  html: { default: "Thanks for providing your feedback - let's go!" },
  timeToFinish: false,
  showResponseCount: false,
};

export const testTemplate: TTemplate = {
  name: "Test template",
  icon: templateIcon.src,
  description: "Test template consisting of all questions",
  preset: {
    name: "Test template",
    icon: templateIcon.src,
    questions: [
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter some text:" },
        required: true,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter some text:" },
        required: false,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter an email" },
        required: true,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter an email" },
        required: false,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a number" },
        required: true,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a number" },
        required: false,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a phone number" },
        required: true,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a phone number" },
        required: false,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a url" },
        required: true,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a url" },
        required: false,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceSingle,
        headline: { default: "This ia a Multiple choice Single question" },
        subheader: { default: "Please select one of the following" },
        required: true,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: { default: "Option1" },
          },
          {
            id: createId(),
            label: { default: "Option2" },
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceSingle,
        headline: { default: "This ia a Multiple choice Single question" },
        subheader: { default: "Please select one of the following" },
        required: false,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: { default: "Option 1" },
          },
          {
            id: createId(),
            label: { default: "Option 2" },
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceMulti,
        headline: { default: "This ia a Multiple choice Multiple question" },
        subheader: { default: "Please select some from the following" },
        required: true,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: { default: "Option1" },
          },
          {
            id: createId(),
            label: { default: "Option2" },
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceMulti,
        headline: { default: "This ia a Multiple choice Multiple question" },
        subheader: { default: "Please select some from the following" },
        required: false,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: { default: "Option1" },
          },
          {
            id: createId(),
            label: { default: "Option2" },
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.CTA,
        headline: { default: "This is a CTA question" },
        html: { default: "This is a test CTA" },
        buttonLabel: { default: "Click" },
        buttonUrl: "https://typeflowai.com",
        buttonExternal: true,
        required: true,
        dismissButtonLabel: { default: "Maybe later" },
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.CTA,
        headline: { default: "This is a CTA question" },
        html: { default: "This is a test CTA" },
        buttonLabel: { default: "Click" },
        buttonUrl: "https://typeflowai.com",
        buttonExternal: true,
        required: false,
        dismissButtonLabel: { default: "Maybe later" },
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.PictureSelection,
        headline: { default: "This is a Picture select" },
        allowMulti: true,
        required: true,
        choices: [
          {
            id: createId(),
            imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-1-small.jpg",
          },
          {
            id: createId(),
            imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-2-small.jpg",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.PictureSelection,
        headline: { default: "This is a Picture select" },
        allowMulti: true,
        required: false,
        choices: [
          {
            id: createId(),
            imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-1-small.jpg",
          },
          {
            id: createId(),
            imageUrl: "https://typeflowai-cdn.s3.eu-central-1.amazonaws.com/puppy-2-small.jpg",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Consent,
        headline: { default: "This is a Consent question" },
        required: true,
        label: { default: "I agree to the terms and conditions" },
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Consent,
        headline: { default: "This is a Consent question" },
        required: false,
        label: { default: "I agree to the terms and conditions" },
      },
    ],
    prompt: {
      enabled: false,
      id: "prompt",
      message: "",
      attributes: {},
      isVisible: true,
      engine: OpenAIModel.GPT35Turbo,
    },
    thankYouCard: thankYouCardDefault,
    welcomeCard: welcomeCardDefault,
    hiddenFields: {
      enabled: false,
    },
  },
};

export const templates: TTemplate[] = [
  ...marketingTemplates,
  ...salesTemplates,
  ...startupTemplates,
  ...supportTemplates,
  ...vaTemplates,
  ...hrTemplates,
  ...agencyTemplates,
];

export const customWorkflow: TTemplate = {
  name: "Start from scratch",
  icon: templateIcon.src,
  description: "Create a workflow without template.",
  preset: {
    name: "New Workflow",
    welcomeCard: welcomeCardDefault,
    icon: templateIcon.src,
    questions: [
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: { default: "What would you like to know?" },
        subheader: { default: "This is an example workflow." },
        placeholder: { default: "Type your answer here..." },
        required: true,
        inputType: "text",
      } as TWorkflowOpenTextQuestion,
    ],
    prompt: {
      enabled: false,
      id: "prompt",
      message: "",
      attributes: {},
      isVisible: true,
      engine: OpenAIModel.GPT35Turbo,
    },
    thankYouCard: thankYouCardDefault,
    hiddenFields: hiddenFieldsDefault,
  },
};

export const minimalWorkflow: TWorkflow = {
  id: "someUniqueId1",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Minimal Workflow",
  type: "app",
  environmentId: "someEnvId1",
  createdBy: null,
  status: "draft",
  displayOption: "displayOnce",
  autoClose: null,
  triggers: [],
  redirectUrl: null,
  recontactDays: null,
  welcomeCard: welcomeCardDefault,
  icon: templateIcon.src,
  questions: [],
  prompt: {
    enabled: false,
    id: "prompt",
    message: "",
    attributes: {},
    isVisible: true,
    engine: OpenAIModel.GPT35Turbo,
  },
  inlineTriggers: null,
  thankYouCard: {
    enabled: false,
  },
  hiddenFields: {
    enabled: false,
  },
  delay: 0, // No delay
  displayPercentage: null,
  autoComplete: null,
  runOnDate: null,
  closeOnDate: null,
  workflowClosedMessage: {
    enabled: false,
  },
  productOverwrites: null,
  singleUse: null,
  styling: null,
  resultShareKey: null,
  segment: null,
  languages: [],
};

export const getExampleWorkflowTemplate = (webAppUrl: string) => ({
  ...customWorkflow.preset,
  questions: customWorkflow.preset.questions.map(
    (question) =>
      ({
        ...question,
        type: TWorkflowQuestionType.CTA,
        headline: { default: "You did it 🎉" },
        html: {
          default: "You're all set up. Create your own workflow to gather exactly the feedback you need :)",
        },
        buttonLabel: { default: "Create workflow" },
        buttonExternal: true,
        imageUrl: `${webAppUrl}/onboarding/meme.png`,
      }) as TWorkflowCTAQuestion
  ),
  name: "Example workflow",
  type: "website" as TWorkflowType,
  autoComplete: 2,
  triggers: ["New Session"],
  status: "inProgress" as TWorkflowStatus,
  displayOption: "respondMultiple" as TWorkflowDisplayOption,
  recontactDays: 0,
});
