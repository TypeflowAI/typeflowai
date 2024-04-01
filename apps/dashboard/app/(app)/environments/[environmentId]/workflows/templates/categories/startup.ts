import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import brandIcon from "@typeflowai/ui/icons/templates/brand.svg";
import budgetIcon from "@typeflowai/ui/icons/templates/budget.svg";
import businessIntelligenceIcon from "@typeflowai/ui/icons/templates/business-intelligence.svg";
import calendarIcon from "@typeflowai/ui/icons/templates/calendar.svg";
import campaignIcon from "@typeflowai/ui/icons/templates/campaign.svg";
import compassIcon from "@typeflowai/ui/icons/templates/compass.svg";
import contentIcon from "@typeflowai/ui/icons/templates/content-ideas.svg";
import contentMaterialsIcon from "@typeflowai/ui/icons/templates/content-materials.svg";
import creditCardIcon from "@typeflowai/ui/icons/templates/credit-card.svg";
import crisisIcon from "@typeflowai/ui/icons/templates/crisis.svg";
import cultureIcon from "@typeflowai/ui/icons/templates/culture.svg";
import dataVisualizerIcon from "@typeflowai/ui/icons/templates/data-visualizer.svg";
import designIcon from "@typeflowai/ui/icons/templates/design.svg";
import devIcon from "@typeflowai/ui/icons/templates/dev.svg";
import documentIcon from "@typeflowai/ui/icons/templates/document.svg";
import employeeTrainerIcon from "@typeflowai/ui/icons/templates/employee-trainer.svg";
import featureIcon from "@typeflowai/ui/icons/templates/feature.svg";
import feedbackIcon from "@typeflowai/ui/icons/templates/feedback.svg";
import figmaIcon from "@typeflowai/ui/icons/templates/figma.svg";
import financialIcon from "@typeflowai/ui/icons/templates/financial.svg";
import growthIcon from "@typeflowai/ui/icons/templates/growth.svg";
import htmlIcon from "@typeflowai/ui/icons/templates/html.svg";
import ideaIcon from "@typeflowai/ui/icons/templates/idea.svg";
import innovationIcon from "@typeflowai/ui/icons/templates/innovation.svg";
import interfaceIcon from "@typeflowai/ui/icons/templates/interface.svg";
import interviewIcon from "@typeflowai/ui/icons/templates/interview.svg";
import jobOfferIcon from "@typeflowai/ui/icons/templates/job-offer.svg";
import jobIcon from "@typeflowai/ui/icons/templates/job.svg";
import leadershipIcon from "@typeflowai/ui/icons/templates/leadership.svg";
import missionIcon from "@typeflowai/ui/icons/templates/mission.svg";
import mvpIcon from "@typeflowai/ui/icons/templates/mvp.svg";
import namingIcon from "@typeflowai/ui/icons/templates/naming.svg";
import officeChairIcon from "@typeflowai/ui/icons/templates/office-chair.svg";
import performanceIcon from "@typeflowai/ui/icons/templates/performance.svg";
import pitchIcon from "@typeflowai/ui/icons/templates/pitch.svg";
import planIcon from "@typeflowai/ui/icons/templates/plan.svg";
import podcastProductionIcon from "@typeflowai/ui/icons/templates/podcast-production.svg";
import podcastIcon from "@typeflowai/ui/icons/templates/podcast.svg";
import presentationIcon from "@typeflowai/ui/icons/templates/presentation.svg";
import producthuntIcon from "@typeflowai/ui/icons/templates/producthunt.svg";
import projectPlannerIcon from "@typeflowai/ui/icons/templates/project-planner.svg";
import rejectionIcon from "@typeflowai/ui/icons/templates/rejection.svg";
import releaseNotesIcon from "@typeflowai/ui/icons/templates/release-notes.svg";
import researchIcon from "@typeflowai/ui/icons/templates/research.svg";
import rewardIcon from "@typeflowai/ui/icons/templates/reward.svg";
import roadmapIcon from "@typeflowai/ui/icons/templates/roadmap.svg";
import rocketIcon from "@typeflowai/ui/icons/templates/rocket.svg";
import strategyIcon from "@typeflowai/ui/icons/templates/strategy.svg";
import swordFightIcon from "@typeflowai/ui/icons/templates/sword-fight.svg";
import targetIcon from "@typeflowai/ui/icons/templates/target.svg";
import taxIcon from "@typeflowai/ui/icons/templates/tax.svg";
import toolsIcon from "@typeflowai/ui/icons/templates/tools.svg";
import trendIcon from "@typeflowai/ui/icons/templates/trend.svg";
import videoProductionIcon from "@typeflowai/ui/icons/templates/video-production.svg";
import videoIcon from "@typeflowai/ui/icons/templates/video.svg";
import writeIcon from "@typeflowai/ui/icons/templates/write.svg";

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

export const startupTemplates: TTemplate[] = [
  {
    name: "Product release notes",
    icon: releaseNotesIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Create detailed and engaging product release notes.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Product release notes",
      welcomeCard: welcomeCardDefault,
      icon: releaseNotesIcon.src,
      questions: [],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Context:
        You are the Cutting-Edge Product Release Notes GPT, specializing in crafting compelling and informative release notes for software products. Your expertise includes outlining new features, improvements, and fixes in a way that is both technically informative and engaging to the user.
        
        Goal:
        To produce release notes that accurately describe the latest updates in an engaging and user-friendly format. These notes should not only inform users of new changes but also excite them about the product's evolution.
        
        Release Notes Structure:
        - Introduction: A brief overview of the release, including version number and release date.
        - New Features: Detailed descriptions of each new feature, explaining the benefits and how to use them.
        - Improvements: Information on updates or enhancements to existing features.
        - Bug Fixes: A list of significant bugs fixed in this release, with a brief description of the problem and the fix.
        
        Acknowledgments: Credit to team members or community contributors, if applicable.
        - Future Outlook: A teaser about what's coming next, building anticipation for future updates.
        
        Writing Criteria:
        - Use clear, concise language that is accessible to both technical and non-technical users.
        - Highlight the user benefits of each new feature or improvement.
        - Include any necessary instructions or tips for using new features effectively.
        - Maintain a positive and engaging tone to keep the user interested.
        - Ensure technical accuracy and completeness of the information provided.
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
    name: "Business Plan Generator",
    icon: planIcon.src,
    category: "Startup",
    subcategory: "Business Plan Generator",
    description: "Create a comprehensive business plan based on your product and services.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Creating business plan",
      welcomeCard: welcomeCardDefault,
      icon: planIcon.src,
      questions: [
        {
          id: "industry-segment",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or segment?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "competitors-products",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some top competitors or products",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "Can you provide an overview of the competitive landscape in @industry-segment, including @competitors-products, market share, and competitive advantages, to help me build a comprehensive business plan for @product-service?"
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
    name: "Sales Strategy Planning",
    icon: strategyIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Develop a sales strategy with insightful and innovative ideas.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Sales Strategy Planning",
      welcomeCard: welcomeCardDefault,
      icon: strategyIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "customer-segment",
          type: TWorkflowQuestionType.OpenText,
          headline: "What segment of customers do you want to target?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "pain-point",
          type: TWorkflowQuestionType.OpenText,
          headline: "Detail a pain point of your clients.",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "metric",
          type: TWorkflowQuestionType.OpenText,
          headline: "What metric would you like to measure?",
          subheader:
            "Insert specific metric such as customer acquisition cost, conversion rate, or customer lifetime value, etc.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some effective sales tactics for @product-service that cater to @customer-segment and address @pain-point? How can we measure the success of these tactics based on @metric
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
    name: "Elevator Pitch",
    icon: pitchIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Create an elevator pitch that highlights your business' key features.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Elevator Pitch",
      welcomeCard: welcomeCardDefault,
      icon: pitchIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "unique-value-proposition",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your unique value proposition?",
          subheader: "E.g. One-of-a-kind, customizable jewelry pieces",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Generate an elevator pitch for my @product-service that highlights its unique value proposition: @unique-value-proposition , the target audience: @target-audience and captures the attention of potential investors/customers/partners.    
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
    name: "Mission Statement",
    icon: missionIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Build a clear and concise mission statement for your business.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Mission Statement",
      welcomeCard: welcomeCardDefault,
      icon: missionIcon.src,
      questions: [
        {
          id: "position",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your position in your company?",
          subheader: "E.g. Sales Manager, Human Resources Specialist, Financial Analyst...",
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your company about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "number",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many numbers would you like to create?",
          subheader: "Set a number between 1 and 4",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "As a @position of @company, I have been tasked with developing a mission statement that encapsulates our brand and reflects our @number core values. Can you provide me with a template or structure for creating a mission statement that is well-organized and impactful in the industry of @industry?".
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
    name: "Growth Opportunities Identifier",
    icon: growthIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Uncover growth opportunities through data and insightful suggestions.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Growth Opportunities Identifier",
      welcomeCard: welcomeCardDefault,
      icon: growthIcon.src,
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your company about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "improvement",
          type: TWorkflowQuestionType.OpenText,
          headline: "How would you like to improve your product/service?",
          subheader: "Increase, boost, expand etc.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "brand-goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us a bit more about your company",
          subheader: "Brand identity, mission statement, business goals...",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "Our @company is looking to @improvement our @product-service offerings in @target-audience. Can you analyze our customer/sales/financial etc. data and suggest potential growth opportunities that align with our @brand-goals?
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
    name: "Target Market Identifier",
    icon: targetIcon.src,
    category: "Startup",
    subcategory: "Business Planning",
    description: "Pinpoint your product's ideal market by analyzing preferences and needs.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Target Market Identifier",
      welcomeCard: welcomeCardDefault,
      icon: targetIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of demographic would you like to impact?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "What are some emerging trends in the @industry that are likely to impact the @demographic market for @product-service and how can I adapt my marketing strategy to stay ahead of the curve?"
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
    name: "Brand Identity Developer",
    icon: brandIcon.src,
    category: "Startup",
    subcategory: "Branding",
    description: "Develop a brand identity aligned with your values and target audience.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Brand Identity Developer",
      welcomeCard: welcomeCardDefault,
      icon: brandIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "values",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some values of your company?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some need of your target audience",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "Can you suggest some potential slogans for a @product-service brand that emphasizes our commitment to @values and sets us apart from our competitors, while also considering the unique features of our @product-service and our target audience's @needs?"
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
    name: "Naming Tool",
    icon: namingIcon.src,
    category: "Startup",
    subcategory: "Branding",
    description: "Generate creative and unique names for products or companies.",
    objectives: ["optimize_content_and_seo_strategy", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Naming Tool",
      welcomeCard: welcomeCardDefault,
      icon: namingIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your new product/service/company?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us some keywords to include",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "tone",
          type: TWorkflowQuestionType.OpenText,
          headline: "What tone would you like to use",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of demographic would you like to impact?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - We are launching a new @product-service and we want a name that is relevant to our industry and has a strong brand identity. Can you suggest some names that incorporate @keywords, sound @tone, and appeal to our target audience of @demographic? Please provide at least 3 options.
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
    name: "Sales Presentations Creator",
    icon: presentationIcon.src,
    category: "Startup",
    subcategory: "Sales",
    description: "Create sales presentations featuring new ideas and outlining content.",
    objectives: ["streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Sales Presentations Creator",
      welcomeCard: welcomeCardDefault,
      icon: presentationIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your new product/service/company?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of demographic would you like to impact?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to create a sales presentation for @product-service that targets @demographic. Can you help me generate ideas for how to make it more appealing to @demographic, while still highlighting the key features and benefits of the @product-service?
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
    name: "Product Launch Plan",
    icon: producthuntIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate ideas, identify roadblocks, and get recommendations for a Product Launch.",
    objectives: ["streamline_operations_and_sales", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Product launch plan",
      welcomeCard: welcomeCardDefault,
      icon: producthuntIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your new product/service/company?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-channels",
          type: TWorkflowQuestionType.OpenText,
          headline: "What marketing channels would you like to use?",
          subheader: "E.g. Social Media, ads, etc.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you create a comprehensive product launch plan for @product-service, targeting @target-audience, and incorporating @marketing-channels? Please include a detailed timeline, budget, promotional strategies, and success metrics.
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
    name: "Product Roadmaps Creator",
    icon: roadmapIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Create product roadmaps: gather insights, generate ideas, and prioritize features.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Product Roadmaps Creator",
      welcomeCard: welcomeCardDefault,
      icon: roadmapIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your new product/service/company?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the needs or problems of your audience?",
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
        "I need a product roadmap for @product-service that takes into account the broader ecosystem of our product, including integrations with third-party platforms, APIs, and partnerships. It should create value for our customers and stakeholders across the board and address their emotional and functional needs for @needs.
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
    name: "User Interfaces Designer",
    icon: interfaceIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Brainstorm ideas, identify needs, and create wireframes.",
    objectives: ["innovate_and_develop", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "User Interfaces Designer",
      welcomeCard: welcomeCardDefault,
      icon: interfaceIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product / service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "user-group",
          type: TWorkflowQuestionType.OpenText,
          headline: "What user group do you want to focus on?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some best practices for designing interfaces of a @product-service that prioritize @user-group, and how can I ensure that my interface is useful and attractive for this group?
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
    name: "Minimum Viable Product",
    icon: mvpIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Develop an MVP: generate ideas, refine concepts, and improve.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Minimum Viable Product",
      welcomeCard: welcomeCardDefault,
      icon: mvpIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product / service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or niche of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some specific types of features that should be included in a minimum viable product of a @product-service for the industry: @industry, and how can they be e.g., tailored/modified to meet the unique needs of our target audience: @target-audience?
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
    name: "Product Feature Ideas",
    icon: featureIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate product feature ideas based on data analysis.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Product Feature Ideas",
      welcomeCard: welcomeCardDefault,
      icon: featureIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product / service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or niche of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "aspects",
          type: TWorkflowQuestionType.OpenText,
          headline: "What aspects do you want to address with these features?",
          subheader: "e.g., customer need/ pain point/ market gap",
          required: true,
          inputType: "text",
        },
        {
          id: "metric",
          type: TWorkflowQuestionType.OpenText,
          headline: "What metric would you like to improve?",
          subheader: "e.g., metric, such as customer retention or sales",
          required: true,
          inputType: "text",
        },
        {
          id: "percentage",
          type: TWorkflowQuestionType.OpenText,
          headline: "Type a potential percentage to increase",
          subheader: "Try to be realistic",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate some product features ideas that would differentiate our @product-service from competitors in the @industry market? Specifically, we are looking for features that address @aspects and have the potential to increase @metric by @percentage.
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
    name: "Idea Prioritizator",
    icon: ideaIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Transform your creative process by evaluating ideas efficiently.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Idea Priorizator",
      welcomeCard: welcomeCardDefault,
      icon: ideaIcon.src,
      questions: [
        {
          id: "ideas",
          type: TWorkflowQuestionType.OpenText,
          headline: "List of product ideas",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "description",
          type: TWorkflowQuestionType.OpenText,
          headline: "Brief description of each idea",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "resources",
          type: TWorkflowQuestionType.OpenText,
          headline: "Current resources and capabilities",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your business goals?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your target market?",
          subheader: "Please be as specific as possible.",
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
        You are Product Viability Assessor GPT, an AI expert in product development and market analysis. You specialize in helping entrepreneurs evaluate their product ideas based on market data, trends, and feasibility studies.
        
        Goal:
        The entrepreneur will present their product ideas, and you will help them evaluate and prioritize these ideas based on market potential and feasibility.
        
        Assessment Process:
        - Idea Submission: The entrepreneur submits a brief description of their product ideas.
        - Market Analysis: Analyze each idea against current market trends, customer demands, and competition.
        - Feasibility Study: Assess the technical and financial feasibility of each idea.
        - Prioritization Matrix: Rank the ideas based on market potential, feasibility, and alignment with the entrepreneur's resources and goals.
        
        Evaluation Criteria:
        - Provide a comprehensive market analysis for each idea.
        - Assess the technical feasibility, including resources and expertise needed.
        - Evaluate financial feasibility, including estimated costs and potential revenue.
        - Rank ideas based on a scoring system that considers market potential, feasibility, and strategic fit with the entrepreneur's capabilities.
        
        Information Required from Entrepreneur:
        - List of product ideas: @ideas
        - Brief description of each idea: @description
        - Current resources and capabilities: @resources
        - Entrepreneur's business goals and target market: @goals & @target-market
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
    name: "Product Requirements Writer",
    icon: writeIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate clear, concise product requirements based on stakeholder needs.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Product Requirements Writer",
      welcomeCard: welcomeCardDefault,
      icon: writeIcon.src,
      questions: [
        {
          id: "key-features",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some key features of your product",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of demographic would you like to impact?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the needs or problems of your audience?",
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
        - Write me detailed product requirements that cover the @key-features.
        - "Please create product requirements that define the target audience: @target-audience, including @demographic. Additionally, please include requirements that address @needs for this audience."
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
    name: "Financial Performance Analyzer",
    icon: financialIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Analyze your financial performance to make informed decisions.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Financial Performance Analyzer",
      welcomeCard: welcomeCardDefault,
      icon: financialIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What industry would you like to analyze?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "financial-metric",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the financial metric would you like to forecast",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us what is your company about",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "financial-performance",
          type: TWorkflowQuestionType.OpenText,
          headline: "What financial performance would you like to improve?",
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
        - Please analyze the @industry market trends for the past 2-3 years and forecast the @financial-metric for the next 2-3 years. Based on this analysis, what recommendations do you have for my company: @company to improve their @financial-performance?
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
    name: "Tax Documents Guide",
    icon: taxIcon.src,
    category: "Startup",
    subcategory: "Product Development",
    description: "Prepare tax documents recieving guidance on regulations and form completion.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Tax Documents Guide",
      welcomeCard: welcomeCardDefault,
      icon: taxIcon.src,
      questions: [
        {
          id: "tax-rules",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name the specific tax rules/regulations",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "income-sources",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us income sources/situation",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "legal-provisions",
          type: TWorkflowQuestionType.OpenText,
          headline: "What legal provisions or recent changes would you like to take into account?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "taxable-income",
          type: TWorkflowQuestionType.OpenText,
          headline: "What specific tax bracket/taxable income?",
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
        - How to determine the @tax-rules that apply to your @income-sources, taking into account @legal-provisions, and understand how they impact your @taxable-income?
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
    name: "Reward System Generator",
    icon: rewardIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Develop a recognition and rewards Systems for your team.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Reward System Generator",
      welcomeCard: welcomeCardDefault,
      icon: rewardIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "E.g. E-commerce and Digital Marketing",
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the size of your team?",
          subheader: "E.g. 25 employees",
          required: true,
          inputType: "text",
        },
        {
          id: "stage",
          type: TWorkflowQuestionType.OpenText,
          headline: "What stage is your company in?",
          subheader: "E.g. Growth-stage, exploring new markets",
          required: true,
          inputType: "text",
        },
        {
          id: "recognition-system",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your current recognition system?",
          subheader: "E.g. Occasional verbal praise, lack of formal recognition program",
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
        You are Startup Recognition Architect GPT, a specialist in designing and implementing effective recognition and reward systems in startup environments. Your expertise revolves around creating innovative and motivational recognition programs that cater to the unique dynamics of startups, focusing on boosting morale, employee engagement, and retention.
        
        Goal:
        Develop creative and impactful recognition and reward strategies specifically tailored for our startup. These strategies should help in acknowledging and appreciating employees' contributions, thereby enhancing their motivation and commitment to the company.
        
        Recognition and Rewards Challenge:
        1. Immediate Recognition Practices (How can we implement real-time recognition methods that are impactful and genuine?)
        2. Performance-Based Rewards (What scalable reward systems can we create that align with individual and team performance?)
        3. Non-Monetary Rewards (What are some creative non-monetary rewards that can be highly valued by employees?)
        4. Peer-to-Peer Recognition Programs (How can we encourage and facilitate peer-to-peer recognition in the workplace?)
        5. Celebrating Milestones and Achievements (What unique ways can we celebrate significant milestones and achievements within the team?)
        
        Criteria for Recognition and Reward Strategies:
        - Provide 3 distinct and innovative strategies for each of the challenge areas.
        - Ensure that the strategies are feasible and practical within the constraints of a startup environment.
        - Focus on creating a culture of appreciation that goes beyond traditional monetary rewards.
        - Strategies should be inclusive, considering the diverse needs and preferences of a varied workforce.
        - Emphasize creating a lasting impact on employee morale and company culture.
        
        Information About My Startup:
        Industry: @industry
        Team Size: @team-size
        Stage: @stage
        Current Recognition System: @recognition-system
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
    name: "Interview Conductor Guide",
    icon: interviewIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Generate questions and discussion topics to conduct interviews.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Interview Conductor Guide",
      welcomeCard: welcomeCardDefault,
      icon: interviewIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionType.OpenText,
          headline: "What position would you like to interview?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "aspect-job",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some aspect of job or company to ask about",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "Can you suggest some @industry questions that I can ask during my interview with @position, specifically relating to @aspect-job?"
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
    name: "Job Descriptions Creator",
    icon: jobIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Create job descriptions to attrack new talents.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Job Descriptions Creator",
      welcomeCard: welcomeCardDefault,
      icon: jobIcon.src,
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us what is your company about",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write the job title you want to hire",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "qualification-skill",
          type: TWorkflowQuestionType.OpenText,
          headline: "What qualification or skill are you looking for?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "education-certifications",
          type: TWorkflowQuestionType.OpenText,
          headline: "What education or certificates should the applicant have?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "experience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What should the applicant have experience in?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
         - I need to hire a @job-title that possesses @qualification-skill. Can you provide me with a job description that highlights the key @job-title responsibilities, qualifications, [e.g., HARD SKILLS/SOFT SKILLS], @education-certifications, and @experience that align with our @company culture?
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
    name: "Employee Trainer",
    icon: employeeTrainerIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Develop effective employee training based on your industry trends and methodologies.",
    objectives: ["innovate_and_develop", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Employee Trainer",
      welcomeCard: welcomeCardDefault,
      icon: employeeTrainerIcon.src,
      questions: [
        {
          id: "learning-styles",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some learning styles",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "technologies",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some training methodologies or technologies",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "employee-demographics",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your employees demographics?",
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
        - How can we design training programs that cater to different @learning-styles, and what @technologies should we consider for each style? How can we tailor the training programs to the needs of our @employee-demographics and e.g., ENSURE THEIR ENGAGEMENT AND PARTICIPATION in the training?
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
    name: "Employee Career Booster",
    icon: rocketIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Elevate your workplace boosting career prospects.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Employee Career Booster",
      welcomeCard: welcomeCardDefault,
      icon: rocketIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "E.g. Fintech",
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the size of your team?",
          subheader: "E.g. 30 employees",
          required: true,
          inputType: "text",
        },
        {
          id: "stage",
          type: TWorkflowQuestionType.OpenText,
          headline: "What stage is your company in?",
          subheader: "E.g. Series A funded, rapidly scaling",
          required: true,
          inputType: "text",
        },
        {
          id: "advancement-structure",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your current advancement structure?",
          subheader: "E.g. Informal and ad hoc, lacking clear advancement pathways",
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
        You are Startup Career Advancement GPT, a specialized consultant for career growth within startup environments. Your expertise lies in creating pathways for employee advancement in settings where traditional hierarchical structures are limited. Your focus is on identifying innovative and practical methods to offer career progression opportunities to employees in startups.
        
        Goal:
        Develop and suggest actionable strategies that will enable us to offer clear and meaningful advancement opportunities for our team members. Your solutions should help us in retaining talent by providing them with a sense of progression and achievement within our startup.
        
        Advancement Opportunities Challenge:
        - Creating Role Progression Paths (How can we structure role progression in a flat organizational hierarchy?)
        - Skill-Based Advancement (What frameworks can we implement for advancement based on skill and competency development?)
        - Project Leadership Opportunities (How can we provide leadership opportunities through project management and team lead roles?)
        - Cross-functional growth (What strategies can we use to facilitate cross-functional movement and growth within the company?)
        - Recognition and Title Advancements (How can we effectively use title changes and recognition to signify advancement?)
        
        Criteria for Advancement Strategies:
        1. Propose 3 detailed strategies for each aspect of the advancement challenge.
        2. Ensure that the strategies are feasible in a startup environment, taking into account resource constraints and the need for flexibility.
        3. Focus on creating transparent and merit-based progression pathways.
        4. Include methods to regularly assess and recognize employee growth and achievements.
        5. Emphasize on strategies that motivate and engage employees, contributing to their personal and professional development.
        
        Information About My Startup:
        - Industry: @industry
        - Team Size: @team-size
        - Stage: [@stage
        - Current Advancement Structure: @advancement-structure       
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
    name: "Candidate Rejections Guide",
    icon: rejectionIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Guide candidate rejections with customizable empathetic responses.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Candidate Rejections Guide",
      welcomeCard: welcomeCardDefault,
      icon: rejectionIcon.src,
      questions: [
        {
          id: "reason-rejected",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the reason for the rejection",
          subheader: "e.g., Applied for a senior management position but lacks the required experience",
          required: true,
          inputType: "text",
        },
        {
          id: "filled-position",
          type: TWorkflowQuestionType.OpenText,
          headline: "What filled the position?",
          subheader: "E.g. A candidate who had more experience and better fit with the team",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me draft a rejection email to a candidate who @reason-rejected? The position has been filled by @filled-position. Please provide a message that is professional yet empathetic and includes a thank you for their time and effort."      
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
    name: "Job Offer Responder",
    icon: jobOfferIcon.src,
    category: "Startup",
    subcategory: "Human Resource",
    description: "Respond to job offers and negotiate your salary.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Job Offer Responder",
      welcomeCard: welcomeCardDefault,
      icon: jobOfferIcon.src,
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What company sent you the offer?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "specific-goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific goals",
          subheader: "Such as expresses gratitude, clarifies details, negotiates salary, etc.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I received a job offer from @company, can you help me draft a response that @specific-goals`,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Market Trends Analyzer",
    icon: trendIcon.src,
    category: "Startup",
    subcategory: "Data Analysis",
    description: "Analyze market trends and predictions easily.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Market Trends Analyzer",
      welcomeCard: welcomeCardDefault,
      icon: trendIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or niche of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the key e.g., indicators/factors/data points to look for when trying to identify and capitalize on current market trends in the industry: @industry, and how can I use this information to improve/optimize my @product-service offerings?"
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
    name: "Data Visualizer",
    icon: dataVisualizerIcon.src,
    category: "Startup",
    subcategory: "Data Analysis",
    description: "Generate effective, engaging, and insightful data visualizations.",
    objectives: ["improve_business_strategy", "optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Data visualizer",
      welcomeCard: welcomeCardDefault,
      icon: dataVisualizerIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "data-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of data do you want to know about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide examples of successful data visualizations that were used for @industry, and explain why they were effective?
        - What are the most effective data visualization tools or software for @data-type, and how can I use them to create more compelling visualizations?
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
    name: "Expenses Report",
    icon: creditCardIcon.src,
    category: "Startup",
    subcategory: "Administrative",
    description: "Streamline expense reporting inputting relevant details.",
    objectives: ["streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Expenses Report",
      welcomeCard: welcomeCardDefault,
      icon: creditCardIcon.src,
      questions: [
        {
          id: "category",
          type: TWorkflowQuestionType.OpenText,
          headline: "What category of expenses?",
          subheader: "Such as e.g. meals/lodging/transportation",
          required: true,
          inputType: "text",
        },
        {
          id: "time-period",
          type: TWorkflowQuestionType.OpenText,
          headline: "What time of period?",
          subheader: "E.g. Daily, monthly, quarterly...",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What is the best way to break down expenses by @category, and how should I document them for @time-period? Can you provide more information on how to categorize these expenses and any tips or best practices for documentation?
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
    name: "Scheduling Appointments",
    icon: calendarIcon.src,
    category: "Startup",
    subcategory: "Administrative",
    description: "Optimize your schedule: receive appointments and timely reminders.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Scheduling Appointments",
      welcomeCard: welcomeCardDefault,
      icon: calendarIcon.src,
      questions: [
        {
          id: "name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name of the person for the appointment",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "type-appointment",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of appontment?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "date",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the date?",
          subheader: "E.g. Daily, monthly, quarterly...",
          required: true,
          inputType: "text",
        },
        {
          id: "time",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the time?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the location?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "additional-requests",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write additional requests",
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
        - What steps should I take to schedule an appointment with @name for a @type-appointment on @date at @time at @location? Also, I need @additional-requests.
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
    name: "Performance Evaluator",
    icon: performanceIcon.src,
    category: "Startup",
    subcategory: "Leadership",
    description: "Enhance evaluations by identifying areas for improvement.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Performance Evaluator",
      welcomeCard: welcomeCardDefault,
      icon: performanceIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name of the employee",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionType.OpenText,
          headline: "What area is this employee in?",
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
        - Can you suggest some strategies for addressing potential biases or stereotypes that may influence the performance evaluation process, particularly with respect to @employee-name 's gender, race, or other personal characteristics?
        - Can you provide guidance on how to evaluate @employee-name 's performance in @area when there are no objective metrics or performance data available?
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
    name: "Crisis Management Planner",
    icon: crisisIcon.src,
    category: "Startup",
    subcategory: "Crisis Management",
    description: "Create a crisis management plan to mitigate risks.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Crisis Management Planner",
      welcomeCard: welcomeCardDefault,
      icon: crisisIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "similiar-organizations",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name a few of similar organizations",
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
        - Design a crisis management plan for @industry that addresses a wide range of potential crises, incorporates best practices from @similiar-organizations, and includes a communication strategy for e.g. media outreach/internal communication/crisis monitoring. Also, include protocols for e.g. financial recovery/business continuity/reputation management."
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
    name: "Career Development Planner",
    icon: devIcon.src,
    category: "Startup",
    subcategory: "Career Developement",
    description: "Guide career development by offering personalized recommendations.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Career Development Planner",
      welcomeCard: welcomeCardDefault,
      icon: devIcon.src,
      questions: [
        {
          id: "current-skills",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your current skills?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What industry would you like to improve in?",
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
        - Can you create a career development plan that takes into account my current skills: @current-skills and identifies areas of improvement needed to advance in @industry?
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
    name: "Resume Writer",
    icon: documentIcon.src,
    category: "Startup",
    subcategory: "Career Developement",
    description: "Enhance resume writing with relevant data and formatting.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Resume Writer",
      welcomeCard: welcomeCardDefault,
      icon: documentIcon.src,
      questions: [
        {
          id: "resume-cv",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write here your CV",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me condense my cv: @resume-cv to fit onto one page without losing any key information? I'm having trouble deciding what to cut and what to keep. Can you also suggest some adjectives that describe me in a positive light?
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
    name: "Leadership Development Planner",
    icon: leadershipIcon.src,
    category: "Startup",
    subcategory: "Leadership Development",
    description: "Get customized guidance and resources to write a leader's plan.",
    objectives: ["innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Leadership Development Planner",
      welcomeCard: welcomeCardDefault,
      icon: leadershipIcon.src,
      questions: [
        {
          id: "plan-for",
          type: TWorkflowQuestionType.OpenText,
          headline: "Who is the plan for?",
          subheader: "E.g. myself/employee/team member",
          required: true,
          inputType: "text",
        },
        {
          id: "skill-area",
          type: TWorkflowQuestionType.OpenText,
          headline: "What skill or area of weakness would you like to focus on?",
          subheader: "E.g. specific skill/area of weakness",
          required: true,
          inputType: "text",
        },
        {
          id: "goal-outcome",
          type: TWorkflowQuestionType.OpenText,
          headline: "What goal or outcome would you like achieve?",
          subheader: "Specific goal/outcome",
          required: true,
          inputType: "text",
        },
        {
          id: "challenge",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main challenge?",
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
        - Can you help me create a leadership development plan for @plan-for? I would like to focus on improving @skill-area, which I believe will help me achieve @goal-outcome. Some of the challenges I've faced in this area include @challenge, and I would appreciate any guidance or resources you can offer to help me overcome these obstacles.
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
    name: "Leaders' Abilities Enhancer",
    icon: toolsIcon.src,
    category: "Startup",
    subcategory: "Leadership Development",
    description: "Enhance leadership adaptability to multiple situations.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Leaders' Abilities Enhancer",
      welcomeCard: welcomeCardDefault,
      icon: toolsIcon.src,
      questions: [
        {
          id: "team-composition",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the team composition",
          subheader: "Details about the diversity in their team",
          required: true,
          inputType: "text",
        },
        {
          id: "leadership-style",
          type: TWorkflowQuestionType.OpenText,
          headline: "Description of their current leadership approach",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "challenges",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the challenges",
          subheader: "Specific challenges encountered in managing diverse teams or situations",
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the objectives?",
          subheader: "Goals for improving their adaptability as a leader",
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
        You are Adaptive Leadership Coach GPT, a specialized AI mentor focused on enhancing leaders' abilities to adapt their styles to diverse teams and situations. You possess a deep understanding of various leadership models and how they apply to different cultural, generational, and professional contexts.
        
        Goal:
        Equip leaders with the skills and knowledge to adapt their leadership approach effectively to various team compositions and dynamic business situations.
        
        Adaptive Leadership Process:
        1. Diversity Assessment: Leaders describe their team’s composition and the diverse contexts they operate in.
        Leadership Style Analysis: The leader provides insight into their current leadership style and approaches.
        2. Adaptation Strategies: Based on the assessments, you provide strategies for adapting leadership styles to the team's diversity.
        3. Scenario-Based Training: Present hypothetical or past real-life scenarios and guide the leader on how to handle them.
        4. Action Plan for Diverse Situations: Develop a comprehensive action plan for various potential business situations and team dynamics.
        
        Adaptive Leadership Coach Criteria:
        - Cultural Sensitivity: Ensure recommendations respect and leverage cultural differences.
        - Generational Understanding: Address different expectations and motivations across generations.
        - Situational Adaptability: Offer strategies that are flexible and adaptable to various business scenarios.
        - Practical Tools: Provide practical tools and techniques for immediate application.
        - Continuous Learning: Emphasize the importance of ongoing learning and adaptation in leadership.
        
        Information Required from Leader:
        Team Composition: @team-composition
        Leadership Style: @leadership-style
        Challenges Faced: @challenges
        Leadership Objectives: @objectives
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
    name: "Project Planner",
    icon: projectPlannerIcon.src,
    category: "Startup",
    subcategory: "Project Management",
    description: "Generate project plans: scope, milestones, and timelines.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Project Planner",
      welcomeCard: welcomeCardDefault,
      icon: projectPlannerIcon.src,
      questions: [
        {
          id: "project-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of project are you working on?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "components",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name addressed 3 components",
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
        - What are the key components of a comprehensive project plan for @project-type, and how can I ensure that I have adequately addressed each component, such as @components?
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
    name: "Project Budget Maker",
    icon: budgetIcon.src,
    category: "Startup",
    subcategory: "Project Management",
    description: "Manage project budgets: estimate costs, forecast, and track expenses.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Project Budget Maker",
      welcomeCard: welcomeCardDefault,
      icon: budgetIcon.src,
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of project are you working on?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "factors",
          type: TWorkflowQuestionType.OpenText,
          headline: "What key factors would you like to improve?",
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
        - What are the key factors that influence the @project-name budget, and how can I improve them? Specifically, how can I account for @factors in my budget plan?
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
    name: "Idea Generator",
    icon: ideaIcon.src,
    category: "Startup",
    subcategory: "Innovation",
    description: "Brainstorm, ideate, and innovate with unique insights.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Idea Generator",
      welcomeCard: welcomeCardDefault,
      icon: ideaIcon.src,
      questions: [
        {
          id: "problem-topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What topic or problem would you want to solve?",
          subheader: "Specific problem or topic",
          required: true,
          inputType: "text",
        },
        {
          id: "outcome",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your desired outcome?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "suggestions",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write some suggestions to complement",
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
        - What are some effective methods that I can use to generate ideas for @problem-topic? I'm looking for ways to @outcome, but I'm open to @suggestions.
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
    name: "Innovation Strategy Developer",
    icon: innovationIcon.src,
    category: "Startup",
    subcategory: "Innovation",
    description: "Develop innovative strategies to stay ahead of your competitors.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Innovation Strategy Developer",
      welcomeCard: welcomeCardDefault,
      icon: innovationIcon.src,
      questions: [
        {
          id: "industry-market",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "disruptors",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some disruptors or uncertainties",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the factors that are shaping the @industry-market, and how can we develop an innovation strategy that aligns with these trends while anticipating future @disruptors?
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
    name: "Innovation Opportunities",
    icon: compassIcon.src,
    category: "Startup",
    subcategory: "Innovation",
    description: "Identify opportunities to innovate your products and services.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Innovation Opportunities",
      welcomeCard: welcomeCardDefault,
      icon: compassIcon.src,
      questions: [
        {
          id: "company-organization",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your company/organization about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us more about your new product/service",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or niche of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can @company-organization foster a culture of innovation to consistently identify and capitalize on new @product-service opportunities in @industry-niche, and what are some best practices for doing so?
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
    name: "Employee Feedback Responder",
    icon: feedbackIcon.src,
    category: "Startup",
    subcategory: "Employee Engagement",
    description: "Manage employee feedback to turn issues into improvements.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Employee Feedback Responder",
      welcomeCard: welcomeCardDefault,
      icon: feedbackIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the employee's name?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "issue",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the feedback issue about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "feedback",
          type: TWorkflowQuestionType.OpenText,
          headline: "Paste here the feedback",
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
        - I need help crafting a response to @employee-name 's feedback about @issue. They mentioned @feedback and I want to ensure that I address their concerns in a thoughtful way. Can you assist me in drafting an appropriate response?
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
    name: "Company Culture Strategy",
    icon: cultureIcon.src,
    category: "Startup",
    subcategory: "Company Culture",
    description: "Formulate a company culture strategy aligned with your values.",
    objectives: ["improve_customer_and_employee_experience", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Company Culture Strategy",
      welcomeCard: welcomeCardDefault,
      icon: cultureIcon.src,
      questions: [
        {
          id: "core-values",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the company core values/strategic goals?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some effective ways to improve a company culture that aligns with our @core-values and supports talented employees, including but not limited to culture audits/employee surveys/leadership workshops and transparent communications?
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
    name: "Work Culture Designer",
    icon: officeChairIcon.src,
    category: "Startup",
    subcategory: "Company Culture",
    description: "Design remote and in-office work cultures to attract talents.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Work Culture Designer",
      welcomeCard: welcomeCardDefault,
      icon: officeChairIcon.src,
      questions: [
        {
          id: "cultural-dynamics",
          type: TWorkflowQuestionType.OpenText,
          headline: "Description of existing remote and in-office work culture",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "challenges",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific issues faced in integrating the two cultures",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "core-values",
          type: TWorkflowQuestionType.OpenText,
          headline: "Core values and objectives for the company culture",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "employee-feedback",
          type: TWorkflowQuestionType.OpenText,
          headline: "Previous feedback from employees about the work culture",
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
        Context:
        You are Hybrid Culture Harmonizer GPT, an AI expert specializing in blending remote and in-office work cultures into a cohesive and productive environment. Your expertise includes fostering inclusive communication, collaboration strategies, and creating a sense of unity among all employees.
        
        Goal:
        To assist companies in developing a harmonized company culture that equally engages both remote and in-office employees, promoting collaboration, inclusivity, and a shared sense of purpose.
        
        Culture Integration Process:
        - Cultural Assessment: Analyze the current state of the company's culture for both remote and in-office environments.
        - Challenges Identification: Identify specific challenges and gaps between remote and in-office employee experiences.
        - Inclusive Strategy Development: Develop strategies for more inclusive communication, collaboration, and employee recognition.
        - Implementation Roadmap: Provide a step-by-step plan for implementing these strategies.
        Feedback and Adjustment Mechanism: Suggest methods for gathering employee feedback and adjusting strategies accordingly.
        
        Culture Harmonization Criteria:
        1. Inclusivity: Strategies must promote equal participation and visibility for all employees.
        2. Communication Excellence: Focus on enhancing clear and consistent communication across all mediums.
        3. Engagement and Collaboration: Encourage collaborative projects and team-building activities that bridge the gap between remote and in-office employees.
        4. Recognition Equality: Ensure that recognition and growth opportunities are equally accessible to all employees.
        5. Feedback-Driven Improvement: Incorporate regular feedback loops for continuous culture improvement.
        
        Information Required from Company:
        - Current Cultural Dynamics: @cultural-dynamics
        - Identified Challenges: @challenges
        - Company Values and Goals: @core-values
        - Employee Feedback: @employee-feedback
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
    name: "Sales Trends Identifier",
    icon: trendIcon.src,
    category: "Startup",
    subcategory: "Sales Analysis",
    description: "Examine industry-specific sales trends to inform your strategy.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Sales Trends Identifier",
      welcomeCard: welcomeCardDefault,
      icon: trendIcon.src,
      questions: [
        {
          id: "customer-behavior",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of customer behavior do you want to know more about?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "How can I use AI to analyze @customer-behavior data and identify emerging sales trends in @industry? Can AI also help me identify causes/effects of these trends such as demographics of my target audience: @targe-audience?"
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
    name: "Business Intelligence Assessments",
    icon: businessIntelligenceIcon.src,
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Identify KPIs to determine business objectives.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Conducting business intelligence assessments",
      welcomeCard: welcomeCardDefault,
      icon: businessIntelligenceIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "data-segmentation",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write specific data segmentation to take into account",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "Write specific demographic factors to take into account",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "What are the key metrics that can be analyzed to determine business objective in industry: @industry and how can @data-segmentation and @demographic factors be used to draw insights from this analysis?"
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
    name: "Competitive Analysis",
    icon: swordFightIcon.src,
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Perform competitive analysis, offering insights and recommendations.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Competitive Analysis",
      welcomeCard: welcomeCardDefault,
      icon: swordFightIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can I conduct a comprehensive competitive analysis to identify my main competitors in the @industry and analyze their strengths/weaknesses/opportunities/threats in terms of market share/revenue growth/customer retention?
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
    name: "Industry Research",
    icon: researchIcon.src,
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Conduct industry research, gathering insights, stats, and trends.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Industry Research",
      welcomeCard: welcomeCardDefault,
      icon: researchIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the product or service you want to know about",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "country-region",
          type: TWorkflowQuestionType.OpenText,
          headline: "What country or region would you like to analyze this product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "market-segment",
          type: TWorkflowQuestionType.OpenText,
          headline: "What market segment do you want to know?",
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
        - How do I use AI to find the market size of @product-service in @country-region and analyze the growth potential in @market-segment ?
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
    name: "Growth Detector",
    icon: growthIcon.src,
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Identify growth opportunities to get ideas for expansion.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Growth Detector",
      welcomeCard: welcomeCardDefault,
      icon: growthIcon.src,
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your company about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your company?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some potential growth opportunities for my @company in the @industry industry considering current market trends, customer behavior and competitor strategies?
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
    name: "Web Design User Research",
    icon: figmaIcon.src,
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Conduct user research to understand behavior for web design.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Web Design User Research",
      welcomeCard: welcomeCardDefault,
      icon: figmaIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "tool",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name specific tool/method/technique you would like to use",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What objective/goal would you like to achieve?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide multiple examples/suggestions on how to conduct user research for web design, specifically for @target-audience , using @tool to @goal?
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
    name: "Web Usability Test",
    icon: htmlIcon.src,
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Gain insights and recommendations to enhance user experience.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Web Usability Test",
      welcomeCard: welcomeCardDefault,
      icon: htmlIcon.src,
      questions: [
        {
          id: "website-goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the website goals?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of the website?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide examples of successful web usability testing methods that have been used to @website-goals for industry: @industry, and what specific metrics were used to measure the results?
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
    name: "Web Interfaces Designer",
    icon: interfaceIcon.src,
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Design web interfaces with user-friendly layouts and features.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Web Interfaces Designer",
      welcomeCard: welcomeCardDefault,
      icon: interfaceIcon.src,
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your business about?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "values",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the values of your brand?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        I'm designing a website for my business and I need help selecting a primary/secondary color scheme. Can you suggest a palette that aligns with my brand's values?
        - Business: @business
        - Values: @values
        What are some best practices for creating responsive/mobile-friendly web layouts that minimize the need for scrolling?
        I'm struggling to come up with innovative ideas for my website features. Can you suggest some unique interactive features that will engage my website visitors?
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
    name: "Web Design Features Developer",
    icon: designIcon.src,
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Enhance UX offering insights on layout, typography, and content.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Web Design Features Developer",
      welcomeCard: welcomeCardDefault,
      icon: designIcon.src,
      questions: [
        {
          id: "website-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of website are you developing?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the target audience for this website?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "brand-guidelines",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe your brand guidelines",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "What are some effective color schemes for a @website-type that caters to @target-audience and emphasizes brand identity? How can I ensure that the colors are appropiate for the content and do not compromise accessibility?
        Can you suggest some design elements to enhance the user experience of my @website-type, while incorporating trendy features and avoiding common mistakes? How can I ensure that the design is consistent with our brand guidelines: @brand-guidelines and resonates with our @target-audience?"
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
    name: "Content Marketing Campaigns",
    icon: campaignIcon.src,
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Content marketing campaigns from generating ideas to optimizing SEO.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Content Marketing Campaigns",
      welcomeCard: welcomeCardDefault,
      icon: campaignIcon.src,
      questions: [
        {
          id: "content-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of content would you like to use for the campaign?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the key elements of a successful @content-type campaign for the industry: @industry  audience, and how can AI assist with their execution and optimization?
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
    name: "Content Marketing Strategy",
    icon: contentIcon.src,
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Create a winning content marketing strategy for your audience.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Creating content marketing strategy",
      welcomeCard: welcomeCardDefault,
      icon: contentIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of demographic would you like to impact?",
          subheader: "Please be as specific as possible..",
          required: true,
          inputType: "text",
        },
        {
          id: "content-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of content would you like to use for the campaign?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "tone-voice",
          type: TWorkflowQuestionType.OpenText,
          headline: "What tone/voice would you like to use",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "channel",
          type: TWorkflowQuestionType.OpenText,
          headline: "What channel would you like to use",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Create me a content marketing strategy for @industry that targets @demographic audience, and includes @content-type content with @tone-voice. Additionally, please suggest ways to optimize the content for @channel and improve the SEO ranking.
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
    name: "Content Marketing Materials",
    icon: contentMaterialsIcon.src,
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Develop engaging content materials to enhance your marketing.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Content Marketing Materials",
      welcomeCard: welcomeCardDefault,
      icon: contentMaterialsIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the target audience?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main topic?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some keywords related to the main topic",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me brainstorm ideas for my next content marketing campaign? I'm targeting @target-audience and want to create content around @topic. Specifically, I'm interested in the following topics: @keywords.
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
    name: "Video Content Creator",
    icon: videoIcon.src,
    category: "Startup",
    subcategory: "Video Production",
    description: "Create persuasive video content on specific topics.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Video Content Creator",
      welcomeCard: welcomeCardDefault,
      icon: videoIcon.src,
      questions: [
        {
          id: "challenge",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the challenge of your video production?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main topic of your video production?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main topic?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What goal would you like to achieve?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I am struggling with @challenge in creating my video content on @topic, and I need some advice on how to overcome this challenge while keeping the @target-audience and @goal in mind. Can you help me out?
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
    name: "Video Production Strategy",
    icon: videoProductionIcon.src,
    category: "Startup",
    subcategory: "Video Production",
    description: "Develop a video production strategy, gaining insights and ideas.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Video Production Strategy",
      welcomeCard: welcomeCardDefault,
      icon: videoProductionIcon.src,
      questions: [
        {
          id: "brand-voice",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the brand voice?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main topic?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "platform",
          type: TWorkflowQuestionType.OpenText,
          headline: "What platform are you focus on?",
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
        - How can I create a video production strategy that aligns with my @brand-voice, while still being engaging and relevant for @target-audience on @platform?
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
    name: "Podcast Ideas",
    icon: podcastIcon.src,
    category: "Startup",
    subcategory: "Podcast Production",
    description: "Refresh podcast content strategies by exploring new ideas and formats.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Podcast Ideas",
      welcomeCard: welcomeCardDefault,
      icon: podcastIcon.src,
      questions: [
        {
          id: "audience-profile",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your audience profile?",
          subheader: "Detailed description of the target audience’s demographics and interests",
          required: true,
          inputType: "text",
        },
        {
          id: "content-history",
          type: TWorkflowQuestionType.OpenText,
          headline: "Overview of past content and any known engagement metrics",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "production",
          type: TWorkflowQuestionType.OpenText,
          headline: "Information on available resources and production limitations",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific objectives for audience engagement and growth",
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
        Context:
        You are Content Innovator GPT, an AI consultant specializing in podcast and video production. Your expertise lies in generating unique, engaging content ideas tailored to specific audience demographics and trends.
        
        Goal:
        To assist podcasters and video creators in consistently developing fresh, captivating content that resonates with their audience and drives engagement.
        
        Content Innovation Process:
        - Audience Analysis: Creators provide an overview of their target audience demographics and interests.
        - Content Review: Analyze the creator’s past content to identify what has or hasn’t worked.
        - Idea Generation: Generate innovative content ideas, formats, and themes.
        - Engagement Strategies: Suggest strategies to increase audience engagement with the new content.
        - Implementation and Feedback Guide: Provide a plan for implementing these ideas and a method for gathering audience feedback.
        
        Content Innovation Criteria:
        - Audience-Centric Ideas: Ensure all content ideas are tailored to the specific interests and preferences of the target audience.
        - Originality: Focus on fresh, unique ideas that stand out in the crowded content landscape.
        - Practicality: Suggestions should be feasible for the creator to produce with their available resources.
        - Engagement Focus: Ideas should inherently encourage audience interaction and engagement.
        - Adaptability: Include flexible ideas that can evolve based on audience feedback and changing trends.
        
        Information Required from Creator:
        1. Audience Profile: @audience-profile
        2. Content History: @content-history
        3. Production Capabilities: @production
        4. Engagement Goals: @goals
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
    name: "Podcast Production Projects",
    icon: podcastProductionIcon.src,
    category: "Startup",
    subcategory: "Podcast Production",
    description: "Streamline podcast production by generating topics and outlines.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Podcast Production Projects",
      welcomeCard: welcomeCardDefault,
      icon: podcastProductionIcon.src,
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main topic?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you suggest some podcast topic ideas related to @topic? Additionally, could you provide some potential subtopics or guest speakers that could be featured?
        - What are some common mistakes to avoid when producing a podcast? How can I remediate these mistakes and improve the overall quality of my podcast?
        - Can you provide me with a template for a podcast outline? Specifically, could you elaborate on any recommended segments or elements to include?
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
