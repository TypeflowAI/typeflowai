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
    isStreaming: false,
    engine: OpenAIModel.GPT35Turbo,
  },
  thankYouCard: thankYouCardDefault,
  hiddenFields: hiddenFieldsDefault,
  questions: [],
};

export const startupTemplates: TTemplate[] = [
  {
    name: "Product release notes",
    icon: "ReleaseNotesIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Create detailed and engaging product release notes.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product release notes",
      icon: "ReleaseNotesIcon",
      questions: [],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Business Plan Generator",
    icon: "PlanIcon",
    category: "Startup",
    subcategory: "Business Plan Generator",
    description: "Create a comprehensive business plan based on your product and services.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Creating business plan",
      icon: "PlanIcon",
      questions: [
        {
          id: "industry-segment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry or segment?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "competitors-products",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some top competitors or products" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "Can you provide an overview of the competitive landscape in @industry-segment, including @competitors-products, market share, and competitive advantages, to help me build a comprehensive business plan for @product-service?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Sales Strategy Planning",
    icon: "StrategyIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Develop a sales strategy with insightful and innovative ideas.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Sales Strategy Planning",
      icon: "StrategyIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "customer-segment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What segment of customers do you want to target?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "pain-point",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Detail a pain point of your clients." },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "metric",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What metric would you like to measure?" },
          subheader: {
            default:
              "Insert specific metric such as customer acquisition cost, conversion rate, or customer lifetime value, etc.",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some effective sales tactics for @product-service that cater to @customer-segment and address @pain-point? How can we measure the success of these tactics based on @metric
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Elevator Pitch",
    icon: "PitchIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Create an elevator pitch that highlights your business' key features.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Elevator Pitch",
      icon: "PitchIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "unique-value-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your unique value proposition?" },
          subheader: { default: "E.g. One-of-a-kind, customizable jewelry pieces" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Generate an elevator pitch for my @product-service that highlights its unique value proposition: @unique-value-proposition , the target audience: @target-audience and captures the attention of potential investors/customers/partners.    
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Mission Statement",
    icon: "MissionIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Build a clear and concise mission statement for your business.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Mission Statement",
      icon: "MissionIcon",
      questions: [
        {
          id: "position",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your position in your company?" },
          subheader: { default: "E.g. Sales Manager, Human Resources Specialist, Financial Analyst..." },
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your company about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "number",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many numbers would you like to create?" },
          subheader: { default: "Set a number between 1 and 4" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "As a @position of @company, I have been tasked with developing a mission statement that encapsulates our brand and reflects our @number core values. Can you provide me with a template or structure for creating a mission statement that is well-organized and impactful in the industry of @industry?".
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Growth Opportunities Identifier",
    icon: "GrowthIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Uncover growth opportunities through data and insightful suggestions.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Growth Opportunities Identifier",
      icon: "GrowthIcon",
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your company about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "improvement",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How would you like to improve your product/service?" },
          subheader: { default: "Increase, boost, expand etc." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "brand-goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a bit more about your company" },
          subheader: { default: "Brand identity, mission statement, business goals..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "Our @company is looking to @improvement our @product-service offerings in @target-audience. Can you analyze our customer/sales/financial etc. data and suggest potential growth opportunities that align with our @brand-goals?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Target Market Identifier",
    icon: "TargetIcon",
    category: "Startup",
    subcategory: "Business Planning",
    description: "Pinpoint your product's ideal market by analyzing preferences and needs.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Target Market Identifier",
      icon: "TargetIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of demographic would you like to impact?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "What are some emerging trends in the @industry that are likely to impact the @demographic market for @product-service and how can I adapt my marketing strategy to stay ahead of the curve?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Brand Identity Developer",
    icon: "BrandIcon",
    category: "Startup",
    subcategory: "Branding",
    description: "Develop a brand identity aligned with your values and target audience.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Brand Identity Developer",
      icon: "BrandIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some values of your company?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some need of your target audience" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "Can you suggest some potential slogans for a @product-service brand that emphasizes our commitment to @values and sets us apart from our competitors, while also considering the unique features of our @product-service and our target audience's @needs?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Naming Tool",
    icon: "NamingIcon",
    category: "Startup",
    subcategory: "Branding",
    description: "Generate creative and unique names for products or companies.",
    objectives: ["optimize_content_and_seo_strategy", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Naming Tool",
      icon: "NamingIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your new product/service/company?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us some keywords to include" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "tone",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What tone would you like to use" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of demographic would you like to impact?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - We are launching a new @product-service and we want a name that is relevant to our industry and has a strong brand identity. Can you suggest some names that incorporate @keywords, sound @tone, and appeal to our target audience of @demographic? Please provide at least 3 options.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Sales Presentations Creator",
    icon: "PresentationIcon",
    category: "Startup",
    subcategory: "Sales",
    description: "Create sales presentations featuring new ideas and outlining content.",
    objectives: ["streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Sales Presentations Creator",
      icon: "PresentationIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your new product/service/company?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of demographic would you like to impact?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need to create a sales presentation for @product-service that targets @demographic. Can you help me generate ideas for how to make it more appealing to @demographic, while still highlighting the key features and benefits of the @product-service?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Product Launch Plan",
    icon: "ProductHuntIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate ideas, identify roadblocks, and get recommendations for a Product Launch.",
    objectives: ["streamline_operations_and_sales", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product launch plan",
      icon: "ProductHuntIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your new product/service/company?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-channels",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What marketing channels would you like to use?" },
          subheader: { default: "E.g. Social Media, ads, etc." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you create a comprehensive product launch plan for @product-service, targeting @target-audience, and incorporating @marketing-channels? Please include a detailed timeline, budget, promotional strategies, and success metrics.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Product Roadmaps Creator",
    icon: "RoadmapIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Create product roadmaps: gather insights, generate ideas, and prioritize features.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Roadmaps Creator",
      icon: "RoadmapIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your new product/service/company?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the needs or problems of your audience?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "I need a product roadmap for @product-service that takes into account the broader ecosystem of our product, including integrations with third-party platforms, APIs, and partnerships. It should create value for our customers and stakeholders across the board and address their emotional and functional needs for @needs.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "User Interfaces Designer",
    icon: "InterfaceIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Brainstorm ideas, identify needs, and create wireframes.",
    objectives: ["innovate_and_develop", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "User Interfaces Designer",
      icon: "InterfaceIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product / service about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "user-group",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What user group do you want to focus on?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some best practices for designing interfaces of a @product-service that prioritize @user-group, and how can I ensure that my interface is useful and attractive for this group?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Minimum Viable Product",
    icon: "MvpIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Develop an MVP: generate ideas, refine concepts, and improve.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Minimum Viable Product",
      icon: "MvpIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product / service about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry or niche of your business?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some specific types of features that should be included in a minimum viable product of a @product-service for the industry: @industry, and how can they be e.g., tailored/modified to meet the unique needs of our target audience: @target-audience?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Product Feature Ideas",
    icon: "FeatureIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate product feature ideas based on data analysis.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Feature Ideas",
      icon: "FeatureIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product / service about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry or niche of your business?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "aspects",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What aspects do you want to address with these features?" },
          subheader: { default: "e.g., customer need/ pain point/ market gap" },
          required: true,
          inputType: "text",
        },
        {
          id: "metric",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What metric would you like to improve?" },
          subheader: { default: "e.g., metric, such as customer retention or sales" },
          required: true,
          inputType: "text",
        },
        {
          id: "percentage",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Type a potential percentage to increase" },
          subheader: { default: "Try to be realistic" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you generate some product features ideas that would differentiate our @product-service from competitors in the @industry market? Specifically, we are looking for features that address @aspects and have the potential to increase @metric by @percentage.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Idea Prioritizator",
    icon: "IdeaIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Transform your creative process by evaluating ideas efficiently.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Idea Priorizator",
      icon: "IdeaIcon",
      questions: [
        {
          id: "ideas",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "List of product ideas" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "description",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Brief description of each idea" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "resources",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Current resources and capabilities" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your business goals?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your target market?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Product Requirements Writer",
    icon: "WriteIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Generate clear, concise product requirements based on stakeholder needs.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Requirements Writer",
      icon: "WriteIcon",
      questions: [
        {
          id: "key-features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some key features of your product" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of demographic would you like to impact?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the needs or problems of your audience?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Write me detailed product requirements that cover the @key-features.
        - "Please create product requirements that define the target audience: @target-audience, including @demographic. Additionally, please include requirements that address @needs for this audience."
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Financial Performance Analyzer",
    icon: "FinancialIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Analyze your financial performance to make informed decisions.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Financial Performance Analyzer",
      icon: "FinancialIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What industry would you like to analyze?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "financial-metric",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the financial metric would you like to forecast" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us what is your company about" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "financial-performance",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What financial performance would you like to improve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Please analyze the @industry market trends for the past 2-3 years and forecast the @financial-metric for the next 2-3 years. Based on this analysis, what recommendations do you have for my company: @company to improve their @financial-performance?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Tax Documents Guide",
    icon: "TaxIcon",
    category: "Startup",
    subcategory: "Product Development",
    description: "Prepare tax documents recieving guidance on regulations and form completion.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Tax Documents Guide",
      icon: "TaxIcon",
      questions: [
        {
          id: "tax-rules",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name the specific tax rules/regulations" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "income-sources",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us income sources/situation" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "legal-provisions",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: {
            default: "What legal provisions or recent changes would you like to take into account?",
          },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "taxable-income",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific tax bracket/taxable income?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How to determine the @tax-rules that apply to your @income-sources, taking into account @legal-provisions, and understand how they impact your @taxable-income?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Reward System Generator",
    icon: "RewardIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Develop a recognition and rewards Systems for your team.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Reward System Generator",
      icon: "RewardIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "E.g. E-commerce and Digital Marketing" },
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the size of your team?" },
          subheader: { default: "E.g. 25 employees" },
          required: true,
          inputType: "text",
        },
        {
          id: "stage",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What stage is your company in?" },
          subheader: { default: "E.g. Growth-stage, exploring new markets" },
          required: true,
          inputType: "text",
        },
        {
          id: "recognition-system",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your current recognition system?" },
          subheader: { default: "E.g. Occasional verbal praise, lack of formal recognition program" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Interview Conductor Guide",
    icon: "InterviewIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Generate questions and discussion topics to conduct interviews.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Interview Conductor Guide",
      icon: "InterviewIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What position would you like to interview?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "aspect-job",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some aspect of job or company to ask about" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "Can you suggest some @industry questions that I can ask during my interview with @position, specifically relating to @aspect-job?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Job Descriptions Creator",
    icon: "JobIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Create job descriptions to attrack new talents.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Job Descriptions Creator",
      icon: "JobIcon",
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us what is your company about" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "job-title",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write the job title you want to hire" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "qualification-skill",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What qualification or skill are you looking for?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "education-certifications",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What education or certificates should the applicant have?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "experience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What should the applicant have experience in?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
         - I need to hire a @job-title that possesses @qualification-skill. Can you provide me with a job description that highlights the key @job-title responsibilities, qualifications, [e.g., HARD SKILLS/SOFT SKILLS], @education-certifications, and @experience that align with our @company culture?
         `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Employee Trainer",
    icon: "EmployeeTrainerIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Develop effective employee training based on your industry trends and methodologies.",
    objectives: ["innovate_and_develop", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Employee Trainer",
      icon: "EmployeeTrainerIcon",
      questions: [
        {
          id: "learning-styles",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some learning styles" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "technologies",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some training methodologies or technologies" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "employee-demographics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your employees demographics?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can we design training programs that cater to different @learning-styles, and what @technologies should we consider for each style? How can we tailor the training programs to the needs of our @employee-demographics and e.g., ENSURE THEIR ENGAGEMENT AND PARTICIPATION in the training?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Employee Career Booster",
    icon: "RocketIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Elevate your workplace boosting career prospects.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Employee Career Booster",
      icon: "RocketIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "E.g. Fintech" },
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the size of your team?" },
          subheader: { default: "E.g. 30 employees" },
          required: true,
          inputType: "text",
        },
        {
          id: "stage",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What stage is your company in?" },
          subheader: { default: "E.g. Series A funded, rapidly scaling" },
          required: true,
          inputType: "text",
        },
        {
          id: "advancement-structure",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your current advancement structure?" },
          subheader: { default: "E.g. Informal and ad hoc, lacking clear advancement pathways" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are Startup Career Advancement GPT, a specialized consultant for career growth within startup environments. Your expertise lies in creating pathways for employee advancement in settings where traditional hierarchical structures are limited. Your focus is on identifying innovative and practical methods to offer career progression opportunities to employees in startups.
        
        Goal:
        Develop and suggest actionable strategies that will enable us to offer clear and meaningful advancement opportunities for our team members. Your solutions should help us in retaining talent by providing them with a sense of progression and achievement within our startup.
        
        Advancement Opportunities Challenge:
        - Creating Role Progression Paths (How can we structure role progression in a flat teamal hierarchy?)
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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Candidate Rejections Guide",
    icon: "RejectionIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Guide candidate rejections with customizable empathetic responses.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Candidate Rejections Guide",
      icon: "RejectionIcon",
      questions: [
        {
          id: "reason-rejected",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the reason for the rejection" },
          subheader: {
            default: "e.g., Applied for a senior management position but lacks the required experience",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "filled-position",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What filled the position?" },
          subheader: { default: "E.g. A candidate who had more experience and better fit with the team" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me draft a rejection email to a candidate who @reason-rejected? The position has been filled by @filled-position. Please provide a message that is professional yet empathetic and includes a thank you for their time and effort."      
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Job Offer Responder",
    icon: "JobOfferIcon",
    category: "Startup",
    subcategory: "Human Resource",
    description: "Respond to job offers and negotiate your salary.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Job Offer Responder",
      icon: "JobOfferIcon",
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What company sent you the offer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "specific-goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Insert specific goals" },
          subheader: { default: "Such as expresses gratitude, clarifies details, negotiates salary, etc." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I received a job offer from @company, can you help me draft a response that @specific-goals`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Market Trends Analyzer",
    icon: "TrendIcon",
    category: "Startup",
    subcategory: "Data Analysis",
    description: "Analyze market trends and predictions easily.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Market Trends Analyzer",
      icon: "TrendIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry or niche of your business?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key e.g., indicators/factors/data points to look for when trying to identify and capitalize on current market trends in the industry: @industry, and how can I use this information to improve/optimize my @product-service offerings?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Data Visualizer",
    icon: "DataVisualizerIcon",
    category: "Startup",
    subcategory: "Data Analysis",
    description: "Generate effective, engaging, and insightful data visualizations.",
    objectives: ["improve_business_strategy", "optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Data visualizer",
      icon: "DataVisualizerIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "data-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of data do you want to know about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide examples of successful data visualizations that were used for @industry, and explain why they were effective?
        - What are the most effective data visualization tools or software for @data-type, and how can I use them to create more compelling visualizations?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Expenses Report",
    icon: "CreditCardIcon",
    category: "Startup",
    subcategory: "Administrative",
    description: "Streamline expense reporting inputting relevant details.",
    objectives: ["streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Expenses Report",
      icon: "CreditCardIcon",
      questions: [
        {
          id: "category",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What category of expenses?" },
          subheader: { default: "Such as e.g. meals/lodging/transportation" },
          required: true,
          inputType: "text",
        },
        {
          id: "time-period",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What time of period?" },
          subheader: { default: "E.g. Daily, monthly, quarterly..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What is the best way to break down expenses by @category, and how should I document them for @time-period? Can you provide more information on how to categorize these expenses and any tips or best practices for documentation?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Scheduling Appointments",
    icon: "CalendarIcon",
    category: "Startup",
    subcategory: "Administrative",
    description: "Optimize your schedule: receive appointments and timely reminders.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Scheduling Appointments",
      icon: "CalendarIcon",
      questions: [
        {
          id: "name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name of the person for the appointment" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "type-appointment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of appontment?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "date",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the date?" },
          subheader: { default: "E.g. Daily, monthly, quarterly..." },
          required: true,
          inputType: "text",
        },
        {
          id: "time",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the time?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the location?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "additional-requests",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write additional requests" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What steps should I take to schedule an appointment with @name for a @type-appointment on @date at @time at @location? Also, I need @additional-requests.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Performance Evaluator",
    icon: "PerformanceIcon",
    category: "Startup",
    subcategory: "Leadership",
    description: "Enhance evaluations by identifying areas for improvement.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Performance Evaluator",
      icon: "PerformanceIcon",
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name of the employee" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What area is this employee in?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you suggest some strategies for addressing potential biases or stereotypes that may influence the performance evaluation process, particularly with respect to @employee-name 's gender, race, or other personal characteristics?
        - Can you provide guidance on how to evaluate @employee-name 's performance in @area when there are no objective metrics or performance data available?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Crisis Management Planner",
    icon: "CrisisIcon",
    category: "Startup",
    subcategory: "Crisis Management",
    description: "Create a crisis management plan to mitigate risks.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Crisis Management Planner",
      icon: "CrisisIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "similiar-teams",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a few of similar teams" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Design a crisis management plan for @industry that addresses a wide range of potential crises, incorporates best practices from @similiar-teams, and includes a communication strategy for e.g. media outreach/internal communication/crisis monitoring. Also, include protocols for e.g. financial recovery/business continuity/reputation management."
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Career Development Planner",
    icon: "DevIcon",
    category: "Startup",
    subcategory: "Career Developement",
    description: "Guide career development by offering personalized recommendations.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Career Development Planner",
      icon: "DevIcon",
      questions: [
        {
          id: "current-skills",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your current skills?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What industry would you like to improve in?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you create a career development plan that takes into account my current skills: @current-skills and identifies areas of improvement needed to advance in @industry?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Resume Writer",
    icon: "DocumentIcon",
    category: "Startup",
    subcategory: "Career Developement",
    description: "Enhance resume writing with relevant data and formatting.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Resume Writer",
      icon: "DocumentIcon",
      questions: [
        {
          id: "resume-cv",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write here your CV" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me condense my cv: @resume-cv to fit onto one page without losing any key information? I'm having trouble deciding what to cut and what to keep. Can you also suggest some adjectives that describe me in a positive light?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Leadership Development Planner",
    icon: "LeadershipIcon",
    category: "Startup",
    subcategory: "Leadership Development",
    description: "Get customized guidance and resources to write a leader's plan.",
    objectives: ["innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Leadership Development Planner",
      icon: "LeadershipIcon",
      questions: [
        {
          id: "plan-for",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Who is the plan for?" },
          subheader: { default: "E.g. myself/employee/team member" },
          required: true,
          inputType: "text",
        },
        {
          id: "skill-area",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What skill or area of weakness would you like to focus on?" },
          subheader: { default: "E.g. specific skill/area of weakness" },
          required: true,
          inputType: "text",
        },
        {
          id: "goal-outcome",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What goal or outcome would you like achieve?" },
          subheader: { default: "Specific goal/outcome" },
          required: true,
          inputType: "text",
        },
        {
          id: "challenge",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main challenge?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me create a leadership development plan for @plan-for? I would like to focus on improving @skill-area, which I believe will help me achieve @goal-outcome. Some of the challenges I've faced in this area include @challenge, and I would appreciate any guidance or resources you can offer to help me overcome these obstacles.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Leaders' Abilities Enhancer",
    icon: "ToolsIcon",
    category: "Startup",
    subcategory: "Leadership Development",
    description: "Enhance leadership adaptability to multiple situations.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Leaders' Abilities Enhancer",
      icon: "ToolsIcon",
      questions: [
        {
          id: "team-composition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the team composition" },
          subheader: { default: "Details about the diversity in their team" },
          required: true,
          inputType: "text",
        },
        {
          id: "leadership-style",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Description of their current leadership approach" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "challenges",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the challenges" },
          subheader: { default: "Specific challenges encountered in managing diverse teams or situations" },
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the objectives?" },
          subheader: { default: "Goals for improving their adaptability as a leader" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Project Planner",
    icon: "ProjectPlannerIcon",
    category: "Startup",
    subcategory: "Project Management",
    description: "Generate project plans: scope, milestones, and timelines.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Planner",
      icon: "ProjectPlannerIcon",
      questions: [
        {
          id: "project-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of project are you working on?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "components",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name addressed 3 components" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key components of a comprehensive project plan for @project-type, and how can I ensure that I have adequately addressed each component, such as @components?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Project Budget Maker",
    icon: "BudgetIcon",
    category: "Startup",
    subcategory: "Project Management",
    description: "Manage project budgets: estimate costs, forecast, and track expenses.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Budget Maker",
      icon: "BudgetIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of project are you working on?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "factors",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What key factors would you like to improve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key factors that influence the @project-name budget, and how can I improve them? Specifically, how can I account for @factors in my budget plan?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Idea Generator",
    icon: "IdeaIcon",
    category: "Startup",
    subcategory: "Innovation",
    description: "Brainstorm, ideate, and innovate with unique insights.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Idea Generator",
      icon: "IdeaIcon",
      questions: [
        {
          id: "problem-topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What topic or problem would you want to solve?" },
          subheader: { default: "Specific problem or topic" },
          required: true,
          inputType: "text",
        },
        {
          id: "outcome",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your desired outcome?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "suggestions",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write some suggestions to complement" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some effective methods that I can use to generate ideas for @problem-topic? I'm looking for ways to @outcome, but I'm open to @suggestions.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Innovation Strategy Developer",
    icon: "InnovationIcon",
    category: "Startup",
    subcategory: "Innovation",
    description: "Develop innovative strategies to stay ahead of your competitors.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Innovation Strategy Developer",
      icon: "InnovationIcon",
      questions: [
        {
          id: "industry-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "disruptors",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some disruptors or uncertainties" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the factors that are shaping the @industry-market, and how can we develop an innovation strategy that aligns with these trends while anticipating future @disruptors?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Innovation Opportunities",
    icon: "CompassIcon",
    category: "Startup",
    subcategory: "Innovation",
    description: "Identify opportunities to innovate your products and services.",
    objectives: ["innovate_and_develop", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Innovation Opportunities",
      icon: "CompassIcon",
      questions: [
        {
          id: "company-team",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your company/team about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us more about your new product/service" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry or niche of your business?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can @company-team foster a culture of innovation to consistently identify and capitalize on new @product-service opportunities in @industry-niche, and what are some best practices for doing so?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Employee Feedback Responder",
    icon: "FeedbackIcon",
    category: "Startup",
    subcategory: "Employee Engagement",
    description: "Manage employee feedback to turn issues into improvements.",
    objectives: ["improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Employee Feedback Responder",
      icon: "FeedbackIcon",
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the employee's name?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "issue",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the feedback issue about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "feedback",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the feedback" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need help crafting a response to @employee-name 's feedback about @issue. They mentioned @feedback and I want to ensure that I address their concerns in a thoughtful way. Can you assist me in drafting an appropriate response?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Company Culture Strategy",
    icon: "CultureIcon",
    category: "Startup",
    subcategory: "Company Culture",
    description: "Formulate a company culture strategy aligned with your values.",
    objectives: ["improve_customer_and_employee_experience", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Company Culture Strategy",
      icon: "CultureIcon",
      questions: [
        {
          id: "core-values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the company core values/strategic goals?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some effective ways to improve a company culture that aligns with our @core-values and supports talented employees, including but not limited to culture audits/employee workflows/leadership workshops and transparent communications?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Work Culture Designer",
    icon: "OfficeChairIcon",
    category: "Startup",
    subcategory: "Company Culture",
    description: "Design remote and in-office work cultures to attract talents.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Work Culture Designer",
      icon: "OfficeChairIcon",
      questions: [
        {
          id: "cultural-dynamics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Description of existing remote and in-office work culture" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "challenges",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Specific issues faced in integrating the two cultures" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "core-values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Core values and objectives for the company culture" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "employee-feedback",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Previous feedback from employees about the work culture" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Sales Trends Identifier",
    icon: "TrendIcon",
    category: "Startup",
    subcategory: "Sales Analysis",
    description: "Examine industry-specific sales trends to inform your strategy.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Sales Trends Identifier",
      icon: "TrendIcon",
      questions: [
        {
          id: "customer-behavior",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of customer behavior do you want to know more about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "How can I use AI to analyze @customer-behavior data and identify emerging sales trends in @industry? Can AI also help me identify causes/effects of these trends such as demographics of my target audience: @targe-audience?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Business Intelligence Assessments",
    icon: "BusinessIntelligenceIcon",
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Identify KPIs to determine business objectives.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Conducting business intelligence assessments",
      icon: "BusinessIntelligenceIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "data-segmentation",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write specific data segmentation to take into account" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write specific demographic factors to take into account" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "What are the key metrics that can be analyzed to determine business objective in industry: @industry and how can @data-segmentation and @demographic factors be used to draw insights from this analysis?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Competitive Analysis",
    icon: "SwordFightIcon",
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Perform competitive analysis, offering insights and recommendations.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Competitive Analysis",
      icon: "SwordFightIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can I conduct a comprehensive competitive analysis to identify my main competitors in the @industry and analyze their strengths/weaknesses/opportunities/threats in terms of market share/revenue growth/customer retention?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Industry Research",
    icon: "ResearchIcon",
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Conduct industry research, gathering insights, stats, and trends.",
    objectives: ["improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Industry Research",
      icon: "ResearchIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the product or service you want to know about" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "country-region",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What country or region would you like to analyze this product?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "market-segment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What market segment do you want to know?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How do I use AI to find the market size of @product-service in @country-region and analyze the growth potential in @market-segment ?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Growth Detector",
    icon: "GrowthIcon",
    category: "Startup",
    subcategory: "Business Intelligence",
    description: "Identify growth opportunities to get ideas for expansion.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Growth Detector",
      icon: "GrowthIcon",
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your company about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some potential growth opportunities for my @company in the @industry industry considering current market trends, customer behavior and competitor strategies?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Web Design User Research",
    icon: "FigmaIcon",
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Conduct user research to understand behavior for web design.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Web Design User Research",
      icon: "FigmaIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "tool",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name specific tool/method/technique you would like to use" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What objective/goal would you like to achieve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide multiple examples/suggestions on how to conduct user research for web design, specifically for @target-audience , using @tool to @goal?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Web Usability Test",
    icon: "HtmlIcon",
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Gain insights and recommendations to enhance user experience.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Web Usability Test",
      icon: "HtmlIcon",
      questions: [
        {
          id: "website-goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the website goals?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of the website?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide examples of successful web usability testing methods that have been used to @website-goals for industry: @industry, and what specific metrics were used to measure the results?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Web Interfaces Designer",
    icon: "InterfaceIcon",
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Design web interfaces with user-friendly layouts and features.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Web Interfaces Designer",
      icon: "InterfaceIcon",
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the values of your brand?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        I'm designing a website for my business and I need help selecting a primary/secondary color scheme. Can you suggest a palette that aligns with my brand's values?
        - Business: @business
        - Values: @values
        What are some best practices for creating responsive/mobile-friendly web layouts that minimize the need for scrolling?
        I'm struggling to come up with innovative ideas for my website features. Can you suggest some unique interactive features that will engage my website visitors?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Web Design Features Developer",
    icon: "DesignIcon",
    category: "Startup",
    subcategory: "UX/UI Design",
    description: "Enhance UX offering insights on layout, typography, and content.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Web Design Features Developer",
      icon: "DesignIcon",
      questions: [
        {
          id: "website-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of website are you developing?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience for this website?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "brand-guidelines",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe your brand guidelines" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        "What are some effective color schemes for a @website-type that caters to @target-audience and emphasizes brand identity? How can I ensure that the colors are appropiate for the content and do not compromise accessibility?
        Can you suggest some design elements to enhance the user experience of my @website-type, while incorporating trendy features and avoiding common mistakes? How can I ensure that the design is consistent with our brand guidelines: @brand-guidelines and resonates with our @target-audience?"
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Content Marketing Campaigns",
    icon: "CampaignIcon",
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Content marketing campaigns from generating ideas to optimizing SEO.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Content Marketing Campaigns",
      icon: "CampaignIcon",
      questions: [
        {
          id: "content-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of content would you like to use for the campaign?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key elements of a successful @content-type campaign for the industry: @industry  audience, and how can AI assist with their execution and optimization?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Content Marketing Strategy",
    icon: "ContentIdeasIcon",
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Create a winning content marketing strategy for your audience.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Creating content marketing strategy",
      icon: "ContentIdeasIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What kind of demographic would you like to impact?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "content-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of content would you like to use for the campaign?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "tone-voice",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What tone/voice would you like to use" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "channel",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What channel would you like to use" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Create me a content marketing strategy for @industry that targets @demographic audience, and includes @content-type content with @tone-voice. Additionally, please suggest ways to optimize the content for @channel and improve the SEO ranking.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Content Marketing Materials",
    icon: "ContentMaterialsIcon",
    category: "Startup",
    subcategory: "Content Marketing",
    description: "Develop engaging content materials to enhance your marketing.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Content Marketing Materials",
      icon: "ContentMaterialsIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some keywords related to the main topic" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me brainstorm ideas for my next content marketing campaign? I'm targeting @target-audience and want to create content around @topic. Specifically, I'm interested in the following topics: @keywords.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Video Content Creator",
    icon: "VideoIcon",
    category: "Startup",
    subcategory: "Video Production",
    description: "Create persuasive video content on specific topics.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Video Content Creator",
      icon: "VideoIcon",
      questions: [
        {
          id: "challenge",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the challenge of your video production?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic of your video production?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What goal would you like to achieve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I am struggling with @challenge in creating my video content on @topic, and I need some advice on how to overcome this challenge while keeping the @target-audience and @goal in mind. Can you help me out?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Video Production Strategy",
    icon: "VideoProductionIcon",
    category: "Startup",
    subcategory: "Video Production",
    description: "Develop a video production strategy, gaining insights and ideas.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Video Production Strategy",
      icon: "VideoProductionIcon",
      questions: [
        {
          id: "brand-voice",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the brand voice?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "platform",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What platform are you focus on?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can I create a video production strategy that aligns with my @brand-voice, while still being engaging and relevant for @target-audience on @platform?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Podcast Ideas",
    icon: "PodcastIcon",
    category: "Startup",
    subcategory: "Podcast Production",
    description: "Refresh podcast content strategies by exploring new ideas and formats.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Podcast Ideas",
      icon: "PodcastIcon",
      questions: [
        {
          id: "audience-profile",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your audience profile?" },
          subheader: { default: "Detailed description of the target audience’s demographics and interests" },
          required: true,
          inputType: "text",
        },
        {
          id: "content-history",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Overview of past content and any known engagement metrics" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "production",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Information on available resources and production limitations" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Specific objectives for audience engagement and growth" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

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
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
  {
    name: "Podcast Production Projects",
    icon: "PodcastProductionIcon",
    category: "Startup",
    subcategory: "Podcast Production",
    description: "Streamline podcast production by generating topics and outlines.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Podcast Production Projects",
      icon: "PodcastProductionIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you suggest some podcast topic ideas related to @topic? Additionally, could you provide some potential subtopics or guest speakers that could be featured?
        - What are some common mistakes to avoid when producing a podcast? How can I remediate these mistakes and improve the overall quality of my podcast?
        - Can you provide me with a template for a podcast outline? Specifically, could you elaborate on any recommended segments or elements to include?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        engine: OpenAIModel.GPT4,
      },
    },
  },
];
