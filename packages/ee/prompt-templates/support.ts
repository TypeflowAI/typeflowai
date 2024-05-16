import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import { TWorkflowHiddenFields, TWorkflowQuestionType } from "@typeflowai/types/workflows";
import angryIcon from "@typeflowai/ui/icons/templates/angry.svg";
import articleIcon from "@typeflowai/ui/icons/templates/article.svg";
import brandIcon from "@typeflowai/ui/icons/templates/brand.svg";
import commentIcon from "@typeflowai/ui/icons/templates/comment.svg";
import creditCardIcon from "@typeflowai/ui/icons/templates/credit-card.svg";
import customerSupportIcon from "@typeflowai/ui/icons/templates/customer-support.svg";
import designIdeasIcon from "@typeflowai/ui/icons/templates/design-ideas.svg";
import feedbackIcon from "@typeflowai/ui/icons/templates/feedback.svg";
import informationIcon from "@typeflowai/ui/icons/templates/information.svg";
import interviewIcon from "@typeflowai/ui/icons/templates/interview.svg";
import legalIcon from "@typeflowai/ui/icons/templates/legal.svg";
import moderatorIcon from "@typeflowai/ui/icons/templates/moderator.svg";
import orderConfirmedIcon from "@typeflowai/ui/icons/templates/order-confirmed.svg";
import refundIcon from "@typeflowai/ui/icons/templates/refund.svg";
import relationshipIcon from "@typeflowai/ui/icons/templates/relationship.svg";
import returnIcon from "@typeflowai/ui/icons/templates/return.svg";
import robot1Icon from "@typeflowai/ui/icons/templates/robot1.svg";
import robot2Icon from "@typeflowai/ui/icons/templates/robot2.svg";
import robot3Icon from "@typeflowai/ui/icons/templates/robot3.svg";
import robot4Icon from "@typeflowai/ui/icons/templates/robot4.svg";
import robot5Icon from "@typeflowai/ui/icons/templates/robot5.svg";
import robot6Icon from "@typeflowai/ui/icons/templates/robot6.svg";
import robot7Icon from "@typeflowai/ui/icons/templates/robot7.svg";
import robot8Icon from "@typeflowai/ui/icons/templates/robot8.svg";
import technicalIcon from "@typeflowai/ui/icons/templates/technical.svg";
import todoIcon from "@typeflowai/ui/icons/templates/todo.svg";
import warningIcon from "@typeflowai/ui/icons/templates/warning.svg";
import welcomeIcon from "@typeflowai/ui/icons/templates/welcome.svg";

const thankYouCardDefault = {
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

const welcomeCardDefault = {
  enabled: false,
  headline: { default: "Welcome!" },
  html: { default: "Thanks for providing your feedback - let's go!" },
  timeToFinish: false,
  showResponseCount: false,
};

export const supportTemplates: TTemplate[] = [
  {
    name: "Product Usage Instructions",
    icon: todoIcon.src,
    category: "Support",
    subcategory: "Product Information",
    description: "Create your detailed product usage instructions easily.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Product Usage Instructions",
      welcomeCard: welcomeCardDefault,
      icon: todoIcon.src,
      questions: [
        {
          id: "product-name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the product name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the product about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm looking for a comprehensive guide on how to use @product-name. Can you provide me with detailed instructions on all of its features and functions?
        - Can you help me create usage instructions for this product: @product ? I need detailed step-by-step instructions on how to use it.
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
    name: "Chat Feedback",
    icon: feedbackIcon.src,
    category: "Support",
    subcategory: "Chat Support",
    description: "Enhance customer experience by analyzing chat feedback.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Chat Feedback",
      welcomeCard: welcomeCardDefault,
      icon: feedbackIcon.src,
      questions: [
        {
          id: "services",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What type of services would you like to improve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can we use customer feedback collected via chat to improve our @services services in a timely and efficient manner?
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
    name: "Chat Support Guidelines",
    icon: interviewIcon.src,
    category: "Support",
    subcategory: "Chat Support",
    description: "Train chat support agents effectively by generating custom guidelines.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Chat Support Guidelines",
      welcomeCard: welcomeCardDefault,
      icon: interviewIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "instructions",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Write some instructions for using the product/service" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "issues",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What are common issues/problems that customers face of?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the most common issues/problems that customers/clients face when using our @product-service? Please provide a detailed response that includes steps/instructions/guidelines @instructions to resolve these issues/problems @issues.
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
    name: "Product Advice",
    icon: designIdeasIcon.src,
    category: "Support",
    subcategory: "Chat Support",
    description: "Provide personalized product advice, enhancing customer satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Product Advice",
      welcomeCard: welcomeCardDefault,
      icon: designIdeasIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What product or service do you want to know more about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What features are you looking for?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "quality",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What quality are you looking for?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your budget range?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm in the market for a new @product-service and I'm wondering what you would recommend. I'm looking for the following features: @features . I also want it to be @quality. My budget is @budget . Can you provide some suggestions?
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
    name: "Chat Moderator",
    icon: moderatorIcon.src,
    category: "Support",
    subcategory: "Chat Support",
    description: "Moderate inappropriate chat messages, ensuring a safer online environment for users.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Chat Moderator",
      welcomeCard: welcomeCardDefault,
      icon: moderatorIcon.src,
      questions: [
        {
          id: "chat-logs",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Paste here the chat logs that you would like to moderate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can AI be trained/optimized to recognize context and sarcasm/avoid false positives in chat messages in order to reduce/minimize mistakes/false flags/over-moderation?
        - Can you provide an analysis/review of the chat logs @chat-logs and identify/highlight/flag any messages that may require further review/are potentially inappropriate/contain offensive language]?
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
    name: "Culturally Sensitive Support",
    icon: warningIcon.src,
    category: "Support",
    subcategory: "Email Support",
    description: "Enhance multilingual support for businesses, ensuring culturally sensitive assistance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Culturally Sensitive Support",
      welcomeCard: welcomeCardDefault,
      icon: warningIcon.src,
      questions: [
        {
          id: "e-mail",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Paste here the original E-mail" },
          subheader: { default: "" },
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
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Customer Returns & Refunds",
    icon: refundIcon.src,
    category: "Support",
    subcategory: "Email Support",
    description: "Optimize customer returns and refunds to save time and boost satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Customer Returns & Refunds",
      welcomeCard: welcomeCardDefault,
      icon: refundIcon.src,
      questions: [
        {
          id: "reason-return",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the reason for return?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I have a customer who is requesting a return and refund for @reason-return. Could you provide me with some useful tips to assist them with their request?
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
    name: "Onboarding Emails Writer",
    icon: welcomeIcon.src,
    category: "Support",
    subcategory: "Email Support",
    description: "Optimize user onboarding by generating engaging and informative emails.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Onboarding Emails Writer",
      welcomeCard: welcomeCardDefault,
      icon: welcomeIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the name of the company?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What position have you hired?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-goals",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What are the company goals?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-culture",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What are the company culture?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need an onboarding email template for @company-name 's @position new hires. Please include an introduction to our company culture, goals.
        - Company goals: @company-goals
        - Company culture: @company-culture
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
    name: "Technical Support Provider",
    icon: technicalIcon.src,
    category: "Support",
    subcategory: "Customer Service",
    description: "Enhance technical support by providing instant assistance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Technical Support Provider",
      welcomeCard: welcomeCardDefault,
      icon: technicalIcon.src,
      questions: [
        {
          id: "issue",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What issue/problem is facing the customer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you please provide additional details about the @issue the customer is experiencing, so I can provide more targeted technical support based on their unique situation?
        - Could you provide any related articles/resources/documentation or commonly asked questions (FAQs) that I can share with the customer to help resolve their @issue issue?
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
    name: "Customer Complaints",
    icon: angryIcon.src,
    category: "Support",
    subcategory: "Customer Service",
    description: "Handle customer complaints by providing quick and personalized responses.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Customer Complaints",
      welcomeCard: welcomeCardDefault,
      icon: angryIcon.src,
      questions: [
        {
          id: "complaint",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What complaint are you trying to handle?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "circumstance",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the current circumstance?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide me with some strategies or techniques to handle @complaint that is common in my industry or business, and any tips for effectively implementing these strategies based on my @circumstance?
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
    name: "Support Articles Generator",
    icon: articleIcon.src,
    category: "Support",
    subcategory: "Customer Service",
    description: "Generate informative support articles, saving time and effort.",
    objectives: ["optimize_content_and_seo_strategy", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Support Articles Generator",
      welcomeCard: welcomeCardDefault,
      icon: articleIcon.src,
      questions: [
        {
          id: "issue",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What issue/problem is facing the customer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Tell us a specific topic to generate a detailed support about" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "action",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What action would you like to answer" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - We've been getting a lot of questions about @issue. Can you generate a detailed support article that covers @topic and provides step-by-step instructions on how to @action?
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
    name: "Return Requests",
    icon: returnIcon.src,
    category: "Support",
    subcategory: "Order Management",
    description: "Manage return requests efficiently, offering accurate responses and guidance.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Return Requests",
      welcomeCard: welcomeCardDefault,
      icon: returnIcon.src,
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Which product are your customers trying to return?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some common reasons for return requests for @product? We want to address these issues and improve the quality of our products.
        - Can you give me some tips on handling return requests for @product? We've been experiencing a higher-than-average rate of returns and want to prevent them in the future.
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
    name: "Order Payment Issues",
    icon: creditCardIcon.src,
    category: "Support",
    subcategory: "Order Management",
    description: "Resolve order payment issues with guidance and troubleshooting support.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Order Payment Issues",
      welcomeCard: welcomeCardDefault,
      icon: creditCardIcon.src,
      questions: [
        {
          id: "reason",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the reason of the payment issue?" },
          subheader: { default: "E.g. It wasn't the correct amount/was declined]" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I received a payment notification/email from customer, but it @reason. How can I resolve this issue/receive the correct payment?
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
    name: "Order Confirmations",
    icon: orderConfirmedIcon.src,
    category: "Support",
    subcategory: "Order Management",
    description: "Generate personalized order confirmations swiftly and efficiently.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Order Confirmations",
      welcomeCard: welcomeCardDefault,
      icon: orderConfirmedIcon.src,
      questions: [
        {
          id: "customer-name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the customer's name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the product's name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Please generate an order confirmation for @customer-name for their recent purchase of @product-name. Please include the order number, delivery date, and any relevant discount codes.        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Legal Documents Writer",
    icon: legalIcon.src,
    category: "Support",
    subcategory: "Knowledge Management",
    description: "Generate high-quality legal documents based on your specific requirements.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Legal Documents Writer",
      welcomeCard: welcomeCardDefault,
      icon: legalIcon.src,
      questions: [
        {
          id: "type-document",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What type of legal document would you like to create?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "terms-conditions",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Describe the terms and conditions" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "business-organization",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your business/organization about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topics",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the main topic?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "clauses",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Name some clauses" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need a @type-document that outlines the @terms-conditions of my @business-organization. Please generate a document that includes the following clauses related to @topics: @clauses.
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
    name: "Brand Mentions Monitor",
    icon: brandIcon.src,
    category: "Support",
    subcategory: "Social Media",
    description: "Monitor brand mentions across social media platforms efficiently.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Brand Mentions Monitor",
      welcomeCard: welcomeCardDefault,
      icon: brandIcon.src,
      questions: [
        {
          id: "brand-name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the brand name?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "time-frame",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What time frame are you interest in?" },
          subheader: { default: "E.g. Day, Month, Quarter..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Who can provide me with a list of all the social media platform(s) where @brand-name has been mentioned in the past @time-frame?
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
    name: "Comments Moderator",
    icon: commentIcon.src,
    category: "Support",
    subcategory: "Social Media",
    description: "Moderate brand comments across social media platforms easily.",
    objectives: ["enhance_online_presence"],
    isPremium: false,
    preset: {
      name: "Comments Moderator",
      welcomeCard: welcomeCardDefault,
      icon: commentIcon.src,
      questions: [
        {
          id: "comment",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Paste here the comment to moderate" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Please analyze the sentiment of the following comment and categorize it as either positive, negative, or neutral. If negative, provide potential reasons for the negative sentiment and suggest appropriate actions to address them.
        - Comment: @comment
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
    name: "Customer Relationships Manager",
    icon: relationshipIcon.src,
    category: "Support",
    subcategory: "Social Media",
    description:
      "Enhance customer relationships through insightful strategies and effective communication techniques.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Customer Relationships Manager",
      welcomeCard: welcomeCardDefault,
      icon: relationshipIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some effective ways to personalize my interactions with customers/clients, based on their previous purchases/interactions and reviews? How can I use this information to tailor my @product-service to their preferences/needs?
        - How can I use social media/digital platforms to connect with customers/clients and build a strong online mpresence? What are some best practices/strategies for engaging with customers/clients through these channels/platforms?
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
    name: "Chatbot Content Updater",
    icon: robot1Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Update chatbot and virtual assistant content swiftly.",
    objectives: ["other"],
    isPremium: false,
    preset: {
      name: "Chatbot Content Updater",
      welcomeCard: welcomeCardDefault,
      icon: robot1Icon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "task",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What specific task would you like to add?" },
          subheader: { default: "E.g. adding a new product feature or updating pricing information" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the steps to update the chatbot/virtual assistant for @product-service? Can you provide guidance on how to @task ?
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
    name: "Chatbot & VA Trainer",
    icon: robot2Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Provide tailored chatbot and virtual assistant training for new users.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Chatbot & VA Trainer",
      welcomeCard: welcomeCardDefault,
      icon: robot2Icon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to create/improve a comprehensive training workflow for new users to effectively use @product-service chatbot and virtual assistant. Can you guide me throug the best practices] for designing/implementing/evaluating this training program using advanced AI technology?
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
    name: "Chatbot Billing Support",
    icon: robot3Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Manage billing inquiries enhancing customer satisfaction and reducing staff workload.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Chatbot Billing Support",
      welcomeCard: welcomeCardDefault,
      icon: robot3Icon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - When a customer asks how to resolve an issue with their billing for @product-service, what should I ask for to verify their account and how should I provide instructions to resolve the issue?
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
    name: "Sales Support Chatbot",
    icon: robot4Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description:
      "Design sales support chatbots, enhancing engagement, personalization, and sales efficiency.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Sales Support Chatbot",
      welcomeCard: welcomeCardDefault,
      icon: robot4Icon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the best practices for designing a sales chatbot that can answer customer questions/provide product recommendations/close sales, and how can we tailor the chatbot's responses to meet the unique needs and preferences of our @target-audience?
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
    name: "Technical Support Chatbot",
    icon: robot5Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description:
      "Generate technical responses efficiently, enhancing customer service and reducing response times.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Technical Support Chatbot",
      welcomeCard: welcomeCardDefault,
      icon: robot5Icon.src,
      questions: [
        {
          id: "inquiries",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What inquiries would you like to address?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What topic would you like to resolve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide guidance on how to generate chatbot responses/answers that address @inquiries related to @topic?
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
    name: "Customer Onboarding VA",
    icon: customerSupportIcon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Create virtual assistants for customer onboarding, enhancing efficiency and satisfaction.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Customer Onboarding VA",
      welcomeCard: welcomeCardDefault,
      icon: customerSupportIcon.src,
      questions: [
        {
          id: "onboarding-process",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Describe briefly the onboarding process?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What programming languages and tools should I use to create a virtual assistant for @onboarding-process ?
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
    name: "FAQ Chatbot",
    icon: robot6Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Design a chatbot for FAQ support, enhancing customer assistance and engagement.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "FAQ Chatbot",
      welcomeCard: welcomeCardDefault,
      icon: robot6Icon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is your product/service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the best tools/technologies for designing a chatbot that can support FAQs related to @product-service , and how can I integrate them with company's existing systems?
        What are some key considerations I should keep in mind while designing a chatbot that can handle high volume of customer queries related to @product-service, and how can I optimize its performance using data analytics/NLP techniques?
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
    name: "User Feedback Chatbot",
    icon: robot7Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Streamline the process of designing chatbots for user feedback and workflows.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "User Feedback Support",
      welcomeCard: welcomeCardDefault,
      icon: robot7Icon.src,
      questions: [
        {
          id: "feature",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What feature would you like to create?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-goal",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What is the goal of your product/service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can we create a @feature to gather user feedback on @product-goal? What specific question should the chatbot ask and what response options should it provide?
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
    name: "Warranty Chatbot",
    icon: robot8Icon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Generate chatbot responses for warranty inquiries, enhancing customer service.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Warranty Chatbot",
      welcomeCard: welcomeCardDefault,
      icon: robot8Icon.src,
      questions: [
        {
          id: "name",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What's your name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "warranty-inquiries",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "What type of warranty inquiries do you need to solve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Hello, @name here. Could you provide me with some guidance on how to use AI / our chatbot platform to generate responses for @warranty-inquiries ?
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
    name: "Specific Information Request Tool",
    icon: informationIcon.src,
    category: "Support",
    subcategory: "Chatbot & Virtual Assistants",
    description: "Ask users for specific information to help them reach their goals.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Specific Information Request Tool",
      welcomeCard: welcomeCardDefault,
      icon: informationIcon.src,
      questions: [
        {
          id: "user-needs",
          type: TWorkflowQuestionType.OpenText,
          headline: { default: "Paste here the user needs" },
          subheader: { default: "" },
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
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
];
