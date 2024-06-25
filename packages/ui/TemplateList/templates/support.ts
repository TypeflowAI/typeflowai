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
    allowRetry: false,
    engine: OpenAIModel.GPT35Turbo,
  },
  thankYouCard: thankYouCardDefault,
  hiddenFields: hiddenFieldsDefault,
  questions: [],
};

export const supportTemplates: TTemplate[] = [
  {
    name: "Product Usage Instructions",
    icon: "TodoIcon",
    category: "Support",
    subcategory: "Product Information",
    description: "Create your detailed product usage instructions easily.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Usage Instructions",
      icon: "TodoIcon",
      questions: [
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the product name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the product about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I'm looking for a comprehensive guide on how to use @product-name. Can you provide me with detailed instructions on all of its features and functions?
        - Can you help me create usage instructions for this product: @product ? I need detailed step-by-step instructions on how to use it.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chat Feedback",
    icon: "FeedbackIcon",
    category: "Support",
    subcategory: "Chat Support",
    description: "Enhance customer experience by analyzing chat feedback.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chat Feedback",
      icon: "FeedbackIcon",
      questions: [
        {
          id: "services",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of services would you like to improve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can we use customer feedback collected via chat to improve our @services services in a timely and efficient manner?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chat Support Guidelines",
    icon: "InterviewIcon",
    category: "Support",
    subcategory: "Chat Support",
    description: "Train chat support agents effectively by generating custom guidelines.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chat Support Guidelines",
      icon: "InterviewIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "instructions",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write some instructions for using the product/service" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "issues",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are common issues/problems that customers face of?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the most common issues/problems that customers/clients face when using our @product-service? Please provide a detailed response that includes steps/instructions/guidelines @instructions to resolve these issues/problems @issues.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Advice",
    icon: "DesignIdeasIcon",
    category: "Support",
    subcategory: "Chat Support",
    description: "Provide personalized product advice, enhancing customer satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Advice",
      icon: "DesignIdeasIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What product or service do you want to know more about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What features are you looking for?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "quality",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What quality are you looking for?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your budget range?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I'm in the market for a new @product-service and I'm wondering what you would recommend. I'm looking for the following features: @features . I also want it to be @quality. My budget is @budget . Can you provide some suggestions?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chat Moderator",
    icon: "ModeratorIcon",
    category: "Support",
    subcategory: "Chat Support",
    description: "Moderate inappropriate chat messages, ensuring a safer online environment for users.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chat Moderator",
      icon: "ModeratorIcon",
      questions: [
        {
          id: "chat-logs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the chat logs that you would like to moderate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can AI be trained/optimized to recognize context and sarcasm/avoid false positives in chat messages in order to reduce/minimize mistakes/false flags/over-moderation?
        - Can you provide an analysis/review of the chat logs @chat-logs and identify/highlight/flag any messages that may require further review/are potentially inappropriate/contain offensive language]?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Culturally Sensitive Support",
    icon: "WarningIcon",
    category: "Support",
    subcategory: "Email Support",
    description: "Enhance multilingual support for businesses, ensuring culturally sensitive assistance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Culturally Sensitive Support",
      icon: "WarningIcon",
      questions: [
        {
          id: "e-mail",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the original E-mail" },
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
        You are a Multilingual E-Mail Support GPT, capable of understanding and responding to customer emails in various languages. Your expertise includes not just language translation but also cultural nuance and localization.
        
        Goal:
        To address customer queries via email in their native language, providing culturally appropriate, accurate, and empathetic responses, thereby enhancing customer relations across different regions.
        
        E-Mail Support Structure:
        1. Language Detection: Automatically identify the customer's language.
        2. Culturally Adapted Greeting: Start with a greeting suitable for the customer's culture.
        3. Localized Response: Provide a response that is not only linguistically but also culturally tailored.
        4. Clarification Request: Politely ask for clarification if certain aspects of the query are unclear due to language differences.
        5. Multilingual Resources: Offer links to FAQs or help resources in the customer's language.
        6. Respectful Closing: Conclude with a culturally respectful sign-off.
        
        Multilingual Criteria:
        - Ensure linguistic accuracy and appropriateness in all responses.
        - Adapt the tone and formalities according to cultural norms.
        - Avoid direct translations that might misrepresent the intended meaning.
        - Use simple, clear language to minimize misunderstandings.
        - Be sensitive to cultural nuances and preferences in communication.
        
        Insert E-Mail: @e-mail
        
        E-Mail Format:
        Maintain a professional layout with a clear, easy-to-follow structure.
        Use simple vocabulary and short sentences for clarity.
        Respect the conventions of business communication in different languages and cultures.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Customer Returns & Refunds",
    icon: "RefundIcon",
    category: "Support",
    subcategory: "Email Support",
    description: "Optimize customer returns and refunds to save time and boost satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Returns & Refunds",
      icon: "RefundIcon",
      questions: [
        {
          id: "reason-return",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the reason for return?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I have a customer who is requesting a return and refund for @reason-return. Could you provide me with some useful tips to assist them with their request?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Onboarding Emails Writer",
    icon: "WelcomeIcon",
    category: "Support",
    subcategory: "Email Support",
    description: "Optimize user onboarding by generating engaging and informative emails.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Onboarding Emails Writer",
      icon: "WelcomeIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of the company?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What position have you hired?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the company goals?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-culture",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the company culture?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need an onboarding email template for @company-name 's @position new hires. Please include an introduction to our company culture, goals.
        - Company goals: @company-goals
        - Company culture: @company-culture
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Technical Support Provider",
    icon: "TechnicalIcon",
    category: "Support",
    subcategory: "Customer Service",
    description: "Enhance technical support by providing instant assistance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Technical Support Provider",
      icon: "TechnicalIcon",
      questions: [
        {
          id: "issue",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What issue/problem is facing the customer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you please provide additional details about the @issue the customer is experiencing, so I can provide more targeted technical support based on their unique situation?
        - Could you provide any related articles/resources/documentation or commonly asked questions (FAQs) that I can share with the customer to help resolve their @issue issue?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Customer Complaints",
    icon: "AngryIcon",
    category: "Support",
    subcategory: "Customer Service",
    description: "Handle customer complaints by providing quick and personalized responses.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Complaints",
      icon: "AngryIcon",
      questions: [
        {
          id: "complaint",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What complaint are you trying to handle?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "circumstance",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the current circumstance?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide me with some strategies or techniques to handle @complaint that is common in my industry or business, and any tips for effectively implementing these strategies based on my @circumstance?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Support Articles Generator",
    icon: "ArticleIcon",
    category: "Support",
    subcategory: "Customer Service",
    description: "Generate informative support articles, saving time and effort.",
    objectives: ["optimize_content_and_seo_strategy", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Support Articles Generator",
      icon: "ArticleIcon",
      questions: [
        {
          id: "issue",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What issue/problem is facing the customer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a specific topic to generate a detailed support about" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "action",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What action would you like to answer" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - We've been getting a lot of questions about @issue. Can you generate a detailed support article that covers @topic and provides step-by-step instructions on how to @action?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Return Requests",
    icon: "ReturnIcon",
    category: "Support",
    subcategory: "Order Management",
    description: "Manage return requests efficiently, offering accurate responses and guidance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Return Requests",
      icon: "ReturnIcon",
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Which product are your customers trying to return?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some common reasons for return requests for @product? We want to address these issues and improve the quality of our products.
        - Can you give me some tips on handling return requests for @product? We've been experiencing a higher-than-average rate of returns and want to prevent them in the future.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Order Payment Issues",
    icon: "CreditCardIcon",
    category: "Support",
    subcategory: "Order Management",
    description: "Resolve order payment issues with guidance and troubleshooting support.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Order Payment Issues",
      icon: "CreditCardIcon",
      questions: [
        {
          id: "reason",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the reason of the payment issue?" },
          subheader: { default: "E.g. It wasn't the correct amount/was declined]" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I received a payment notification/email from customer, but it @reason. How can I resolve this issue/receive the correct payment?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Order Confirmations",
    icon: "OrderConfirmedIcon",
    category: "Support",
    subcategory: "Order Management",
    description: "Generate personalized order confirmations swiftly and efficiently.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Order Confirmations",
      icon: "OrderConfirmedIcon",
      questions: [
        {
          id: "customer-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the customer's name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the product's name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Please generate an order confirmation for @customer-name for their recent purchase of @product-name. Please include the order number, delivery date, and any relevant discount codes.        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Legal Documents Writer",
    icon: "LegalIcon",
    category: "Support",
    subcategory: "Knowledge Management",
    description: "Generate high-quality legal documents based on your specific requirements.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Legal Documents Writer",
      icon: "LegalIcon",
      questions: [
        {
          id: "type-document",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of legal document would you like to create?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "terms-conditions",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the terms and conditions" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "business-team",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business/team about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "clauses",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some clauses" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need a @type-document that outlines the @terms-conditions of my @business-team. Please generate a document that includes the following clauses related to @topics: @clauses.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Brand Mentions Monitor",
    icon: "BrandIcon",
    category: "Support",
    subcategory: "Social Media",
    description: "Monitor brand mentions across social media platforms efficiently.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Brand Mentions Monitor",
      icon: "BrandIcon",
      questions: [
        {
          id: "brand-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the brand name?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "time-frame",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What time frame are you interest in?" },
          subheader: { default: "E.g. Day, Month, Quarter..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Who can provide me with a list of all the social media platform(s) where @brand-name has been mentioned in the past @time-frame?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Comments Moderator",
    icon: "CommentIcon",
    category: "Support",
    subcategory: "Social Media",
    description: "Moderate brand comments across social media platforms easily.",
    objectives: ["enhance_online_presence"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Comments Moderator",
      icon: "CommentIcon",
      questions: [
        {
          id: "comment",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the comment to moderate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Please analyze the sentiment of the following comment and categorize it as either positive, negative, or neutral. If negative, provide potential reasons for the negative sentiment and suggest appropriate actions to address them.
        - Comment: @comment
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Customer Relationships Manager",
    icon: "RelationshipIcon",
    category: "Support",
    subcategory: "Social Media",
    description:
      "Enhance customer relationships through insightful strategies and effective communication techniques.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Relationships Manager",
      icon: "RelationshipIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some effective ways to personalize my interactions with customers/clients, based on their previous purchases/interactions and reviews? How can I use this information to tailor my @product-service to their preferences/needs?
        - How can I use social media/digital platforms to connect with customers/clients and build a strong online mpresence? What are some best practices/strategies for engaging with customers/clients through these channels/platforms?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chatbot Content Updater",
    icon: "Robot1Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Update chatbot and virtual assistant content swiftly.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chatbot Content Updater",
      icon: "Robot1Icon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "task",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific task would you like to add?" },
          subheader: { default: "E.g. adding a new product feature or updating pricing information" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the steps to update the chatbot/virtual assistant for @product-service? Can you provide guidance on how to @task ?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chatbot & VA Trainer",
    icon: "Robot2Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Provide tailored chatbot and virtual assistant training for new users.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chatbot & VA Trainer",
      icon: "Robot2Icon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need to create/improve a comprehensive training workflow for new users to effectively use @product-service chatbot and virtual assistant. Can you guide me throug the best practices] for designing/implementing/evaluating this training program using advanced AI technology?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Chatbot Billing Support",
    icon: "Robot3Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Manage billing inquiries enhancing customer satisfaction and reducing staff workload.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Chatbot Billing Support",
      icon: "Robot3Icon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - When a customer asks how to resolve an issue with their billing for @product-service, what should I ask for to verify their account and how should I provide instructions to resolve the issue?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Sales Support Chatbot",
    icon: "Robot4Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description:
      "Design sales support chatbots, enhancing engagement, personalization, and sales efficiency.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Sales Support Chatbot",
      icon: "Robot4Icon",
      questions: [
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
        - What are the best practices for designing a sales chatbot that can answer customer questions/provide product recommendations/close sales, and how can we tailor the chatbot's responses to meet the unique needs and preferences of our @target-audience?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Technical Support Chatbot",
    icon: "Robot5Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description:
      "Generate technical responses efficiently, enhancing customer service and reducing response times.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Technical Support Chatbot",
      icon: "Robot5Icon",
      questions: [
        {
          id: "inquiries",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What inquiries would you like to address?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What topic would you like to resolve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide guidance on how to generate chatbot responses/answers that address @inquiries related to @topic?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Customer Onboarding VA",
    icon: "CustomerSupportIcon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Create virtual assistants for customer onboarding, enhancing efficiency and satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Onboarding VA",
      icon: "CustomerSupportIcon",
      questions: [
        {
          id: "onboarding-process",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe briefly the onboarding process?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What programming languages and tools should I use to create a virtual assistant for @onboarding-process ?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "FAQ Chatbot",
    icon: "Robot6Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Design a chatbot for FAQ support, enhancing customer assistance and engagement.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "FAQ Chatbot",
      icon: "Robot6Icon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the best tools/technologies for designing a chatbot that can support FAQs related to @product-service , and how can I integrate them with company's existing systems?
        What are some key considerations I should keep in mind while designing a chatbot that can handle high volume of customer queries related to @product-service, and how can I optimize its performance using data analytics/NLP techniques?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "User Feedback Chatbot",
    icon: "Robot7Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Streamline the process of designing chatbots for user feedback and workflows.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "User Feedback Support",
      icon: "Robot7Icon",
      questions: [
        {
          id: "feature",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What feature would you like to create?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the goal of your product/service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can we create a @feature to gather user feedback on @product-goal? What specific question should the chatbot ask and what response options should it provide?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Warranty Chatbot",
    icon: "Robot8Icon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Generate chatbot responses for warranty inquiries, enhancing customer service.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Warranty Chatbot",
      icon: "Robot8Icon",
      questions: [
        {
          id: "name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "warranty-inquiries",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of warranty inquiries do you need to solve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Hello, @name here. Could you provide me with some guidance on how to use AI / our chatbot platform to generate responses for @warranty-inquiries ?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Specific Information Request Tool",
    icon: "InformationIcon",
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Ask users for specific information to help them reach their goals.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Specific Information Request Tool",
      icon: "InformationIcon",
      questions: [
        {
          id: "user-needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the user needs" },
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
        I am Clarification Expert AI, an advanced conversational assistant known for my ability to handle vague or unclear user inputs with finesse. My specialty lies in guiding users to refine their requests, making them more specific and actionable while ensuring a smooth and engaging conversation.
        
        Objective:
        Your goal is to improve the user experience by transforming ambiguous or vague user requests into clear, well-defined queries without causing frustration or confusion. I'm here to assist you in this endeavor, ensuring that users feel understood and valued throughout the conversation.
        
        Refinement Strategy:
        - **Elicit Specifics:** Skillfully ask targeted questions to narrow down the user's intent.
        - **Offer Examples:** Provide illustrative examples to help users express their needs more precisely.
        - **Contextual Insight:** Leverage the ongoing conversation context to make educated guesses about what the user might mean.
        - **Confirm Understanding:** Seek user confirmation to ensure that the interpreted query aligns with their requirements before proceeding.
        
        Refinement and Clarity Criteria:
        - **Seamless Clarity:** Integrate clarification requests smoothly into responses to maintain a natural flow of conversation.
        - **User Comfort:** Prioritize the user's comfort and avoid overwhelming them with excessive questions.
        - **Efficient Information Gathering:** Strive to extract essential information effectively, minimizing unnecessary back-and-forth.
        - **Sustained Engagement:** Keep the user engaged and interested throughout the refinement process.
        
        Example Interaction:
        User: @user-needs

        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
];
