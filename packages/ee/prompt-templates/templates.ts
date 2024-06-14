import { createId } from "@paralleldrive/cuid2";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowCTAQuestion,
  TWorkflowDisplayOption,
  TWorkflowHiddenFields,
  TWorkflowInput,
  TWorkflowOpenTextQuestion,
  TWorkflowQuestionTypeEnum,
  TWorkflowStatus,
  TWorkflowThankYouCard,
  TWorkflowType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import { agencyTemplates } from "./agency";
import { hrTemplates } from "./hr";
import { marketingTemplates } from "./marketing";
import { salesTemplates } from "./sales";
import { startupTemplates } from "./startup";
import { supportTemplates } from "./support";
import { vaTemplates } from "./va";

const thankYouCardDefault: TWorkflowThankYouCard = {
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

const welcomeCardDefault: TWorkflowWelcomeCard = {
  enabled: false,
  headline: { default: "Welcome!" },
  html: { default: "Thanks for providing your feedback - let's go!" },
  timeToFinish: false,
  showResponseCount: false,
};

const workflowDefault: TTemplate["preset"] = {
  name: "New Workflow",
  welcomeCard: welcomeCardDefault,
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
  questions: [],
};

export const testTemplate: TTemplate = {
  name: "Test template",
  icon: "DefaultIcon",
  description: "Test template consisting of all questions",
  preset: {
    ...workflowDefault,
    name: "Test template",
    icon: "DefaultIcon",
    questions: [
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter some text:" },
        required: true,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter some text:" },
        required: false,
        inputType: "text",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter an email" },
        required: true,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter an email" },
        required: false,
        inputType: "email",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a number" },
        required: true,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a number" },
        required: false,
        inputType: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a phone number" },
        required: true,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a phone number" },
        required: false,
        inputType: "phone",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a url" },
        required: true,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
        headline: { default: "This is an open text question" },
        subheader: { default: "Please enter a url" },
        required: false,
        inputType: "url",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
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
        type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
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
        type: TWorkflowQuestionTypeEnum.MultipleChoiceMulti,
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
        type: TWorkflowQuestionTypeEnum.MultipleChoiceMulti,
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
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "number",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "smiley",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: true,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Rating,
        headline: { default: "This is a rating question" },
        required: false,
        lowerLabel: { default: "Low" },
        upperLabel: { default: "High" },
        range: 5,
        scale: "star",
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.CTA,
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
        type: TWorkflowQuestionTypeEnum.CTA,
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
        type: TWorkflowQuestionTypeEnum.PictureSelection,
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
        type: TWorkflowQuestionTypeEnum.PictureSelection,
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
        type: TWorkflowQuestionTypeEnum.Consent,
        headline: { default: "This is a Consent question" },
        required: true,
        label: { default: "I agree to the terms and conditions" },
      },
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.Consent,
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
  icon: "DefaultIcon",
  description: "Create a workflow without template.",
  preset: {
    ...workflowDefault,
    name: "New Workflow",
    icon: "DefaultIcon",
    questions: [
      {
        id: createId(),
        type: TWorkflowQuestionTypeEnum.OpenText,
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
  },
};

export const getExampleWorkflowTemplate = (webAppUrl: string, trigger: TActionClass): TWorkflowInput => ({
  ...customWorkflow.preset,
  questions: customWorkflow.preset.questions.map(
    (question) =>
      ({
        ...question,
        type: TWorkflowQuestionTypeEnum.CTA,
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
  triggers: [{ actionClass: trigger }],
  status: "inProgress" as TWorkflowStatus,
  displayOption: "respondMultiple" as TWorkflowDisplayOption,
  recontactDays: 0,
});
