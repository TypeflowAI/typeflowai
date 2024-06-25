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

export const agencyTemplates: TTemplate[] = [
  {
    name: "Unpaid Invoices Tracker",
    icon: "InvoiceIcon",
    category: "Agency",
    subcategory: "Client Management",
    description: "Efficiently streamline follow-ups on overdue unpaid invoices.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Unpaid Invoices Tracker",
      icon: "InvoiceIcon",
      questions: [
        {
          id: "invoice-number",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Invoice Number" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the product/service on the invoice?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What company is billed on the invoice?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "number-days",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Number of days since the payment was due" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide me with an update on the status of our invoice @invoice-number for the @product-service we provided to @company ? It has been @number-days since the payment was due, and we have not received any communication regarding the payment. We would appreciate it if you could let us know when we can expect payment.
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
    name: "Client Proposals Copy",
    icon: "DocumentIcon",
    category: "Agency",
    subcategory: "Client Management",
    description: "Quickly generate high-quality, custom client proposals.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Client Proposals Copy",
      icon: "DocumentIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your product/service about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Could you help me draft a proposal for @client-name, who is interested in our @product-service ? Please include information about our company's history, previous success stories, and how we can tailor our services to fit their specific needs.
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
    name: "Thank You Emails",
    icon: "OkIcon",
    category: "Agency",
    subcategory: "Client Management",
    description: "Create personalized and professional thank you emails for your clients.",
    objectives: ["improve_business_strategy", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Thank You Emails",
      icon: "OkIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "project",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What project has been done?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "details",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write some details to add to the email" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "data",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Relevant data/statistics that show your impact" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me generate a thank you email for @client-name ? We recently completed a @project for them and I want to express our gratitude for their business. I'd like the email to mention @details and include any relevant @data that would show our impact. Can you also suggest any personalized touches that would make the email stand out?
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
    name: "Status Reports",
    icon: "ReportIcon",
    category: "Agency",
    subcategory: "Client Management",
    description: "Create and send detailed status reports to your clients.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Status Reports",
      icon: "ReportIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the project name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "data-points",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe data points to include on the report" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you please generate a status report for @client-name 's @project-name ? Please include an overview of @data-points .
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
    name: "Client Complaint Resolver",
    icon: "WarningIcon",
    category: "Agency",
    subcategory: "Client Management",
    description: "Resolve client complaints using personalized responses and actionable solutions.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Client Complaint Resolver",
      icon: "WarningIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "issue",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the complaint about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me address a client complaint regarding @issue at @company-name ?
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
    name: "Project Assigner",
    icon: "ProjectAsignIcon",
    category: "Agency",
    subcategory: "Team Management",
    description: "Optimize project assignments with task delegation suggestions.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Assigner",
      icon: "ProjectAsignIcon",
      questions: [
        {
          id: "project-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the type of project" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the area of expertise?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        "What are the best ways to assign a @project-type project to a team member with expertise in @area ? Please provide suggestions for @company-name , a @industry company that needs to assign a project related to @topic .
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
    name: "Project Feedback Provider",
    icon: "FeedbackIcon",
    category: "Agency",
    subcategory: "Team Management",
    description: "Enhance team performance giving feedback and solutions.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Feedback Provider",
      icon: "FeedbackIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the project name" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "area",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the area of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are some potential improvements that can be made to @project-name for @company-name ? I'm particularly interested in @area .
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
    name: "Individual Feedback Provider",
    icon: "FeedbackIcon",
    category: "Agency",
    subcategory: "Team Management",
    description: "Offer personalized feedback, aiding in performance evaluation and growth.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Individual Feedback Provider",
      icon: "FeedbackIcon",
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the employee name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "period",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Period of time over the past" },
          subheader: { default: "E.g. Month, Day..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide a detailed analysis of @employee-name 's performance over the past @period, including specific examples of areas where they excelled and areas where improvement is needed? Please provide at least 5 examples for each category.
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
    name: "Budget Plan Creator",
    icon: "BudgetIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Optimize resource allocation and forecast revenue in budget planning.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Budget Plan Creator",
      icon: "BudgetIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "year",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What year " },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the projected expenses for @company-name in @year ? Please provide a breakdown of expenses by category and any factors influencing the expense projections.
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
    name: "Financial Reporter",
    icon: "FinancialIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Identify key financial metrics to create financial reports.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Financial Reporter",
      icon: "FinancialIcon",
      questions: [
        {
          id: "company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your company about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I need to create a financial report for my company @company , but I'm not sure where to start. Can you help me identify the key financial metrics I should include in my report and provide a template for formatting the data?
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
    name: "Expense Reporter",
    icon: "CreditCardIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Facilitate expense report approval with decision-making support.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Expense Reporter",
      icon: "CreditCardIcon",
      questions: [
        {
          id: "report-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the name of the report?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "policies-guidelines",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the expense item?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "policies-guidelines",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here you policies & guidelines" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Could you please help me review @report-name ? I need to ensure that @expense-item is compliant with our company's policies and guidelines @policies-guidelines
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
    name: "Refund Responder",
    icon: "RefundIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Enhance customer satisfaction by generating refunds responses.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Refunder Responder",
      icon: "RefundIcon",
      questions: [
        {
          id: "amount",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Refund amount" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "customer-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the customer name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the product name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "date",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Date of refund" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "reason",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the reason for the refund?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I need to issue a refund for @amount to @customer-name  who purchased @product-name on @date . The reason for the refund is @reason . Can you guide me through the refund process, including any necessary documentation or forms that need to be filled out?
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
    name: "Payment Plan Creator",
    icon: "PayIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Create and customize flexible payment plans to save time.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Payment Plan Creator",
      icon: "PayIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "timeframe",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Timeframe for the payment schedule" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "number",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Number of installments" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "amount",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Amount of each installment" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me create a payment plan for @client-name ? They require a payment schedule that spans @timeframe and includes @number installments of @amount each. What options can ChatGPT suggest to accommodate these requirements?
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
    name: "Financial Statements Reviewer",
    icon: "FinancialIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Analyze financial statements to identify improvement areas efficiently.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Financial Statements Reviewer",
      icon: "FinancialIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "revenue",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Revenue by product/service category" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "period",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Period for this revenue" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide a breakdown of @company-name 's revenue @revenue by product/service category for the past @period ? Please include total revenue and percentage of revenue by category.
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
    name: "ROI Calculator",
    icon: "CalculatorIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Calculate ROI, estimate revenue and forecast expenses.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "ROI Calculator",
      icon: "CalculatorIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "campaign-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the campaign name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "date",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What date are you launching the campaign?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the goals for the campaign?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What is the projected ROI for @campaign-name that @company-name plans to launch on @date ? How can we optimize it based on @goals ?
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
    name: "Cash Flow Statement Creator",
    icon: "CashflowIcon",
    category: "Agency",
    subcategory: "Financial Management",
    description: "Revise marketing plans providing feedback and suggestions.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Cash Flow Statement Creator",
      icon: "CashflowIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-plan",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your marketing plan?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide a SWOT analysis of @company-name 's current marketing plan @marketing-plan , including strengths, weaknesses, opportunities, and threats?
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
    name: "Industry Trends Researcher",
    icon: "TrendIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Research industry trends, analyze data and look ahead.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Industry Trends Researcher",
      icon: "TrendIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What industry do you want to research?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the top 5 trends in the @industry industry, and how can my company adapt to take advantage of them?
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
    name: "Market Research",
    icon: "ResearchIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Conduct market research across industries and niches efficiently.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Market Research",
      icon: "ResearchIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of product/service do you want to research?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What country/region would you like to research?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the current market trends and opportunities for @product-service in @location ? How can we capitalize on these trends to increase sales and revenue?
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
    name: "Lead Scoring System",
    icon: "LeadScoreIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Create a lead scoring system, enhancing sales and boosting conversion.",
    objectives: ["boost_engagement_and_conversion", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Lead Scoring System",
      icon: "LeadScoreIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's industry of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I'm interested in building a lead scoring system for my industry @industry business. Can you provide me with some examples of scoring models used in similar industries, and suggest ways to customize these models to meet my specific needs?
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
    name: "Brand Audit",
    icon: "BrandIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Conduct brand audits, identifying areas for improvement.",
    objectives: ["improve_business_strategy", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Brand Audit",
      icon: "BrandIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's industry of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I want to assess how our brand is positioned in the market and identify potential threats and opportunities. Can you provide insights on @industry market trends and how we can adjust our brand strategy accordingly?
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
    name: "Referral Program Creator",
    icon: "RewardIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Develop an effective referral program to grow your agency.",
    objectives: ["boost_engagement_and_conversion", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Referral Program Creator",
      icon: "RewardIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's industry of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the best practices for creating a referral program in @industry industry that would work for @company-name ?
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
    name: "Public Relations Strategy",
    icon: "NewspaperIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Develop a PR strategy by creating press releases and social media posts.",
    objectives: ["enhance_online_presence", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Public Relations Strategy",
      icon: "NewspaperIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the product name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe features/benefits of the product" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me draft a press release about our latest product launch at @company-name that highlights our new @product-name and its @features ?
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
    name: "Growth Opportunities Finder",
    icon: "GrowthIcon",
    category: "Agency",
    subcategory: "Business Development",
    description: "Identify growth opportunities and provide tailored strategies",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Growth Opportunities Finder",
      icon: "GrowthIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "current-sale",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the current sale?" },
          subheader: { default: "E.g. Operating nationally, planning to expand internationally" },
          required: true,
          inputType: "text",
        },
        {
          id: "key-challenges",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your key challenges?" },
          subheader: { default: "E.g. Generating new Customers" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        Context:
        You are Strategic Growth GPT, a business development expert specializing in guiding small and medium-sized agencies through expansion and scaling challenges. Your expertise lies in identifying growth opportunities and providing tailored strategies for business development.
        
        Goal:
        I need creative and practical strategies to expand my agency. Your recommendations will help me explore new markets, improve product offerings, and increase overall business growth.
        
        Business Development Structure:
        - Market Expansion (how can I identify and enter new markets?)
        - Product Diversification (what strategies can I employ to diversify my product line?)
        - Partnership Development (how can I build beneficial partnerships to enhance growth?)
        - Brand Enhancement (what steps can I take to strengthen my brand's presence and reputation?)
        - Customer Retention and Loyalty (how can I improve customer retention and loyalty?)
        
        Business Development Criteria:
        - Provide three strategies for each area of business development
        - Strategies should be innovative yet achievable for SMEs
        - Include potential digital tools or platforms that could aid in implementation
        - Emphasize cost-effectiveness and potential ROI of each strategy
        - Strategies should be adaptable to different industries and markets
        
        Information About My Business:
        - Industry: @industry
        - Current scale: @current-sale
        - Key challenges: @key-challenges
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
    name: "Infographic Creator",
    icon: "BrushIcon",
    category: "Agency",
    subcategory: "Content Creation",
    description: "Generate data-driven content for visually engaging infographics.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Infographic Creator",
      icon: "BrushIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your service/product about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience of your business" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I'm creating an infographic that highlights the benefits of @product-service for @target-audience . Can you suggest 5 data points or statistics that demonstrate the effectiveness of @product-service, and how it compares to similar offerings in the market?
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
    name: "Lead Magnet Content Creator",
    icon: "MagnetIcon",
    category: "Agency",
    subcategory: "Content Creation",
    description: "Generate engaging and informative lead magnet content.",
    objectives: ["optimize_content_and_seo_strategy", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Lead Magnet Content Creator",
      icon: "MagnetIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What topic do you want to cover in the lead magnet?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target audience of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me come up with 5 @topic ideas for a lead magnet that will appeal to @target-audience ? Please provide examples and data to support each idea.
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
    name: "Case Study Writer",
    icon: "CaseStudyIcon",
    category: "Agency",
    subcategory: "Content Creation",
    description: "Create compelling case studies content effortlessly.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Case Study Writer",
      icon: "CaseStudyIcon",
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your client name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your product/service about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "agency-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the agency name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "results",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the results of the case study" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "key-metrics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some key metrics" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide me with a case study template for @client-name 's @product-service that showcases the results achieved? Please suggest the key metrics and KPIs that should be included. Use @agency-name , @results , and @key-metrics as placeholders for customization.
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
    name: "Project Kickoffs",
    icon: "StartIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Streamline project kickoff meetings with scheduling assistance.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Kickoffs",
      icon: "StartIcon",
      questions: [
        {
          id: "topics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name and describe some topics for the meeting" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you generate an agenda for our project kickoff meeting? We need to cover topics such as @topics .
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
    name: "Project Timeline Developer",
    icon: "TimelineIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Create accurate project timelines to ensure on-time delivery.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Timeline Developer",
      icon: "TimelineIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the project name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "deadline",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the deadline of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide a comprehensive breakdown of the tasks involved in @project-name , along with the estimated timeline for completion of each task before @deadline ?
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
    name: "Project Tasks Assigner",
    icon: "TaskIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Optimize project management by assigning tasks efficiently.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Tasks Assigner",
      icon: "TaskIcon",
      questions: [
        {
          id: "task",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What task has to be done?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "skill-experience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What skill/experience is necessary for the task?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "deadline",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the deadline of the task?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Which team member would be best suited to complete the @task that requires @skill-experience by @deadline ?
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
    name: "Project kick-off Calls",
    icon: "PhoneIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Initiate project kick-off calls ensuring alignment and clarity.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project kick-off Calls",
      icon: "PhoneIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the name of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the goals of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me kick-off a new project with my agency? I need to identify project objectives, map out timelines, and ensure all stakeholders are aligned on project goals @goals. @project-name is a complex project, so any insights you can provide would be greatly appreciated.
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
    name: "Project Scope Reviewer",
    icon: "ScopeIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Optimize project scopes with recommendations and document generation.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Scope Reviewer",
      icon: "ScopeIcon",
      questions: [
        {
          id: "companyt-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the objective of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - How can I optimize the project scope for @company-name to ensure that it meets our project objectives @objectives and aligns with industry best practices? Can you provide specific recommendations?
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
    name: "Project Milestones Reviewer",
    icon: "GoalIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Optimize project milestones by analyzing the scope and objectives.",
    objectives: ["optimize_content_and_seo_strategy", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Milestones Reviewer",
      icon: "GoalIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the objective of the project?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - How can I optimize the project scope for @company-name to ensure that it meets our project objectives @objectives and aligns with industry best practices? Can you provide specific recommendations?
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
    name: "Project Documentation Updater",
    icon: "DocumentIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Update project documentation efficiently with human-like texts.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Documentation Updater",
      icon: "DocumentIcon",
      questions: [
        {
          id: "project",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your project about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the major accomplishments of the project @project to date, and how do these impact our overall progress?
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
    name: "Project Progress Monitor",
    icon: "ProgressIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Track project progress with task monitoring and issue identification.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Progress Monitor",
      icon: "ProgressIcon",
      questions: [
        {
          id: "project",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your task/project about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "data",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Provide some information to take into account" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What is the estimated time and cost required to complete @project , and how can we optimize both factors to meet our goals?
        "Based on @data , what are the key insights and trends that can inform decision-making for @project ?"
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
    name: "Project Expenses Tracker",
    icon: "CreditCardIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Optimize project expenses tracking with custom reports.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Expenses Tracker",
      icon: "CreditCardIcon",
      questions: [
        {
          id: "expenses",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Provide information about the project expenses" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "timeframe",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What time frame would you like to analize?" },
          subheader: { default: "E.g. Month, Quarter..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me analyze my project expenses @expenses for the past @timeframe , and identify areas where we can reduce costs?
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
    name: "Project Risks Reviewer",
    icon: "WarningIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Identify and mitigate project risks for enhanced risk management.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project risks Reviewer",
      icon: "WarningIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the project name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the top 3 risks that @company-name should be most concerned about for their upcoming @project-name , and what are some recommended mitigation strategies for each risk?
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
    name: "Project Assumptions Reviewer",
    icon: "AssumptionIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Ensure accuracy and achieve better project outcomes.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Assumptions Reviewer",
      icon: "AssumptionIcon",
      questions: [
        {
          id: "project-assumptions",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your project assumptions?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "project-description",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the project" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you review my project assumptions @project-assumptions and provide insights on any potential risks or opportunities? My project involves @project-description , and I want to make sure I'm on the right track.
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
    name: "Project Gantt Charts",
    icon: "ProjectPlannerIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Streamline Gantt chart creation: tasks, dependencies, and milestones.",
    objectives: ["streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Gantt Charts",
      icon: "ProjectPlannerIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the project name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "data",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Provide data to ensure the project stays on track" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you give me a Gantt chart template for @project-name ? I need to see the dependencies, deadlines, and milestones @data to ensure the project stays on track.
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
    name: "Project Schedule Reviewer",
    icon: "CalendarIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Optimize project schedules by analyzing risks and allocating resources.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Project Schedule Reviewer",
      icon: "CalendarIcon",
      questions: [
        {
          id: "project-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the project name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "schedule",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Provide information about the current schedule" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide an overview of the project schedule for @project-name ? Include the critical path and any potential risks based on the current schedule @schedule .
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
    name: "Agile Implementor",
    icon: "AgileIcon",
    category: "Agency",
    subcategory: "Project Management",
    description: "Implement Agile techniques for better project management.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Agile Implementor",
      icon: "AgileIcon",
      questions: [
        {
          id: "project-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the type of project" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the time size?" },
          subheader: { default: "E.g. 20 members, cross-functional" },
          required: true,
          inputType: "text",
        },
        {
          id: "current-challenges",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the challenges?" },
          subheader: {
            default:
              "E.g. Meeting tight deadlines, adapting to rapidly changing requirements, maintaining team synergy",
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
        You are "Agile Pioneer GPT," a specialized AI in Agile Project Management, focusing on innovative practices and adaptive methodologies in project execution. Your expertise extends to integrating cutting-edge Agile techniques, fostering team collaboration, and navigating rapidly changing project landscapes.
        
        Goal:
        To assist project managers in effectively implementing advanced Agile methodologies, adapting to project changes swiftly, and fostering a culture of continuous innovation and improvement within their teams.
        
        Agile Project Innovation Structure:
        1. Advanced Agile Techniques (What are the latest, less-known Agile techniques that can be integrated into project management?)
        2. Rapid Adaptation Strategies (How can teams quickly adapt to unexpected changes without derailing the project?)
        3. Innovative Collaboration Tools (What are the emerging tools and technologies that enhance team collaboration in an Agile environment?)
        4. Feedback and Iteration Processes (How can we optimize feedback loops and iteration cycles to maximize project outcomes?)
        5. Team Dynamics and Morale (What strategies can be used to maintain high team morale and motivation in a fast-paced Agile setting?)
        
        Agile Project Criteria:
        - Develop 3 advanced and unique strategies for each aspect of Agile project management.
        - Focus on contemporary Agile practices that are not widely adopted but have shown significant benefits.
        - Include strategies that are adaptable to various project sizes and complexities.
        - Emphasize the integration of technology and data analytics in Agile processes.
        - Highlight the importance of team dynamics and psychological safety in fostering innovation.
        
        Information About The Project:
        Project Type: @project-type
        Team Size: @team-size
        Current Challenges: @current-challenges
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
    name: "Customer Engagement Data",
    icon: "CustomerEngagementIcon",
    category: "Agency",
    subcategory: "Reporting",
    description: "Analyze customer engagement data to enhance performance.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Engagement Data",
      icon: "CustomerEngagementIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your product/service about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "metrics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What metrics would you like to take into account?" },
          subheader: { default: "Customer engagement metrics" },
          required: true,
          inputType: "text",
        },
        {
          id: "time-period",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What time period?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide insights on the performance of our latest @product-service launch in terms of @metrics for the @time-period?
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
    name: "CPA Analyzer",
    icon: "CpaIcon",
    category: "Agency",
    subcategory: "Reporting",
    description: "Analyze cost per acquisition data, gaining insights and optimizing campaigns.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "CPA Analyzer",
      icon: "CpaIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your product/service about?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the key factors that are impacting the cost per acquisition for @product-service at @company-name ? Can you provide an analysis of the marketing channels that are driving the highest and lowest costs per acquisition?
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
    name: "Customer Feedback Reviewer",
    icon: "FeedbackIcon",
    category: "Agency",
    subcategory: "Reporting",
    description: "Analyze customer feedback data to gain valuable insights.",
    objectives: ["improve_customer_and_employee_experience", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Customer Feedback Reviewer",
      icon: "FeedbackIcon",
      questions: [
        {
          id: "customer-feedback",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Paste here the customer feedback" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your company name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "date-range",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the date range?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Please provide a sentiment analysis of customer feedback data @customer-feedback for @company-name for the period of @date-range .
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
