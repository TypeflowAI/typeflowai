import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionTypeEnum,
  TWorkflowThankYouCard,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

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

export const vaTemplates: TTemplate[] = [
  {
    name: "Team Productivity Performance",
    icon: "TeamIcon",
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Optimize team productivity with personalized insights and recommendations.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Team Productivity Performance",
      icon: "TeamIcon",
      questions: [
        {
          id: "team-member",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of the team member?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What area would you like to improve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "problem",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What problem would you like to solve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can I improve @team-member's performance at @area ?
        - "Help me identify the root cause of @problem and provide a solution to improve  @team-member 's performance."
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "To-do List Generator",
    icon: "TodoIcon",
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Generate personalized daily to-do lists to enhance productivity.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "To-do List Generator",
      icon: "TodoIcon",
      questions: [
        {
          id: "deadline",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "When is the deadline?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "tasks",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the tasks?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you make a schedule of tasks that need to be completed by @deadline? Please prioritize tasks: @tasks, and provide an estimated time for each task. Also, could you add any alerts that I may need?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Basic Project Plans",
    icon: "ProjectPlannerIcon",
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Automate project plan creation, saving time and effort.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Basic Project Plans",
      icon: "ProjectPlannerIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is their industry?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "specifics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe specifics" },
          subheader: { default: "Such as project scope, deliverables, and stakeholder" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Assist in creating a project plan for @client-name that aligns with their @industry standards and requirements? @specifics
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Daily Task Reports",
    icon: "TaskIcon",
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Generate daily task reports, saving time for virtual assistants.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Daily Task Reports",
      icon: "TaskIcon",
      questions: [
        {
          id: "team-member",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of the team member?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "information",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add more information for the report " },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you generate a detailed report on @team-member 's today/yesterday/the past week tasks, including the progress made on each task, any issues encountered, and any upcoming deadlines? @information.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "High-performance Time Management",
    icon: "ClockIcon",
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Transform your team's productivity landscape with advanced time management strategies.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "High-performance Time Management",
      icon: "ClockIcon",
      questions: [
        {
          id: "team-size",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many members do you have in your team?" },
          subheader: { default: "E.g. 15 members" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "productivity-challenges",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the current productivity challenges?" },
          subheader: {
            default: "Inconsistent productivity levels, frequent overtime, poor task prioritization",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are "Time Mastery GPT," an AI productivity coach specialized in optimizing time management for high-performance teams. Your expertise includes advanced techniques in time allocation, priority setting, and eliminating inefficiencies in work processes.
        
        Goal:
        To revolutionize the way high-performance teams manage their time, aiming to drastically increase productivity while maintaining a healthy work-life balance. The objective is to identify and eliminate time wasters, optimize workflows, and ensure that every team member is operating at peak efficiency.
        
        Time Management Optimization Structure:
        1. Individual Time Audit (How can we conduct a thorough time audit for each team member to identify inefficiencies?)
        2. Prioritization Frameworks (What advanced prioritization techniques can we implement to ensure focus on high-impact tasks?)
        3. Workflow Optimization (How can we redesign workflows to minimize time wastage and maximize output?)
        4. Collaboration and Delegation (What strategies can be applied to improve collaboration and effective delegation within the team?)
        5. Mindset and Time Perception (How can we cultivate a mindset that enhances time perception and encourages proactive time management?)
        
        Time Management Criteria:
        - Propose 2 sophisticated and innovative solutions for each aspect of time management.
        - Emphasize strategies that leverage technology and data analytics for time tracking and optimization.
        - Include techniques that are scalable and adaptable to different team sizes and industries.
        - Focus on sustainable practices that promote long-term productivity and prevent burnout.
        - Ensure the solutions foster a culture of efficiency, collaboration, and continuous improvement.
        
        Information About The Team:
        Team Size: @team-size
        Industry: @industry
        Current Productivity Challenges: @productivity-challenges
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Travel itineraries",
    icon: "AirplaneIcon",
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Simplify travel planning with recommendations and booking assistance.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Travel itineraries",
      icon: "AirplaneIcon",
      questions: [
        {
          id: "length-trip",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the length of the trip?" },
          subheader: { default: "E.g. 15 days" },
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination?" },
          subheader: { default: "E.g. Paris" },
          required: true,
          inputType: "text",
        },
        {
          id: "number-people",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many people are going to the trip?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me plan a @length-trip trip to @destination for @number-people? I'm looking for recommendations on activites/attractions and restaurantes to try.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Travel Options Seeker",
    icon: "TravelOptionsIcon",
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Research travel options, providing comprehensive results to customers' queries.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Travel Options Seeker",
      icon: "TravelOptionsIcon",
      questions: [
        {
          id: "destination",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination?" },
          subheader: { default: "E.g. Paris" },
          required: true,
          inputType: "text",
        },
        {
          id: "number-people",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many people are going to the trip?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "month",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What month would you like to travel?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "activity",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of activity do you like to research?" },
          subheader: { default: "E.g. 15 days" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you please research the best @activity options in @destination for @number-people people during @month?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Workout Plans",
    icon: "WorkoutIcon",
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Workout plans tailored to your fitness goals, preferences, and limitations.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Workout Plans",
      icon: "WorkoutIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "client-gender",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "muscle-group",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What muscle group do you want to focus the plan on?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "health-condition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the health condition of your client" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "workout-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of workout does your client prefer" },
          subheader: { default: "E.g. Cardio/strength/flexibility" },
          required: true,
          inputType: "text",
        },
        {
          id: "client-level",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your client's fitness level?" },
          subheader: { default: "E.g. beginner/intermediate/advanced" },
          required: true,
          inputType: "text",
        },
        {
          id: "equipment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Do you want to recommend exercises with or without equipment?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you create a workout plan for @client-name that focuses on @muscle-group? He/She has @health-condition that limits his/her ability to do certain exercises, so please keep that in mind. He/She also prefers @workout-type workouts and has @client-level fitness level. Can you include some @equipement exercises as well?
        - Client Gender: @client-gender

        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Expert Translator",
    icon: "TranslateIcon",
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Address translation challenges by providing expert, context-aware assistance.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Expert Translator",
      icon: "TranslateIcon",
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "E.g., English" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "E.g., Japanese" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry-context",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your industry or context?" },
          subheader: { default: "E.g., Software Development" },
          required: true,
          inputType: "text",
        },
        {
          id: "tones",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Specific Nuances/Tones" },
          subheader: { default: "E.g. formal, persuasive" },
          required: true,
          inputType: "text",
        },
        {
          id: "original-text",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the original text" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are a Translation Expert GPT, a linguistic specialist adept in multiple languages and familiar with various industry terminologies. You excel in providing translations that not only convey the literal meaning but also capture the nuances and specific jargon relevant to different sectors.
        
        GOAL:
        I need translations for business documents, emails, or communications that are accurate, culturally appropriate, and industry-specific. Your assistance will ensure I can effectively communicate with international partners, clients, and stakeholders.
        
        TRANSLATION PROCESS:
        Provide the original text to be translated.
        Specify the target language.
        Indicate the industry or context (e.g., legal, tech, healthcare).
        Highlight any specific nuances or tones that need to be maintained.
        
        TRANSLATION CRITERIA:
        - Ensure translations are not only linguistically accurate but also culturally and contextually appropriate.
        - Pay special attention to industry-specific terminologies and phrases.
        - Maintain the tone, style, and intent of the original text.
        - Avoid literal translations that might misrepresent the meaning.
        - Prioritize clarity and readability in the target language.
        
        INFORMATION ABOUT MY REQUIREMENTS:
        1. Source Language: @source-language
        2. Target Language: @target-language
        3. Industry/Context: @industry
        4. Specific Nuances/Tones: @tones
        5. Original Text: @original-text
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Emails & Messages Translator",
    icon: "TranslateIcon",
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Translate emails and messages and streamline communication globally.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Emails & Messages Translator",
      icon: "TranslateIcon",
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "E.g., English" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "E.g., Japanese" },
          required: true,
          inputType: "text",
        },
        {
          id: "message",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the text to translate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Translate this email/message from @source-language to @target-language, please:
        @message
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Document Translator",
    icon: "TranslateIcon",
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Facilitate global communication for businesses and individuals.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Document translator",
      icon: "TranslateIcon",
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "E.g., English" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "E.g., Japanese" },
          required: true,
          inputType: "text",
        },
        {
          id: "document-info",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the document info to translate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you translate from @source-language to @target-language for me, please?
        @document-info
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Text Translator",
    icon: "TranslateIcon",
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Precise and context-aware translations across various text types and languages.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Text Translator",
      icon: "TranslateIcon",
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "E.g., English" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "E.g., Japanese" },
          required: true,
          inputType: "text",
        },
        {
          id: "text",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the text to translate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "How can I translate from @source-language to @target-language while preserving its contextual information?
        @text
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Legal Documents Translator",
    icon: "LegalIcon",
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Receive translated documents instantly to save time.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Legal Documents Translator",
      icon: "LegalIcon",
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "E.g., English" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of your client?" },
          subheader: { default: "E.g., Japanese" },
          required: true,
          inputType: "text",
        },
        {
          id: "text",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the text to translate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        How can I translate a @source-language legal document to @target-language ?
        @text
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "AWS Cloud Formation Templates",
    icon: "AwsIcon",
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Streamline the creation of AWS Cloud Formation by producing accurate templates.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "AWS Cloud Formation Templates",
      icon: "AwsIcon",
      questions: [
        {
          id: "subnets",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many subnets would you like to create?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "I need your assistance in generating a Cloud Formation template that creates a VPC with @subnets and an internet gateway. The VPC should have security groups and network acls configured for inbound and outbound traffic. Could you help me with that?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Software Documentation Writer",
    icon: "ComputerIcon",
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Create software documentation with a virtual assistant, ensuring accuracy and clarity.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Software Documentation Writer",
      icon: "ComputerIcon",
      questions: [
        {
          id: "software",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your software about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some features of your software" },
          subheader: { default: "E.g. features,functions,components" },
          required: true,
          inputType: "text",
        },
        {
          id: "information",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add some extra information that should be included" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you create a comprehensive guide for our @software software?
        - Our software has several @features that need documentation. Can you create some guides for each?
        - @information
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "API Documentation Writer",
    icon: "ApiIcon",
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Generate custom APIs tailored to your business needs, enhancing operations.",
    objectives: ["innovate_and_develop", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "API Documentation Writer",
      icon: "ApiIcon",
      questions: [
        {
          id: "source",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the source?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "destinaion",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your company?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I'm looking for a virtual assistant to build an API that connects @source to @destination. @company-name would like the API to be scalable and secure. Can you help us with that?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Hybrid Events Engagement",
    icon: "EventIcon",
    category: "Virtual Assistant",
    subcategory: "Event Planning",
    description: "Develop strategies that maximize engagement and interaction in hybrid events.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Hybrid Events Engagement",
      icon: "EventIcon",
      questions: [
        {
          id: "event-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of event is?" },
          subheader: { default: "E.g. International Business Conference" },
          required: true,
          inputType: "text",
        },
        {
          id: "expected-attendance",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the expected attendace?" },
          subheader: { default: "E.g. 1000 in-person, 2000+ virtual attendees" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the location" },
          subheader: { default: "E.g. Major convention center with advanced tech facilities" },
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the budget contrains?" },
          subheader: { default: "E.g. High, with a focus on innovative and impactful solutions" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are "Hybrid Event Maestro GPT," an AI expert in the field of hybrid event planning - events that combine both in-person and virtual elements. Your expertise includes integrating technology, enhancing participant engagement, and ensuring seamless experiences for both physical and remote attendees.
        
        Goal:
        To develop strategies that maximize engagement and interaction in hybrid events, ensuring that both in-person and virtual attendees have a fulfilling and immersive experience. The aim is to bridge the gap between physical and virtual spaces, creating a cohesive event environment.
        
        Hybrid Event Engagement Structure:
        - Tech Integration (What technology can be used to seamlessly connect in-person and virtual audiences?)
        - Interactive Sessions (How can we design sessions that are equally engaging for both types of attendees?)
        - Networking Opportunities (What methods can be implemented to facilitate networking between in-person and virtual attendees?)
        - Content Accessibility (How can we ensure that all content is equally accessible and engaging for everyone?)
        - Feedback and Participation (What strategies can be used to encourage active feedback and participation from all attendees?)
        
        Hybrid Event Engagement Criteria:
        Propose 4 innovative and practical engagement strategies for each aspect of hybrid event planning.
        Focus on technological solutions that enhance interaction without causing complexity or technical difficulties.
        Include cost-effective strategies that add value to the event without significantly increasing the budget.
        Ensure inclusivity, considering diverse audience needs and preferences in both physical and virtual settings.
        Emphasize real-time interaction and engagement to create a unified event experience.
        
        Information About The Event:
        - Event Type: @event-type
        - Expected Attendance: @expected-attendance
        - Location: @location
        - Budget Constraints: @budget
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Event Environmental Impact Mitigator",
    icon: "FactoryIcon",
    category: "Virtual Assistant",
    subcategory: "Event Planning",
    description: "Plan and execute events that adhere to high environmental standards",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Event Environmental Impact Mitigator",
      icon: "FactoryIcon",
      questions: [
        {
          id: "event-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of event is?" },
          subheader: { default: "E.g. Corporate Conference" },
          required: true,
          inputType: "text",
        },
        {
          id: "expected-attendance",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the expected attendace?" },
          subheader: { default: "E.g. Approximately 500 people" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the location" },
          subheader: { default: "E.g. Urban area with access to public transportation" },
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the budget contrains?" },
          subheader: { default: "E.g. Moderate, with a focus on cost-effective sustainability" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are "Green Event Planner GPT," a specialized AI in event planning with a focus on sustainability and eco-friendliness. Your expertise encompasses green practices, environmentally friendly materials, and sustainable event management strategies.
        
        Goal:
        To assist in planning and executing events that are not only successful but also adhere to high environmental standards. The objective is to reduce the carbon footprint and environmental impact of events while ensuring a memorable and engaging experience for attendees.
        
        Sustainable Event Planning Structure:
        - Venue Selection (How can we choose and optimize venues for minimal environmental impact?)
        - Eco-Friendly Materials and Supplies (What sustainable materials and supplies can be used for event setup?)
        - Waste Management and Reduction (How can we effectively manage and minimize waste before, during, and after the event?)
        - Energy Efficiency and Conservation (What strategies can be implemented to reduce energy consumption?)
        - Engagement and Education (How can we educate and engage attendees about sustainability efforts in a fun and interactive way?)
        
        Sustainable Event Planning Criteria:
        - Provide 3 creative and feasible solutions for each aspect of sustainable event planning.
        - Focus on innovative approaches that go beyond basic recycling and energy-saving practices.
        - Include solutions that are scalable and adaptable to various event sizes and types.
        - Ensure that the solutions are cost-effective and offer potential cost savings in the long run.
        - Highlight the marketing and PR advantages of hosting sustainable events, enhancing the appeal to eco-conscious attendees and sponsors.
        
        Information About The Event:
        Event Type: @event-type
        Expected Attendance: @expected-attendace
        Location: @location
        Budget Constraints: @budget
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Copy",
    icon: "RealStateIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate engaging real estate blog content effortlessly.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Real Estate Copy",
      icon: "RealStateIcon",
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many words should have the post?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What city/neighborhood is the property in?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some features of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How would you craft a blog post of @number-words that highlights the top 5 home features to look for when buying a property in @location? Please focus on @features , and provide examples of properties that showcase these features.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Ad Copy",
    icon: "AdsIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create real estate ad copy to captivate potential buyers.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Real Estate Ad Copy",
      icon: "AdsIcon",
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type of property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What city/neighborhood is the property in?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "state",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What state is the property in?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "bedrooms",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many bedrooms?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "bathrooms",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many bathrooms?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some features of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you please generate a description for a @property-type located in @city , @state ? Please include @bedrooms, @bathrooms , and any @features that make this property unique.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Flyers",
    icon: "FlyerIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate real estate flyers ensuring engaging content for your audience.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Generate real estate flyers",
      icon: "FlyerIcon",
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type of property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some features of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you generate a nice real estate flyer for @property-type that feature its @features ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Website Copy",
    icon: "RealStateIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate engaging real estate website content quickly.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Real Estate Website Copy",
      icon: "RealStateIcon",
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many words should have the post?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "property-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type of property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the location of the property?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some features of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "benefits",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some benefits of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you generate @number-words words of website content for a @property-type in @location , highlighting its @features , and showcasing its @benefits to the target audience?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Offer Letters",
    icon: "RealStateLetterIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create real estate offer letters to secure a deal.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Real Estate Offer Letters",
      icon: "RealStateLetterIcon",
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many words should have the letters?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "property-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type of property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the city of the property?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "key-selling-points",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some key selling points of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you generate a @number-words real estate offer letter for @property-type in @city , with emphasis on @key-selling-points ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Real Estate Listings Writer",
    icon: "ListingIcon",
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create compelling real estate listings in no time.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Real Estate Listings Writer",
      icon: "ListingIcon",
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type of property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the location of the property?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience for the listing?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some features of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "amenities",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe some amenities of the property" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need to create a real estate listing for a @property-type in @location that will appeal to @target-audience. Can you provide me with research on @features and @amenities that would be important to highlight?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Visa Requirements",
    icon: "VisaIcon",
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Streamline the process of obtaining visa requirements.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Visa Requirements",
      icon: "VisaIcon",
      questions: [
        {
          id: "nationality",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your nationality?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "visa-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of visa do you need?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the entry/exit restrictions for @nationality citizens traveling to @destination on a @visa-type visa?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Travel Insurance Options",
    icon: "TravelInsuranceIcon",
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Assist users in exploring travel insurance options.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Travel Insurance Options",
      icon: "TravelInsuranceIcon",
      questions: [
        {
          id: "duration",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many days are you travelling?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "deaperture-city",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the deaperture city?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "start-date",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Start date of the travel" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you suggest me travel insurance plans for a @duration day trip to @destination departing from @deaperture-city on @start-date ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Destination Guides Writer",
    icon: "DestinationIcon",
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Create engaging and personalized destination guides.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Destination Guides Writer",
      icon: "DestinationIcon",
      questions: [
        {
          id: "activity",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of activity would you like to do?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the destination city?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me generate some unique @activity ideas to add to my destination guide on @city ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Hotel Reviews Writer",
    icon: "HotelIcon",
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Write personalized hotel reviews effortlessly.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Hotel Reviews Writer",
      icon: "HotelIcon",
      questions: [
        {
          id: "review-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Do you want to create a positive or negative review?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "hotel-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of the hotel that you recently stayed at?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Could you please write a @review-type review for the @hotel-name that I recently stayed at?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
    },
  },
];
