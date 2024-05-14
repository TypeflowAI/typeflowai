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
  TWorkflowHiddenFields,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import templateIcon from "@typeflowai/ui/icons/templates/default.svg";

const thankYouCardDefault = {
  enabled: true,
  headline: "Thank you!",
  subheader: "We appreciate your feedback.",
};

const hiddenFieldsDefault: TWorkflowHiddenFields = {
  enabled: true,
  fieldIds: [],
};

const welcomeCardDefault: TWorkflowWelcomeCard = {
  enabled: false,
  headline: "Welcome!",
  html: "Thanks for providing your feedback - let's go!",
  timeToFinish: true,
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
        headline: "This is an open text question",
        subheader: "Please enter some text:",
        required: true,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter some text:",
        required: false,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter an email",
        required: true,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter an email",
        required: false,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a number",
        required: true,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a number",
        required: false,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a phone number",
        required: true,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a phone number",
        required: false,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a url",
        required: true,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "This is an open text question",
        subheader: "Please enter a url",
        required: false,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceSingle,
        headline: "This ia a Multiple choice Single question",
        subheader: "Please select one of the following",
        required: true,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: "Option1",
          },
          {
            id: createId(),
            label: "Option2",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceSingle,
        headline: "This ia a Multiple choice Single question",
        subheader: "Please select one of the following",
        required: false,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: "Option 1",
          },
          {
            id: createId(),
            label: "Option 2",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceMulti,
        headline: "This ia a Multiple choice Multiple question",
        subheader: "Please select some from the following",
        required: true,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: "Option1",
          },
          {
            id: createId(),
            label: "Option2",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.MultipleChoiceMulti,
        headline: "This ia a Multiple choice Multiple question",
        subheader: "Please select some from the following",
        required: false,
        shuffleOption: "none",
        choices: [
          {
            id: createId(),
            label: "Option1",
          },
          {
            id: createId(),
            label: "Option2",
          },
        ],
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: true,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: false,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: true,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: false,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: true,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Rating,
        headline: "This is a rating question",
        required: false,
        lowerLabel: "Low",
        upperLabel: "High",
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.CTA,
        headline: "This is a CTA question",
        html: "This is a test CTA",
        buttonLabel: "Click",
        buttonUrl: "https://typeflowai.com",
        buttonExternal: true,
        required: true,
        dismissButtonLabel: "Maybe later",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.CTA,
        headline: "This is a CTA question",
        html: "This is a test CTA",
        buttonLabel: "Click",
        buttonUrl: "https://typeflowai.com",
        buttonExternal: true,
        required: false,
        dismissButtonLabel: "Maybe later",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.PictureSelection,
        headline: "This is a Picture select",
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
        headline: "This is a Picture select",
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
        headline: "This is a Consent question",
        required: true,
        label: "I agree to the terms and conditions",
        dismissButtonLabel: "Skip",
      },
      {
        id: createId(),
        type: TWorkflowQuestionType.Consent,
        headline: "This is a Consent question",
        required: false,
        label: "I agree to the terms and conditions",
        dismissButtonLabel: "Skip",
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
    welcomeCard: {
      enabled: false,
      timeToFinish: false,
      showResponseCount: false,
    },
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
        headline: "What would you like to know?",
        subheader: "This is an example workflow.",
        placeholder: "Type your answer here...",
        required: true,
        inputType: "text",
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
    hiddenFields: hiddenFieldsDefault,
  },
};

export const minimalWorkflow: TWorkflow = {
  id: "someUniqueId1",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Minimal Workflow",
  type: "web",
  environmentId: "someEnvId1",
  status: "draft",
  attributeFilters: [],
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
  thankYouCard: {
    enabled: false,
  },
  hiddenFields: {
    enabled: false,
  },
  delay: 0, // No delay
  autoComplete: null,
  closeOnDate: null,
  workflowClosedMessage: {
    enabled: false,
  },
  productOverwrites: null,
  singleUse: null,
  styling: null,
  resultShareKey: null,
};
