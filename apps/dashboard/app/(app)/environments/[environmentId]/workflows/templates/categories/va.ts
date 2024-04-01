import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import adsIcon from "@typeflowai/ui/icons/templates/ads.svg";
import airplaneIcon from "@typeflowai/ui/icons/templates/airplane.svg";
import apiIcon from "@typeflowai/ui/icons/templates/api.svg";
import awsIcon from "@typeflowai/ui/icons/templates/aws.svg";
import clockIcon from "@typeflowai/ui/icons/templates/clock.svg";
import computerIcon from "@typeflowai/ui/icons/templates/computer.svg";
import destinationIcon from "@typeflowai/ui/icons/templates/destination.svg";
import eventIcon from "@typeflowai/ui/icons/templates/event.svg";
import factoryIcon from "@typeflowai/ui/icons/templates/factory.svg";
import flyerIcon from "@typeflowai/ui/icons/templates/flyer.svg";
import hotelIcon from "@typeflowai/ui/icons/templates/hotel.svg";
import legalIcon from "@typeflowai/ui/icons/templates/legal.svg";
import listingIcon from "@typeflowai/ui/icons/templates/listing.svg";
import projectIcon from "@typeflowai/ui/icons/templates/project-planner.svg";
import realStateLetterIcon from "@typeflowai/ui/icons/templates/real-state-letter.svg";
import realstateIcon from "@typeflowai/ui/icons/templates/real-state.svg";
import taskIcon from "@typeflowai/ui/icons/templates/task.svg";
import teamIcon from "@typeflowai/ui/icons/templates/team.svg";
import todoIcon from "@typeflowai/ui/icons/templates/todo.svg";
import translateIcon from "@typeflowai/ui/icons/templates/translate.svg";
import travelInsuranceIcon from "@typeflowai/ui/icons/templates/travel-insurance.svg";
import travelOptionsIcon from "@typeflowai/ui/icons/templates/travel-options.svg";
import visaIcon from "@typeflowai/ui/icons/templates/visa.svg";
import workoutIcon from "@typeflowai/ui/icons/templates/workout.svg";

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

export const vaTemplates: TTemplate[] = [
  {
    name: "Team Productivity Performance",
    icon: teamIcon.src,
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Optimize team productivity with personalized insights and recommendations.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Team Productivity Performance",
      welcomeCard: welcomeCardDefault,
      icon: teamIcon.src,
      questions: [
        {
          id: "team-member",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the team member?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionType.OpenText,
          headline: "What area would you like to improve?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "problem",
          type: TWorkflowQuestionType.OpenText,
          headline: "What problem would you like to solve?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can I improve @team-member's performance at @area ?
        - "Help me identify the root cause of @problem and provide a solution to improve  @team-member 's performance."
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "To-do List Generator",
    icon: todoIcon.src,
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Generate personalized daily to-do lists to enhance productivity.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "To-do List Generator",
      welcomeCard: welcomeCardDefault,
      icon: todoIcon.src,
      questions: [
        {
          id: "deadline",
          type: TWorkflowQuestionType.OpenText,
          headline: "When is the deadline?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "tasks",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the tasks?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you make a schedule of tasks that need to be completed by @deadline? Please prioritize tasks: @tasks, and provide an estimated time for each task. Also, could you add any alerts that I may need?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Basic Project Plans",
    icon: projectIcon.src,
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Automate project plan creation, saving time and effort.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Basic Project Plans",
      welcomeCard: welcomeCardDefault,
      icon: projectIcon.src,
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the client name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is their industry?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "specifics",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe specifics",
          subheader: "Such as project scope, deliverables, and stakeholder",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Assist in creating a project plan for @client-name that aligns with their @industry standards and requirements? @specifics
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Daily Task Reports",
    icon: taskIcon.src,
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Generate daily task reports, saving time for virtual assistants.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Daily Task Reports",
      welcomeCard: welcomeCardDefault,
      icon: taskIcon.src,
      questions: [
        {
          id: "team-member",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the team member?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "information",
          type: TWorkflowQuestionType.OpenText,
          headline: "Add more information for the report ",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you generate a detailed report on @team-member 's today/yesterday/the past week tasks, including the progress made on each task, any issues encountered, and any upcoming deadlines? @information.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "High-performance Time Management",
    icon: clockIcon.src,
    category: "Virtual Assistant",
    subcategory: "Productivity",
    description: "Transform your team's productivity landscape with advanced time management strategies.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "High-performance Time Management",
      welcomeCard: welcomeCardDefault,
      icon: clockIcon.src,
      questions: [
        {
          id: "team-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many members do you have in your team?",
          subheader: "E.g. 15 members",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "productivity-challenges",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the current productivity challenges?",
          subheader: "Inconsistent productivity levels, frequent overtime, poor task prioritization",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
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
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Travel itineraries",
    icon: airplaneIcon.src,
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Simplify travel planning with recommendations and booking assistance.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Travel itineraries",
      welcomeCard: welcomeCardDefault,
      icon: airplaneIcon.src,
      questions: [
        {
          id: "length-trip",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the length of the trip?",
          subheader: "E.g. 15 days",
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination?",
          subheader: "E.g. Paris",
          required: true,
          inputType: "text",
        },
        {
          id: "number-people",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many people are going to the trip?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me plan a @length-trip trip to @destination for @number-people? I'm looking for recommendations on activites/attractions and restaurantes to try.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Travel Options Seeker",
    icon: travelOptionsIcon.src,
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Research travel options, providing comprehensive results to customers' queries.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Travel Options Seeker",
      welcomeCard: welcomeCardDefault,
      icon: travelOptionsIcon.src,
      questions: [
        {
          id: "destination",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination?",
          subheader: "E.g. Paris",
          required: true,
          inputType: "text",
        },
        {
          id: "number-people",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many people are going to the trip?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "month",
          type: TWorkflowQuestionType.OpenText,
          headline: "What month would you like to travel?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "activity",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of activity do you like to research?",
          subheader: "E.g. 15 days",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you please research the best @activity options in @destination for @number-people people during @month?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Workout Plans",
    icon: workoutIcon.src,
    category: "Virtual Assistant",
    subcategory: "Personal Assitence",
    description: "Workout plans tailored to your fitness goals, preferences, and limitations.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Workout Plans",
      welcomeCard: welcomeCardDefault,
      icon: workoutIcon.src,
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the client name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "client-gender",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the gender of your client?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "muscle-group",
          type: TWorkflowQuestionType.OpenText,
          headline: "What muscle group do you want to focus the plan on?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "health-condition",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the health condition of your client",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "workout-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of workout does your client prefer",
          subheader: "E.g. Cardio/strength/flexibility",
          required: true,
          inputType: "text",
        },
        {
          id: "client-level",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your client's fitness level?",
          subheader: "E.g. beginner/intermediate/advanced",
          required: true,
          inputType: "text",
        },
        {
          id: "equipment",
          type: TWorkflowQuestionType.OpenText,
          headline: "Do you want to recommend exercises with or without equipment?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you create a workout plan for @client-name that focuses on @muscle-group? He/She has @health-condition that limits his/her ability to do certain exercises, so please keep that in mind. He/She also prefers @workout-type workouts and has @client-level fitness level. Can you include some @equipement exercises as well?
        - Client Gender: @client-gender

        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Expert Translator",
    icon: translateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Address translation challenges by providing expert, context-aware assistance.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Expert Translator",
      welcomeCard: welcomeCardDefault,
      icon: translateIcon.src,
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "E.g., English",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "WWhat is the gender of your client?",
          subheader: "E.g., Japanese",
          required: true,
          inputType: "text",
        },
        {
          id: "industry-context",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your industry or context?",
          subheader: "E.g., Software Development",
          required: true,
          inputType: "text",
        },
        {
          id: "industry-context",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific Nuances/Tones",
          subheader: "E.g. formal, persuasive",
          required: true,
          inputType: "text",
        },
        {
          id: "original-text",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the original text",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
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
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Emails & Messages Translator",
    icon: translateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Translate emails and messages and streamline communication globally.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Emails & Messages Translator",
      welcomeCard: welcomeCardDefault,
      icon: translateIcon.src,
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "E.g., English",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "WWhat is the gender of your client?",
          subheader: "E.g., Japanese",
          required: true,
          inputType: "text",
        },
        {
          id: "message",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the text to translate",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Translate this email/message from @source-language to @target-language, please:
        @message
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Document Translator",
    icon: translateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Facilitate global communication for businesses and individuals.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Document translator",
      welcomeCard: welcomeCardDefault,
      icon: translateIcon.src,
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "E.g., English",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "WWhat is the gender of your client?",
          subheader: "E.g., Japanese",
          required: true,
          inputType: "text",
        },
        {
          id: "document-info",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the document info to translate",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you translate from @source-language to @target-language for me, please?
        @document-info
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Text Translator",
    icon: translateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Precise and context-aware translations across various text types and languages.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Text Translator",
      welcomeCard: welcomeCardDefault,
      icon: translateIcon.src,
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "E.g., English",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "WWhat is the gender of your client?",
          subheader: "E.g., Japanese",
          required: true,
          inputType: "text",
        },
        {
          id: "text",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the text to translate",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "How can I translate from @source-language to @target-language while preserving its contextual information?
        @text
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Legal Documents Translator",
    icon: legalIcon.src,
    category: "Virtual Assistant",
    subcategory: "Translation",
    description: "Receive translated documents instantly to save time.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Legal Documents Translator",
      welcomeCard: welcomeCardDefault,
      icon: legalIcon.src,
      questions: [
        {
          id: "source-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "E.g., English",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionType.OpenText,
          headline: "WWhat is the gender of your client?",
          subheader: "E.g., Japanese",
          required: true,
          inputType: "text",
        },
        {
          id: "text",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the text to translate",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        How can I translate a @source-language legal document to @target-language ?
        @text
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "AWS Cloud Formation Templates",
    icon: awsIcon.src,
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Streamline the creation of AWS Cloud Formation by producing accurate templates.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "AWS Cloud Formation Templates",
      welcomeCard: welcomeCardDefault,
      icon: awsIcon.src,
      questions: [
        {
          id: "subnets",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many subnets would you like to create?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "I need your assistance in generating a Cloud Formation template that creates a VPC with @subnets and an internet gateway. The VPC should have security groups and network acls configured for inbound and outbound traffic. Could you help me with that?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Software Documentation Writer",
    icon: computerIcon.src,
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Create software documentation with a virtual assistant, ensuring accuracy and clarity.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Software Documentation Writer",
      welcomeCard: welcomeCardDefault,
      icon: computerIcon.src,
      questions: [
        {
          id: "software",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your software about?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some features of your software",
          subheader: "E.g. features,functions,components",
          required: true,
          inputType: "text",
        },
        {
          id: "information",
          type: TWorkflowQuestionType.OpenText,
          headline: "Add some extra information that should be included",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you create a comprehensive guide for our @software software?
        - Our software has several @features that need documentation. Can you create some guides for each?
        - @information
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "API Documentation Writer",
    icon: apiIcon.src,
    category: "Virtual Assistant",
    subcategory: "IT",
    description: "Generate custom APIs tailored to your business needs, enhancing operations.",
    objectives: ["innovate_and_develop", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "API Documentation Writer",
      welcomeCard: welcomeCardDefault,
      icon: apiIcon.src,
      questions: [
        {
          id: "source",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the source?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "destinaion",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of your company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm looking for a virtual assistant to build an API that connects @source to @destination. @company-name would like the API to be scalable and secure. Can you help us with that?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Hybrid Events Engagement",
    icon: eventIcon.src,
    category: "Virtual Assistant",
    subcategory: "Event Planning",
    description: "Develop strategies that maximize engagement and interaction in hybrid events.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Hybrid Events Engagement",
      welcomeCard: welcomeCardDefault,
      icon: eventIcon.src,
      questions: [
        {
          id: "event-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of event is?",
          subheader: "E.g. International Business Conference",
          required: true,
          inputType: "text",
        },
        {
          id: "expected-attendance",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the expected attendace?",
          subheader: "E.g. 1000 in-person, 2000+ virtual attendees",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the location",
          subheader: "E.g. Major convention center with advanced tech facilities",
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the budget contrains?",
          subheader: "E.g. High, with a focus on innovative and impactful solutions",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
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
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Event Environmental Impact Mitigator",
    icon: factoryIcon.src,
    category: "Virtual Assistant",
    subcategory: "Event Planning",
    description: "Plan and execute events that adhere to high environmental standards",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Event Environmental Impact Mitigator",
      welcomeCard: welcomeCardDefault,
      icon: factoryIcon.src,
      questions: [
        {
          id: "event-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of event is?",
          subheader: "E.g. Corporate Conference",
          required: true,
          inputType: "text",
        },
        {
          id: "expected-attendance",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the expected attendace?",
          subheader: "E.g. Approximately 500 people",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the location",
          subheader: "E.g. Urban area with access to public transportation",
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the budget contrains?",
          subheader: "E.g. Moderate, with a focus on cost-effective sustainability",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
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
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Copy",
    icon: realstateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate engaging real estate blog content effortlessly.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Real Estate Copy",
      welcomeCard: welcomeCardDefault,
      icon: realstateIcon.src,
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many words should have the post?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What city/neighborhood is the property in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some features of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How would you craft a blog post of @number-words that highlights the top 5 home features to look for when buying a property in @location? Please focus on @features , and provide examples of properties that showcase these features.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Ad Copy",
    icon: adsIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create real estate ad copy to captivate potential buyers.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Real Estate Ad Copy",
      welcomeCard: welcomeCardDefault,
      icon: adsIcon.src,
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type of property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionType.OpenText,
          headline: "What city/neighborhood is the property in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "state",
          type: TWorkflowQuestionType.OpenText,
          headline: "What state is the property in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "bedrooms",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many bedrooms?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "bathrooms",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many bathrooms?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some features of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you please generate a description for a @property-type located in @city , @state ? Please include @bedrooms, @bathrooms , and any @features that make this property unique.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Flyers",
    icon: flyerIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate real estate flyers ensuring engaging content for your audience.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Generate real estate flyers",
      welcomeCard: welcomeCardDefault,
      icon: flyerIcon.src,
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type of property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some features of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate a nice real estate flyer for @property-type that feature its @features ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Website Copy",
    icon: realstateIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Generate engaging real estate website content quickly.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Real Estate Website Copy",
      welcomeCard: welcomeCardDefault,
      icon: realstateIcon.src,
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many words should have the post?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "property-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type of property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the location of the property?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some features of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefits",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some benefits of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate @number-words words of website content for a @property-type in @location , highlighting its @features , and showcasing its @benefits to the target audience?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Offer Letters",
    icon: realStateLetterIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create real estate offer letters to secure a deal.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Real Estate Offer Letters",
      welcomeCard: welcomeCardDefault,
      icon: realStateLetterIcon.src,
      questions: [
        {
          id: "number-words",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many words should have the letters?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "property-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type of property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the city of the property?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "key-selling-points",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some key selling points of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate a @number-words real estate offer letter for @property-type in @city , with emphasis on @key-selling-points ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Real Estate Listings Writer",
    icon: listingIcon.src,
    category: "Virtual Assistant",
    subcategory: "Real State",
    description: "Create compelling real estate listings in no time.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Real Estate Listings Writer",
      welcomeCard: welcomeCardDefault,
      icon: listingIcon.src,
      questions: [
        {
          id: "property-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type of property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the location of the property?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the target audience for the listing?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some features of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "amenities",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe some amenities of the property",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to create a real estate listing for a @property-type in @location that will appeal to @target-audience. Can you provide me with research on @features and @amenities that would be important to highlight?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Visa Requirements",
    icon: visaIcon.src,
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Streamline the process of obtaining visa requirements.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Visa Requirements",
      welcomeCard: welcomeCardDefault,
      icon: visaIcon.src,
      questions: [
        {
          id: "nationality",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your nationality?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "visa-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of visa do you need?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the entry/exit restrictions for @nationality citizens traveling to @destination on a @visa-type visa?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Travel Insurance Options",
    icon: travelInsuranceIcon.src,
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Assist users in exploring travel insurance options.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Travel Insurance Options",
      welcomeCard: welcomeCardDefault,
      icon: travelInsuranceIcon.src,
      questions: [
        {
          id: "duration",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many days are you travelling?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "destination",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "deaperture-city",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the deaperture city?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "start-date",
          type: TWorkflowQuestionType.OpenText,
          headline: "Start date of the travel",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you suggest me travel insurance plans for a @duration day trip to @destination departing from @deaperture-city on @start-date ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Destination Guides Writer",
    icon: destinationIcon.src,
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Create engaging and personalized destination guides.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Destination Guides Writer",
      welcomeCard: welcomeCardDefault,
      icon: destinationIcon.src,
      questions: [
        {
          id: "activity",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of activity would you like to do?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the destination city?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me generate some unique @activity ideas to add to my destination guide on @city ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Hotel Reviews Writer",
    icon: hotelIcon.src,
    category: "Virtual Assistant",
    subcategory: "Travel",
    description: "Write personalized hotel reviews effortlessly.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Hotel Reviews Writer",
      welcomeCard: welcomeCardDefault,
      icon: hotelIcon.src,
      questions: [
        {
          id: "review-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Do you want to create a positive or negative review?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "hotel-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the hotel that you recently stayed at?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Could you please write a @review-type review for the @hotel-name that I recently stayed at?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
];
