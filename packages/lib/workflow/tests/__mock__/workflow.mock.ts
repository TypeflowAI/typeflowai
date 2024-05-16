import { Prisma } from "@prisma/client";

import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TProduct } from "@typeflowai/types/product";
import { TTeam } from "@typeflowai/types/teams";
import { TUser } from "@typeflowai/types/user";
import {
  TWorkflow,
  TWorkflowInput,
  TWorkflowLanguage,
  TWorkflowQuestion,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

import { selectPerson } from "../../../person/service";
import { selectWorkflow } from "../../service";

const currentDate = new Date();
const fourDaysAgo = new Date();
fourDaysAgo.setDate(currentDate.getDate() - 4);

export const mockId = "ars2tjk8hsi8oqk1uac00mo8";
const commonMockProperties = {
  createdAt: currentDate,
  updatedAt: currentDate,
  environmentId: mockId,
};

type WorkflowMock = Prisma.WorkflowGetPayload<{
  include: typeof selectWorkflow;
}>;

export const mockWorkflowLanguages: TWorkflowLanguage[] = [
  {
    default: true,
    enabled: true,
    language: {
      id: "rp2di001zicbm3mk8je1ue9u",
      code: "en",
      alias: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    default: false,
    enabled: true,
    language: {
      id: "cuuxfzls09sjkueg6lm6n7i0",
      code: "de",
      alias: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export const mockProduct: TProduct = {
  id: mockId,
  createdAt: currentDate,
  updatedAt: currentDate,
  name: "mock Product",
  teamId: mockId,
  brandColor: "#000000",
  highlightBorderColor: "#000000",
  recontactDays: 0,
  linkWorkflowBranding: false,
  inAppWorkflowBranding: false,
  placement: "bottomRight",
  clickOutsideClose: false,
  darkOverlay: false,
  environments: [],
  languages: [],
  styling: {
    allowStyleOverwrite: false,
  },
};

export const mockDisplay = {
  id: mockId,
  createdAt: fourDaysAgo,
  updatedAt: fourDaysAgo,
  workflowId: mockId,
  personId: null,
  responseId: null,
  status: null,
};

export const mockUser: TUser = {
  id: mockId,
  name: "mock User",
  email: "test@unit.com",
  emailVerified: currentDate,
  imageUrl: "https://www.google.com",
  createdAt: currentDate,
  updatedAt: currentDate,
  onboardingCompleted: true,
  twoFactorEnabled: false,
  identityProvider: "google",
  objective: "improve_user_retention",
  notificationSettings: {
    alert: {},
    weeklySummary: {},
    unsubscribedTeamIds: [],
  },
  role: "other",
};

export const mockPrismaPerson: Prisma.PersonGetPayload<{
  include: typeof selectPerson;
}> = {
  id: mockId,
  userId: mockId,
  attributes: [
    {
      value: "de",
      attributeClass: {
        id: mockId,
        name: "language",
      },
    },
  ],
  ...commonMockProperties,
};

export const mockActionClass: TActionClass = {
  id: mockId,
  name: "mock action class",
  type: "code",
  description: "mock desc",
  noCodeConfig: null,
  ...commonMockProperties,
};

export const mockAttributeClass: TAttributeClass = {
  id: mockId,
  name: "mock attribute class",
  type: "code",
  description: "mock action class",
  archived: false,
  ...commonMockProperties,
};

const mockQuestion: TWorkflowQuestion = {
  id: mockId,
  type: TWorkflowQuestionType.OpenText,
  headline: { default: "Question Text", de: "Fragetext" },
  required: false,
  inputType: "text",
};

const mockWelcomeCard: TWorkflowWelcomeCard = {
  enabled: false,
  headline: { default: "My welcome card", de: "Meine Willkommenskarte" },
  timeToFinish: false,
  showResponseCount: false,
};

const baseWorkflowProperties = {
  id: mockId,
  name: "Mock Workflow",
  autoClose: 10,
  delay: 0,
  autoComplete: 7,
  runOnDate: null,
  closeOnDate: currentDate,
  redirectUrl: "http://github.com/typeflowai/typeflowai",
  recontactDays: 3,
  welcomeCard: mockWelcomeCard,
  questions: [mockQuestion],
  thankYouCard: { enabled: false },
  hiddenFields: { enabled: false },
  workflowClosedMessage: {
    enabled: false,
  },
  verifyEmail: {
    name: "verifyEmail",
    subheading: "please verify your email",
  },
  attributeFilters: [],
  ...commonMockProperties,
};

export const mockTeamOutput: TTeam = {
  id: mockId,
  name: "mock Team",
  createdAt: currentDate,
  updatedAt: currentDate,
  billing: {
    stripeCustomerId: null,
    features: {
      inAppWorkflow: {
        status: "inactive",
        unlimited: false,
      },
      linkWorkflow: {
        status: "inactive",
        unlimited: false,
      },
      userTargeting: {
        status: "inactive",
        unlimited: false,
      },
      multiLanguage: {
        status: "inactive",
        unlimited: false,
      },
    },
  },
};

export const mockSyncWorkflowOutput: WorkflowMock = {
  type: "app",
  status: "inProgress",
  displayOption: "respondMultiple",
  triggers: [{ actionClass: mockActionClass }],
  productOverwrites: null,
  singleUse: null,
  styling: null,
  displayPercentage: null,
  createdBy: null,
  pin: null,
  segment: null,
  segmentId: null,
  resultShareKey: null,
  inlineTriggers: null,
  languages: mockWorkflowLanguages,
  ...baseWorkflowProperties,
};

export const mockWorkflowOutput: WorkflowMock = {
  type: "website",
  status: "inProgress",
  displayOption: "respondMultiple",
  triggers: [{ actionClass: mockActionClass }],
  productOverwrites: null,
  singleUse: null,
  styling: null,
  displayPercentage: null,
  createdBy: null,
  pin: null,
  segment: null,
  segmentId: null,
  resultShareKey: null,
  inlineTriggers: null,
  languages: mockWorkflowLanguages,
  ...baseWorkflowProperties,
};

export const createWorkflowInput: TWorkflowInput = {
  type: "website",
  status: "inProgress",
  displayOption: "respondMultiple",
  triggers: [mockActionClass.name],
  ...baseWorkflowProperties,
};

export const updateWorkflowInput: TWorkflow = {
  type: "website",
  status: "inProgress",
  displayOption: "respondMultiple",
  triggers: [mockActionClass.name],
  productOverwrites: null,
  styling: null,
  singleUse: null,
  displayPercentage: null,
  createdBy: null,
  pin: null,
  resultShareKey: null,
  segment: null,
  inlineTriggers: null,
  languages: [],
  ...commonMockProperties,
  ...baseWorkflowProperties,
};

export const mockTransformedWorkflowOutput = {
  ...mockWorkflowOutput,
  triggers: mockWorkflowOutput.triggers.map((trigger) => trigger.actionClass.name),
};

export const mockTransformedSyncWorkflowOutput = {
  ...mockSyncWorkflowOutput,
  triggers: mockWorkflowOutput.triggers.map((trigger) => trigger.actionClass.name),
};
