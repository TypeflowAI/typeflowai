import { OpenAIModel } from "@typeflowai/types/openai";
import { TWorkflow } from "@typeflowai/types/workflows";

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
  displayLimit: null,
  welcomeCard: {
    enabled: false,
    headline: { default: "Welcome!" },
    html: { default: "Thanks for providing your feedback - let's go!" },
    timeToFinish: false,
    showResponseCount: false,
  },
  icon: "DefaultIcon",
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
