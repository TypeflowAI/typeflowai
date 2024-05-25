import { createId } from "@paralleldrive/cuid2";

import { OpenAIModel } from "@typeflowai/types/openai";
import {
  AppPieChartIcon,
  ArrowRightCircleIcon,
  ArrowUpRightIcon,
  BaseballIcon,
  CancelSubscriptionIcon,
  CashCalculatorIcon,
  CheckMarkIcon,
  CodeBookIcon,
  DashboardIcon,
  DogChaserIcon,
  DoorIcon,
  EmailIcon,
  FeedbackIcon,
  GaugeSpeedFastIcon,
  HeartCommentIcon,
  InterviewPromptIcon,
  LoadingBarIcon,
  OnboardingIcon,
  PMFIcon,
  TaskListSearchIcon,
  UserSearchGlasIcon,
  VideoTabletAdjustIcon,
} from "@typeflowai/ui/IconsOld";

import { TTemplate, TWorkflowQuestionType } from "./types";

const thankYouCardDefault = {
  enabled: true,
  headline: "Thank you!",
  subheader: "We appreciate your feedback.",
};

const welcomeCardDefault = {
  enabled: true,
  headline: "Welcome!",
  timeToFinish: false,
  showResponseCount: false,
};

export const customWorkflow: TTemplate = {
  name: "Start from scratch",
  description: "Create a workflow without template.",
  icon: null,
  preset: {
    name: "New Workflow",
    questions: [
      {
        id: createId(),
        type: TWorkflowQuestionType.OpenText,
        headline: "Custom Workflow",
        subheader: "This is an example workflow.",
        placeholder: "Type your answer here...",
        inputType: "text",
        longAnswer: true,
        required: true,
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
  {
    name: "Product Market Fit (Superhuman)",
    icon: PMFIcon,
    category: "Marketing",

    description: "Measure PMF by assessing how disappointed users would be if your product disappeared.",
    preset: {
      name: "Product Market Fit (Superhuman)",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How disappointed would you be if you could no longer use TypeflowAI?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Not at all disappointed",
            },
            {
              id: createId(),
              label: "Somewhat disappointed",
            },
            {
              id: createId(),
              label: "Very disappointed",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What is your role?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Founder",
            },
            {
              id: createId(),
              label: "Executive",
            },
            {
              id: createId(),
              label: "Product Manager",
            },
            {
              id: createId(),
              label: "Product Owner",
            },
            {
              id: createId(),
              label: "Software Engineer",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of people do you think would most benefit from TypeflowAI?",
          inputType: "text",
          longAnswer: true,
          required: true,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main benefit you receive from TypeflowAI?",
          inputType: "text",
          longAnswer: true,
          required: true,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "How can we improve our service for you?",
          inputType: "text",
          subheader: "Please be as specific as possible.",
          longAnswer: true,
          required: true,
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
  },

  {
    name: "Onboarding Segmentation",
    icon: OnboardingIcon,
    category: "Marketing",
    description: "Learn more about who signed up to your product and why.",
    preset: {
      name: "Onboarding Segmentation",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What is your role?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Founder",
            },
            {
              id: createId(),
              label: "Executive",
            },
            {
              id: createId(),
              label: "Product Manager",
            },
            {
              id: createId(),
              label: "Product Owner",
            },
            {
              id: createId(),
              label: "Software Engineer",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What's your company size?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "only me",
            },
            {
              id: createId(),
              label: "1-5 employees",
            },
            {
              id: createId(),
              label: "6-10 employees",
            },
            {
              id: createId(),
              label: "11-100 employees",
            },
            {
              id: createId(),
              label: "over 100 employees",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How did you hear about us first?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Recommendation",
            },
            {
              id: createId(),
              label: "Social Media",
            },
            {
              id: createId(),
              label: "Ads",
            },
            {
              id: createId(),
              label: "Google Search",
            },
            {
              id: createId(),
              label: "In a Podcast",
            },
          ],
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
  },
  {
    name: "Uncover Strengths & Weaknesses",
    icon: TaskListSearchIcon,
    category: "Marketing",
    description: "Find out what users like and don't like about your product or offering.",
    preset: {
      name: "Uncover Strengths & Weaknesses",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What do you value most about our service?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Ease of use",
            },
            {
              id: createId(),
              label: "Good value for money",
            },
            {
              id: createId(),
              label: "It's open-source",
            },
            {
              id: createId(),
              label: "The founders are pretty",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What should we improve on?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Documentation",
            },
            {
              id: createId(),
              label: "Customizability",
            },
            {
              id: createId(),
              label: "Pricing",
            },
            {
              id: createId(),
              label: "Humbleness of founders",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Would you like to add something?",
          subheader: "Feel free to speak your mind, we do too.",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Marketing Attribution",
    icon: AppPieChartIcon,
    category: "Marketing",
    description: "How did you first hear about us?",
    preset: {
      name: "Marketing Attribution",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How did you hear about us first?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Recommendation",
            },
            {
              id: createId(),
              label: "Social Media",
            },
            {
              id: createId(),
              label: "Ads",
            },
            {
              id: createId(),
              label: "Google Search",
            },
            {
              id: createId(),
              label: "In a Podcast",
            },
          ],
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
  },
  {
    name: "Churn Workflow",
    icon: CancelSubscriptionIcon,
    category: "Marketing",
    description: "Find out why people cancel their subscriptions. These insights are pure gold!",
    preset: {
      name: "Churn Workflow",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Why did you cancel your subscription?",
          subheader: "We're sorry to see you leave. Please help us do better:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "I didn't get much value out of it",
            },
            {
              id: createId(),
              label: "It's too expensive",
            },
            {
              id: createId(),
              label: "I am missing a feature",
            },
            {
              id: createId(),
              label: "Poor customer service",
            },
            {
              id: createId(),
              label: "I just didn't need it anymore",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "How can we win you back?",
          subheader: "Feel free to speak your mind, we do too.",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Improve Trial Conversion",
    icon: BaseballIcon,
    category: "Marketing",
    description: "Find out why people stopped their trial. These insights help you improve your funnel.",
    preset: {
      name: "Improve Trial Conversion",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Why did you stop your trial?",
          subheader: "Help us understand you better:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "I didn't get much value out of it",
            },
            {
              id: createId(),
              label: "I expected something else",
            },
            {
              id: createId(),
              label: "It's too expensive for what it does",
            },
            {
              id: createId(),
              label: "I am missing a feature",
            },
            {
              id: createId(),
              label: "I was just looking around",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Any details to share?",
          inputType: "text",
          longAnswer: true,
          required: false,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "How are you solving your problem instead?",
          inputType: "text",
          subheader: "Please name alternative tools:",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Changing subscription experience",
    icon: CashCalculatorIcon,
    category: "Marketing",
    description: "Find out what goes through peoples minds when changing their subscriptions.",
    preset: {
      name: "Changing subscription experience",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How easy was it to change your plan?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Extremely difficult",
            },
            {
              id: createId(),
              label: "It took a while, but I got it",
            },
            {
              id: createId(),
              label: "It was alright",
            },
            {
              id: createId(),
              label: "Quite easy",
            },
            {
              id: createId(),
              label: "Very easy, love it!",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Is the pricing information easy to understand?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Yes, very clear.",
            },
            {
              id: createId(),
              label: "I was confused at first, but found what I needed.",
            },
            {
              id: createId(),
              label: "Quite complicated.",
            },
          ],
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
  },
  {
    name: "Measure Task Accomplishment",
    icon: CheckMarkIcon,
    category: "Marketing",
    description: "See if people get their 'Job To Be Done' done. Successful people are better customers.",
    preset: {
      name: "Measure Task Accomplishment",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Were you able to accomplish what you came here to do today?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Yes",
            },
            {
              id: createId(),
              label: "Working on it, boss",
            },
            {
              id: createId(),
              label: "No",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          headline: "How easy was it to achieve your goal?",
          required: true,
          lowerLabel: "Very difficult",
          upperLabel: "Very easy",
          range: 5,
          scale: "number",
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What did you come here to do today?",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Identify Customer Goals",
    icon: ArrowRightCircleIcon,
    category: "Marketing",
    description:
      "Better understand if your messaging creates the right expectations of the value your product provides.",
    preset: {
      name: "Identify Customer Goals",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What's your primary goal for using TypeflowAI?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Understand my user base deeply",
            },
            {
              id: createId(),
              label: "Identify upselling opportunities",
            },
            {
              id: createId(),
              label: "Build the best possible product",
            },
            {
              id: createId(),
              label: "Rule the world to make everyone breakfast brussels sprouts.",
            },
          ],
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
  },
  {
    name: "Feature Chaser",
    icon: DogChaserIcon,
    category: "Marketing",
    description: "Follow up with users who just used a specific feature.",
    preset: {
      name: "Feature Chaser",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          headline: "How easy was it to achieve your goal?",
          required: true,
          lowerLabel: "Very difficult",
          upperLabel: "Very easy",
          range: 5,
          scale: "number",
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Wanna add something?",
          inputType: "text",
          subheader: "This really helps us do better!",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Fake Door Follow-Up",
    icon: DoorIcon,
    category: "Marketing",
    description: "Follow up with users who ran into one of your Fake Door experiments.",
    preset: {
      name: "Fake Door Follow-Up",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          headline: "How important is this feature for you?",
          required: true,
          lowerLabel: "Not important",
          upperLabel: "Very important",
          range: 5,
          scale: "number",
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
  },
  {
    name: "Product Market Fit Workflow (short)",
    icon: PMFIcon,
    category: "Marketing",

    description: "Measure PMF by assessing how disappointed users would be if your product disappeared.",
    preset: {
      name: "Product Market Fit Workflow (short)",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How disappointed would you be if you could no longer use TypeflowAI?",
          subheader: "Please select one of the following options:",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Not at all disappointed",
            },
            {
              id: createId(),
              label: "Somewhat disappointed",
            },
            {
              id: createId(),
              label: "Very disappointed",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "How can we improve our service for you?",
          inputType: "text",
          subheader: "Please be as specific as possible.",
          longAnswer: true,
          required: true,
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
  },
  {
    name: "Feedback Box",
    icon: FeedbackIcon,
    category: "Marketing",
    description: "Give your users the chance to seamlessly share what's on their minds.",
    preset: {
      name: "Feedback Box",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "What's on your mind, boss?",
          subheader: "Thanks for sharing. We'll get back to you asap.",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Bug report 🐞",
            },
            {
              id: createId(),
              label: "Feature Request 💡",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Give us the juicy details:",
          inputType: "text",
          longAnswer: true,
          required: true,
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
  },
  {
    name: "Integration usage workflow",
    icon: DashboardIcon,
    category: "Marketing",
    description: "Evaluate how easily users can add integrations to your product. Find blind spots.",
    preset: {
      name: "Integration Usage Workflow",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How easy was it to set this integration up?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Extremely difficult",
            },
            {
              id: createId(),
              label: "It took a while, but I got it",
            },
            {
              id: createId(),
              label: "It was alright",
            },
            {
              id: createId(),
              label: "Quite easy",
            },
            {
              id: createId(),
              label: "Very easy, love it!",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Which product would you like to integrate next?",
          inputType: "text",
          subheader: "We keep building integrations. Yours can be next:",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "New integration workflow",
    icon: DashboardIcon,
    category: "Marketing",
    description: "Find out which integrations your users would like to see next.",
    preset: {
      name: "New integration workflow",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Which other tools are you using?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "PostHog",
            },
            {
              id: createId(),
              label: "Segment",
            },
            {
              id: createId(),
              label: "Hubspot",
            },
            {
              id: createId(),
              label: "Twilio",
            },
            {
              id: createId(),
              label: "Other",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "If you chose other, please clarify:",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Docs Feedback",
    icon: CodeBookIcon,
    category: "Marketing",
    description: "Measure how clear each page of your developer documentation is.",
    preset: {
      name: "TypeflowAI Docs Feedback",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Was this page helpful?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Yes 👍",
            },
            {
              id: createId(),
              label: "No 👎",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "Please elaborate:",
          inputType: "text",
          longAnswer: true,
          required: false,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          inputType: "url",
          headline: "Page URL",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Interview Prompt",
    icon: InterviewPromptIcon,
    category: "Marketing",
    description: "Invite a specific subset of your users to schedule an interview with your product team.",
    preset: {
      name: "Interview Prompt",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.CTA,
          headline: "Do you have 15 min to talk to us? 🙏",
          html: "You're one of our power users. We would love to interview you briefly!",
          buttonLabel: "Book interview",
          buttonUrl: "https://cal.com/johannes/onboarding?duration=25",
          buttonExternal: true,
          required: false,
          dismissButtonLabel: "Maybe later",
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
  },
  {
    name: "Review Prompt",
    icon: HeartCommentIcon,
    category: "Marketing",
    description: "Invite users who love your product to review it publicly.",
    preset: {
      name: "Review Prompt",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.CTA,
          headline: "You're one of our most valued customers! Please write a review for us.",
          buttonLabel: "Write review",
          buttonUrl: "https://typeflowai.com/github",
          buttonExternal: true,
          required: false,
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
  },
  {
    name: "Net Promoter Score (NPS)",
    icon: GaugeSpeedFastIcon,
    category: "Marketing",
    description: "Measure the Net Promoter Score of your product.",
    preset: {
      name: "TypeflowAI NPS",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.NPS,
          headline: "How likely are you to recommend TypeflowAI to a friend or colleague?",
          required: false,
          lowerLabel: "Not likely",
          upperLabel: "Very likely",
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
  },
  {
    name: "Identify upsell opportunities",
    icon: ArrowUpRightIcon,
    category: "Marketing",
    description: "Find out how much time your product saves your user. Use it to upsell.",
    preset: {
      name: "Identify upsell opportunities",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "How many hours does your team save per week by using TypeflowAI?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Less than 1 hour",
            },
            {
              id: createId(),
              label: "1 to 2 hours",
            },
            {
              id: createId(),
              label: "3 to 5 hours",
            },
            {
              id: createId(),
              label: "5+ hours",
            },
          ],
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
  },
  {
    name: "Build Product Roadmap",
    icon: LoadingBarIcon,
    category: "Marketing",
    description: "Ask how users rate your product. Identify blind spots to build your roadmap.",
    preset: {
      name: "Build Product Roadmap",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          headline: "How satisfied are you with the features of TypeflowAI?",
          required: true,
          lowerLabel: "Not satisfied",
          upperLabel: "Very satisfied",
          scale: "number",
          range: 5,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the #1 thing you'd like to change in TypeflowAI?",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Gauge Feature Satisfaction",
    icon: UserSearchGlasIcon,
    category: "Marketing",
    description: "Evaluate the satisfaction of specific features of your product.",
    preset: {
      name: "Gauge Feature Satisfaction",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          headline: "How easy was it to achieve ... ?",
          required: true,
          lowerLabel: "Not easy",
          upperLabel: "Very easy",
          scale: "number",
          range: 5,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What is one thing we could do better?",
          inputType: "text",
          longAnswer: true,
          required: false,
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
  },
  {
    name: "Marketing Site Clarity",
    icon: VideoTabletAdjustIcon,
    category: "Marketing",
    description: "Identify users dropping off your marketing site. Improve your messaging.",
    preset: {
      name: "Marketing Site Clarity",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.MultipleChoiceSingle,
          headline: "Do you have all the info you need to give TypeflowAI a try?",
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: createId(),
              label: "Yes, totally",
            },
            {
              id: createId(),
              label: "Kind of...",
            },
            {
              id: createId(),
              label: "No, not at all",
            },
          ],
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.OpenText,
          headline: "What’s missing or unclear to you about TypeflowAI?",
          inputType: "text",
          longAnswer: true,
          required: false,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.CTA,
          headline: "Thanks for your answer! Get 25% off your first 6 months:",
          required: false,
          buttonLabel: "Get discount",
          buttonUrl: "https://dashboard.typeflowai.com/auth/signup",
          buttonExternal: true,
        },
        {
          id: createId(),
          type: TWorkflowQuestionType.FileUpload,
          headline: "Upload file",
          required: false,
          allowMultipleFiles: false,
          maxSizeInMB: 10,
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
  },
  {
    name: "Improve Newsletter Content",
    icon: EmailIcon,
    category: "Marketing",
    description: "Find out how your subscribers like your newsletter content.",
    objectives: ["increase_conversion", "sharpen_marketing_messaging"],
    preset: {
      name: "Improve Newsletter Content",
      questions: [
        {
          id: createId(),
          type: TWorkflowQuestionType.Rating,
          logic: [
            { value: "5", condition: "equals", destination: "l2q1chqssong8n0xwaagyl8g" },
            { value: "5", condition: "lessThan", destination: "k3s6gm5ivkc5crpycdbpzkpa" },
          ],
          range: 5,
          scale: "smiley",
          headline: "How would you rate this weeks newsletter?",
          required: true,
          subheader: "",
          lowerLabel: "Meh",
          upperLabel: "Great",
        },
        {
          id: "k3s6gm5ivkc5crpycdbpzkpa",
          type: TWorkflowQuestionType.OpenText,
          logic: [
            { condition: "submitted", destination: "end" },
            { condition: "skipped", destination: "end" },
          ],
          headline: "What would have made this weeks newsletter more helpful?",
          required: false,
          placeholder: "Type your answer here...",
          inputType: "text",
        },
        {
          id: "l2q1chqssong8n0xwaagyl8g",
          html: '<p class="fb-editor-paragraph" dir="ltr"><span>Who thinks like you? You\'d do us a huge favor if you\'d share this weeks episode with your brain friend!</span></p>',
          type: TWorkflowQuestionType.CTA,
          headline: "Thanks! ❤️ Spread the love with ONE friend.",
          required: false,
          buttonUrl: "https://typeflowai.com",
          buttonLabel: "Happy to help!",
          buttonExternal: true,
          dismissButtonLabel: "Find your own friends",
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
      welcomeCard: welcomeCardDefault,
      thankYouCard: thankYouCardDefault,
      hiddenFields: {
        enabled: false,
      },
    },
  },
];

export const findTemplateByName = (name: string): TTemplate | undefined => {
  return templates.find((template) => template.name === name);
};
